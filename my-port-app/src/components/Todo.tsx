import { isTodo } from '../data/content'

/** Renders text; in dev, placeholder copy gets a visible TODO marker. */
export function T({ children }: { children: string }) {
  if (import.meta.env.DEV && isTodo(children)) {
    return (
      <span className="rounded-sm bg-orange/20 outline outline-1 outline-dashed outline-orange" title="Placeholder: edit in src/data/content.ts">
        {children}
      </span>
    )
  }
  return <>{children}</>
}
