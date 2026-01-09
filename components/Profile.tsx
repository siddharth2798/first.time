
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import PostCard from './PostCard';

interface ProfileProps {
  posts: Post[];
}

const Profile: React.FC<ProfileProps> = ({ posts }) => {
  // Use local storage to find posts created by the current user session
  const myCreatedPostIds = JSON.parse(localStorage.getItem('ft_my_post_ids') || '[]');
  const myPosts = posts.filter(p => myCreatedPostIds.includes(p.id));

  return (
    <main className="max-w-7xl mx-auto px-4 py-20 sm:px-8">
      <header className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
        <div className="md:col-span-2">
          <div className="flex items-center gap-10 mb-10">
            <div className="relative">
                <div className="w-32 h-32 bg-blue-600 border-4 border-black rounded-full shadow-2xl rotate-3 flex items-center justify-center text-white font-black text-4xl">
                    ?
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 border-2 border-black w-10 h-10 rounded-full flex items-center justify-center font-black text-xl">✓</div>
            </div>
            <div>
              <h1 className="text-6xl font-black tracking-tighter mb-4">The Guest Archive</h1>
              <p className="text-black font-black font-mono text-sm uppercase tracking-widest bg-yellow-200 px-3 py-1 inline-block scrapbook-border shadow-none">Session Resident</p>
            </div>
          </div>
          <div className="bg-white p-8 scrapbook-border -rotate-1 max-w-2xl">
             <h4 className="text-xs font-black uppercase text-black opacity-30 mb-4 tracking-widest">Archive Status</h4>
             <p className="text-2xl font-black italic leading-snug">"Tracking every 'first' logged in this browser session. Starting from zero is a collective art form."</p>
          </div>
        </div>
        <div className="flex gap-6">
           <div className="flex-1 bg-black text-white p-10 rounded-[40px] shadow-2xl text-center border-4 border-black">
              <span className="text-6xl font-black block mb-2">{myPosts.length}</span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Your Firsts</span>
           </div>
           <div className="flex-1 bg-blue-600 border-4 border-black p-10 rounded-[40px] text-center shadow-2xl">
              <span className="text-6xl font-black block text-white mb-2">{posts.length}</span>
              <span className="text-xs font-black uppercase tracking-widest text-white">Global Feed</span>
           </div>
        </div>
      </header>

      <section>
        <div className="flex items-center gap-6 mb-16">
           <h2 className="text-4xl font-black uppercase italic tracking-tighter">Your Private Archives</h2>
           <div className="h-[4px] flex-1 bg-black"></div>
        </div>

        {myPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {myPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-48 bg-white scrapbook-border border-dashed border-4 p-16">
            <p className="text-4xl font-black text-gray-200 uppercase mb-12 italic">Your local log is empty.</p>
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
