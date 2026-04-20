import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/ServicesSection.module.css';

// Real images for each service
// Copy this entire object
const serviceImages = {
  // Smartphone with GPS (Bus Tracking)
  busTracking: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=800&h=500&fit=crop',
  
  // Digital permits on tablet
  digitalPermits: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=500&fit=crop',
  
  // Smart city road asphalt (Route Planning)
  routePlanning: 'https://images.pexels.com/photos/210182/pexels-photo-210182.jpeg?w=800&h=500&fit=crop',
  
  // Analytics dashboard
  analyticsDashboard: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
  
  // Trumpet/Megaphone (Smart Alerts) - WORKING LINK
  smartAlerts: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=500&fit=crop',
  
  // Digital payments
  digitalPayments: 'https://images.unsplash.com/photo-1625225233840-695456021cde?w=800&h=500&fit=crop'
};

const services = [
  {
    id: 1,
    title: 'Bus Tracking',
    description: 'Real-time bus location tracking and arrival predictions with GPS accuracy. Our advanced tracking system provides live location updates every 2 seconds, ensuring you always know exactly where your bus is. The predictive arrival algorithm factors in current traffic conditions, historical route data, and real-time weather patterns to deliver accurate ETAs within 30 seconds of actual arrival.',
    image: serviceImages.busTracking,
    link: '#',
    features: ['Live Location', 'Arrival Time', 'Route Map', 'Traffic Integration', 'Favorite Routes']
  },
  {
    id: 2,
    title: 'Digital Permits',
    description: 'Online transport request and approval system for seamless campus commute. Submit transport requests from any device with our streamlined digital workflow that reduces processing time from days to minutes. Administrators can review, approve, or modify requests with real-time status updates and automated email notifications.',
    image: serviceImages.digitalPermits,
    link: '#',
    features: ['Instant Approval', 'Digital Pass', 'Easy Renewal', 'Audit Trail', 'Bulk Processing']
  },
  {
    id: 3,
    title: 'Route Planning',
    description: 'Optimized routes for efficient campus commute with AI-powered suggestions. Our machine learning algorithms analyze thousands of data points including historical ridership patterns, peak demand periods, special events, and construction schedules to generate the most efficient route networks.',
    image: serviceImages.routePlanning,
    link: '#',
    features: ['AI Optimized', 'Multiple Routes', 'Traffic Updates', 'Scenario Simulation', 'Capacity Balancing']
  },
  {
    id: 4,
    title: 'Analytics Dashboard',
    description: 'Comprehensive reports on fleet performance and usage patterns. Transform raw operational data into actionable insights with our interactive dashboard featuring customizable visualizations and drill-down capabilities. Track key performance indicators including on-time performance, passenger load factors, and fuel efficiency.',
    image: serviceImages.analyticsDashboard,
    link: '#',
    features: ['Real-time Stats', 'Usage Reports', 'Performance Metrics', 'Custom Dashboards', 'Predictive Analytics']
  },
  {
    id: 5,
    title: 'Smart Alerts',
    description: 'Real-time notifications for schedule changes and important updates. Our intelligent notification engine delivers critical information through your preferred communication channels including push notifications, SMS, email, or in-app messages. Advanced filtering ensures you receive only relevant alerts.',
    image: serviceImages.smartAlerts,
    link: '#',
    features: ['Push Notifications', 'SMS Alerts', 'Email Updates', 'Geofencing', 'Emergency Broadcast']
  },
  {
    id: 6,
    title: 'Digital Payments',
    description: 'Secure online payment for transport services with multiple options. Our PCI-compliant payment gateway supports credit cards, debit cards, digital wallets, and campus account integration for a seamless checkout experience. Automated receipt generation provides complete financial visibility.',
    image: serviceImages.digitalPayments,
    link: '#',
    features: ['Secure Payment', 'Multiple Methods', 'Transaction History', 'Recurring Billing', 'Financial Reports']
  }
];

const ServicesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [visibleServices, setVisibleServices] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const serviceId = parseInt(entry.target.dataset.id);
            setVisibleServices(prev => [...new Set([...prev, serviceId])]);
          }
        });
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    const serviceElements = document.querySelectorAll(`.${styles.serviceCard}`);
    serviceElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className={styles.servicesSection} ref={sectionRef}>
      <div className={styles.servicesContainer}>
        {/* Section Header */}
        <div className={styles.servicesHeader}>
          <div className={styles.sectionBadge}>
            <span className={styles.badgeIcon}>✦</span>
            <span>What We Offer</span>
          </div>
          <h2 className={styles.servicesTitle}>
            Our Premium
            <span className={styles.gradientText}> Services</span>
          </h2>
          <p className={styles.servicesSubtitle}>
            Comprehensive transport solutions designed for the entire university community
          </p>
          <div className={styles.titleDecoration}>
            <div className={styles.decorationLine}></div>
            <div className={styles.decorationDot}></div>
            <div className={styles.decorationLine}></div>
          </div>
        </div>

        {/* Services Grid */}
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div
              key={service.id}
              data-id={service.id}
              ref={el => {
                if (el) {
                  const cardsRef = document.querySelectorAll(`.${styles.serviceCard}`);
                  if (cardsRef[index]) return;
                }
              }}
              className={`${styles.serviceCard} ${visibleServices.includes(service.id) ? styles.visible : ''} ${hoveredIndex === index ? styles.cardHovered : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Image Section */}
              <div className={styles.cardImageWrapper}>
                <img 
                  src={service.image} 
                  alt={service.title}
                  className={styles.cardImage}
                  loading="lazy"
                />
                <div className={styles.imageOverlay}></div>
                <div className={styles.serviceNumber}>
                  <span>0{service.id}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDescription}>{service.description}</p>
                
                {/* Divider */}
                <div className={styles.cardDivider}></div>
                
                {/* Features List */}
                <div className={styles.cardFeatures}>
                  {service.features.map((feature, idx) => (
                    <div key={idx} className={styles.featureItem}>
                      <span className={styles.featureDot}>✦</span>
                      <span className={styles.featureText}>{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Learn More Link */}
                <a href={service.link} className={styles.cardLink}>
                  <span>Learn More</span>
                  <svg className={styles.linkArrow} viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
              
              <div className={styles.hoverLine}></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={styles.servicesCTA}>
          <p className={styles.ctaText}>Need a custom solution for your department?</p>
          <button className={styles.ctaButton}>
            Contact Our Team
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;