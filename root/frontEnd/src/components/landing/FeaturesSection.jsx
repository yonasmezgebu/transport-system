import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/FeaturesSection.module.css';

// Real image imports (high-quality professional images)
const images = {
  tracking: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=500&fit=crop',
  mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop',
  secure: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=500&fit=crop',
  fast: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
  friendly: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=500&fit=crop',
  updates: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop',
  analytics: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
  notifications: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=500&fit=crop'
};

const features = [
  {
    id: 1,
    title: 'Real-time Tracking',
    description: 'Live bus location tracking with accurate ETAs and route visualization. Our advanced GPS technology updates positions every 2 seconds, ensuring you never miss your bus. Get real-time traffic conditions, alternative route suggestions, and predictive arrival times based on historical data patterns.',
    image: images.tracking,
    stat: '99.9%',
    statLabel: 'Accuracy',
    direction: 'right'
  },
  {
    id: 2,
    title: 'Mobile Friendly',
    description: 'Seamless experience across all devices with responsive design. The touch-optimized interface features larger tap targets and swipe gestures. Offline mode allows you to save routes and access without internet connection. Progressive Web App technology enables installation on your home screen.',
    image: images.mobile,
    stat: '100%',
    statLabel: 'Responsive',
    direction: 'left'
  },
  {
    id: 3,
    title: 'Secure Login',
    description: 'Enterprise-grade authentication with role-based access and data encryption. Multi-factor authentication options including SMS, email, and authenticator app verification. All sensitive data encrypted using AES-256 both in transit and at rest with automatic session timeout.',
    image: images.secure,
    stat: '256-bit',
    statLabel: 'Encryption',
    direction: 'right'
  },
  {
    id: 4,
    title: 'Fast & Reliable',
    description: 'Lightning-fast response times with 99.9% uptime SLA for uninterrupted service. Cloud-native architecture scales automatically during peak hours, handling thousands of concurrent users without degradation. Redundant server clusters provide automatic failover with zero data loss.',
    image: images.fast,
    stat: '<100ms',
    statLabel: 'Response',
    direction: 'left'
  },
  {
    id: 5,
    title: 'User Friendly',
    description: 'Intuitive interface designed for all users with seamless navigation flows. WCAG 2.1 AA accessibility standards support screen readers and keyboard navigation. Interactive tutorials and tooltips guide you through every feature. Customizable dashboard layouts arrange information according to your preferences.',
    image: images.friendly,
    stat: '10K+',
    statLabel: 'Happy Users',
    direction: 'right'
  },
  {
    id: 6,
    title: 'Auto Updates',
    description: 'Real-time sync across all platforms with automatic updates. WebSocket connections maintain persistent communication for live data streaming. Version updates roll out seamlessly without manual downloads. Schedule changes propagate automatically to all users within seconds.',
    image: images.updates,
    stat: 'Instant',
    statLabel: 'Sync',
    direction: 'left'
  },
  {
    id: 7,
    title: 'Analytics Dashboard',
    description: 'Comprehensive reports and performance metrics for data-driven insights. Analytics engine processes millions of data points for actionable intelligence. Export custom reports in multiple formats. Predictive analytics use machine learning to forecast demand patterns and optimize scheduling.',
    image: images.analytics,
    stat: '24/7',
    statLabel: 'Monitoring',
    direction: 'right'
  },
  {
    id: 8,
    title: 'Smart Notifications',
    description: 'Instant alerts for schedule changes, delays, and announcements. Intelligent notification system prioritizes messages based on urgency. Choose preferred delivery channels including push notifications, SMS, email, or in-app messages. Geofencing triggers location-based alerts when buses approach your stop.',
    image: images.notifications,
    stat: 'Real-time',
    statLabel: 'Alerts',
    direction: 'left'
  }
];

const FeaturesSection = () => {
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const sectionRef = useRef(null);

  // Animate stats on scroll
  useEffect(() => {
    const animateValue = (element, start, end, duration, suffix = '') => {
      const increment = (end - start) / (duration / 16);
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          element.textContent = end + suffix;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + suffix;
        }
      }, 16);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll(`.${styles.statNumber}`);
            statNumbers.forEach(stat => {
              const targetValue = parseInt(stat.dataset.count);
              let suffix = '';
              if (stat.dataset.count === '99') suffix = '%';
              if (stat.dataset.count === '100') suffix = '%';
              if (targetValue && !stat.classList.contains(styles.animated)) {
                stat.classList.add(styles.animated);
                animateValue(stat, 0, targetValue, 2000, suffix);
              }
            });
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      statsObserver.observe(sectionRef.current);
    }

    return () => statsObserver.disconnect();
  }, []);

  // Feature card observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const featureId = parseInt(entry.target.dataset.id);
            setVisibleFeatures(prev => [...new Set([...prev, featureId])]);
          }
        });
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    const featureElements = document.querySelectorAll(`.${styles.featureRow}`);
    featureElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className={styles.featuresSection} ref={sectionRef}>
      <div className={styles.featuresContainer}>
        {/* Section Header */}
        <div className={styles.featuresHeader}>
          <div className={styles.sectionBadge}>
            <span>Why Choose Us</span>
          </div>
          <h2 className={styles.featuresTitle}>
            Smart <span className={styles.gradientText}>Features</span>
          </h2>
          <p className={styles.featuresSubtitle}>
            Cutting-edge technology to enhance your transport experience
          </p>
          <div className={styles.titleDecoration}>
            <div className={styles.decorationLine}></div>
            <div className={styles.decorationIcon}>✦</div>
            <div className={styles.decorationLine}></div>
          </div>
        </div>

        {/* Features List - Left/Right Layout with Horizontal Lines */}
        <div className={styles.featuresList}>
          {features.map((feature, index) => (
            <React.Fragment key={feature.id}>
              <div
                data-id={feature.id}
                className={`${styles.featureRow} ${feature.direction === 'left' ? styles.rowLeft : styles.rowRight} ${visibleFeatures.includes(feature.id) ? styles.visible : ''}`}
              >
                {/* Image Side */}
                <div className={styles.featureImageSide}>
                  <div className={styles.imageWrapper}>
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className={styles.featureImage}
                      loading="lazy"
                    />
                    <div className={styles.imageOverlay}></div>
                  </div>
                </div>

                {/* Content Side */}
                <div className={styles.featureContentSide}>
                  <div className={styles.contentWrapper}>
                    <div className={styles.featureNumber}>
                      <span>0{feature.id}</span>
                    </div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                    
                    <div className={styles.featureDivider}></div>
                    
                    <div className={styles.featureStat}>
                      <div className={styles.statInfo}>
                        <span className={styles.statValue}>{feature.stat}</span>
                        <span className={styles.statLabel}>{feature.statLabel}</span>
                      </div>
                      <div className={styles.statArrow}>→</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Horizontal Separator Line - not shown after last item */}
              {index < features.length - 1 && (
                <div className={styles.featureSeparator}>
                  <div className={styles.separatorLine}></div>
                  <div className={styles.separatorIcon}>
                    <span>✦</span>
                  </div>
                  <div className={styles.separatorLine}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Stats Counter Section */}
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <div className={styles.statNumber} data-count="5000">0</div>
            <div className={styles.statDesc}>Active Users</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <div className={styles.statNumber} data-count="10000">0</div>
            <div className={styles.statDesc}>Trips Completed</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <div className={styles.statNumber} data-count="99">0</div>
            <div className={styles.statDesc}>Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;