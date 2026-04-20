import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/HeroSection.module.css'
import bus from '../../assets/images/BUS 11.png'

const HeroSection = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    
    return () => observer.disconnect()
  }, [])

  return (
    <section id="home" className={styles.heroSection} ref={sectionRef}>
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            INJIBARA UNIVERSITY STAFF TRANSPORT AND SCHEDULING MANAGEMENT SYSTEM
          </h1>
          <p className={styles.heroDescription}>
            Efficient, reliable, and smart transport scheduling for university staff.
            Real‑time tracking, automated trip planning, and seamless fleet management.
          </p>
          <div className={styles.buttonGroup}>
            <Link to="/login">
              <button className={styles.primaryBtn}>Get Started</button>
            </Link>
            <button className={styles.secondaryBtn}>Learn More</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection