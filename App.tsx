
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { Post, Category, Comment } from './types.ts';
import { CATEGORIES, MOCK_POSTS } from './constants.ts';
import { supabase } from './supabase.ts';
import { CONFIG } from './config.ts';
import PostCard from './components/PostCard.tsx';
import PostDetail from './components/PostDetail.tsx';
import SubmissionForm from './components/SubmissionForm.tsx';
import Profile from './components/Profile.tsx';
import Settings from './components/Settings.tsx';

const Header: React.FC<{ isSaving?: boolean }> = ({ isSaving }) => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAuth0Configured = !!(CONFIG.AUTH0_DOMAIN && CONFIG.AUTH0_CLIENT_ID);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    if (!isAuth0Configured) {
      alert("Auth0 is not configured. Please update config.ts with your Domain and Client ID.");
      return;
    }
    loginWithRedirect();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fcfbf7]/95 backdrop-blur-md border-b-4 border-black px-4 py-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link to="/" className="flex flex-col group relative">
          <h1 className="text-3xl font-black tracking-tighter text-black group-hover:text-blue-600 transition-colors">
            first.<span className="text-blue-600 group-hover:text-black">time</span>
          </h1>
          <p className="text-[12px] text-black italic uppercase tracking-widest font-bold doodle-font">Everyone starts at zero</p>
          {isSaving && (
            <div className="absolute -left-6 top-1">
               <div className="w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-black animate-ping"></div>
            </div>
          )}
        </Link>
        <nav className="flex items-center gap-4 sm:gap-8">
          <Link to="/" className="text-sm font-black hover:text-blue-600 transition-colors uppercase tracking-tighter">Feed</Link>
          
          {isAuthenticated && (
            <Link to="/profile" className="text-sm font-black hover:text-blue-600 transition-colors uppercase tracking-tighter">My Archive</Link>
          )}
          
          <div className="flex items-center gap-4">
            {!isLoading && (
              isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 group focus:outline-none"
                  >
                    <div className="relative">
                      <img 
                        src={user?.picture} 
                        alt={user?.name} 
                        className="w-12 h-12 border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all" 
                      />
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-4 w-64 bg-white scrapbook-border z-50 p-6">
                      <div className="mb-6 pb-6 border-b-2 border-black border-dashed">
                        <p className="text-lg font-black truncate text-black">{user?.nickname || user?.name}</p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="text-xs font-black uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-2">
                          <span>📓</span> View Archive
                        </Link>
                        <Link to="/settings" onClick={() => setDropdownOpen(false)} className="text-xs font-black uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-2">
                          <span>⚙️</span> Account Settings
                        </Link>
                        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="text-xs font-black uppercase tracking-widest text-left hover:text-red-600 transition-colors flex items-center gap-2">
                          <span>🚪</span> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={handleLogin} 
                  className={`text-xs font-black uppercase tracking-widest transition-colors ${!isAuth0Configured ? 'text-red-400 hover:text-red-600' : 'hover:text-blue-600'}`}
                >
                  {isAuth0Configured ? 'Login' : 'Config Error'}
                </button>
              )
            )}
            
            <Link 
              to="/submit" 
              className="bg-black text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:scale-105 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              Log a First
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

