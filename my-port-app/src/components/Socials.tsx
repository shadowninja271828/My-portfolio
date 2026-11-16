import { AtSign, Camera, GitBranch, Link2, Mail, Play, type LucideIcon } from 'lucide-react'
import { content, safeUrl } from '../data/content'

const META: Record<string, { Icon: LucideIcon; label: string }> = {
  github: { Icon: GitBranch, label: 'GitHub' },
  linkedin: { Icon: Link2, label: 'LinkedIn' },
  instagram: { Icon: Camera, label: 'Instagram' },
  x: { Icon: AtSign, label: 'X' },
  youtube: { Icon: Play, label: 'YouTube' },
  email: { Icon: Mail, label: 'Email' },
}

/** Renders only socials that have a value in content.ts. */
export function Socials({ variant = 'orange', max = 6 }: { variant?: 'orange' | 'light'; max?: number }) {
  const entries = Object.entries(content.socials).filter(([, v]) => v).slice(0, max)
  if (!entries.length) return null
  const color = variant === 'orange' ? 'border-orange text-orange hover:bg-orange hover:text-white' : 'border-white/20 text-white hover:border-lime hover:text-lime'
  return (
    <ul className="flex flex-wrap gap-2">
      {entries.map(([k, v]) => {
        const { Icon, label } = META[k]
        const href = safeUrl(k === 'email' && !v.startsWith('mailto:') ? `mailto:${v}` : v)
        if (!href) return null
        return (
          <li key={k}>
            <a href={href} aria-label={label} target={k === 'email' ? undefined : '_blank'} rel="noreferrer noopener"
               className={`grid size-11 place-items-center rounded-xl border-2 transition-colors ${color}`}>
              <Icon className="size-5" aria-hidden="true" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
