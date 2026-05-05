import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, LogIn } from 'lucide-react';
import styles from '../../styles/Header.module.css';
// Make sure this path is correct for your project structure
import busLogo from '../../assets/images/bus.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const navLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Features', href: '/features' },
    { name: 'Contact', href: '/contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <nav className={styles.navbar}>
            {/* Logo with Local Bus Image */}
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <img 
                  src={busLogo}
                  alt="Injibara Transport Bus" 
                  className={styles.busImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=50&h=50&fit=crop';
                  }}
                />
              </div>
              <div className={styles.logoText}>
                <h1 className={styles.logoTitle}>Injibara Transport</h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className={styles.desktopNav}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`${styles.navLink} ${location.pathname === link.href ? styles.active : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className={styles.actions}>
              {/* Search Bar */}
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <Search size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </form>
              
              {/* Login Button */}
              <Link to="/login" className={styles.loginLink}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.loginBtn}
                >
                  <LogIn size={18} />
                  Login
                </motion.button>
              </Link>

              {/* Register Button */}
              <Link to="/register" className={styles.loginLink} style={{ marginLeft: '10px' }}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.loginBtn}
                  style={{ backgroundColor: '#10b981' }}
                >
                  Register
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={styles.menuBtn}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.overlay} 
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className={styles.mobileMenu}
          >
            <div className={styles.mobileMenuHeader}>
              <div className={styles.mobileLogo}>
                <img 
                  src={busLogo}  // Fixed: use the same imported image
                  alt="Injibara Transport Bus" 
                  className={styles.mobileBusImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=40&h=40&fit=crop';
                  }}
                />
                <span className={styles.mobileLogoText}>Injibara Transport</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className={styles.closeMenuBtn}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.mobileMenuContent}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={styles.mobileNavLink}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className={styles.mobileActions}>
                <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
                  <Search size={20} className={styles.mobileSearchIcon} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.mobileSearchInput}
                  />
                </form>
                
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className={styles.mobileLoginLink}>
                  <button className={styles.mobileLoginBtn}>
                    <LogIn size={20} />
                    Login
                  </button>
                </Link>

                <Link to="/register" onClick={() => setIsMenuOpen(false)} className={styles.mobileLoginLink} style={{ marginTop: '10px' }}>
                  <button className={styles.mobileLoginBtn} style={{ backgroundColor: '#10b981' }}>
                    Register
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;