const MainContent: React.FC<{ setIsSaving: (val: boolean) => void }> = ({ setIsSaving }) => {
  const { user, isAuthenticated } = useAuth0();
  const [posts, setPosts] = useState<Post[]>([]);
  const [customUsername, setCustomUsername] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const isSupabaseConfigured = () => {
    return !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && !CONFIG.SUPABASE_URL.includes('placeholder-url'));
  };

  useEffect(() => {
    const loadData = async () => {
      if (!isSupabaseConfigured()) {
        setPosts(MOCK_POSTS);
        setIsInitialLoading(false);
        return;
      }

      try {
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*, comments(*)');
        
        if (postsError) throw postsError;
        
        if (!postsData || postsData.length === 0) {
          setPosts(MOCK_POSTS);
        } else {
          setPosts(postsData);
        }

        if (isAuthenticated && user?.sub) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.sub)
            .single();
          
          if (profileData?.username) {
            setCustomUsername(profileData.username);
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch initial data:", err?.message || err);
        setPosts(MOCK_POSTS);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user]);

  const handleUpdateUsername = async (newName: string) => {
    if (!isAuthenticated || !user?.sub) return;
    setIsSaving(true);
    
    try {
      if (isSupabaseConfigured()) {
        await supabase.from('profiles').upsert({ id: user.sub, username: newName });
      }
      setCustomUsername(newName);
      setPosts(prev => prev.map(post => {
        let updatedPost = { ...post };
        if (post.authorId === user.sub) updatedPost.author = newName;
        if (post.comments) {
          updatedPost.comments = post.comments.map(c => c.authorId === user.sub ? { ...c, author: newName } : c);
        }
        return updatedPost;
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const handleAddPost = async (newPost: Post) => {
    setIsSaving(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.from('posts').insert([newPost]);
      }
      setPosts(prev => [newPost, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const handleAddComment = async (postId: string, comment: Comment) => {
    setIsSaving(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.from('comments').insert([{ ...comment, post_id: postId }]);
      }
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), comment] } : p));
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Delete this experience?")) {
      setIsSaving(true);
      try {
        if (isSupabaseConfigured()) {
          await supabase.from('posts').delete().eq('id', postId);
        }
        setPosts(prev => prev.filter(p => p.id !== postId));
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setIsSaving(false), 500);
      }
    }
  };

  const handleTogglePin = async (postId: string) => {
    setIsSaving(true);
    try {
      const targetPost = posts.find(p => p.id === postId);
      const newPinnedStatus = !targetPost?.isFeatured;
      if (isSupabaseConfigured()) {
        await supabase.from('posts').update({ isFeatured: false }).neq('id', postId);
        await supabase.from('posts').update({ isFeatured: newPinnedStatus }).eq('id', postId);
      }
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, isFeatured: newPinnedStatus } : { ...p, isFeatured: false }));
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => posts.find(p => p.isFeatured) || (posts.length > 0 ? posts[0] : null), [posts]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfbf7]">
        <div className="text-center">
          <div className="w-16 h-16 border-8 border-black border-t-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="font-black doodle-font text-2xl uppercase italic tracking-widest">Opening the Archive...</p>
        </div>
      </div>
    );
  }

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
                  <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center font-black text-xl border-2 border-white overflow-hidden">
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
            className="w-full bg-white border-4 border-black p-6 text-2xl font-bold focus:outline-none focus:translate-x-2 focus:translate-y-2 focus:shadow-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-300 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setSelectedCategory('All')} className={`px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest border-4 border-black transition-all ${selectedCategory === 'All' ? 'bg-black text-white' : 'bg-white hover:bg-yellow-100'}`}>All Firsts</button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest border-4 border-black transition-all ${selectedCategory === cat ? 'bg-black text-white' : 'bg-white hover:bg-yellow-100'}`}>{cat}</button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredPosts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            onDelete={handleDeletePost}
            onTogglePin={handleTogglePin}
          />
        ))}
      </div>
    </main>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/post/:id" element={<PostDetail posts={posts} onAddComment={handleAddComment} onDelete={handleDeletePost} onTogglePin={handleTogglePin} />} />
      <Route path="/submit" element={<SubmissionForm onAddPost={handleAddPost} defaultUsername={customUsername} />} />
      <Route path="/profile" element={<Profile posts={posts} onDelete={handleDeletePost} onTogglePin={handleTogglePin} />} />
      <Route path="/settings" element={<Settings onUpdateUsername={handleUpdateUsername} currentUsername={customUsername} />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);

  // Auth0 credentials from sanitized CONFIG
  const auth0Domain = (CONFIG.AUTH0_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  const auth0ClientId = CONFIG.AUTH0_CLIENT_ID || '';

  const isSupabaseConfigured = () => {
    return !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && !CONFIG.SUPABASE_URL.includes('placeholder-url'));
  };

  return (
    <Auth0Provider
      domain={auth0Domain || 'placeholder.auth0.com'}
      clientId={auth0ClientId || 'placeholder'}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <HashRouter>
        <div className="min-h-screen selection:bg-blue-600 selection:text-white">
          <Header isSaving={isSaving} />
          <MainContent setIsSaving={setIsSaving} />
          <footer className="mt-48 border-t-8 border-black bg-white py-32 text-center px-6">
            <div className="max-w-4xl mx-auto">
               <h2 className="text-7xl font-black mb-6 italic tracking-tighter">first.time</h2>
               <p className="text-2xl font-bold mb-12 italic text-black">"Everyone starts at zero."</p>
               <div className="flex flex-col items-center gap-2">
                 <div className="inline-block bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                   Storage: {isSupabaseConfigured() ? 'Persistent Cloud (Supabase)' : 'Demo Mode (Mock Data)'}
                 </div>
                 {!auth0Domain && (
                   <div className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 border-2 border-red-200 px-3 py-1 rounded">
                     Auth0 Configuration Missing in config.ts
                   </div>
                 )}
               </div>
            </div>
          </footer>
        </div>
      </HashRouter>
    </Auth0Provider>
  );
};

export default App;
