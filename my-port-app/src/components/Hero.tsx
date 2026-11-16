import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { content } from '../data/content'
import { PixelScene } from './PixelScene'
import { StatCounter } from './StatCounter'
import { T } from './Todo'
import { TypedName } from './TypedName'

const line = { hidden: { y: '110%' }, show: (i: number) => ({ y: 0, transition: { duration: 0.8, delay: 0.15 * i, ease: [0.2, 0.7, 0.2, 1] as const } }) }

export function Hero() {
  const [a, b] = content.role
  return (
    <section id="home" aria-labelledby="hero-h" className="pt-24 lg:pt-10">
      <p className="mono text-sm text-muted">{content.eyebrow}</p>
      <TypedName text={content.typedName} />
      <h1 id="hero-h" className="display mt-4 text-[clamp(3.2rem,9vw,9rem)]">
        <span className="block overflow-hidden pb-[0.05em]"><motion.span className="block text-white" variants={line} custom={0} initial="hidden" animate="show">{a}</motion.span></span>
        <span className="block overflow-hidden pb-[0.05em]"><motion.span className="block text-[#4a4947]" variants={line} custom={1} initial="hidden" animate="show">{b}</motion.span></span>
      </h1>

      <div className="mt-8 grid items-end gap-8 xl:grid-cols-[1fr_320px]">
        <div>
          <p className="max-w-xl text-muted"><T>{content.heroParagraph}</T></p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#projects" className="pixel-btn group inline-flex min-h-11 items-center gap-2 rounded-xl bg-lime px-6 py-3 text-sm font-semibold text-black">
              View my work <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href="#contact" className="inline-flex min-h-11 items-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold transition-colors hover:border-lime hover:text-lime">
              Contact me
            </a>
          </div>
        </div>
        {content.heroVisual === 'pixelScene' && (
          <div className="hidden w-full max-w-xs overflow-hidden rounded-[14px] border border-white/10 sm:block"><PixelScene /></div>
        )}
      </div>

      <div className="mt-10 grid gap-3 min-[480px]:grid-cols-3">
        {content.stats.map((s) => <StatCounter key={s.label} {...s} />)}
      </div>
    </section>
  )
}
