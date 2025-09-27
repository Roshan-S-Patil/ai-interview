import React, { useEffect, useState } from 'react';
import styles from './GoogleCallback.module.css';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { googleVerificationApi } from '../../api/authapi';

const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dots, setDots] = useState('');
   // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Simulate redirect logic (replace with your actual auth handling)
  useEffect(() => {
    // Extract auth code from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    // Simulate processing time
    const timer = setTimeout(() => {
      googleAuth(code);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
    
    const googleAuth = async(code) => {
        try {
            if (code) {
                // Send code to backend for verification
                const res = await googleVerificationApi(code, REDIRECT_URI);
                if (res.data) {
                  dispatch(setUser(res?.data));
                  navigate('/');
                  window.location.replace('/');
                } else {
                    console.error("No data received from backend");
                }
            }
        } catch (err) {
            console.error("Error exchanging code:", err)
        }
    }
  return (
    <div className={styles.container}>
      {/* Background decoration */}
      <div className={styles.backgroundDecorations}>
        <div className={styles.decorationTop}></div>
        <div className={styles.decorationBottom}></div>
      </div>

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Google logo animation container */}
        <div className={styles.logoContainer}>
          <div className={styles.loaderWrapper}>
            {/* Outer spinning ring */}
            <div className={styles.spinnerRing}></div>
            
            {/* Google logo */}
            <div className={styles.logoCircle}>
              <div className={styles.googleLogo}>
                <svg viewBox="0 0 24 24" className={styles.googleLogo}>
                  <path 
                    fill="#4285F4" 
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path 
                    fill="#34A853" 
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path 
                    fill="#FBBC05" 
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path 
                    fill="#EA4335" 
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Status text */}
        <div className={styles.textContainer}>
          <h1 className={styles.title}>
            Completing sign in{dots}
          </h1>
          <p className={styles.description}>
            Please wait while we securely process your authentication
          </p>
        </div>

        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
        </div>

        {/* Security badge */}
        <div className={styles.securityBadge}>
          <svg className={styles.lockIcon} viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>Secured by Google OAuth 2.0</span>
        </div>
      </div>
    </div>
  );
}

export default GoogleCallback;
