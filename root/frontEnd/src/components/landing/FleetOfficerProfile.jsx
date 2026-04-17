import React, { useState, useEffect, useRef } from 'react'
import styles from '../../styles/FleetOfficerProfile.module.css'

// Import fleet officer image (replace with your actual image path)
import officerImage from '../../assets/images/officer.jpg'

const FleetOfficerProfile = () => {
  const [showBio, setShowBio] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)
  const statsRef = useRef([])

  const toggleBio = () => {
    setShowBio(!showBio)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Animate stats counter
          animateStats()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const animateStats = () => {
    const stats = [
      { element: document.querySelector(`.${styles.statNumber1}`), target: 10, suffix: '+' },
      { element: document.querySelector(`.${styles.statNumber2}`), target: 98, suffix: '%' },
      { element: document.querySelector(`.${styles.statNumber3}`), target: 500, suffix: 'K+' }
    ]

    stats.forEach(stat => {
      if (stat.element) {
        let current = 0
        const increment = stat.target / 50
        const timer = setInterval(() => {
          current += increment
          if (current >= stat.target) {
            stat.element.textContent = stat.target + stat.suffix
            clearInterval(timer)
          } else {
            stat.element.textContent = Math.floor(current) + stat.suffix
          }
        }, 20)
      }
    })
  }

  const achievements = [
    'Reduced vehicle downtime by 60%',
    'Implemented digital fuel tracking system',
    'Achieved 100% document compliance',
    'Extended vehicle lifespan by 3+ years'
  ]

  return (
    <section id="fleet-officer" className={styles.profileSection} ref={sectionRef}>
      {/* Animated Background */}
      <div className={styles.profileBackground}>
        <div className={styles.bgPattern}></div>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        <div className={styles.floatingElements}>
          <div className={styles.floatingIcon1}>🚌</div>
          <div className={styles.floatingIcon2}>⚙️</div>
          <div className={styles.floatingIcon3}>📊</div>
          <div className={styles.floatingIcon4}>🔧</div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.profileCard} ${isVisible ? styles.visible : ''}`}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <div className={styles.imageGlow}></div>
              <img 
                src={officerImage} 
                alt="Fleet Officer - Meron Alemu" 
                className={styles.profileImage}
              />
              <div className={styles.imageOverlay}>
                <div className={styles.overlayContent}>
                  <span className={styles.overlayIcon}>👤</span>
                  <span>Fleet Operations Expert</span>
                </div>
              </div>
              <div className={styles.imageBorder}></div>
            </div>
            <div className={styles.experienceBadge}>
              <span className={styles.badgeYears}>10+</span>
              <span className={styles.badgeText}>Years of Excellence</span>
            </div>
          </div>

          {/* Content Section */}
          <div className={styles.contentSection}>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>⚙️</span>
              <span>Operations Management</span>
              <div className={styles.badgePulse}></div>
            </div>
            
            <h2 className={styles.sectionTitle}>
              Fleet Officer
            </h2>
            
            <h3 className={styles.officerName}>
              Meron Alemu
              <div className={styles.nameUnderline}></div>
            </h3>
            
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📅</div>
                <div className={`${styles.statNumber} ${styles.statNumber1}`}>10+</div>
                <div className={styles.statLabel}>Years Experience</div>
                <div className={styles.statProgress}></div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={`${styles.statNumber} ${styles.statNumber2}`}>24</div>
                <div className={styles.statLabel}>Fleet Uptime</div>
                <div className={styles.statProgress}></div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🛣️</div>
                <div className={`${styles.statNumber} ${styles.statNumber3}`}>500</div>
                <div className={styles.statLabel}>KM Managed</div>
                <div className={styles.statProgress}></div>
              </div>
            </div>

            {/* Bio Button */}
            <button
              onClick={toggleBio}
              className={styles.bioButton}
            >
              <span>{showBio ? 'Hide Biography' : 'Read Biography'}</span>
              <span className={`${styles.buttonArrow} ${showBio ? styles.arrowRotated : ''}`}>
                {showBio ? '▲' : '▼'}
              </span>
            </button>

            {/* Biography Section */}
            <div className={`${styles.bioSection} ${showBio ? styles.bioExpanded : ''}`}>
              {showBio && (
                <div className={styles.bioContent}>
                  <div className={styles.bioText}>
                    <p>
                      Meron Alemu is the dedicated Fleet Officer at Injibara University, 
                      responsible for managing the entire vehicle fleet including maintenance, 
                      fuel tracking, and document compliance. With over 10 years of experience 
                      in fleet management, she has implemented preventive maintenance schedules 
                      that reduced breakdowns by 40%.
                    </p>
                    <p>
                      Her expertise in fuel efficiency tracking has saved the university over 
                      200,000 ETB annually. She holds a Bachelor's degree in Automotive Engineering 
                      from Bahir Dar University and is certified in Fleet Management from the 
                      Ethiopian Transport Authority.
                    </p>
                    
                    <div className={styles.achievementsSection}>
                      <h4 className={styles.achievementsTitle}>
                        <span className={styles.trophyIcon}>🏆</span>
                        Key Achievements
                      </h4>
                      <div className={styles.achievementsGrid}>
                        {achievements.map((achievement, index) => (
                          <div key={index} className={styles.achievementItem}>
                            <span className={styles.checkIcon}>✓</span>
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Button */}
            <div className={styles.contactSection}>
              <button className={styles.contactButton}>
                <span>📧</span>
                <span>Contact Officer</span>
              </button>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>🔗</a>
                <a href="#" className={styles.socialLink}>💼</a>
                <a href="#" className={styles.socialLink}>📱</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FleetOfficerProfile