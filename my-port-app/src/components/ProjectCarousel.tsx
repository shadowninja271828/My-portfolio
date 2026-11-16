import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { Project } from '../data/content'
import { ProjectCard } from './ProjectCard'

const pad = (n: number) => String(n).padStart(2, '0')

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const track = useRef<HTMLUListElement>(null)
  const [i, setI] = useState(0)

  const go = useCallback((n: number) => {
    const el = track.current
    if (!el) return
    const idx = Math.max(0, Math.min(projects.length - 1, n))
    const child = el.children[idx] as HTMLElement
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: 'smooth' })
    setI(idx)
  }, [projects.length])

  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => {
      const w = (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1
      setI(Math.round(el.scrollLeft / (w + 16)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1) }
  }

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Projects" tabIndex={0} onKeyDown={onKey}>
      <ul ref={track} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none]">
        {projects.map((p) => (
          <li key={p.title} className="w-[85%] shrink-0 snap-start md:w-[48%]"><ProjectCard project={p} /></li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-between">
        <span className="mono text-sm text-muted" aria-live="polite">{pad(i + 1)} / {pad(projects.length)}</span>
        <div className="flex items-center gap-2" role="group" aria-label="Pagination">
          {projects.map((p, n) => (
            <button key={p.title} onClick={() => go(n)} aria-label={`Go to project ${n + 1}`} aria-current={n === i}
              className={`size-2.5 rounded-full transition-colors ${n === i ? 'bg-lime' : 'bg-white/25'}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous project" className="grid size-11 place-items-center rounded-full border border-white/20 hover:border-lime disabled:opacity-30"><ChevronLeft className="size-5" /></button>
          <button onClick={() => go(i + 1)} disabled={i === projects.length - 1} aria-label="Next project" className="grid size-11 place-items-center rounded-full border border-white/20 hover:border-lime disabled:opacity-30"><ChevronRight className="size-5" /></button>
        </div>
      </div>
    </div>
  )
}
