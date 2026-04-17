import React, { useState, useEffect, useRef } from 'react'
import styles from '../../styles/ContactSection.module.css'

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: '🌍',
      title: 'Address',
      details: 'Injibara University, Ethiopia',
      color: 'gradient1',
      link: null
    },
    {
      icon: '📞',
      title: 'Phone',
      details: '+251 912 345 678',
      color: 'gradient2',
      link: 'tel:+251912345678'
    },
    {
      icon: '✉️',
      title: 'Email',
      details: 'transport@injibara.edu.et',
      color: 'gradient3',
      link: 'mailto:transport@injibara.edu.et'
    },
    {
      icon: '🕒',
      title: 'Support Hours',
      details: 'Monday - Saturday: 8:00 AM - 6:00 PM',
      color: 'gradient4',
      link: null
    }
  ]

  return (
    <section id="contact" className={styles.contactSection} ref={sectionRef}>
      {/* Animated Background */}
      <div className={styles.contactBackground}>
        <div className={styles.bgWave1}></div>
        <div className={styles.bgWave2}></div>
        <div className={styles.bgWave3}></div>
        <div className={styles.particleContainer}>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
        </div>
      </div>

      <div className={styles.contactContainer}>
        {/* Section Header */}
        <div className={`${styles.contactHeader} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.sectionBadge}>
            <span className={styles.badgeIcon}>💬</span>
            <span>Get In Touch</span>
          </div>
          <h2 className={styles.contactTitle}>
            Let's Talk About Your
            <span className={styles.gradientText}> Transport Needs</span>
          </h2>
          <p className={styles.contactSubtitle}>
            Have questions? We're here to help you 24/7
          </p>
          <div className={styles.titleDecoration}>
            <div className={styles.decorationLine}></div>
            <div className={styles.decorationHeart}>❤️</div>
            <div className={styles.decorationLine}></div>
          </div>
        </div>

        <div className={styles.contactGrid}>
          {/* Contact Info Cards */}
          <div className={`${styles.contactInfo} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.infoCards}>
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className={`${styles.infoCard} ${styles[info.color]}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.cardIconWrapper}>
                    <div className={styles.cardIcon}>
                      <span>{info.icon}</span>
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <h4 className={styles.cardTitle}>{info.title}</h4>
                    {info.link ? (
                      <a href={info.link} className={styles.cardDetails}>
                        {info.details}
                      </a>
                    ) : (
                      <p className={styles.cardDetails}>{info.details}</p>
                    )}
                  </div>
                  <div className={styles.cardHoverEffect}></div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className={styles.socialLinks}>
              <h4 className={styles.socialTitle}>Follow Us</h4>
              <div className={styles.socialIcons}>
                <a href="#" className={styles.socialIcon}>
                  <span>📘</span>
                  <div className={styles.socialTooltip}>Facebook</div>
                </a>
                <a href="#" className={styles.socialIcon}>
                  <span>🐦</span>
                  <div className={styles.socialTooltip}>Twitter</div>
                </a>
                <a href="#" className={styles.socialIcon}>
                  <span>📸</span>
                  <div className={styles.socialTooltip}>Instagram</div>
                </a>
                <a href="#" className={styles.socialIcon}>
                  <span>💼</span>
                  <div className={styles.socialTooltip}>LinkedIn</div>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`${styles.contactFormWrapper} ${isVisible ? styles.visible : ''}`}>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formHeader}>
                <div className={styles.formHeaderIcon}>📝</div>
                <h3 className={styles.formTitle}>Send Us a Message</h3>
                <p className={styles.formSubtitle}>We'll respond within 24 hours</p>
              </div>

              {submitted && (
                <div className={styles.successMessage}>
                  <span className={styles.successIcon}>✓</span>
                  <div>
                    <strong>Thank you!</strong> We'll get back to you soon.
                  </div>
                </div>
              )}
              
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${focusedField === 'name' ? styles.labelFocused : ''}`}>
                  Your Name
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>👤</span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={styles.formInput}
                    placeholder="John Doe"
                  />
                  <div className={styles.inputBorder}></div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${focusedField === 'email' ? styles.labelFocused : ''}`}>
                  Email Address
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>✉️</span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={styles.formInput}
                    placeholder="john@example.com"
                  />
                  <div className={styles.inputBorder}></div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${focusedField === 'message' ? styles.labelFocused : ''}`}>
                  Your Message
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>💬</span>
                  <textarea
                    rows="4"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    className={styles.formTextarea}
                    placeholder="Tell us how we can help..."
                  ></textarea>
                  <div className={styles.inputBorder}></div>
                </div>
              </div>
              
              <button type="submit" className={styles.submitButton}>
                <span>Send Message</span>
                <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className={styles.formFooter}>
                <p>We respect your privacy. No spam, ever.</p>
              </div>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className={styles.mapSection}>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapOverlay}>
              <div className={styles.mapPin}>
                <span>📍</span>
                <div className={styles.pinPulse}></div>
              </div>
              <p className={styles.mapText}>Injibara University Campus</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection