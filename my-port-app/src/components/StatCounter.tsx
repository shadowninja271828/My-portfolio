import { motion } from 'framer-motion'
import { Palette, Layers, Repeat2, Star, Users, Zap, Code2, type LucideIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import type { IconName } from '../data/content'
import { useCountUp } from '../hooks/useCountUp'

export const ICON_MAP: Record<IconName, LucideIcon> = {
  star: Star, users: Users, repo: Repeat2, code: Code2, zap: Zap, layers: Layers, palette: Palette,
}

interface Props { value: number; suffix: string; label: string; icon: IconName }

export function StatCounter({ value, suffix, label, icon }: Props) {
  const [seen, setSeen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const n = useCountUp(value, seen)
  const Icon = ICON_MAP[icon]
  return (
    <motion.div
      ref={ref}
      onViewportEnter={() => setSeen(true)}
      viewport={{ once: true }}
      className="rounded-2xl border border-white/10 p-4"
    >
      <Icon className="mb-3 size-4 text-orange" aria-hidden="true" />
      <p className="pixel text-3xl text-white sm:text-4xl">{n}{suffix}</p>
      <p className="mono mt-2 text-[11px] uppercase tracking-wider text-muted">{label}</p>
    </motion.div>
  )
}
