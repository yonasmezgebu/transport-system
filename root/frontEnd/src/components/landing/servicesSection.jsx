import React, { useEffect, useRef, useState } from 'react'
import styles from '../../styles/ServicesSection.module.css'

const services = [
  {
    icon: '🚌',
    title: 'Bus Tracking',
    description: 'Real-time bus location tracking and arrival predictions with GPS accuracy.',
    link: '#',
    gradient: 'gradient1',
    features: ['Live Location', 'Arrival Time', 'Route Map']
  },
  {
    icon: '🎫',
    title: 'Digital Permits',
    description: 'Online transport request and approval system for seamless campus commute.',
    link: '#',
    gradient: 'gradient2',
    features: ['Instant Approval', 'Digital Pass', 'Easy Renewal']
  },
  {
    icon: '🗺️',
    title: 'Route Planning',
    description: 'Optimized routes for efficient campus commute with AI-powered suggestions.',
    link: '#',
    gradient: 'gradient3',
    features: ['AI Optimized', 'Multiple Routes', 'Traffic Updates']
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Comprehensive reports on fleet performance and usage patterns.',
    link: '#',
    gradient: 'gradient4',
    features: ['Real-time Stats', 'Usage Reports', 'Performance Metrics']
  },
  {
    icon: '🔔',
    title: 'Smart Alerts',
    description: 'Real-time notifications for schedule changes and important updates.',
    link: '#',
    gradient: 'gradient5',
    features: ['Push Notifications', 'SMS Alerts', 'Email Updates']
  },
  {
    icon: '💳',
    title: 'Digital Payments',
    description: 'Secure online payment for transport services with multiple options.',
    link: '#',
    gradient: 'gradient6',
    features: ['Secure Payment', 'Multiple Methods', 'Transaction History']
  }
]

const ServicesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

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
    <section id="services" className={styles.servicesSection} ref={sectionRef}>
      {/* Animated Background */}
      <div className={styles.servicesBackground}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        <div className={styles.gradientOrb3}></div>
      </div>

      <div className={styles.servicesContainer}>
        {/* Section Header */}
        <div className={styles.servicesHeader}>
          <div className={styles.sectionBadge}>
            <span className={styles.badgeIcon}>✨</span>
            <span>What We Offer</span>
          </div>
          <h2 className={styles.servicesTitle}>
            Our Premium
            <span className={styles.gradientText}> Services</span>
          </h2>
          <p className={styles.servicesSubtitle}>
            Comprehensive transport solutions designed for the entire university community
          </p>
          <div className={styles.titleDecoration}>
            <div className={styles.decorationLine}></div>
            <div className={styles.decorationDot}></div>
            <div className={styles.decorationLine}></div>
          </div>
        </div>

        {/* Services Grid */}
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className={`${styles.serviceCard} ${styles[service.gradient]} ${hoveredIndex === index ? styles.cardHovered : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className={styles.cardGlow}></div>
              
              <div className={styles.cardIcon}>
                <div className={styles.iconWrapper}>
                  <span className={styles.iconEmoji}>{service.icon}</span>
                  <div className={styles.iconRing}></div>
                </div>
              </div>
              
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDescription}>{service.description}</p>
              
              <div className={styles.cardFeatures}>
                {service.features.map((feature, idx) => (
                  <div key={idx} className={styles.featureItem}>
                    <span className={styles.featureDot}>•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <a href={service.link} className={styles.cardLink}>
                <span>Learn More</span>
                <svg className={styles.linkArrow} viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              
              <div className={styles.cardBorder}></div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className={styles.servicesCTA}>
          <p>Need a custom solution for your department?</p>
          <button className={styles.ctaButton}>
            Contact Our Team
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection