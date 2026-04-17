import React, { useEffect } from 'react'
import Header from './Header'
import HeroSection from './HeroSection'
import TransportManagerProfile from './TransportManagerProfile'
import FleetOfficerProfile from './FleetOfficerProfile'
import ImageSlider from './ImageSlider' 
import AboutSection from './AboutSection'
import ServicesSection from './ServicesSection'
import FeaturesSection from './FeaturesSection'
import TestimonialsSection from './TestimonialsSection'
import ContactSection from './ContactSection'
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
        
        <section id="profiles" className={styles.section}>
          <TransportManagerProfile />
        </section>
        
        <section id="fleet-officer" className={styles.section}>
          <FleetOfficerProfile />
        </section>
        
        <section id="gallery" className={`${styles.section} ${styles.sliderSection}`}>
          <ImageSlider speed={150} />
        </section>
        
        <section id="about" className={styles.section}>
          <AboutSection />
        </section>
        
        <section id="services" className={styles.section}>
          <ServicesSection />
        </section>
        
        <section id="features" className={styles.section}>
          <FeaturesSection />
        </section>
        
        <section id="testimonials" className={styles.section}>
          <TestimonialsSection />
        </section>
        
        <section id="contact" className={styles.section}>
          <ContactSection />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage