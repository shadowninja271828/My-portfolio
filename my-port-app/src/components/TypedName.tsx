import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

/** Typewriter reveal, then a steady blinking block cursor. Reserves final width to avoid layout shift. */
export function TypedName({ text }: { text: string }) {
  const reduced = useReducedMotion()
  const [n, setN] = useState(reduced ? text.length : 0)
  useEffect(() => {
    if (reduced) { setN(text.length); return }
    setN(0)
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), 140)
    return () => clearInterval(id)
  }, [text, reduced])
  return (
    <p className="pixel relative text-3xl text-lime sm:text-4xl" aria-label={text}>
      <span aria-hidden="true" className="invisible">{text}</span>
      <span aria-hidden="true" className="absolute left-0 top-0">
        {text.slice(0, n).replace(/_$/, '')}
        <span className="cursor-blink ml-1 inline-block h-[0.8em] w-[0.55em] translate-y-[0.1em] bg-lime" />
      </span>
    </p>
  )
}
