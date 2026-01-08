
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Post, Comment } from '../types';

interface PostDetailProps {
  posts: Post[];
  onAddComment: (postId: string, comment: Comment) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ posts, onAddComment }) => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const post = posts.find(p => p.id === id);
  const [newCommentText, setNewCommentText] = useState('');

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-5xl font-black mb-8">404: EXPERIENCED NOT FOUND</h2>
        <Link to="/" className="text-blue-600 font-bold underline decoration-4 underline-offset-8">BACK TO ZERO &rarr;</Link>
      </div>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !isAuthenticated) return;

    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: user?.nickname || user?.name || 'Explorer',
      authorId: user?.sub,
      text: newCommentText,
      createdAt: new Date().toISOString()
    };

    onAddComment(post.id, comment);
    setNewCommentText('');
  };

  return (
    <article className="max-w-6xl mx-auto px-4 py-12 md:py-24">
      <Link to="/" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-gray-400 mb-12 hover:text-black transition-colors group">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to the feed
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
               <span className="bg-yellow-200 text-[10px] font-black px-3 py-1 scrapbook-border uppercase tracking-widest">
                {post.category}
              </span>
              <span className="text-xs font-mono text-gray-400">{new Date(post.createdAt).toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-black">{post.title}</h1>
            <div className="flex items-center gap-4 p-4 scrapbook-border inline-flex">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xl border-2 border-black">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-lg leading-none">By {post.author}</p>
                <p className="text-[10px] font-black uppercase text-gray-400 mt-1">First-time reporter</p>
              </div>
            </div>
          </header>

          <div className="relative mb-16 scrapbook-border p-3 bg-white -rotate-1 shadow-2xl">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-6 -right-6 doodle-font text-blue-600 text-6xl opacity-20 -rotate-12 select-none">PHOTO LOG</div>
          </div>

          <div className="prose prose-xl max-w-none text-black mb-20 leading-relaxed bg-white p-10 scrapbook-border relative">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none">
                <svg width="100" height="100" viewBox="0 0 100 100"><path d="M10 10 q 40 10 80 0" stroke="black" fill="none" strokeWidth="2"/></svg>
             </div>
            {post.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-8 font-medium">{paragraph}</p>
            ))}
          </div>

          <div className="bg-blue-600 border-4 border-black p-10 rounded-3xl relative overflow-hidden mb-20 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-3xl font-black mb-10 text-white flex items-center uppercase italic tracking-tighter">
              The Survivor's Toolkit
            </h3>
            <ol className="space-y-8">
              {post.tips.map((tip, i) => (
                <li key={i} className="flex gap-6 items-start bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                  <span className="font-black text-white doodle-font text-4xl leading-none">0{i + 1}</span>
                  <p className="text-white text-lg font-bold">{tip}</p>
                </li>
              ))}
            </ol>
          </div>

          <section className="mt-32">
            <h3 className="text-3xl font-black mb-12 flex items-center gap-4 uppercase italic">
              Peer Review ({post.comments.length})
              <div className="h-[2px] flex-1 bg-black/10"></div>
            </h3>

            <div className="space-y-10 mb-16">
              {post.comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-100 border-2 border-black rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                    {comment.author.charAt(0)}
                  </div>
                  <div className="comment-bubble bg-white p-6 w-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-sm">{comment.author}</span>
                      <span className="text-[10px] font-mono text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-800 font-medium">{comment.text}</p>
                  </div>
                </div>
              ))}
              {post.comments.length === 0 && (
                <p className="text-center text-gray-400 font-bold italic py-8">Be the first to speak up.</p>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="bg-gray-100 p-8 scrapbook-border">
              <h4 className="font-black uppercase text-xs tracking-widest mb-4">Leave your mark</h4>
              <textarea 
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={isAuthenticated ? "Share some wisdom or ask a question..." : "Login to leave a comment..."}
                disabled={!isAuthenticated}
                className="w-full p-4 border-2 border-black mb-4 focus:outline-none focus:ring-4 focus:ring-blue-100 bg-white min-h-[120px]"
              />
              <div className="flex justify-between items-center">
                {!isAuthenticated && (
                    <p className="text-xs font-bold text-gray-400">
                        You must be <button type="button" onClick={() => loginWithRedirect()} className="text-blue-600 underline">logged in</button> to comment.
                    </p>
                )}
                <button 
                  type="submit"
                  disabled={!isAuthenticated || !newCommentText.trim()}
                  className="bg-black text-white px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-blue-600 disabled:bg-gray-300 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  Send Advice
                </button>
              </div>
            </form>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-12">
          <div className="bg-white p-8 scrapbook-border rotate-1">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Intensity Level</h4>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-7xl font-black leading-none italic">{post.difficulty}</span>
              <span className="text-2xl text-gray-300 font-black italic">/ 5</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full border-2 border-black overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-1000" 
                style={{ width: `${(post.difficulty / 5) * 100}%` }}
              />
            </div>
            <p className="mt-6 text-sm font-bold italic text-blue-600 doodle-font text-xl">
              {post.difficulty === 1 && "Piece of cake."}
              {post.difficulty === 2 && "A bit of a head scratcher."}
              {post.difficulty === 3 && "You'll break a sweat."}
              {post.difficulty === 4 && "Consider your life choices."}
              {post.difficulty === 5 && "Prepare for total chaos."}
            </p>
          </div>

          <div className="bg-orange-50 p-8 border-4 border-black rounded-[40px] relative">
            <div className="absolute -top-4 -right-2 bg-black text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-lg -rotate-3">
              Reality Check
            </div>
            <div className="space-y-10 mt-4">
              {post.realityChecks.map((check, i) => (
                <div key={i} className="relative">
                  <div className="mb-4">
                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Expectation</span>
                    <p className="text-lg font-medium italic border-b border-orange-200 pb-2">"{check.expectation}"</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-black uppercase tracking-widest">The Truth</span>
                    <p className="text-lg font-black leading-tight mt-1 text-orange-900">{check.reality}</p>
                  </div>
                  {i < post.realityChecks.length - 1 && <div className="mt-8 border-t-2 border-dotted border-orange-200"></div>}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default PostDetail;
