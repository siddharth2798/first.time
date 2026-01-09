
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useNavigate } from 'react-router-dom';
import { Post } from '../types.ts';
import PostCard from './PostCard.tsx';

interface ProfileProps {
  posts: Post[];
  // Added missing handlers passed from App.tsx
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ posts, onDelete, onTogglePin }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Filter posts created by the current user's ID
  const myPosts = posts.filter(p => p.authorId === user?.sub);

  if (isLoading) return <div className="py-40 text-center font-black doodle-font text-4xl italic">Loading Archive...</div>;

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center">
         <div className="bg-white p-16 scrapbook-border inline-block -rotate-1">
            <h2 className="text-5xl font-black mb-8 italic uppercase tracking-tighter">Anonymous Visitor</h2>
            <p className="text-xl font-bold mb-12 italic">Login to see your specific log of first-time adventures.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-black text-white px-12 py-6 text-xl font-black uppercase tracking-widest shadow-[10px_10px_0px_0px_#2563eb] hover:bg-blue-600 transition-all"
            >
              Back to Main Feed
            </button>
         </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-20 sm:px-8">
      <header className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
        <div className="md:col-span-2">
          <div className="flex items-center gap-10 mb-10">
            <div className="relative">
                <img 
                  src={user?.picture} 
                  alt={user?.name} 
                  className="w-32 h-32 bg-blue-600 border-4 border-black rounded-full shadow-2xl rotate-3 object-cover" 
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 border-2 border-black w-10 h-10 rounded-full flex items-center justify-center font-black text-xl">✓</div>
            </div>
            <div>
              <h1 className="text-6xl font-black tracking-tighter mb-4">{user?.nickname || user?.name}'s Archive</h1>
              <p className="text-black font-black font-mono text-sm uppercase tracking-widest bg-yellow-200 px-3 py-1 inline-block scrapbook-border shadow-none">Verified Explorer</p>
            </div>
          </div>
          <div className="bg-white p-8 scrapbook-border -rotate-1 max-w-2xl">
             <h4 className="text-xs font-black uppercase text-black opacity-30 mb-4 tracking-widest">Archive Status</h4>
             <p className="text-2xl font-black italic leading-snug">"Tracking every 'first' logged since joining. Starting from zero is an art form, and I'm the artist."</p>
          </div>
        </div>
        <div className="flex gap-6">
           <div className="flex-1 bg-black text-white p-10 rounded-[40px] shadow-2xl text-center border-4 border-black">
              <span className="text-6xl font-black block mb-2">{myPosts.length}</span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Personal Logs</span>
           </div>
           <div className="flex-1 bg-blue-600 border-4 border-black p-10 rounded-[40px] text-center shadow-2xl">
              <span className="text-6xl font-black block text-white mb-2">{posts.length}</span>
              <span className="text-xs font-black uppercase tracking-widest text-white">Global Reach</span>
           </div>
        </div>
      </header>

      <section>
        <div className="flex items-center gap-6 mb-16">
           <h2 className="text-4xl font-black uppercase italic tracking-tighter">Your Public Files</h2>
           <div className="h-[4px] flex-1 bg-black"></div>
        </div>

        {myPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {myPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onDelete={onDelete} 
                onTogglePin={onTogglePin} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-48 bg-white scrapbook-border border-dashed border-4 p-16">
            <p className="text-4xl font-black text-gray-200 uppercase mb-12 italic">Your archive is currently blank.</p>
            <Link 
              to="/submit" 
              className="bg-black text-white px-12 py-6 font-black uppercase text-lg tracking-widest shadow-[10px_10px_0px_0px_#2563eb] hover:bg-blue-600 transition-colors"
            >
              Log Your First Time
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;
