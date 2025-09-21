import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Brain, User, LogOut, Menu, X, Home, BookOpen } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [activeNav, setActiveNav] = useState('/');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user } = useSelector(state => state.user);

    const navlist = [
        { 
            name: 'Home', 
            link: '/', 
            condition: true, 
            icon: <Home size={18} /> 
        },
        { 
            name: 'Practice', 
            link: '/practice', 
            condition: user?.name, 
            icon: <BookOpen size={18} /> 
        },
        { 
            name: 'Login', 
            link: '/login', 
            condition: !user?.name,
            icon: <User size={18} />
        },
    ];

    const loc = window.location.pathname;

    useEffect(() => {
        setActiveNav(loc);
    }, [loc]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Handle user menu
            const userMenuContainer = document.querySelector(`.${styles.userMenuContainer}`);
            if (userMenuContainer && !userMenuContainer.contains(event.target)) {
                setShowUserMenu(false);
            }
            
            // Handle mobile menu
            const mobileMenuContainer = document.querySelector(`.${styles.mobileMenuContainer}`);
            if (mobileMenuContainer && !mobileMenuContainer.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        if (showUserMenu || isMobileMenuOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showUserMenu, isMobileMenuOpen]);

    const handleNavigation = (link) => {
        navigate(link);
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        // Add your logout logic here
        console.log('Logging out...');
        setShowUserMenu(false);
        navigate('/login');
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                {/* Logo */}
                <div className={styles.logo} onClick={() => navigate('/')}>
                    <div className={styles.logoIcon}>
                        <Brain size={28} />
                    </div>
                    <div className={styles.logoText}>
                        <span className={styles.logoMain}>TechPrep</span>
                        <span className={styles.logoSub}>AI</span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className={styles.desktopNav}>
                    <ul className={styles.navList}>
                        {navlist.map((item, index) => (
                            item?.condition && (
                                <li 
                                    key={index} 
                                    className={`${styles.navItem} ${
                                        activeNav === item.link ? styles.activeNavItem : ''
                                    }`} 
                                    onClick={() => handleNavigation(item.link)}
                                >
                                    <span className={styles.navIcon}>{item.icon}</span>
                                    <span className={styles.navText}>{item.name}</span>
                                </li>
                            )
                        ))}
                    </ul>

                    {/* User Menu for Desktop */}
                    {user?.name && (
                        <div className={styles.userMenuContainer}>
                            <div 
                                className={styles.userAvatar}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <span className={styles.userInitials}>
                                    {getInitials(user.name)}
                                </span>
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>{user.name}</span>
                                    <span className={styles.userStatus}>Online</span>
                                </div>
                            </div>

                            {showUserMenu && (
                                <div className={styles.userDropdown}>
                                    <div className={styles.userDropdownHeader}>
                                        <div className={styles.userAvatarLarge}>
                                            {getInitials(user.name)}
                                        </div>
                                        <div className={styles.userDetails}>
                                            <span className={styles.userNameLarge}>{user.name}</span>
                                            <span className={styles.userEmail}>{user.email || 'user@example.com'}</span>
                                        </div>
                                    </div>
                                    <div className={styles.userDropdownDivider}></div>
                                    <button className={styles.dropdownItem} onClick={() => navigate('/profile')}>
                                        <User size={16} />
                                        <span>Profile</span>
                                    </button>
                                    <button className={styles.dropdownItem} onClick={handleLogout}>
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className={styles.mobileMenuContainer}>
                    <button 
                        className={styles.mobileMenuButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMobileMenuOpen(!isMobileMenuOpen);
                        }}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - moved outside navContainer */}
            {isMobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <div className={styles.mobileMenuContent}>
                                {/* User info for mobile */}
                                {user?.name && (
                                    <div className={styles.mobileUserInfo}>
                                        <div className={styles.mobileUserAvatar}>
                                            {getInitials(user.name)}
                                        </div>
                                        <div className={styles.mobileUserDetails}>
                                            <span className={styles.mobileUserName}>{user.name}</span>
                                            <span className={styles.mobileUserEmail}>{user.email || 'user@example.com'}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation items */}
                                <ul className={styles.mobileNavList}>
                                    {navlist.map((item, index) => (
                                        item?.condition && (
                                            <li 
                                                key={index} 
                                                className={`${styles.mobileNavItem} ${
                                                    activeNav === item.link ? styles.activeMobileNavItem : ''
                                                }`} 
                                                onClick={() => handleNavigation(item.link)}
                                            >
                                                <span className={styles.mobileNavIcon}>{item.icon}</span>
                                                <span className={styles.mobileNavText}>{item.name}</span>
                                            </li>
                                        )
                                    ))}

                                    {/* Logout for mobile */}
                                    {user?.name && (
                                        <li className={styles.mobileNavItem} onClick={handleLogout}>
                                            <span className={styles.mobileNavIcon}>
                                                <LogOut size={18} />
                                            </span>
                                            <span className={styles.mobileNavText}>Logout</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                {/* </div> */}
            {/* )} */}
        </nav >
    );
};

export default Navbar;