import React from 'react'
import styles from './LandingPage.module.css'

const SupportSection = () => {
  return (
    <section id="support" style={{ padding: '80px 0', background: '#f0f4f8' }}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Support Center</h2>
        <p className={styles.sectionSubtitle}>
          Get the help you need, when you need it
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ padding: '2rem', background: 'white', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📖</div>
            <h3>Knowledge Base</h3>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Browse articles and guides</p>
          </div>
          <div style={{ padding: '2rem', background: 'white', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
            <h3>Live Chat</h3>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Chat with support team</p>
          </div>
          <div style={{ padding: '2rem', background: 'white', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
            <h3>Email Support</h3>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>support@injibara.edu.et</p>
          </div>
          <div style={{ padding: '2rem', background: 'white', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📞</div>
            <h3>Hotline</h3>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>+251 912 345 678 (24/7)</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SupportSection