import React, { useState } from 'react';
import { MessageCircle, Users } from 'lucide-react';
import styles from './TopicCard.module.css';

const TopicCard = ({ topic, onActionSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return styles.difficultyBeginner;
      case 'Intermediate':
        return styles.difficultyIntermediate;
      case 'Advanced':
        return styles.difficultyAdvanced;
      default:
        return styles.difficultyDefault;
    }
  };

  return (
    <div
      className={`${styles.card} ${isHovered ? styles.cardHovered : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.iconContainer}>
        {topic.icon}
      </div>
      
      <h3 className={styles.title}>{topic.title}</h3>
      <p className={styles.description}>{topic.description}</p>
      
      <div className={styles.meta}>
        <span className={`${styles.difficulty} ${getDifficultyClass(topic.difficulty)}`}>
          {topic.difficulty}
        </span>
        <span className={styles.duration}>
          {topic.duration}
        </span>
      </div>
      
      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${styles.primaryAction}`}
          onClick={() => onActionSelect(topic, 'interview')}
        >
          <Users size={16} />
          Mock Interview
        </button>
        <button
          className={`${styles.actionButton} ${styles.secondaryAction}`}
          onClick={() => onActionSelect(topic, 'discussion')}
        >
          <MessageCircle size={16} />
          Learn & Discuss
        </button>
      </div>
    </div>
  );
};

export default TopicCard;