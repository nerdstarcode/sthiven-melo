export type NavKey = 'home' | 'about' | 'projects' | 'examples' | 'skills' | 'experience'

export interface NavItem {
  key: NavKey
  href: string
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'projects', href: '/projects' },
  { key: 'examples', href: '/examples' },
  { key: 'skills', href: '/about#skills' },
  { key: 'experience', href: '/about#experience' },
]
