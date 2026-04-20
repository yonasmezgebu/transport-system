import React, { useState, useEffect, useRef } from 'react'
import styles from '../../styles/TransportManagerProfile.module.css'

// Import manager image (replace with your actual image path)
import managerImage from '../../assets/images/manager.jpg'

const TransportManagerProfile = () => {
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
      { element: document.querySelector(`.${styles.statNumber1}`), target: 8, suffix: '+' },
      { element: document.querySelector(`.${styles.statNumber2}`), target: 25, suffix: '+' },
      { element: document.querySelector(`.${styles.statNumber3}`), target: 5, suffix: '+' }
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
    'Reduced fuel costs by 25% through smart tracking',
    'Implemented real-time vehicle monitoring system',
    'Achieved 99% on-time departure rate',
    'Received University Excellence Award 2023'
  ]

  return (
    <section id="transport-manager" className={styles.profileSection} ref={sectionRef}>
      {/* White Background with Subtle Elements */}
      <div className={styles.profileBackground}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.profileCard} ${isVisible ? styles.visible : ''}`}>
          {/* Image Section */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <div className={styles.imageGlow}></div>
              <img 
                src={managerImage} 
                alt="Transport Manager - Biruk Tesfaye" 
                className={styles.profileImage}
              />
              <div className={styles.imageBorder}></div>
            </div>
            <div className={styles.experienceBadge}>
              <span className={styles.badgeIcon}>🏆</span>
              <span className={styles.badgeText}>Award Winner 2023</span>
            </div>
          </div>

          {/* Content Section */}
          <div className={styles.contentSection}>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>👨‍💼</span>
              <span>Leadership & Management</span>
              <div className={styles.badgePulse}></div>
            </div>
            
            <h2 className={styles.sectionTitle}>
              Transport Office Manager
            </h2>
            
            <h3 className={styles.managerName}>
              Biruk Tesfaye
              <div className={styles.nameUnderline}></div>
            </h3>
            
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📅</div>
                <div className={`${styles.statNumber} ${styles.statNumber1}`}>8+</div>
                <div className={styles.statLabel}>Years Experience</div>
                <div className={styles.statProgress}></div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🚌</div>
                <div className={`${styles.statNumber} ${styles.statNumber2}`}>25+</div>
                <div className={styles.statLabel}>Fleet Vehicles</div>
                <div className={styles.statProgress}></div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={`${styles.statNumber} ${styles.statNumber3}`}>5,000+</div>
                <div className={styles.statLabel}>Daily Commuters</div>
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
                      Biruk Tesfaye has been serving as the Office Manager at Injibara University 
                      for over 8 years. With a Master's degree in Logistics and Supply Chain Management 
                      from Addis Ababa University, he has transformed the university's transport system 
                      from manual operations to a fully digitalized platform.
                    </p>
                    <p>
                      Under his leadership, the fleet has grown to serve over 5,000 students and staff daily. 
                      He is passionate about leveraging technology to improve efficiency and reduce operational costs.
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

                    {/* Quote Section */}
                    <div className={styles.quoteSection}>
                      <div className={styles.quoteIcon}>"</div>
                      <p className={styles.quoteText}>
                        Our goal is to provide safe, efficient, and reliable transportation 
                        for every member of the Injibara University community.
                      </p>
                      <div className={styles.quoteAuthor}>- Biruk Tesfaye</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className={styles.contactSection}>
              <button className={styles.contactButton}>
                <span>📧</span>
                <span>Schedule Meeting</span>
              </button>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>🔗</a>
                <a href="#" className={styles.socialLink}>💼</a>
                <a href="#" className={styles.socialLink}>📱</a>
                <a href="#" className={styles.socialLink}>✉️</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TransportManagerProfile