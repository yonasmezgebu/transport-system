import React, { useEffect, useRef, useState } from 'react'
import styles from '../../styles/FeaturesSection.module.css'

const features = [
  {
    icon: '🌎',
    title: 'Real-time Tracking',
    description: 'Track buses in real-time with live location updates and accurate ETAs.',
    gradient: 'gradient1',
    stat: '99.9%',
    statLabel: 'Accuracy'
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    description: 'Access the system from any device, anywhere with responsive design.',
    gradient: 'gradient2',
    stat: '100%',
    statLabel: 'Responsive'
  },
  {
    icon: '🔒',
    title: 'Secure Login',
    description: 'Role-based access with secure authentication and data encryption.',
    gradient: 'gradient3',
    stat: '256-bit',
    statLabel: 'Encryption'
  },
  {
    icon: '⚡',
    title: 'Fast & Reliable',
    description: 'Quick response times and 99.9% uptime for uninterrupted service.',
    gradient: 'gradient4',
    stat: '<100ms',
    statLabel: 'Response'
  },
  {
    icon: '🎨',
    title: 'User Friendly',
    description: 'Intuitive interface designed for all users with easy navigation.',
    gradient: 'gradient5',
    stat: '10K+',
    statLabel: 'Happy Users'
  },
  {
    icon: '🔄',
    title: 'Auto Updates',
    description: 'Real-time sync across all platforms with automatic updates.',
    gradient: 'gradient6',
    stat: 'Instant',
    statLabel: 'Sync'
  },
  {
    icon: '📊',
    title: 'Analytics',
    description: 'Detailed reports and performance metrics for better insights.',
    gradient: 'gradient7',
    stat: '24/7',
    statLabel: 'Monitoring'
  },
  {
    icon: '🔔',
    title: 'Smart Notifications',
    description: 'Instant alerts for schedule changes and important updates.',
    gradient: 'gradient8',
    stat: 'Real-time',
    statLabel: 'Alerts'
  }
]

const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  // Animate stats on scroll
  useEffect(() => {
    const animateValue = (element, start, end, duration, suffix = '') => {
      const increment = (end - start) / (duration / 16)
      let current = start
      const timer = setInterval(() => {
        current += increment
        if (current >= end) {
          element.textContent = end + suffix
          clearInterval(timer)
        } else {
          element.textContent = Math.floor(current) + suffix
        }
      }, 16)
    }

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll(`.${styles.statNumber}`)
            statNumbers.forEach(stat => {
              const targetValue = parseInt(stat.dataset.count)
              const suffix = stat.dataset.count === '99' ? '%' : ''
              if (targetValue && !stat.classList.contains(styles.animated)) {
                stat.classList.add(styles.animated)
                animateValue(stat, 0, targetValue, 2000, suffix)
              }
            })
            statsObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) {
      statsObserver.observe(sectionRef.current)
    }

    return () => statsObserver.disconnect()
  }, [])

  // Card intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible)
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" className={styles.featuresSection} ref={sectionRef}>
      {/* Animated Background Elements */}
      <div className={styles.featuresBackground}>
        <div className={styles.bgPattern}></div>
        <div className={styles.floatingShape1}></div>
        <div className={styles.floatingShape2}></div>
        <div className={styles.floatingShape3}></div>
      </div>

      <div className={styles.featuresContainer}>
        {/* Section Header */}
        <div className={styles.featuresHeader}>
          <div className={styles.sectionBadge}>
            <span className={styles.badgeIcon}>⚡</span>
            <span>Why Choose Us</span>
          </div>
          <h2 className={styles.featuresTitle}>
            Smart
            <span className={styles.gradientText}> Features</span>
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

        {/* Features Grid */}
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className={`${styles.featureCard} ${styles[feature.gradient]} ${hoveredIndex === index ? styles.cardHovered : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ transitionDelay: `${index * 0.05}s` }}
            >
              <div className={styles.cardBackground}></div>
              
              <div className={styles.cardIconWrapper}>
                <div className={styles.iconCircle}>
                  <span className={styles.featureIcon}>{feature.icon}</span>
                  <div className={styles.iconPulse}></div>
                </div>
              </div>
              
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              
              <div className={styles.featureStat}>
                <span className={styles.statValue}>{feature.stat}</span>
                <span className={styles.statLabel}>{feature.statLabel}</span>
              </div>
              
              <div className={styles.hoverLine}></div>
              
              <div className={styles.particles}>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
                <div className={styles.particle}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Counter Section */}
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
  )
}

export default FeaturesSection