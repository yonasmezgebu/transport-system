import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../../styles/header.module.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('EN')
  const navigate = useNavigate()

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Features', href: '#features' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
      // Implement search functionality
    }
  }

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value)
    // Implement language change functionality
  }

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <nav className={styles.navbar}>
            {/* Logo */}
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <span className={styles.logoEmoji}>🚌</span>
              </div>
              <div className={styles.logoText}>
                <h1 className={styles.logoTitle}>Injibara Transport</h1>
                <p className={styles.logoSubtitle}>University Transport System</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className={styles.desktopNav}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={styles.navLink}
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.querySelector(link.href)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className={styles.actions}>
              <select 
                className={styles.languageSelector}
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <option value="EN">EN</option>
                <option value="AM">አማ</option>
              </select>
              
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                  type="text"
                  placeholder="Search..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className={styles.searchBtn}>
                  🔍
                </button>
              </form>
              
              <Link to="/login">
                <button className={styles.loginBtn}>
                  Login <span className={styles.loginArrow}>→</span>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={styles.menuBtn}
              aria-label="Toggle menu"
            >
              <div className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.overlay} ${isMenuOpen ? styles.overlayActive : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      
      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <div className={styles.mobileLogo}>
            <span className={styles.mobileLogoEmoji}>🚌</span>
            <span className={styles.mobileLogoText}>Injibara Transport</span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className={styles.closeBtn}>✕</button>
        </div>
        
        <div className={styles.mobileMenuContent}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={styles.mobileNavLink}
              onClick={(e) => {
                e.preventDefault()
                const element = document.querySelector(link.href)
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
                setIsMenuOpen(false)
              }}
            >
              {link.name}
            </a>
          ))}
          
          <div className={styles.mobileActions}>
            <select 
              className={styles.mobileLanguageSelector}
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="EN">English (EN)</option>
              <option value="AM">አማርኛ (AM)</option>
            </select>
            
            <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
              <input
                type="text"
                placeholder="Search..."
                className={styles.mobileSearchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className={styles.mobileSearchBtn}>
                🔍
              </button>
            </form>
            
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <button className={styles.mobileLoginBtn}>
                Login →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header