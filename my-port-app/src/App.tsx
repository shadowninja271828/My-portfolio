import type { ReactNode } from 'react'
import { content } from './data/content'
import { BentoGrid } from './components/BentoGrid'
import { ContactForm } from './components/ContactForm'
import { Faq, Testimonials } from './components/Extras'
import { FloatingNav } from './components/FloatingNav'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { ProfileCard } from './components/ProfileCard'
import { ProjectCard } from './components/ProjectCard'
import { ProjectCarousel } from './components/ProjectCarousel'
import { Reveal } from './components/Reveal'
import { SkillChips } from './components/SkillChips'
import { Timeline } from './components/Timeline'

function Section({ id, index, title, children }: { id: string; index: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mt-24">
      <Reveal>
        <h2 id={`${id}-h`} className="pixel mb-6 text-sm text-lime">{index} {title.toUpperCase()}</h2>
      </Reveal>
      {children}
    </section>
  )
}

export default function App() {
  const hasExp = content.experience.length > 0
  const hasEdu = content.education.length > 0
  const hasProjects = content.projects.length > 0
  const navIds = ['home', ...(hasProjects ? ['projects'] : []), ...(hasExp || hasEdu ? ['experience'] : []), 'skills', 'contact']
  let n = 2

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-lime focus:px-3 focus:py-2 focus:text-black">Skip to content</a>
      <FloatingNav ids={navIds} />
      <div className="mx-auto grid max-w-site gap-8 px-4 pb-10 pt-24 sm:px-8 lg:pt-8 xl:grid-cols-[430px_1fr] xl:gap-12">
        <div className="xl:sticky xl:top-6 xl:self-start xl:pt-16">
          <ProfileCard />
        </div>
        <main id="main" className="min-w-0">
          <Hero />
          <BentoGrid />

          {hasProjects && (
            <Section id="projects" index={String(n++).padStart(2, '0')} title="Projects">
              {content.projectsLayout === 'carousel' ? (
                <ProjectCarousel projects={content.projects} />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {content.projects.map((p, i) => <Reveal key={p.title} delay={i * 0.08}><ProjectCard project={p} /></Reveal>)}
                </div>
              )}
            </Section>
          )}

          {(hasExp || hasEdu) && (
            <Section id="experience" index={String(n++).padStart(2, '0')} title="Experience">
              {hasExp && <Timeline items={content.experience.map((j) => ({ title: j.role, org: j.org, start: j.start, end: j.end, bullets: j.bullets }))} />}
              {hasEdu && (
                <div className={hasExp ? 'mt-12' : ''}>
                  <h3 className="pixel mb-4 text-xs text-orange">EDUCATION</h3>
                  <Timeline items={content.education} />
                </div>
              )}
            </Section>
          )}

          <Section id="skills" index={String(n++).padStart(2, '0')} title="Skills"><SkillChips /></Section>

          {content.testimonials.length > 0 && (
            <Section id="testimonials" index={String(n++).padStart(2, '0')} title="Testimonials"><Testimonials /></Section>
          )}
          {content.faq.length > 0 && (
            <Section id="faq" index={String(n++).padStart(2, '0')} title="FAQ"><Faq /></Section>
          )}

          <ContactForm />
          <Footer />
        </main>
      </div>
    </>
  )
}
