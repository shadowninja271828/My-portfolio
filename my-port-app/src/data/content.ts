// Single source of truth for ALL site copy.
// Anything starting with "TODO" is a placeholder; in dev it renders with a visible marker.

export type IconName = 'star' | 'users' | 'repo' | 'code' | 'zap' | 'layers' | 'palette'

export interface Stat { value: number; suffix: string; label: string; icon: IconName }
export interface Service { title: string; text: string; icon: IconName }
export interface Project {
  title: string
  description: string
  tech: string[]
  tags: string[]
  image: string // 16:10 webp; empty string shows a placeholder
  liveUrl: string
  repoUrl: string
}
export interface Job { role: string; org: string; start: string; end: string; bullets: string[] }
export interface Education { title: string; org: string; start: string; end: string }
export interface Testimonial { quote: string; name: string; role: string; rating: number }
export interface Faq { q: string; a: string }
export interface SkillGroup { title: string; items: string[] }

export const content = {
  name: 'Crown',
  role: ['REACT', 'DEVELOPER'] as [string, string],
  eyebrow: "Hi, I'm",
  typedName: 'CROWN_',
  shortBio: 'TODO_BIO: one sentence about Crown.',
  heroParagraph: 'TODO_BIO: two to three lines about what Crown builds and who Crown builds it for.',
  photo: '/assets/crown.jpg', // placeholder until supplied (3:4 portrait)
  heroVisual: 'pixelScene' as 'pixelScene' | 'none',

  stats: [
    { value: 0, suffix: '+', label: 'TODO_STATS years', icon: 'star' },
    { value: 0, suffix: '+', label: 'TODO_STATS projects', icon: 'repo' },
    { value: 0, suffix: '+', label: 'TODO_STATS clients', icon: 'users' },
  ] as Stat[],

  services: [
    { title: 'UI Development', text: 'TODO_SERVICES: pixel-accurate, accessible interfaces in React.', icon: 'code' },
    { title: 'Component Libraries', text: 'TODO_SERVICES: reusable, documented design-system components.', icon: 'layers' },
    { title: 'Performance', text: 'TODO_SERVICES: fast loads, smooth animation, high Lighthouse scores.', icon: 'zap' },
    { title: 'Interaction Design', text: 'TODO_SERVICES: motion and micro-interactions with purpose.', icon: 'palette' },
  ] as Service[],

  skills: [
    { title: 'Languages', items: ['TODO_SKILLS', 'JavaScript', 'TypeScript'] },
    { title: 'Frontend', items: ['React', 'Tailwind CSS', 'Framer Motion'] },
    { title: 'Tools', items: ['Git', 'Vite', 'Figma'] },
  ] as SkillGroup[],

  projects: [
    {
      title: 'TODO_PROJECTS One',
      description: 'TODO_PROJECTS: one-line description.',
      tech: ['React'], tags: ['React', 'Portfolio', 'Interactive'],
      image: '', liveUrl: '', repoUrl: '',
    },
    {
      title: 'TODO_PROJECTS Two',
      description: 'TODO_PROJECTS: one-line description.',
      tech: ['React'], tags: ['React', 'Dashboard'],
      image: '', liveUrl: '', repoUrl: '',
    },
    {
      title: 'TODO_PROJECTS Three',
      description: 'TODO_PROJECTS: one-line description.',
      tech: ['React'], tags: ['React', 'UI Kit'],
      image: '', liveUrl: '', repoUrl: '',
    },
  ] as Project[],
  projectsLayout: 'grid' as 'grid' | 'carousel',

  experience: [] as Job[], // hidden when empty
  education: [] as Education[], // hidden when empty
  testimonials: [] as Testimonial[], // hidden when empty
  faq: [] as Faq[], // hidden when empty

  budgetOptions: ['TODO_BUDGET Under $1k', 'TODO_BUDGET $1k - $5k', 'TODO_BUDGET $5k+'],

  // Only non-empty entries are rendered.
  socials: { github: '', linkedin: '', instagram: '', x: '', youtube: '', email: '' } as Record<
    'github' | 'linkedin' | 'instagram' | 'x' | 'youtube' | 'email', string
  >,

  // Form backend: set VITE_FORMSPREE_ID or EmailJS keys in .env; otherwise a mock is used.
  contactHeadline: ["LET'S WORK", 'TOGETHER'] as [string, string],
  whatsappBusiness: '+91 7074988045',

  nav: [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ],
}

export const asset = (p: string) =>
  p.startsWith('/') && !p.startsWith('//') ? import.meta.env.BASE_URL + p.slice(1) : p

export const isTodo = (s: string) => s.includes('TODO')

// ---- Admin overrides (frontend only, persisted in localStorage) ----
export type Content = typeof content
export const defaultContent: Content = JSON.parse(JSON.stringify(content))
const KEY = 'crown-content'

export function saveContent(next: Content) {
  localStorage.setItem(KEY, JSON.stringify(next))
  Object.assign(content, next)
}
export function resetContent() {
  localStorage.removeItem(KEY)
  Object.assign(content, JSON.parse(JSON.stringify(defaultContent)))
}
try {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null
  if (raw) Object.assign(content, JSON.parse(raw))
} catch { /* ignore corrupt data */ }
