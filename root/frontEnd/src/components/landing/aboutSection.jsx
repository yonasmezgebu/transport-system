import React, { useEffect, useRef } from 'react'
import styles from '../../styles/AboutSection.module.css'

const AboutSection = () => {
  const sectionRef = useRef(null)
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
        
        {/* Header Section */}
        <div ref={contentRef} className={`${styles.headerSection} ${styles.visible}`}>
          <div className={styles.sectionBadge}>
            <span>About Us</span>
          </div>
          <h2 className={styles.aboutTitle}>
            About Our Transport System
          </h2>
          <div className={styles.titleUnderline}></div>
          <p className={styles.aboutDescription}>
           Injibara University Transport System is a comprehensive digital platform designed to modernize and streamline transportation services for students, staff, and faculty. Our system integrates real-time tracking, route optimization, and seamless booking management to enhance campus mobility across Injibara University's expanding facilities and satellite campuses. Built on three foundational layers—Technology, Accessibility, and Sustainability—our platform delivers real-time GPS tracking with live bus locations, accurate arrival predictions, and crowding indicators, reducing average wait times by over 40%. It also provides intelligent route optimization that adapts to class schedules, special events, and demand patterns, ensuring efficient vehicle deployment and reduced fuel consumption, along with seamless booking management via web and mobile interfaces, allowing users to reserve seats, request on-demand shuttles, and receive instant digital permits. Multi-channel alerts through SMS, email, and push notifications keep the community informed about schedule changes, delays, and safety announcements, while an analytics dashboard enables administrators to monitor fleet performance, passenger load factors, and environmental impact metrics. By centralizing dispatch, maintenance scheduling, and driver management, the system eliminates manual processes, reduces operational costs, and provides transparent data for continuous improvement. Our platform is designed with inclusive features—Amharic and English language options, voice-assisted booking, and accessible interfaces for passengers with disabilities—ensuring every member of the university community can travel with dignity and ease. Beyond daily operations, Injibara University Transport System serves as a living laboratory for transportation research, offering anonymized data to engineering and computer science students for capstone projects and innovation challenges. We aim to set a benchmark for campus mobility in Ethiopian higher education, proving that smart, sustainable, and student-centered transport is not just a goal but a reality.
          </p>
        </div>

        <hr className={styles.divider} />

        {/* Mission & Vision Section */}
        <div className={styles.missionVisionGrid}>
          {/* Mission */}
          <div className={styles.missionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardNumber}>01</div>
              <h3 className={styles.cardTitle}>Our Mission</h3>
            </div>
            <p className={styles.cardText}>
              To provide efficient, reliable, and accessible transportation services through innovative technology and smart management, ensuring seamless mobility for the entire university community. Our commitment encompasses six core pillars: Real-time visibility through live GPS tracking and accurate arrival predictions; Environmental stewardship via optimized routes and eco-friendly vehicles; Financial accessibility through affordable fare structures and digital payment options; Safety assurance with monitored vehicles, emergency protocols, and driver training programs; Operational excellence maintained through preventive maintenance and performance metrics; and Community engagement fostered by responsive customer support and continuous feedback integration. We believe that exceptional transportation transforms educational experiences, reduces stress, saves time, and creates equitable access to campus resources for all community members regardless of their living situation or physical abilities.
            </p>
          </div>

          <div className={styles.verticalDivider}></div>

          {/* Vision */}
          <div className={styles.visionCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardNumber}>02</div>
              <h3 className={styles.cardTitle}>Our Vision</h3>
            </div>
            <p className={styles.cardText}>
             To become Ethiopia's leading university transport management system, setting the standard for efficiency, sustainability, and user satisfaction across higher education institutions nationwide. Our vision encompasses four transformative pillars: Digital excellence through AI-powered route optimization, real-time fleet tracking, and predictive maintenance scheduling that maximizes vehicle uptime and minimizes service disruptions; Environmental leadership via systematic transition to electric and hybrid vehicles, carbon emission tracking, and green route planning that reduces fuel consumption by up to 30%; User-centric innovation delivered through intuitive mobile applications, multi-language support including Amharic and English, accessibility features for passengers with disabilities, and 24/7 customer support that resolves concerns within minutes; and Nationwide scalability achieved through cloud-based architecture, standardized operating procedures, and partnership frameworks that enable rapid deployment across multiple campuses. We aspire to create a model that other Ethiopian universities can adopt, adapt, and implement, transforming how students, faculty, and staff experience campus mobility while reducing traffic congestion, lowering transportation costs, and contributing to national sustainability goals. Through continuous investment in local talent, technology transfer, and collaborative research with university engineering departments, we are building not just a transport system, but a blueprint for smart campus infrastructure that positions Ethiopian higher education at the forefront of African educational innovation.
            </p>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Stats Section */}
        <div className={styles.statsContainer}>
          <div className={styles.statItem} ref={el => statsRef.current[0] = el}>
            <div 
              className={styles.statNumber} 
              data-target="5000"
              data-suffix="+"
            >
              0+
            </div>
            <div className={styles.statLabel}>Active Users</div>
          </div>
          
          <div className={styles.statDivider}></div>
          
          <div className={styles.statItem} ref={el => statsRef.current[1] = el}>
            <div 
              className={styles.statNumber} 
              data-target="25"
              data-suffix="+"
            >
              0+
            </div>
            <div className={styles.statLabel}>Fleet Vehicles</div>
          </div>
          
          <div className={styles.statDivider}></div>
          
          <div className={styles.statItem} ref={el => statsRef.current[2] = el}>
            <div 
              className={styles.statNumber} 
              data-target="98"
              data-suffix="%"
            >
              0%
            </div>
            <div className={styles.statLabel}>Satisfaction Rate</div>
          </div>

          <div className={styles.statDivider}></div>

          <div className={styles.statItem} ref={el => statsRef.current[3] = el}>
            <div 
              className={styles.statNumber} 
              data-target="24"
              data-suffix="/7"
            >
              0/7
            </div>
            <div className={styles.statLabel}>Support Available</div>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Core Values Section */}
        <div className={styles.valuesSection}>
          <h3 className={styles.valuesTitle}>Core Values</h3>
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <span className={styles.valueNumber}>01</span>
              <span className={styles.valueText}>Innovation</span>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueNumber}>02</span>
              <span className={styles.valueText}>Reliability</span>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueNumber}>03</span>
              <span className={styles.valueText}>Efficiency</span>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueNumber}>04</span>
              <span className={styles.valueText}>Sustainability</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default AboutSection