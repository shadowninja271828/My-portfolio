import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

/** Counts 0 -> target over `duration` ms (ease-out) once `start` is true. */
export function useCountUp(target: number, start: boolean, duration = 1500): number {
  const reduced = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!start) return
    if (reduced) { setN(target); return }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, start, duration, reduced])
  return n
}
