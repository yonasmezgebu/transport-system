import React from 'react'

const testimonials = [
  {
    name: 'Dr. Abebe Kebede',
    role: 'University Admin',
    quote: 'This system has transformed how we manage university transport. Highly recommended! The real-time tracking and automated scheduling are absolute game-changers.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Biruk Tesfaye',
    role: 'Transport Manager',
    quote: 'The scheduling and conflict detection features save us hours of manual work daily. Our fleet efficiency has improved by over 40% since implementation.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/men/45.jpg'
  },
  {
    name: 'Selam Girmay',
    role: 'Student',
    quote: 'I love the occupancy feature! I always know which bus has space before leaving my dorm. No more waiting in the cold!',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    name: 'Meron Alemu',
    role: 'Fleet Officer',
    quote: 'Fuel tracking and maintenance scheduling have never been easier. The dashboard gives me complete visibility over our entire fleet.',
    rating: 5,
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  }
]

const TestimonialsSection = () => {
  return (
    <>
      <style>{`
        @keyframes floatCard {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes shineBorder {
          0% {
            border-color: rgba(102, 126, 234, 0.2);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          100% {
            border-color: rgba(102, 126, 234, 0.6);
            box-shadow: 0 20px 35px rgba(102, 126, 234, 0.15);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .testimonial-card {
          background: white;
          padding: 2rem;
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: calc(var(--index, 0) * 0.1s);
          opacity: 0;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }
        
        .testimonial-card:hover {
          transform: translateY(-12px);
          border-color: rgba(102, 126, 234, 0.4);
          box-shadow: 0 25px 45px rgba(102, 126, 234, 0.2);
        }
        
        .testimonial-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.05), transparent);
          transition: left 0.6s ease;
        }
        
        .testimonial-card:hover::before {
          left: 100%;
        }
        
        .quote-icon {
          font-size: 3.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          opacity: 0.6;
          margin-bottom: 0.5rem;
          line-height: 1;
        }
        
        .profile-image {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #667eea;
          transition: all 0.3s ease;
        }
        
        .testimonial-card:hover .profile-image {
          transform: scale(1.05);
          border-color: #764ba2;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .star-rating {
          display: inline-flex;
          gap: 4px;
        }
        
        .star {
          font-size: 1rem;
          transition: transform 0.2s ease;
        }
        
        .testimonial-card:hover .star {
          transform: scale(1.1);
        }
        
        @keyframes gradientBG {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .section-gradient {
          background: linear-gradient(135deg, #f5f7fa 0%, #e9eef5 50%, #f0f4f8 100%);
          background-size: 200% 200%;
          animation: gradientBG 10s ease infinite;
        }
        
        .glow-text {
          background: linear-gradient(135deg, #667eea, #764ba2);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
      `}</style>

      <section id="testimonials" className="section-gradient" style={{ 
        padding: '80px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(118,75,162,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
              padding: '6px 18px',
              borderRadius: '50px',
              marginBottom: '1rem'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#667eea' }}>
                ⭐ Trusted by Thousands
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 2.8rem)',
              fontWeight: '800',
              marginBottom: '1rem',
              color: '#1e293b'
            }}>
              What Our <span className="glow-text">Users Say</span>
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 3vw, 1.1rem)',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Trusted by thousands of students, staff, and administrators across Injibara University
            </p>
          </div>

          {/* Testimonials Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="testimonial-card"
                style={{ '--index': index }}
              >
                {/* Quote Icon */}
                <div className="quote-icon">“</div>
                
                {/* Quote Text */}
                <p style={{
                  color: '#475569',
                  lineHeight: '1.7',
                  marginBottom: '1.5rem',
                  fontSize: '0.95rem',
                  fontStyle: 'italic'
                }}>
                  {testimonial.quote}
                </p>
                
                {/* Rating Stars */}
                <div className="star-rating" style={{ marginBottom: '1.2rem' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="star" style={{
                      color: i < testimonial.rating ? '#fbbf24' : '#e2e8f0',
                      fontSize: '1rem'
                    }}>★</span>
                  ))}
                </div>
                
                {/* User Info with Image */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '1.2rem'
                }}>
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="profile-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=667eea&color=fff&bold=true`
                    }}
                  />
                  <div>
                    <h4 style={{
                      color: '#1e293b',
                      fontSize: '1rem',
                      fontWeight: '700',
                      marginBottom: '0.2rem'
                    }}>
                      {testimonial.name}
                    </h4>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      fontWeight: '500'
                    }}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                
                {/* Decorative corner */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '16px',
                  fontSize: '2rem',
                  opacity: '0.08',
                  pointerEvents: 'none',
                  fontFamily: 'serif'
                }}>
                  ❝
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust Badge Section */}
          <div style={{
            marginTop: '4rem',
            textAlign: 'center',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(102,126,234,0.05), rgba(118,75,162,0.05))',
            borderRadius: '30px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>🏆</span>
                <span style={{ fontWeight: '600', color: '#475569' }}>4.9/5 Average Rating</span>
              </div>
              <div style={{ width: '1px', height: '30px', background: '#cbd5e1' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>👥</span>
                <span style={{ fontWeight: '600', color: '#475569' }}>5000+ Happy Users</span>
              </div>
              <div style={{ width: '1px', height: '30px', background: '#cbd5e1' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>💬</span>
                <span style={{ fontWeight: '600', color: '#475569' }}>Verified Reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default TestimonialsSection