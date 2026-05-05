import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, Mail, Link as LinkIcon, Shield, Send, ArrowUp } from 'lucide-react'
import styles from '../../styles/Footer.module.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const socialIcons = [
    { name: 'Facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, url: '#', color: '#1877f2' },
    { name: 'Twitter', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>, url: '#', color: '#1da1f2' },
    { name: 'LinkedIn', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>, url: '#', color: '#0a66c2' },
    { name: 'Instagram', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, url: '#', color: '#e4405f' },
    { name: 'YouTube', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>, url: '#', color: '#ff0000' }
  ]

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Features', href: '/features' },
    { name: 'Contact', href: '/contact' }
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
      <div className={styles.footerContainer}>
        
        {/* Main Footer Content */}
        <div className={styles.footerGrid}>
          
          {/* Brand Column */}
          <div className={styles.brandColumn}>
            <div className={styles.logoWrapper}>
              <div className={styles.logoIcon}>
                <Home size={24} />
              </div>
              <h3 className={styles.logoText}>Injibara Transport</h3>
            </div>
            <p className={styles.brandDescription}>
              A world-class transport management solution for the Injibara University community, 
              providing seamless, efficient, and reliable transportation services.
            </p>
            <div className={styles.trustBadge}>
              <Shield size={18} />
              <span>Trusted by 5000+ users</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>
              <LinkIcon size={18} />
              Quick Links
            </h4>
            <ul className={styles.linkList}>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className={styles.linkItem}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className={styles.linksColumn}>
            <h4 className={styles.columnTitle}>
              <Shield size={18} />
              Legal
            </h4>
            <ul className={styles.linkList}>
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={styles.linkItem}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className={styles.newsletterColumn}>
            <h4 className={styles.columnTitle}>
              <Mail size={18} />
              Stay Updated
            </h4>
            <p className={styles.newsletterText}>
              Subscribe to our newsletter for the latest updates.
            </p>
            
            <form onSubmit={handleSubscribe} className={styles.subscribeForm}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.emailInput}
              />
              <button type="submit" className={styles.subscribeButton}>
                <Send size={18} />
              </button>
            </form>

            {subscribed && (
              <div className={styles.successMessage}>
                ✓ Thanks for subscribing!
              </div>
            )}

            <div className={styles.socialSection}>
              <h5 className={styles.socialTitle}>Follow Us</h5>
              <div className={styles.socialLinks}>
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    aria-label={social.name}
                    className={styles.socialLink}
                    data-color={social.color}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <p>&copy; {currentYear} Injibara Transport. All rights reserved.</p>
          </div>
          
          <div className={styles.bottomActions}>
            <Link to="/" className={styles.homeLink}>
              <Home size={18} />
              Go back Home
            </Link>
            
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className={styles.scrollTop}
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer