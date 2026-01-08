
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category, Post, RealityCheck, User } from '../types';
import { CATEGORIES } from '../constants';

interface SubmissionFormProps {
  onAddPost: (post: Post) => void;
  currentUser: User | null;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onAddPost, currentUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Home & DIY' as Category,
    difficulty: 3,
    content: '',
    tips: ['', '', ''],
    realityChecks: [{ expectation: '', reality: '' }] as RealityCheck[],
    imagePreview: ''
  });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagePreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newPost: Post = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        author: currentUser?.username || 'Guest Traveler',
        authorId: currentUser?.id,
        category: formData.category,
        difficulty: formData.difficulty,
        content: formData.content,
        tips: formData.tips.filter(t => t.trim() !== ''),
        realityChecks: formData.realityChecks.filter(r => r.expectation.trim() !== ''),
        imageUrl: formData.imagePreview || `https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800`,
        createdAt: new Date().toISOString(),
        comments: []
      };

      onAddPost(newPost);
      setLoading(false);
      navigate('/');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="mb-16 text-center">
        <h1 className="text-6xl font-black mb-6 tracking-tighter uppercase italic">Document Your First</h1>
        <p className="text-gray-400 font-bold doodle-font text-2xl italic underline decoration-blue-200">The world needs your beginners' eyes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-16 bg-white p-10 md:p-20 scrapbook-border shadow-2xl">
        <section className="space-y-10">
          <div className="flex items-center gap-4">
             <h2 className="text-3xl font-black uppercase italic tracking-tighter">The Brief</h2>
             <div className="h-[2px] flex-1 bg-black/10"></div>
          </div>
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Heading</label>
              <input 
                required
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Changing my first flat tire..." 
                className="w-full p-5 border-4 border-black text-xl focus:outline-none focus:ring-8 focus:ring-blue-50 font-bold"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Classify It</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-4 border-4 border-black font-black uppercase text-xs tracking-widest bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Difficulty Score ({formData.difficulty})</label>
                <div className="flex items-center gap-4 py-4">
                  <input 
                    type="range" 
                    name="difficulty"
                    min="1" 
                    max="5" 
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="flex-1 accent-blue-600 h-2"
                  />
                  <span className="font-black text-2xl doodle-font text-blue-600">Level {formData.difficulty}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex items-center gap-4">
             <h2 className="text-3xl font-black uppercase italic tracking-tighter">The Full Story</h2>
             <div className="h-[2px] flex-1 bg-black/10"></div>
          </div>
          <textarea 
            required
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={10}
            placeholder="Don't leave out the embarrassing parts..." 
            className="w-full p-8 border-4 border-black focus:outline-none focus:ring-8 focus:ring-blue-50 font-medium text-lg bg-gray-50/30"
          />

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Evidence (Photo)</label>
            <div className="flex flex-col md:flex-row gap-10 items-center bg-gray-50 p-10 scrapbook-border border-dashed">
              <label className="cursor-pointer group flex flex-col items-center">
                <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors mb-4">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Attach Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
              {formData.imagePreview && (
                <div className="relative scrapbook-border p-2 bg-white rotate-2 max-w-[240px]">
                   <img src={formData.imagePreview} alt="Preview" className="w-full h-auto" />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex items-center gap-4">
             <h2 className="text-3xl font-black uppercase italic tracking-tighter">Survivor's Tips</h2>
             <div className="h-[2px] flex-1 bg-black/10"></div>
          </div>
          <div className="space-y-6">
            {formData.tips.map((tip, i) => (
              <div key={i} className="flex gap-6 items-center">
                <span className="text-5xl font-black text-blue-600 doodle-font italic">0{i+1}</span>
                <input 
                  type="text" 
                  value={tip}
                  onChange={(e) => handleTipChange(i, e.target.value)}
                  placeholder="Pro tip..."
                  className="w-full p-4 border-2 border-black bg-blue-50 focus:outline-none font-bold"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex justify-between items-center">
             <h2 className="text-3xl font-black uppercase italic tracking-tighter">Reality Check</h2>
             <button type="button" onClick={addRealityCheck} className="text-[10px] font-black bg-black text-white px-4 py-2 uppercase tracking-widest">+ Add Comparison</button>
          </div>
          <div className="space-y-10">
            {formData.realityChecks.map((check, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-orange-50 p-8 scrapbook-border border-orange-200">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest">I thought...</label>
                  <input 
                    type="text" 
                    value={check.expectation}
                    onChange={(e) => handleRealityCheckChange(i, 'expectation', e.target.value)}
                    className="w-full p-3 border-b-2 border-orange-200 bg-transparent focus:outline-none focus:border-orange-500 italic font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black uppercase tracking-widest">In reality...</label>
                  <input 
                    type="text" 
                    value={check.reality}
                    onChange={(e) => handleRealityCheckChange(i, 'reality', e.target.value)}
                    className="w-full p-3 border-b-2 border-orange-900 bg-transparent focus:outline-none focus:border-black font-black"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-16 border-t-4 border-black">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 text-2xl font-black text-white bg-black hover:bg-blue-600 transition-all shadow-[10px_10px_0px_0px_rgba(37,99,235,1)] active:shadow-none active:translate-x-2 active:translate-y-2 uppercase tracking-tighter italic"
          >
            {loading ? 'Publishing Report...' : 'Log the First Time'}
          </button>
          <p className="text-center mt-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Your story will be live instantly.</p>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;
