import { content } from '../data/content'
import { PixelCrown } from './PixelCrown'
import { Socials } from './Socials'

export function Footer() {
  const links = content.nav
  return (
    <footer className="mt-28 border-t border-white/10 py-10">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <PixelCrown size={28} />
          <span className="pixel text-sm">{content.name.toUpperCase()}</span>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {links.map((l) => <li key={l.id}><a href={`#${l.id}`} className="hover:text-lime">{l.label}</a></li>)}
          </ul>
        </nav>
        <Socials variant="light" />
      </div>
      <p className="mono mt-8 text-xs text-muted">© {new Date().getFullYear()} {content.name}</p>
    </footer>
  )
}
