import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/HeroSection.module.css'

const HeroSection = () => {
  const sectionRef = useRef(null)
  const particlesRef = useRef(null)

  useEffect(() => {
    // Create particles
    const createParticles = () => {
      if (!particlesRef.current) return
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div')
        particle.className = styles.particle
        const size = Math.random() * 6 + 2
        particle.style.width = size + 'px'
        particle.style.height = size + 'px'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.animationDuration = Math.random() * 10 + 5 + 's'
        particle.style.animationDelay = Math.random() * 5 + 's'
        particle.style.opacity = Math.random() * 0.5 + 0.2
        particlesRef.current.appendChild(particle)
      }
    }

    createParticles()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    { icon: '👥', value: '5,000+', label: 'Active Users', color: 'stat1' },
    { icon: '🚌', value: '850+', label: 'Trips/Month', color: 'stat2' },
    { icon: '⭐', value: '98%', label: 'Satisfaction', color: 'stat3' },
    { icon: '🚗', value: '25+', label: 'Fleet Vehicles', color: 'stat4' }
  ]

  const features = [
    { icon: '✓', text: '24/7 Support' },
    { icon: '✓', text: 'Real-time GPS' },
    { icon: '✓', text: 'Secure Payments' }
  ]

  return (
    <>
      <section id="home" className={styles.heroSection} ref={sectionRef}>
        {/* Animated Background */}
        <div className={styles.heroBackground}>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
          <div className={styles.gradientOrb3}></div>
          <div className={styles.gradientOrb4}></div>
          <div className={styles.noise}></div>
        </div>

        {/* Particles Container */}
        <div className={styles.particlesContainer} ref={particlesRef}></div>

        {/* Floating Shapes */}
        <div className={styles.floatingShape1}></div>
        <div className={styles.floatingShape2}></div>
        <div className={styles.floatingShape3}></div>
        <div className={styles.floatingShape4}></div>

        <div className={styles.container}>
          <div className={styles.heroGrid}>
            {/* Left Content */}
            <div className={styles.heroContent}>
              <div className={styles.badge}>
                <span className={styles.badgeIcon}>✨</span>
                <span>Smart & Efficient Transport</span>
                <div className={styles.badgePulse}></div>
              </div>
              
              <h1 className={styles.heroTitle}>
                Injibara University
                <br />
                <span className={styles.gradientText}>Transport System</span>
              </h1>
              
              <p className={styles.heroDescription}>
                Streamline your daily commute with automated trip scheduling, 
                real-time tracking, and smart fleet management — all in one powerful platform.
              </p>
              
              <div className={styles.buttonGroup}>
                <Link to="/login">
                  <button className={styles.primaryBtn}>
                    <span>Explore Services</span>
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </Link>
                <button className={styles.secondaryBtn}>
                  <span>Learn More</span>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className={styles.trustBadges}>
                {features.map((feature, index) => (
                  <div key={index} className={styles.badgeItem}>
                    <span className={styles.badgeCheck}>{feature.icon}</span>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Stats Card */}
            <div className={styles.heroStats}>
              <div className={styles.statsCard}>
                <div className={styles.statsHeader}>
                  <span className={styles.statsIcon}>⚡</span>
                  <h3>Trusted by Injibara University</h3>
                </div>
                
                <div className={styles.statsGrid}>
                  {stats.map((stat, index) => (
                    <div key={index} className={`${styles.statItem} ${styles[stat.color]}`}>
                      <div className={styles.statIcon}>{stat.icon}</div>
                      <div className={styles.statValue}>{stat.value}</div>
                      <div className={styles.statLabel}>{stat.label}</div>
                      <div className={styles.statHover}></div>
                    </div>
                  ))}
                </div>
                
                <div className={styles.ratingSection}>
                  <div className={styles.ratingHeader}>
                    <span>User Rating</span>
                    <span className={styles.ratingStars}>★★★★★ 4.9</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill}></div>
                  </div>
                </div>

                <div className={styles.cardGlow}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.mouse}>
            <div className={styles.wheel}></div>
          </div>
          <div className={styles.scrollText}>Scroll Down</div>
        </div>
      </section>
    </>
  )
}

export default HeroSection