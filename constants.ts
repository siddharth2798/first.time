
import { Post } from './types';

export const CATEGORIES: Post['category'][] = [
  'Home & DIY',
  'Travel & Culture',
  'Career & Finance',
  'Personal Growth'
];

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Applying for a Schengen Visa for the first time',
    author: 'Elena Gomez',
    category: 'Travel & Culture',
    difficulty: 4,
    isFeatured: true,
    content: "I thought it would just be filling out a simple form and showing my passport. Little did I know, it's a marathon of paperwork. I spent weeks gathering bank statements, travel insurance, and flight itineraries. The actual appointment was surprisingly quick, but the anxiety leading up to it was real.",
    tips: [
      'Organize your documents in the exact order requested by the consulate.',
      'Always carry extra photocopies of everything.',
      'Book your appointment at least 2-3 months in advance.'
    ],
    realityChecks: [
      { expectation: 'Quick 1-week turnaround.', reality: 'Took 23 agonizing days.' },
      { expectation: 'Clear instructions on the website.', reality: 'Vague requirements that needed Reddit threads to clarify.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544333346-64e4fe1f99be?auto=format&fit=crop&q=80&w=800',
    createdAt: '2024-03-10T14:30:00Z',
    comments: [
      { id: 'c1', author: 'TravelBug', text: 'This is so helpful! I am applying next month.', createdAt: '2024-03-11T10:00:00Z' }
    ]
  },
  {
    id: '2',
    title: 'Replacing my first kitchen faucet',
    author: 'Marcus Chen',
    category: 'Home & DIY',
    difficulty: 2,
    content: "The old faucet was dripping incessantly. I watched three YouTube videos and figured it was a 20-minute job. The hardest part wasn't the plumbing itself—it was the awkward yoga poses I had to do under the sink.",
    tips: [
      'Turn off the water supply completely before starting.',
      'A basin wrench is your best friend.',
      'Lay a towel down to catch any residual water.'
    ],
    realityChecks: [
      { expectation: 'A clean swap of parts.', reality: 'Found a rusted nut that took 2 hours to budge.' },
      { expectation: 'Minimal tools needed.', reality: 'Used 5 different wrenches.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    createdAt: '2024-03-12T09:15:00Z',
    comments: []
  },
  {
    id: '3',
    title: 'Negotiating my salary for the first time',
    author: 'Sarah Jenkins',
    category: 'Career & Finance',
    difficulty: 4,
    content: "I've always been a 'people pleaser', so the idea of asking for more money felt like I was being ungrateful. I practiced my script with a friend until I felt confident. When the offer came, I took a deep breath and made my counter-case based on market research.",
    tips: [
      'Always have a specific number in mind, based on research.',
      'Practice your pitch out loud to a mirror or friend.',
      'Focus on the value you bring, not your personal financial needs.'
    ],
    realityChecks: [
      { expectation: 'They would retract the offer immediately.', reality: 'They were actually impressed by the professionalism.' },
      { expectation: 'A flat "No".', reality: 'A "Let me check with HR" followed by a partial increase.' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    createdAt: '2024-03-14T11:00:00Z',
    comments: []
  }
];
