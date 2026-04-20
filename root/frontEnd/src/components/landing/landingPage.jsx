import React, { useEffect } from 'react'
import Header from './Header'
import HeroSection from './HeroSection'
import TransportManagerProfile from './TransportManagerProfile'
import FleetOfficerProfile from './FleetOfficerProfile'
import ImageSlider from './ImageSlider' 
import TestimonialsSection from './TestimonialsSection'
import Footer from './Footer'
import styles from '../../styles/LandingPage.module.css'

const LandingPage = () => {
  // Add scroll margin to prevent header overlap
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          const header = document.querySelector('header')
          const headerHeight = header ? header.offsetHeight : 80
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
          window.scrollTo({
            top: elementPosition - headerHeight,
            behavior: 'smooth'
          })
        }
      }
    }

    // Initial check for hash in URL
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className={styles.landingPage}>
      <Header />
      <main className={styles.mainContent}>
        <section id="home" className={styles.section}>
          <HeroSection />
        </section>
        
        <hr className="section-divider" />
        
        <section id="profiles" className={styles.section}>
          <TransportManagerProfile />
        </section>
        
        <hr className="section-divider" />
        
        <section id="fleet-officer" className={styles.section}>
          <FleetOfficerProfile />
        </section>
        
        <hr className="section-divider" />
        
        <section id="gallery" className={`${styles.section} ${styles.sliderSection}`}>
          <ImageSlider speed={150} />
        </section>
        
        <hr className="section-divider" />
        
        <section id="testimonials" className={styles.section}>
          <TestimonialsSection />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage