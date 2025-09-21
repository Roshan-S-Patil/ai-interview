import React from 'react';
import { useSelector } from 'react-redux';
import { Code, Database, Globe, Server, Smartphone, Brain, GitBranch, Cloud, Shield, Zap } from 'lucide-react';
import styles from './Home.module.css';
import TopicCard from '../../components/topicCard/TopicCard';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useSelector(state => state.user);

  const techTopics = [
    {
      id: 'mern',
      title: 'MERN Stack',
      description: 'Master full-stack development with MongoDB, Express.js, React, and Node.js',
      icon: <Globe size={24} />,
      difficulty: 'Intermediate',
      duration: '45-60 min'
    },
    {
      id: 'java',
      title: 'Java Development',
      description: 'Object-oriented programming, Spring Framework, JVM concepts, and design patterns',
      icon: <Code size={24} />,
      difficulty: 'Intermediate',
      duration: '45-60 min'
    },
    {
      id: 'sql',
      title: 'SQL & Databases',
      description: 'Database design, complex queries, optimization, and data modeling techniques',
      icon: <Database size={24} />,
      difficulty: 'Beginner',
      duration: '30-45 min'
    },
    {
      id: 'python',
      title: 'Python Programming',
      description: 'Data structures, algorithms, Django/Flask frameworks, and machine learning basics',
      icon: <Brain size={24} />,
      difficulty: 'Intermediate',
      duration: '45-60 min'
    },
    {
      id: 'react',
      title: 'React.js',
      description: 'Modern React development with hooks, context, state management, and performance optimization',
      icon: <Zap size={24} />,
      difficulty: 'Intermediate',
      duration: '40-50 min'
    },
    {
      id: 'nodejs',
      title: 'Node.js Backend',
      description: 'Server-side JavaScript, REST APIs, microservices, and asynchronous programming',
      icon: <Server size={24} />,
      difficulty: 'Intermediate',
      duration: '45-60 min'
    },
    {
      id: 'mobile',
      title: 'Mobile Development',
      description: 'Cross-platform development with React Native, Flutter, and native app concepts',
      icon: <Smartphone size={24} />,
      difficulty: 'Advanced',
      duration: '50-70 min'
    },
    {
      id: 'devops',
      title: 'DevOps & Cloud',
      description: 'AWS/Azure, Docker, Kubernetes, CI/CD pipelines, and infrastructure as code',
      icon: <Cloud size={24} />,
      difficulty: 'Advanced',
      duration: '60-75 min'
    },
    {
      id: 'git',
      title: 'Git & Version Control',
      description: 'Advanced Git workflows, branching strategies, and collaborative development practices',
      icon: <GitBranch size={24} />,
      difficulty: 'Beginner',
      duration: '20-30 min'
    },
    {
      id: 'security',
      title: 'Cybersecurity',
      description: 'Web application security, encryption, authentication, and secure coding practices',
      icon: <Shield size={24} />,
      difficulty: 'Advanced',
      duration: '50-65 min'
    }
  ];
const navigate = useNavigate();
  const handleActionSelect = (topic, actionType) => {
    const actionLabel = actionType === 'interview' ? 'interview' : 'discussion';
    navigate('/chat/' + topic.id + '?type=' + actionLabel);
    // Here you would navigate to the appropriate page
    console.log('Selected:', { topic: topic.id, action: actionType });
  };

  return (
      <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>TechPrep AI</h1>
          <p className={styles.greeting}>
            Hi {user?.name}! Ready to level up your tech skills?
          </p>
          <p className={styles.subtitle}>
            Select a topic below to start either a mock interview session or an interactive learning discussion with our AI mentor.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Topic Cards Grid */}
        <div className={styles.grid}>
          {techTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onActionSelect={handleActionSelect}
            />
          ))}
        </div>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>10+</div>
            <div className={styles.statLabel}>Tech Topics Available</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>2</div>
            <div className={styles.statLabel}>Learning Modes</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>AI Mentor Available</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>∞</div>
            <div className={styles.statLabel}>Practice Sessions</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
