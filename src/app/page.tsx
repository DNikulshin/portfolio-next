export const dynamic = 'force-dynamic'

import { Header } from '@/components/Header'
import { HeroSection } from '@/components/hero/HeroSection'
import { AboutSection } from '@/components/about/AboutSection'
import { SkillsSection } from '@/components/skills/SkillsSection'
import { FeaturedProjectsSection } from '@/components/projects/FeaturedProjectsSection'
import { ContactSection } from '@/components/contact/ContactSection'
import { Footer } from '@/components/Footer'
import { AnimatedSection } from '@/components/AnimatedSection'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="grow">
        <HeroSection />

        <div className="container mx-auto px-4">
          <AnimatedSection id="about" className="my-8">
            <AboutSection />
          </AnimatedSection>

          <AnimatedSection id="skills" className="my-8" delay={0.05}>
            <SkillsSection />
          </AnimatedSection>

          <AnimatedSection id="projects" className="my-8" delay={0.05}>
            <FeaturedProjectsSection />
          </AnimatedSection>

<AnimatedSection id="contact" className="my-8 mb-16" delay={0.05}>
            <ContactSection />
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  )
}
