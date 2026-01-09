
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface SettingsProps {
  onUpdateUsername: (name: string) => void;
  currentUsername: string;
}

const Settings: React.FC<SettingsProps> = ({ onUpdateUsername, currentUsername }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [username, setUsername] = useState(currentUsername || user?.nickname || user?.name || '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  if (isLoading) return <div className="py-40 text-center font-black doodle-font text-4xl italic">Loading Profile...</div>;

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
         <div className="bg-white p-16 scrapbook-border inline-block -rotate-1">
            <h2 className="text-5xl font-black mb-8 italic uppercase tracking-tighter">Identity Required</h2>
            <p className="text-xl font-bold mb-12 italic">Login to manage your explorer identity.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-black text-white px-12 py-6 text-xl font-black uppercase tracking-widest shadow-[10px_10px_0px_0px_#2563eb] hover:bg-blue-600 transition-all"
            >
              Return Home
            </button>
         </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setStatus('saving');
    onUpdateUsername(username.trim());
    
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 800);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-20 sm:px-8">
      <div className="mb-16">
        <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase italic">Account Settings</h1>
        <p className="text-xl font-bold italic doodle-font text-blue-600">Define your presence in the archive.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-8">
          <form onSubmit={handleSubmit} className="bg-white p-10 md:p-16 scrapbook-border space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Public Persona</h2>
                <div className="h-[2px] flex-1 bg-black/10"></div>
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-black">Explorer Username</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter a new identity..." 
                    className="w-full p-6 border-4 border-black text-2xl focus:outline-none focus:bg-yellow-50 font-black placeholder:text-gray-200 transition-colors"
                  />
                  <div className="absolute top-1/2 -translate-y-1/2 right-6 pointer-events-none opacity-20">
                     <span className="text-4xl">🖋️</span>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">This name will appear on all your reports and comments.</p>
              </div>
            </section>

            <section className="p-8 bg-blue-50 border-4 border-black border-dashed rounded-3xl">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 opacity-40">Signature Preview</h3>
              <div className="text-center py-6">
                <p className="doodle-font text-7xl text-blue-600 mb-2 truncate px-4">{username || '...'}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Archive Verified Identity</p>
              </div>
            </section>

            <div className="pt-8 border-t-4 border-black border-dotted">
              <button 
                type="submit"
                disabled={status === 'saving' || username.trim() === currentUsername}
                className={`w-full py-6 text-xl font-black uppercase tracking-widest transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                  status === 'success' ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-blue-600 disabled:bg-gray-200 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0'
                }`}
              >
                {status === 'saving' ? 'UPDATING ARCHIVE...' : status === 'success' ? 'IDENTITY SECURED! ✓' : 'SAVE CHANGES'}
              </button>
            </div>
          </form>
        </div>

        <aside className="md:col-span-4 space-y-8">
           <div className="bg-yellow-100 p-8 scrapbook-border rotate-2">
              <h4 className="font-black uppercase text-xs tracking-widest mb-4">Linked Account</h4>
              <div className="flex items-center gap-4 mb-6">
                 <img src={user?.picture} className="w-12 h-12 border-2 border-black rounded-full" alt="Profile" />
                 <div className="overflow-hidden">
                    <p className="font-black text-sm truncate">{user?.email}</p>
                    <p className="text-[10px] font-bold opacity-40 uppercase">Provider: {user?.sub?.split('|')[0]}</p>
                 </div>
              </div>
              <p className="text-sm font-bold italic leading-tight">Your reports are permanently tied to this credential for verification.</p>
           </div>

           <div className="bg-white p-8 scrapbook-border -rotate-1">
              <h4 className="font-black uppercase text-xs tracking-widest mb-4">Pro-Tip</h4>
              <p className="text-sm font-bold">"Your username is your legacy. Choose one that reflects your willingness to be a beginner."</p>
              <div className="mt-4 text-4xl doodle-font text-blue-600 text-right opacity-20">START ZERO</div>
           </div>
        </aside>
      </div>
    </main>
  );
};

export default Settings;
