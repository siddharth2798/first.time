
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: username || 'BeginnerExplorer',
      email: email || 'hello@firsttime.com',
      bio: 'Just getting started with everything.',
      avatarUrl: '',
      joinedAt: new Date().toISOString()
    };
    onLogin(mockUser);
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="bg-white p-8 scrapbook-border rotate-1">
        <h2 className="text-4xl font-black mb-8 text-center uppercase italic tracking-tighter">
          {isLogin ? 'Welcome Back' : 'Join the Club'}
        </h2>
        <p className="text-gray-400 font-bold text-center mb-10 doodle-font text-xl underline decoration-blue-200">
          {isLogin ? "Ready to fail forward again?" : "Document your firsts. Learn from theirs."}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Username</label>
            <input 
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border-2 border-black focus:outline-none focus:ring-4 focus:ring-blue-100"
              placeholder="first_timer_2024"
            />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
              <input 
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-black focus:outline-none focus:ring-4 focus:ring-blue-100"
                placeholder="you@zero.com"
              />
            </div>
          )}
          <button 
            type="submit"
            className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-[6px_6px_0px_0px_rgba(37,99,235,0.2)]"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-black uppercase underline decoration-2 decoration-blue-200"
          >
            {isLogin ? "Wait, I don't have an account" : "Wait, I already have one"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
