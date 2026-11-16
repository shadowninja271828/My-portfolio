import { ExternalLink, GitBranch } from 'lucide-react'
import type { Project } from '../data/content'
import { T } from './Todo'
import { WindowFrame } from './WindowFrame'

export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-[24px] border border-white/10 bg-surface p-3 transition-all duration-300 hover:-translate-y-1 hover:border-lime hover:shadow-[0_0_24px_rgba(198,255,61,0.25)] motion-reduce:hover:translate-y-0">
      <WindowFrame title={p.title}>
        {p.image ? (
          <img src={p.image} alt={`Screenshot of ${p.title}`} width={1280} height={800} loading="lazy" className="size-full object-cover" />
        ) : (
          <div className="pixel grid size-full place-items-center text-xs text-muted">IMAGE 16:10</div>
        )}
      </WindowFrame>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-lg font-bold"><T>{p.title}</T></h3>
        <p className="mt-1 text-sm text-muted"><T>{p.description}</T></p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {p.tags.map((t) => <li key={t} className="mono rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-white/80">{t}</li>)}
        </ul>
        <div className="mt-auto flex gap-4 pt-4 text-sm">
          {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-8 items-center gap-1.5 text-lime hover:underline"><ExternalLink className="size-4" aria-hidden="true" />Live</a>}
          {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-8 items-center gap-1.5 text-white hover:text-lime"><GitBranch className="size-4" aria-hidden="true" />Code</a>}
        </div>
      </div>
    </article>
  )
}
