import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/Footer.module.css'

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  const socialIcons = [
    { name: 'Facebook', icon: '📘', url: '#', color: '#1877f2' },
    { name: 'Twitter', icon: '🐦', url: '#', color: '#1da1f2' },
    { name: 'LinkedIn', icon: '🔗', url: '#', color: '#0a66c2' },
    { name: 'Instagram', icon: '📷', url: '#', color: '#e4405f' },
    { name: 'YouTube', icon: '📺', url: '#', color: '#ff0000' }
  ]

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Features', href: '#features' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' }
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Accessibility', href: '#' }
  ]

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setTimeout(() => setSubscribed(false), 3000)
      setEmail('')
    }
  }

  return (
    <footer className={styles.footer}>
      {/* Animated Background */}
      <div className={styles.footerBackground}>
        <div className={styles.gradientLine}></div>
        <div className={styles.particleField}>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
        </div>
      </div>

      <div className={styles.footerContainer}>
        {/* Main Footer Content */}
        <div className={styles.footerGrid}>
          {/* Brand Column */}
          <div className={styles.footerColumn}>
            <div className={styles.brand}>
              <div className={styles.logoWrapper}>
                <div className={styles.logoIcon}>
                  <span className={styles.logoEmoji}>🚌</span>
                  <div className={styles.logoPulse}></div>
                </div>
                <h3 className={styles.brandName}>Injibara Transport</h3>
              </div>
              <p className={styles.brandDescription}>
                Smart transport management solution for Injibara University community, 
                providing seamless and efficient transportation services.
              </p>
              <div className={styles.trustBadge}>
                <span className={styles.badgeIcon}>✓</span>
                <span>Trusted by 5000+ users</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>
              <span className={styles.titleIcon}>🔗</span>
              Quick Links
            </h4>
            <ul className={styles.linkList}>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={styles.linkItem}>
                    <span className={styles.linkArrow}>→</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>
              <span className={styles.titleIcon}>⚖️</span>
              Legal
            </h4>
            <ul className={styles.linkList}>
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={styles.linkItem}>
                    <span className={styles.linkArrow}>→</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className={styles.footerColumn}>
            <h4 className={styles.columnTitle}>
              <span className={styles.titleIcon}>📧</span>
              Stay Updated
            </h4>
            <p className={styles.newsletterText}>
              Subscribe to our newsletter for updates and news.
            </p>
            
            <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.subscribeBtn}>
                  <span>Subscribe</span>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>

            {subscribed && (
              <div className={styles.subscribeSuccess}>
                ✓ Thanks for subscribing!
              </div>
            )}

            <div className={styles.socialSection}>
              <h5 className={styles.socialTitle}>Follow Us</h5>
              <div className={styles.socialIcons}>
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={styles.socialIcon}
                    style={{ '--hover-color': social.color }}
                    aria-label={social.name}
                  >
                    <span>{social.icon}</span>
                    <div className={styles.socialTooltip}>{social.name}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className={styles.footerStats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>5000+</div>
            <div className={styles.statLabel}>Active Users</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>10000+</div>
            <div className={styles.statLabel}>Trips Completed</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>99.9%</div>
            <div className={styles.statLabel}>Satisfaction Rate</div>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Support Available</div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <p>&copy; {currentYear} Injibara University Transport System. All rights reserved.</p>
          </div>
          <div className={styles.bottomLinks}>
            <a href="#">Sitemap</a>
            <span className={styles.divider}>|</span>
            <a href="#">Accessibility</a>
            <span className={styles.divider}>|</span>
            <a href="#">Contact Support</a>
          </div>
          <div className={styles.backToTop}>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={styles.backToTopBtn}>
              <span>↑</span>
              <span className={styles.backText}>Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer