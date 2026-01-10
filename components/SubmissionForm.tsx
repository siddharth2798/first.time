
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Category, Post, RealityCheck } from '../types.ts';
import { CATEGORIES } from '../constants.ts';
import { CONFIG } from '../config.ts';

interface SubmissionFormProps {
  onAddPost: (post: Post) => void;
  defaultUsername: string;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onAddPost, defaultUsername }) => {
  const { user, isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: defaultUsername || '',
    category: 'Home & DIY' as Category,
    difficulty: 3,
    content: '',
    tips: ['', '', ''],
    realityChecks: [{ expectation: '', reality: '' }] as RealityCheck[],
    imageUrl: ''
  });

  useEffect(() => {
    if (user && !formData.author) {
      setFormData(prev => ({ ...prev, author: defaultUsername || user.nickname || user.name || '' }));
    }
  }, [user, defaultUsername]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTipChange = (index: number, value: string) => {
    const newTips = [...formData.tips];
    newTips[index] = value;
    setFormData(prev => ({ ...prev, tips: newTips }));
  };

  const handleRealityCheckChange = (index: number, field: keyof RealityCheck, value: string) => {
    const newChecks = [...formData.realityChecks];
    newChecks[index] = { ...newChecks[index], [field]: value };
    setFormData(prev => ({ ...prev, realityChecks: newChecks }));
  };

  const addRealityCheck = () => {
    setFormData(prev => ({
      ...prev,
      realityChecks: [...prev.realityChecks, { expectation: '', reality: '' }]
    }));
  };

  const removeRealityCheck = (index: number) => {
    if (formData.realityChecks.length <= 1) return;
    const newChecks = formData.realityChecks.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, realityChecks: newChecks }));
  };

  const openCloudinaryWidget = useCallback(() => {
    const cloudinary = (window as any).cloudinary;
    if (!cloudinary) {
      console.error("Cloudinary widget not loaded");
      return;
    }

    const cloudName = CONFIG.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = CONFIG.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary not configured in config.ts. Visual proof disabled.");
      return;
    }

    const myWidget = cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        sources: ['local', 'url', 'camera'],
        showAdvancedOptions: false,
        cropping: true,
        multiple: false,
        defaultSource: 'local',
        styles: {
            palette: {
                window: "#FFFFFF",
                windowBorder: "#000000",
                tabIcon: "#000000",
                menuIcons: "#000000",
                textDark: "#000000",
                textLight: "#FFFFFF",
                link: "#2563EB",
                action: "#000000",
                activeTab: "#2563EB",
                inactiveTabIcon: "#000000",
                error: "#F43F5E",
                inProgress: "#2563EB",
                complete: "#10B981",
                sourceBg: "#F9FAFB"
            }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setFormData(prev => ({ ...prev, imageUrl: result.info.secure_url }));
        }
      }
    );
    myWidget.open();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const newPost: Post = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        author: formData.author || defaultUsername || user?.nickname || user?.name || 'Explorer',
        authorId: user?.sub,
        category: formData.category,
        difficulty: formData.difficulty,
        content: formData.content,
        tips: formData.tips.filter(t => t.trim() !== ''),
        realityChecks: formData.realityChecks.filter(r => r.expectation.trim() !== ''),
        imageUrl: formData.imageUrl || `https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800`,
        createdAt: new Date().toISOString(),
        comments: []
      };

      onAddPost(newPost);
      setSubmitting(false);
      navigate('/');
    }, 1200);
  };

  if (isLoading) return <div className="py-40 text-center font-black doodle-font text-4xl italic">Initializing Explorer Session...</div>;

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
         <div className="bg-white p-16 scrapbook-border inline-block rotate-2">
            <h2 className="text-5xl font-black mb-8 italic uppercase tracking-tighter">Members Only</h2>
            <p className="text-xl font-bold mb-12 italic">You need to be logged in to permanently archive a 'first'.</p>
            <button 
              onClick={() => loginWithRedirect()}
              className="bg-black text-white px-12 py-6 text-xl font-black uppercase tracking-widest shadow-[10px_10px_0px_0px_#2563eb] hover:bg-blue-600 transition-all"
            >
              Identify Myself
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="mb-20 text-center">
        <h1 className="text-7xl font-black mb-8 tracking-tighter uppercase italic">LOG YOUR FIRST</h1>
        <p className="text-black font-black doodle-font text-3xl italic underline decoration-blue-600 underline-offset-8">Capture the moment you started from zero.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-20 bg-white p-10 md:p-24 scrapbook-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-4 bg-blue-600"></div>
        
        <section className="space-y-12">
          <div className="flex items-center gap-4">
             <h2 className="text-4xl font-black uppercase italic tracking-tighter">The Brief</h2>
             <div className="h-[4px] flex-1 bg-black"></div>
          </div>
          <div className="grid grid-cols-1 gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-black">Project Title</label>
                <input 
                    required
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Filing my taxes for the first time..." 
                    className="w-full p-6 border-4 border-black text-lg focus:outline-none focus:bg-blue-50 font-black placeholder:text-gray-200"
                />
                </div>
                <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-black">Display Name</label>
                <input 
                    required
                    type="text" 
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Explorer Name" 
                    className="w-full p-6 border-4 border-black text-lg focus:outline-none focus:bg-blue-50 font-black placeholder:text-gray-200"
                />
                <p className="text-[10px] font-bold opacity-30">ARCHIVED UNDER ID: {user?.sub?.slice(-8)}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-black">Genre</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-5 border-4 border-black font-black uppercase text-sm tracking-widest bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-black">Mental Load ({formData.difficulty}/5)</label>
                <div className="flex items-center gap-6 py-4">
                  <input 
                    type="range" 
                    name="difficulty"
                    min="1" 
                    max="5" 
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="flex-1 accent-black h-3 cursor-pointer"
                  />
                  <span className="font-black text-4xl doodle-font text-blue-600">Lvl {formData.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex items-center gap-4">
             <h2 className="text-4xl font-black uppercase italic tracking-tighter">The Full Experience</h2>
             <div className="h-[4px] flex-1 bg-black"></div>
          </div>
          <textarea 
            required
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={12}
            placeholder="Tell us the story. What broke? What worked? How did you feel?" 
            className="w-full p-10 border-4 border-black focus:outline-none focus:bg-yellow-50 font-medium text-xl bg-gray-50/50 placeholder:text-gray-300"
          />

          <div className="space-y-6">
            <label className="text-xs font-black uppercase tracking-widest text-black">Visual Proof</label>
            <div className="flex flex-col md:flex-row gap-12 items-center bg-gray-50 p-12 scrapbook-border border-dashed border-4">
              {formData.imageUrl ? (
                <div className="relative scrapbook-border p-3 bg-white rotate-2 max-w-[320px] group">
                   <img src={formData.imageUrl} alt="Uploaded" className="w-full h-auto" />
                   <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                    className="absolute -top-4 -right-4 bg-red-600 text-white w-10 h-10 rounded-full border-4 border-black font-black flex items-center justify-center hover:scale-110 transition-transform"
                   >
                    X
                   </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={openCloudinaryWidget}
                  className="group flex flex-col items-center justify-center p-12 bg-white border-4 border-black border-dashed hover:bg-blue-50 transition-all w-full md:w-auto min-w-[200px]"
                >
                  <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors mb-6 shadow-xl">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">UPLOAD VIA CLOUDINARY</span>
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex items-center gap-4">
             <h2 className="text-4xl font-black uppercase italic tracking-tighter">Survivor's Code</h2>
             <div className="h-[4px] flex-1 bg-black"></div>
          </div>
          <div className="space-y-8">
            {formData.tips.map((tip, i) => (
              <div key={i} className="flex gap-8 items-center">
                <span className="text-6xl font-black text-blue-600 doodle-font italic">0{i+1}</span>
                <input 
                  type="text" 
                  value={tip}
                  onChange={(e) => handleTipChange(i, e.target.value)}
                  placeholder="Essential lesson..."
                  className="w-full p-5 border-4 border-black bg-blue-50 focus:outline-none font-black text-lg"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex justify-between items-center gap-4">
             <div className="flex items-center gap-4 flex-1">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">The Reality Gap</h2>
                <div className="h-[4px] flex-1 bg-black"></div>
             </div>
             <button 
                type="button" 
                onClick={addRealityCheck} 
                className="text-[10px] font-black bg-black text-white px-6 py-3 uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
             >
                + Add Reality Check
             </button>
          </div>
          <div className="space-y-10">
            {formData.realityChecks.map((check, i) => (
              <div key={i} className="relative group p-8 md:p-12 bg-orange-50 scrapbook-border rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Idealized Expectation</label>
                    <textarea 
                      value={check.expectation}
                      onChange={(e) => handleRealityCheckChange(i, 'expectation', e.target.value)}
                      placeholder="What the instructions said..."
                      rows={2}
                      className="w-full p-4 border-b-4 border-orange-200 bg-transparent focus:outline-none focus:border-orange-500 italic font-black text-xl placeholder:text-orange-200 resize-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-black uppercase tracking-widest">Cold Hard Reality</label>
                    <textarea 
                      value={check.reality}
                      onChange={(e) => handleRealityCheckChange(i, 'reality', e.target.value)}
                      placeholder="What actually happened..."
                      rows={2}
                      className="w-full p-4 border-b-4 border-black bg-transparent focus:outline-none focus:border-blue-600 font-black text-xl placeholder:text-gray-300 resize-none"
                    />
                  </div>
                </div>
                {formData.realityChecks.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeRealityCheck(i)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-black text-white border-2 border-white rounded-full font-black text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="pt-20 border-t-8 border-black">
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full py-8 text-3xl font-black text-white bg-black hover:bg-blue-600 transition-all shadow-[12px_12px_0px_0px_#2563eb] active:shadow-none active:translate-x-3 active:translate-y-3 uppercase tracking-tighter italic"
          >
            {submitting ? 'STORING...' : 'PERMANENTLY LOG THIS FIRST'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;
