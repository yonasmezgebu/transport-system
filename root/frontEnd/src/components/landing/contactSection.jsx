import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/ContactSection.module.css';

// Material Icons as inline SVGs for consistency
const Icons = {
  Chat: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z"/>
    </svg>
  ),
  Location: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  ),
  Email: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
  Schedule: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>
  ),
  Send: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  ArrowForward: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84q-.51 0-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  ),
  Person: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  ),
  EmailOutline: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
  Message: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z"/>
    </svg>
  ),
  LocationPin: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
    </svg>
  )
};

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Icons.Location />,
      title: 'Address',
      details: 'Injibara University, Ethiopia',
      link: null
    },
    {
      icon: <Icons.Phone />,
      title: 'Phone',
      details: '+251 912 345 678',
      link: 'tel:+251912345678'
    },
    {
      icon: <Icons.Email />,
      title: 'Email',
      details: 'transport@injibara.edu.et',
      link: 'mailto:transport@injibara.edu.et'
    },
    {
      icon: <Icons.Schedule />,
      title: 'Support Hours',
      details: 'Monday - Saturday: 8:00 AM - 6:00 PM',
      link: null
    }
  ];

  return (
    <section id="contact" className={styles.contactSection} ref={sectionRef}>
      <div className={styles.contactContainer}>
        {/* Section Header */}
        <div className={`${styles.contactHeader} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.sectionBadge}>
            <span className={styles.badgeIcon}><Icons.Chat /></span>
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
                  className={styles.infoCard}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.cardIconWrapper}>
                    <div className={styles.cardIcon}>
                      {info.icon}
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
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className={styles.socialLinks}>
              <h4 className={styles.socialTitle}>Follow Us</h4>
              <div className={styles.socialIcons}>
                <a href="#" className={styles.socialIcon}>
                  <Icons.Facebook />
                  <div className={styles.socialTooltip}>Facebook</div>
                </a>
                <a href="#" className={styles.socialIcon}>
                  <Icons.Twitter />
                  <div className={styles.socialTooltip}>Twitter</div>
                </a>
                <a href="#" className={styles.socialIcon}>
                  <Icons.Instagram />
                  <div className={styles.socialTooltip}>Instagram</div>
                </a>
                <a href="#" className={styles.socialIcon}>
                  <Icons.LinkedIn />
                  <div className={styles.socialTooltip}>LinkedIn</div>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`${styles.contactFormWrapper} ${isVisible ? styles.visible : ''}`}>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formHeader}>
                <div className={styles.formHeaderIcon}><Icons.Message /></div>
                <h3 className={styles.formTitle}>Send Us a Message</h3>
                <p className={styles.formSubtitle}>We'll respond within 24 hours</p>
              </div>

              {submitted && (
                <div className={styles.successMessage}>
                  <span className={styles.successIcon}><Icons.CheckCircle /></span>
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
                  <span className={styles.inputIcon}><Icons.Person /></span>
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
                  <span className={styles.inputIcon}><Icons.EmailOutline /></span>
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
                  <span className={styles.inputIcon}><Icons.Message /></span>
                  <textarea
                    rows={4}
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
                <Icons.ArrowForward />
              </button>

              <div className={styles.formFooter}>
                <Icons.Lock />
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
                <Icons.LocationPin />
                <div className={styles.pinPulse}></div>
              </div>
              <p className={styles.mapText}>Injibara University Campus</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;