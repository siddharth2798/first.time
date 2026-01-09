
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types.ts';

interface PostCardProps {
  post: Post;
  // Added missing handlers for delete and pin actions
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete, onTogglePin }) => {
  return (
    <div className="relative group">
      {/* Action buttons for pin and delete, using e.preventDefault to avoid triggering Link navigation */}
      <div className="absolute top-8 right-8 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        {onTogglePin && (
          <button 
            onClick={(e) => { e.preventDefault(); onTogglePin(post.id); }}
            className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${post.isFeatured ? 'bg-yellow-400' : 'bg-white'}`}
            title={post.isFeatured ? "Unpin" : "Pin as Featured"}
          >
            📌
          </button>
        )}
        {onDelete && (
          <button 
            onClick={(e) => { e.preventDefault(); onDelete(post.id); }}
            className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none hover:bg-red-500 hover:text-white"
            title="Delete Log"
          >
            🗑️
          </button>
        )}
      </div>

      <Link 
        to={`/post/${post.id}`}
        className="block bg-white p-5 scrapbook-border hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 flex flex-col relative"
      >
        {post.isFeatured && (
          <div className="absolute -top-4 -left-4 z-10 bg-blue-600 text-white text-xs font-black px-3 py-1.5 scrapbook-border uppercase tracking-widest -rotate-6 shadow-xl">
            CHAMPION
          </div>
        )}
        <div className="relative mb-6 aspect-video overflow-hidden border-4 border-black">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute bottom-4 left-4 bg-white text-[10px] font-black px-3 py-1.5 border-4 border-black uppercase tracking-widest shadow-lg">
            {post.category}
          </div>
        </div>
        
        <div className="flex-1 px-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-black font-black uppercase tracking-widest opacity-40">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <div className="flex gap-1.5">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3.5 h-3.5 rounded-full border-2 border-black ${i < post.difficulty ? 'bg-blue-600' : 'bg-gray-100'}`}
                />
              ))}
            </div>
          </div>
          
          <h2 className="text-3xl font-black mb-4 group-hover:text-blue-600 transition-colors leading-none tracking-tight">
            {post.title}
          </h2>
          
          <p className="text-lg text-black font-medium line-clamp-2 mb-8 italic leading-snug">
            "{post.content}"
          </p>
        </div>

        <div className="pt-6 border-t-4 border-black border-dashed flex justify-between items-center mt-auto px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-black flex items-center justify-center text-xs font-black">
              {post.author.charAt(0)}
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-black">{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-blue-600 font-black text-sm uppercase tracking-tighter group-hover:tracking-widest transition-all">VIEW REPORT</span>
             <span className="text-blue-600 font-black text-xl">&rarr;</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
