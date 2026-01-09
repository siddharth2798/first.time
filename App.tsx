
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Post, Category } from './types';
import { MOCK_POSTS, CATEGORIES } from './constants';
import PostCard from './components/PostCard';
import PostDetail from './components/PostDetail';
import SubmissionForm from './components/SubmissionForm';
import Profile from './components/Profile';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-[#fcfbf7]/95 backdrop-blur-md border-b-4 border-black px-4 py-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link to="/" className="flex flex-col group">
          <h1 className="text-3xl font-black tracking-tighter text-black group-hover:text-blue-600 transition-colors">
            first.<span className="text-blue-600 group-hover:text-black">time</span>
          </h1>
          <p className="text-[12px] text-black italic uppercase tracking-widest font-bold doodle-font">Everyone starts at zero</p>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-8">
          <Link to="/" className="text-sm font-black hover:text-blue-600 transition-colors uppercase tracking-tighter underline decoration-4 decoration-blue-200 underline-offset-4">Feed</Link>
          
          <Link to="/profile" className="text-sm font-black hover:text-blue-600 transition-colors uppercase tracking-tighter">My Archive</Link>
          
          <Link 
            to="/submit" 
            className="bg-black text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Log a First
          </Link>
        </nav>
      </div>
    </header>
  );
};

const MainContent: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('ft_posts');
    return saved ? JSON.parse(saved) : MOCK_POSTS;
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddPost = async (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleAddComment = async (postId: string, comment: any) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
  };

  useEffect(() => {
    localStorage.setItem('ft_posts', JSON.stringify(posts));
  }, [posts]);

  const featuredPost = useMemo(() => posts.find(p => p.isFeatured) || posts[0], [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, selectedCategory, searchQuery]);

  const HomePage: React.FC = () => (
    <main className="max-w-7xl mx-auto px-4 py-12 sm:px-8">
      {featuredPost && selectedCategory === 'All' && !searchQuery && (
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-black bg-blue-600 text-white px-3 py-1 rounded uppercase tracking-tighter">Weekly Gold</span>
            <div className="h-[3px] flex-1 bg-black"></div>
          </div>
          <Link to={`/post/${featuredPost.id}`} className="group relative block bg-white p-8 sm:p-14 featured-card transition-all hover:-rotate-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <span className="text-blue-600 font-black text-lg uppercase tracking-widest doodle-font mb-4 block underline decoration-blue-200">Featured Legend</span>
                <h2 className="text-5xl sm:text-7xl font-black mb-8 group-hover:text-blue-600 transition-colors leading-none tracking-tight">{featuredPost.title}</h2>
                <p className="text-xl text-black font-medium mb-10 italic line-clamp-3 leading-relaxed">"{featuredPost.content}"</p>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center font-black text-xl border-2 border-white">
                    {featuredPost.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-xl">By {featuredPost.author}</p>
                    <p className="text-sm text-black font-bold uppercase tracking-tighter opacity-50">{new Date(featuredPost.createdAt).toDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 relative aspect-[4/3] scrapbook-border overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <img src={featuredPost.imageUrl} alt={featuredPost.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-32 h-32 opacity-10 pointer-events-none doodle-font text-8xl text-blue-600 select-none">BEST</div>
          </Link>
        </section>
      )}

      <section className="mb-16 flex flex-col gap-10">
        <div className="flex items-center gap-4">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter">The Experience Feed</h3>
            <div className="h-[3px] flex-1 bg-black"></div>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search first-hand knowledge..." 
            className="w-full bg-white border-4 border-black p-6 text-2xl font-bold focus:outline-none transition-all focus:translate-x-2 focus:translate-y-2 focus:shadow-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest border-4 border-black transition-all ${selectedCategory === 'All' ? 'bg-black text-white' : 'bg-white hover:bg-yellow-100'}`}
          >
            All Firsts
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest border-4 border-black transition-all ${selectedCategory === cat ? 'bg-black text-white' : 'bg-white hover:bg-yellow-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-40 bg-white scrapbook-border p-16 rotate-2">
          <p className="text-5xl font-black text-gray-200 uppercase italic mb-6">Ghost town...</p>
          <p className="text-black font-black text-xl mb-10">No firsts match your search.</p>
          <button onClick={() => {setSearchQuery(''); setSelectedCategory('All')}} className="bg-black text-white px-10 py-4 font-black uppercase tracking-widest">Reset Hunt</button>
        </div>
      )}
    </main>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/post/:id" element={<PostDetail posts={posts} onAddComment={handleAddComment} />} />
      <Route path="/submit" element={<SubmissionForm onAddPost={handleAddPost} />} />
      <Route path="/profile" element={<Profile posts={posts} />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen selection:bg-blue-600 selection:text-white">
        <Header />
        <MainContent />
        <footer className="mt-48 border-t-8 border-black bg-white py-32 text-center px-6">
          <div className="max-w-4xl mx-auto">
             <h2 className="text-7xl font-black mb-6 italic tracking-tighter">first.time</h2>
             <p className="text-2xl font-bold mb-12 italic text-black">"Because failing for the first time is just a first step."</p>
             <div className="flex flex-wrap justify-center gap-12 mb-20">
                <a href="#" className="font-black text-sm uppercase underline decoration-4 decoration-blue-500">Instagram</a>
                <a href="#" className="font-black text-sm uppercase underline decoration-4 decoration-yellow-500">Stories</a>
                <a href="#" className="font-black text-sm uppercase underline decoration-4 decoration-red-500">Community</a>
             </div>
             <p className="text-black font-mono text-sm font-bold opacity-30">&copy; 2025 THE ZERO PROJECT. BUILT TO LEARN.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
