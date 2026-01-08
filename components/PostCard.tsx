
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link 
      to={`/post/${post.id}`}
      className="group bg-white p-4 scrapbook-border hover:-translate-y-2 hover:shadow-2xl transition-all flex flex-col relative"
    >
      {post.isFeatured && (
        <div className="absolute -top-3 -left-3 z-10 bg-blue-600 text-white text-[10px] font-black px-2 py-1 scrapbook-border uppercase tracking-tighter -rotate-6">
          Featured
        </div>
      )}
      <div className="relative mb-4 aspect-video overflow-hidden border-2 border-black">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute top-2 right-2 bg-white text-[10px] font-black px-2 py-1 border-2 border-black uppercase tracking-widest">
          {post.category}
        </div>
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full border border-black ${i < post.difficulty ? 'bg-blue-600' : 'bg-gray-100'}`}
              />
            ))}
          </div>
        </div>
        
        <h2 className="text-2xl font-black mb-3 group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
          {post.title}
        </h2>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-6 leading-relaxed italic font-medium">
          "{post.content}"
        </p>
      </div>

      <div className="pt-4 border-t-2 border-black border-dashed flex justify-between items-center mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 border border-black flex items-center justify-center text-[10px] font-black">
            {post.author.charAt(0)}
          </div>
          <span className="text-[10px] font-black uppercase text-gray-400">{post.author}</span>
        </div>
        <div className="flex items-center gap-1">
           <span className="text-blue-600 font-black text-[10px] uppercase tracking-tighter group-hover:mr-2 transition-all">Report</span>
           <span className="text-blue-600 font-black">&rarr;</span>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
