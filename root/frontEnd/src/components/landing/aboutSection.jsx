import React, { useEffect, useRef } from 'react'
import aboutImage from '../../assets/images/injibara-university-water.webp'
import styles from '../../styles/AboutSection.module.css'

const AboutSection = () => {
  const sectionRef = useRef(null)
  const imageCardRef = useRef(null)
  const contentRef = useRef(null)
  const statsRef = useRef([])

  // Intersection Observer for scroll animations
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

    if (imageCardRef.current) observer.observe(imageCardRef.current)
    if (contentRef.current) observer.observe(contentRef.current)
    
    statsRef.current.forEach((stat) => {
      if (stat) observer.observe(stat)
    })

    return () => observer.disconnect()
  }, [])

  // Animate stats counter
  useEffect(() => {
    const animateStats = () => {
      const stats = document.querySelectorAll(`.${styles.statNumber}`)
      stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'))
        if (!target || stat.classList.contains(styles.animated)) return
        
        stat.classList.add(styles.animated)
        let current = 0
        const increment = target / 50
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            stat.textContent = target + (stat.getAttribute('data-suffix') || '')
            clearInterval(timer)
          } else {
            stat.textContent = Math.floor(current) + (stat.getAttribute('data-suffix') || '')
          }
        }, 30)
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className={styles.aboutSection} ref={sectionRef}>
      <div className={styles.aboutContainer}>
        {/* 50/50 Grid Layout */}
        <div className={styles.aboutGrid}>
          
          {/* LEFT SIDE - IMAGE (50%) */}
          <div 
            ref={imageCardRef}
            className={`${styles.imageWrapper} ${styles.fadeInLeft}`}
          >
            <div className={styles.imageCard}>
              <div className={styles.imageContainer}>
                <img 
                  src={aboutImage} 
                  alt="Injibara University Campus" 
                  className={styles.aboutImage}
                />
                <div className={styles.imageOverlay}></div>
              </div>
              
              <div className={styles.imageContent}>
                <h3 className={styles.universityTitle}>
                  Injibara University
                </h3>
                <p className={styles.universitySubtitle}>
                  Excellence in Education & Innovation
                </p>
                <div className={styles.titleDivider}></div>
              </div>
              
              {/* Floating badges */}
              <div className={styles.floatingBadge1}>
                <span>🎓</span>
                <span>Top Ranked</span>
              </div>
              <div className={styles.floatingBadge2}>
                <span>🏆</span>
                <span>Excellence</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - TEXT CONTENT (50%) */}
          <div 
            ref={contentRef}
            className={`${styles.contentWrapper} ${styles.fadeInRight}`}
          >
            <div className={styles.contentHeader}>
              <div className={styles.sectionBadge}>
                <span className={styles.badgeIcon}>🚌</span>
                <span>About Us</span>
              </div>
              <h2 className={styles.aboutTitle}>
                About Our
                <span className={styles.gradientText}> Transport System</span>
              </h2>
            </div>
            
            <p className={styles.aboutDescription}>
              Injibara University Transport System is a comprehensive digital platform designed 
              to modernize and streamline transportation services for students, staff, and faculty. 
              Our system integrates real-time tracking, route optimization, and seamless booking 
              management to enhance campus mobility.
            </p>
            
            {/* Mission Card */}
            <div className={`${styles.missionCard} ${styles.cardHover}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>🎯</span>
                <h3 className={styles.cardTitle}>Our Mission</h3>
              </div>
              <p className={styles.cardText}>
                To provide efficient, reliable, and accessible transportation services 
                through innovative technology and smart management, ensuring seamless 
                mobility for the entire university community.
              </p>
              <div className={styles.cardGlow}></div>
            </div>

            {/* Vision Card */}
            <div className={`${styles.visionCard} ${styles.cardHover}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>👁️</span>
                <h3 className={styles.cardTitle}>Our Vision</h3>
              </div>
              <p className={styles.cardText}>
                To become Ethiopia's leading university transport management system, 
                setting the standard for efficiency, sustainability, and user satisfaction 
                across higher education institutions nationwide.
              </p>
              <div className={styles.cardGlow}></div>
            </div>

            {/* Additional Stats */}
            <div className={styles.statsContainer}>
              <div className={styles.statItem} ref={el => statsRef.current[0] = el}>
                <div 
                  className={styles.statNumber} 
                  data-target="20"
                  data-suffix="+"
                >
                  0+
                </div>
                <div className={styles.statLabel}>Daily Riders</div>
                <div className={styles.statProgress} style={{ '--progress': '85%' }}></div>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem} ref={el => statsRef.current[1] = el}>
                <div 
                  className={styles.statNumber} 
                  data-target="50"
                  data-suffix="+"
                >
                  0+
                </div>
                <div className={styles.statLabel}>Active Routes</div>
                <div className={styles.statProgress} style={{ '--progress': '70%' }}></div>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem} ref={el => statsRef.current[2] = el}>
                <div 
                  className={styles.statNumber} 
                  data-target="24"
                  data-suffix="/7"
                >
                  0/7
                </div>
                <div className={styles.statLabel}>Support</div>
                <div className={styles.statProgress} style={{ '--progress': '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection