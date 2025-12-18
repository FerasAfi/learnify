import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, GraduationCap } from 'lucide-react';
import api from '../utils/api';

interface AuthPageProps {
  onLogin: (userId: number) => void;
}

interface LoginResponse {
  msg: string;
  user_id: number;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [sex, setSex] = useState(true);
  const [age, setAge] = useState(25);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    if (isLogin) {
      
      const response = await api.post<LoginResponse>('/signin', { 
        username, 
        password 
      });
      const data: LoginResponse = response.data;
      onLogin(data.user_id);

    } else {
      
      await api.post('/signup', { 
        username,
        password, 
        email,
        profile_pic:"picture.png",
        sex: true,
        age: 25 
      });
    }
  
    
    } catch (error) {
      console.error('Auth error:', error);
      alert(error.response?.data?.detail || 'Authentication failed');
      } finally {
      setIsLoading(false);
      }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade-in">
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <div className="logo-icon" style={{width: '64px', height: '64px', margin: '0 auto 1.5rem', justifyContent: 'center', alignItems: 'center'}}>
            <GraduationCap size={32} color="white" />
          </div>
          <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem'}}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>
            {isLogin ? 'Enter your details to access your study space.' : 'Start your journey to smarter learning today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="auth-form-group">
            <label style={{fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block'}}>Username</label>
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" size={18} />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            </div>
          </div>

          <div className="auth-form-group">
            <label style={{fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block'}}>Password</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={18} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
          </div>

          {!isLogin && (
            <div className="auth-form-group">
            <label style={{fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block'}}>Email Address</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" required />
            </div>
          </div>
          )}
          

          {!isLogin && (
            <div className="auth-form-group">
              <label style={{fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block'}}>Age</label>
              <div className="auth-input-wrapper">
                <User className="auth-input-icon" size={18} />
                <input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)} 
                  placeholder="25" 
                  min="1" 
                  max="120"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="auth-form-group" style={{marginBottom:'1rem'}}>
              <label style={{fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block'}}>Gender</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={sex === true}
                    onChange={() => setSex(true)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block'}}>Male</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={sex === false}
                    onChange={() => setSex(false)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block'}}>Female</span>
                </label>
              </div>
            </div>
            )}

          <button type="submit" disabled={isLoading} className="primary-button" style={{marginTop: '1rem'}}>
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{marginTop: '1.5rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border)'}}>
          <p style={{fontSize: '0.875rem', color: 'var(--text-secondary)'}}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={() => setIsLogin(!isLogin)} style={{color: 'var(--accent)', fontWeight: '600'}}>
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;