import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Login failed. Please check your credentials.')
    }
    
    setLoading(false)
  }

  return (
    <>
      {/* 🌊 FULL TSUNAMI BACKGROUND + FLOATING GLOW CARD + INPUT GLOW */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
          background: #020a0f;
          font-family: 'Segoe UI', 'Poppins', system-ui, -apple-system, 'Inter', sans-serif;
          overflow-x: hidden;
        }

        /* CONTAINER - full screen tsunami background */
        .login-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          background: radial-gradient(circle at 30% 20%, #06212e, #01080c);
        }

        /* ========= TSUNAMI WAVE LAYERS - FULL BACKGROUND COVERAGE ========= */
        .tsunami-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100%;
          background-repeat: repeat-x;
          background-position: bottom;
          pointer-events: none;
          z-index: 1;
        }

        /* Wave 1 - fast surface foam */
        .wave-1 {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 180'%3E%3Cpath fill='%234a9eb3' fill-opacity='0.5' d='M0,140 C180,190 320,100 500,130 C680,160 820,90 1000,120 C1120,140 1180,100 1200,120 L1200,180 L0,180 Z'/%3E%3Cpath fill='%23307e92' fill-opacity='0.6' d='M0,160 C200,210 400,120 600,150 C800,180 1000,110 1200,140 L1200,180 L0,180 Z'/%3E%3C/svg%3E");
          background-size: 1200px 180px;
          bottom: -10px;
          height: 220px;
          opacity: 0.75;
          animation: tsunamiSwell1 16s cubic-bezier(0.4, 0.1, 0.2, 1) infinite alternate;
        }

        /* Wave 2 - powerful mid current */
        .wave-2 {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1400 240'%3E%3Cpath fill='%23246b7e' fill-opacity='0.65' d='M0,180 C300,240 600,130 900,190 C1150,230 1300,160 1400,190 L1400,240 L0,240 Z'/%3E%3Cpath fill='%231a5566' fill-opacity='0.55' d='M0,210 C350,270 700,150 1050,210 C1250,245 1350,190 1400,220 L1400,240 L0,240 Z'/%3E%3C/svg%3E");
          background-size: 1400px 240px;
          bottom: -30px;
          height: 280px;
          animation: tsunamiSwell2 22s cubic-bezier(0.45, 0.05, 0.2, 1) infinite alternate-reverse;
          opacity: 0.7;
        }

        /* Wave 3 - deep tsunami swell */
        .wave-3 {
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 300'%3E%3Cpath fill='%23155c6e' fill-opacity='0.8' d='M0,230 C450,300 850,180 1250,250 C1450,280 1550,230 1600,250 L1600,300 L0,300 Z'/%3E%3C/svg%3E");
          background-size: 1600px 300px;
          bottom: -50px;
          height: 340px;
          animation: tsunamiSwell3 28s ease-in-out infinite alternate;
          opacity: 0.65;
        }

        /* Wave animations - continuous ocean movement */
        @keyframes tsunamiSwell1 {
          0% { transform: translateX(0%) translateY(0px); }
          100% { transform: translateX(-40%) translateY(-10px); }
        }
        @keyframes tsunamiSwell2 {
          0% { transform: translateX(-10%) translateY(0px); }
          100% { transform: translateX(-50%) translateY(-12px); }
        }
        @keyframes tsunamiSwell3 {
          0% { transform: translateX(-5%) translateY(5px); }
          100% { transform: translateX(-45%) translateY(-8px); }
        }

        /* DISTANT HORIZON - far place tsunami view */
        .distant-horizon {
          position: absolute;
          top: 8%;
          left: 0;
          width: 100%;
          height: 40%;
          background: radial-gradient(ellipse at 50% 15%, rgba(80, 200, 230, 0.25), rgba(10, 60, 85, 0) 75%);
          filter: blur(12px);
          pointer-events: none;
          z-index: 1;
          animation: horizonBreathing 8s infinite alternate;
        }

        @keyframes horizonBreathing {
          0% { opacity: 0.4; transform: scale(1);}
          100% { opacity: 0.85; transform: scale(1.03);}
        }

        /* Sea mist / spray */
        .sea-mist {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 40% 50%, rgba(140, 215, 235, 0.1), rgba(0, 25, 40, 0.5));
          pointer-events: none;
          z-index: 1;
        }

        /* ========= FLOATING CARD with GLOW AROUND (entire page glow effect on touch/interaction) ========= */
        .login-card {
          position: relative;
          z-index: 30;
          background: rgba(3, 18, 25, 0.7);
          backdrop-filter: blur(16px);
          border-radius: 2.5rem;
          padding: 2.2rem 2.2rem 2.2rem;
          width: 100%;
          max-width: 470px;
          margin: 1.5rem;
          
          /* FLOATING ANIMATION - gentle buoyancy like on water */
          animation: floatCard 4s ease-in-out infinite;
          
          /* DIM LIGHT TSUNAMI BORDER with glow */
          border: 1px solid rgba(70, 200, 230, 0.5);
          border-top: 1px solid rgba(120, 225, 250, 0.7);
          border-left: 1px solid rgba(90, 210, 240, 0.6);
          box-shadow: 0 30px 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba(50, 180, 210, 0.3);
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }

        /* FLOATING KEYFRAMES */
        @keyframes floatCard {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        /* ENTIRE PAGE GLOW AROUND CARD when any input is focused / touched */
        .login-card:focus-within {
          box-shadow: 0 35px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(80, 210, 250, 0.7);
          border-color: rgba(100, 220, 255, 0.9);
          transition: all 0.3s ease;
        }

        /* Outer glow ring effect that radiates from card when interacted */
        .login-card:focus-within::before {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 2.7rem;
          background: radial-gradient(circle at 30% 20%, rgba(80, 210, 240, 0.5), rgba(0, 100, 130, 0.3));
          filter: blur(12px);
          z-index: -1;
          opacity: 0.9;
          animation: pulseGlow 1.2s infinite alternate;
        }

        @keyframes pulseGlow {
          0% { opacity: 0.5; filter: blur(10px);}
          100% { opacity: 1; filter: blur(15px);}
        }

        /* Card additional glow on hover */
        .login-card:hover {
          box-shadow: 0 30px 55px rgba(0, 0, 0, 0.55), 0 0 28px rgba(70, 200, 240, 0.6);
          transform: translateY(-3px);
        }

        /* HEADER */
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h1 {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #f0f9ff, #b8e4f5);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-shadow: 0 2px 10px rgba(0, 50, 70, 0.5);
        }

        .login-header h2 {
          font-size: 1rem;
          font-weight: 400;
          color: #c2e6f5;
          margin-top: 0.4rem;
          letter-spacing: 0.5px;
        }

        /* FORM GROUPS WITH GLOW ON FOCUS */
        .form-group {
          margin-bottom: 1.6rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: #d4f0fc;
          letter-spacing: 0.3px;
        }

        .form-input {
          width: 100%;
          padding: 0.9rem 1.1rem;
          background: rgba(0, 20, 28, 0.8);
          border: 1px solid rgba(70, 180, 210, 0.6);
          border-radius: 1.3rem;
          font-size: 0.95rem;
          color: #f0fcff;
          outline: none;
          transition: all 0.25s;
          backdrop-filter: blur(4px);
        }

        /* FIELD GLOW when touched/focused */
        .form-input:focus {
          border-color: #6ad4f0;
          box-shadow: 0 0 18px rgba(80, 210, 240, 0.7), inset 0 0 5px rgba(100, 220, 255, 0.3);
          background: rgba(5, 30, 40, 0.9);
          transform: scale(1.01);
        }

        .form-input::placeholder {
          color: #6f9eae;
          font-weight: 300;
        }

        /* Links */
        .form-links {
          text-align: right;
          margin: 0.3rem 0 0.8rem;
        }

        .forgot-password {
          font-size: 0.8rem;
          color: #addfef;
          text-decoration: none;
          border-bottom: 1px dashed rgba(90, 200, 230, 0.7);
          transition: 0.2s;
        }

        .forgot-password:hover {
          color: #e5f7ff;
          border-bottom-color: #8ae0f5;
          text-shadow: 0 0 4px rgba(100, 210, 240, 0.5);
        }

        /* BUTTON with glow on hover */
        .btn-primary {
          background: linear-gradient(100deg, #0f6c80, #084a5a);
          border: none;
          padding: 0.9rem 1rem;
          border-radius: 2rem;
          font-weight: 700;
          font-size: 1rem;
          color: #eefbff;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
          width: 100%;
          margin-top: 0.8rem;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(100deg, #1c8aa3, #0e6377);
          transform: scale(1.02);
          box-shadow: 0 8px 22px rgba(0, 50, 70, 0.7), 0 0 15px rgba(70, 200, 230, 0.5);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* ALERT */
        .alert-danger {
          background: rgba(180, 55, 70, 0.25);
          backdrop-filter: blur(10px);
          border-left: 4px solid #ff9494;
          border-radius: 1.2rem;
          padding: 0.8rem 1rem;
          margin-bottom: 1.5rem;
          color: #ffe0e0;
          font-size: 0.85rem;
          text-align: center;
        }

        /* FOOTER */
        .login-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.7rem;
          color: #7faaba;
          border-top: 1px solid rgba(70, 150, 175, 0.4);
          padding-top: 1rem;
        }

        .login-footer p {
          margin: 0.25rem 0;
        }

        /* RESPONSIVE */
        @media (max-width: 550px) {
          .login-card {
            padding: 1.6rem;
            margin: 1rem;
          }
          .login-header h1 {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <div className="login-container">
        {/* FULL TSUNAMI BACKGROUND LAYERS - covering entire view */}
        <div className="tsunami-wave wave-1"></div>
        <div className="tsunami-wave wave-2"></div>
        <div className="tsunami-wave wave-3"></div>
        <div className="distant-horizon"></div>
        <div className="sea-mist"></div>

        {/* FLOATING LOGIN CARD - glows on interaction (touch/click/focus) */}
        <div className="login-card">
          <div className="login-header">
            <h1>Injibara University</h1>
            <h2>Transport Management System</h2>
          </div>
        
          {error && <div className="alert alert-danger">{error}</div>}
        
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
          
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          
            <div className="form-links">
              <Link to="/reset-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>
          
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        
          <div className="login-footer">
            <p>Demo Accounts:</p>
            <p>Admin: admin@transport.com / Admin@123</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login