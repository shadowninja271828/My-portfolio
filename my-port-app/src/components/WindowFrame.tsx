import type { ReactNode } from 'react'

/** macOS-style window chrome with optional faint scanlines. */
export function WindowFrame({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-white/10 bg-surface-2">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        {title && <span className="mono ml-2 truncate text-[10px] text-muted">{title}</span>}
      </div>
      <div className="scanlines relative aspect-[16/10]" >{children}</div>
    </div>
  )
}
