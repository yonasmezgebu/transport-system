import React, { useEffect } from 'react'
import Header from '../Header'
import Footer from '../Footer'
import AboutSection from '../AboutSection'
import styles from '../../../styles/LandingPage.module.css'

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={styles.landingPage}>
      <Header />
      <main className={styles.mainContent} style={{ paddingTop: '80px', minHeight: '80vh' }}>
        <section className={styles.section}>
          <AboutSection />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default AboutPage
