
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Post, Category, User } from './types';
import { MOCK_POSTS, CATEGORIES } from './constants';
import PostCard from './components/PostCard';
import PostDetail from './components/PostDetail';
import SubmissionForm from './components/SubmissionForm';
import Auth from './components/Auth';
import Profile from './components/Profile';

const Header: React.FC<{ currentUser: User | null; onLogout: () => void }> = ({ currentUser, onLogout }) => (
  <header className="sticky top-0 z-50 bg-[#fcfbf7]/90 backdrop-blur-sm border-b-2 border-black px-4 py-4 sm:px-8">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
      <Link to="/" className="flex flex-col group">
        <h1 className="text-3xl font-bold tracking-tighter text-black group-hover:text-blue-600 transition-colors">
          first.<span className="text-blue-600 group-hover:text-black">time</span>
        </h1>
        <p className="text-[10px] text-gray-500 italic uppercase tracking-widest font-bold doodle-font">Everyone starts at zero</p>
      </Link>
      <nav className="flex items-center gap-4 sm:gap-8">
        <Link to="/" className="text-sm font-bold hover:text-blue-600 transition-colors uppercase tracking-tighter underline decoration-2 decoration-blue-200 underline-offset-4">Browse</Link>
        {currentUser ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-black flex items-center justify-center font-bold text-xs group-hover:bg-blue-200">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold hidden sm:inline">{currentUser.username}</span>
            </Link>
            <button onClick={onLogout} className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase">Logout</button>
          </div>
        ) : (
          <Link to="/auth" className="text-sm font-bold hover:text-blue-600 transition-colors uppercase tracking-tighter">Login</Link>
        )}
        <Link 
          to="/submit" 
          className="bg-black text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          Share
        </Link>
      </nav>
    </div>
  </header>
);

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('ft_posts');
    return saved ? JSON.parse(saved) : MOCK_POSTS;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ft_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('ft_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ft_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ft_user');
    }
  }, [currentUser]);

  const featuredPost = useMemo(() => posts.find(p => p.isFeatured) || posts[0], [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, selectedCategory, searchQuery]);

  const handleAddPost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleAddComment = (postId: string, comment: any) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const HomePage: React.FC = () => (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-8">
      {/* Featured Section */}
      {featuredPost && selectedCategory === 'All' && !searchQuery && (
        <section className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-black bg-blue-600 text-white px-2 py-0.5 rounded uppercase tracking-tighter">Weekly Highlight</span>
            <div className="h-[2px] flex-1 bg-black/10"></div>
          </div>
          <Link to={`/post/${featuredPost.id}`} className="group relative block bg-white p-6 sm:p-10 featured-card transition-all hover:rotate-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1">
                <span className="text-blue-600 font-black text-sm uppercase tracking-widest doodle-font mb-4 block underline decoration-blue-200">Story of the Week</span>
                <h2 className="text-4xl sm:text-5xl font-bold mb-6 group-hover:text-blue-600 transition-colors leading-tight">{featuredPost.title}</h2>
                <p className="text-lg text-gray-600 mb-8 italic line-clamp-4 leading-relaxed">"{featuredPost.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">
                    {featuredPost.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">By {featuredPost.author}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-tighter font-mono">{new Date(featuredPost.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 relative aspect-video scrapbook-border overflow-hidden rotate-2 group-hover:rotate-0 transition-transform duration-500">
                <img src={featuredPost.imageUrl} alt={featuredPost.title} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-20 pointer-events-none doodle-font text-5xl text-blue-600">✨</div>
          </Link>
        </section>
      )}

      {/* Search and Filters */}
      <section className="mb-12 flex flex-col gap-8">
        <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold uppercase tracking-tighter">The Feed</h3>
            <div className="h-[2px] flex-1 bg-black/10"></div>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search first-hand experiences..." 
            className="w-full bg-white border-4 border-black p-5 text-xl focus:outline-none transition-all focus:translate-x-1 focus:translate-y-1 focus:shadow-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2 border-black transition-all ${selectedCategory === 'All' ? 'bg-black text-white' : 'bg-white hover:bg-blue-50'}`}
          >
            Everything
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2 border-black transition-all ${selectedCategory === cat ? 'bg-black text-white' : 'bg-white hover:bg-blue-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white scrapbook-border p-10 rotate-1">
          <p className="text-3xl font-black text-gray-300 uppercase italic">Silence is a first time too...</p>
          <p className="text-gray-400 mt-4 font-bold">No results matching your hunt.</p>
          <button onClick={() => {setSearchQuery(''); setSelectedCategory('All')}} className="mt-8 text-blue-600 font-bold underline">Clear all filters</button>
        </div>
      )}
    </main>
  );

  return (
    <HashRouter>
      <div className="min-h-screen">
        <Header currentUser={currentUser} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostDetail posts={posts} onAddComment={handleAddComment} currentUser={currentUser} />} />
          <Route path="/submit" element={<SubmissionForm onAddPost={handleAddPost} currentUser={currentUser} />} />
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          <Route path="/profile" element={<Profile currentUser={currentUser} posts={posts} />} />
        </Routes>
        
        <footer className="mt-40 border-t-4 border-black bg-white py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
             <h2 className="text-4xl font-black mb-4">first.time</h2>
             <p className="text-xl font-bold mb-8 italic">"Because every expert was once a complete disaster."</p>
             <div className="flex justify-center gap-8 mb-12">
                <a href="#" className="font-black text-xs uppercase underline decoration-blue-400 decoration-2">Instagram</a>
                <a href="#" className="font-black text-xs uppercase underline decoration-blue-400 decoration-2">Substack</a>
                <a href="#" className="font-black text-xs uppercase underline decoration-blue-400 decoration-2">Community</a>
             </div>
             <p className="text-gray-400 text-xs font-mono">&copy; 2024 FT.PROJECT. ZERO TO HERO.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
