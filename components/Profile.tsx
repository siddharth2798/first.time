
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { User, Post } from '../types';
import PostCard from './PostCard';

interface ProfileProps {
  currentUser: User | null;
  posts: Post[];
}

const Profile: React.FC<ProfileProps> = ({ currentUser, posts }) => {
  if (!currentUser) return <Navigate to="/auth" />;

  const myPosts = posts.filter(p => p.author === currentUser.username || p.authorId === currentUser.id);

  return (
    <main className="max-w-7xl mx-auto px-4 py-16 sm:px-8">
      <header className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-10 items-end">
        <div className="md:col-span-2">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-blue-600 border-4 border-black rounded-full flex items-center justify-center font-black text-5xl text-white shadow-xl rotate-3">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tighter mb-2">{currentUser.username}</h1>
              <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">Joined {new Date(currentUser.joinedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="bg-white p-6 scrapbook-border -rotate-1 max-w-xl">
             <h4 className="text-[10px] font-black uppercase text-gray-400 mb-2">Manifesto</h4>
             <p className="text-lg font-bold italic">"{currentUser.bio}"</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="flex-1 bg-black text-white p-6 rounded-3xl shadow-xl text-center">
              <span className="text-4xl font-black block">{myPosts.length}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Firsts Logged</span>
           </div>
           <div className="flex-1 bg-yellow-200 border-2 border-black p-6 rounded-3xl text-center">
              <span className="text-4xl font-black block">0</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-black">Badges</span>
           </div>
        </div>
      </header>

      <section>
        <div className="flex items-center gap-4 mb-12">
           <h2 className="text-3xl font-black uppercase italic tracking-tighter">My Experience Log</h2>
           <div className="h-[2px] flex-1 bg-black/10"></div>
        </div>

        {myPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {myPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white scrapbook-border border-dashed p-10">
            <p className="text-2xl font-black text-gray-300 uppercase mb-8">You haven't logged any 'firsts' yet.</p>
            <Link 
              to="/submit" 
              className="bg-black text-white px-10 py-4 font-black uppercase text-xs tracking-widest shadow-[6px_6px_0px_0px_rgba(37,99,235,1)]"
            >
              Document My First
            </Link>
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;
