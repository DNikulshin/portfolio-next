'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Avatar from '@/images/avatar3.webp'
import { FaGithub, FaTelegram } from 'react-icons/fa'
import { MdAlternateEmail } from 'react-icons/md'

const socialLinks = [
  { href: 'https://github.com/DNikulshin', icon: FaGithub, label: 'GitHub' },
  { href: 'https://t.me/nikulshin_dev', icon: FaTelegram, label: 'Telegram' },
  { href: 'mailto:d.nikulshin.dev@gmail.com', icon: MdAlternateEmail, label: 'Email' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const slideLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
}

const iconVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[80vh] flex items-center overflow-hidden"
      style={{ background: 'var(--hero-glow)' }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-12 md:flex-row md:justify-between md:items-center">

          {/* Text block */}
          <motion.div
            className="flex flex-col items-center text-center md:items-start md:text-left md:max-w-xl flex-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              variants={slideLeft}
              className="font-mono text-primary text-sm mb-3 tracking-widest uppercase"
            >
              // fullstack developer
            </motion.span>

            <motion.h1
              variants={slideLeft}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight"
            >
              Dmitriy Nikulshin
            </motion.h1>

            <motion.p
              variants={slideLeft}
              className="font-mono text-xl sm:text-2xl text-primary font-semibold mb-4"
            >
              От концепции до кода
            </motion.p>

            <motion.p
              variants={slideLeft}
              className="text-muted-foreground text-base mb-5 leading-relaxed"
            >
              Строю продукты полного цикла:&nbsp;
              <span className="text-foreground font-medium">API → UI → Deploy</span>
            </motion.p>

            <motion.div
              variants={slideLeft}
              className="flex flex-wrap gap-2 mb-8"
            >
              {['React', 'TypeScript', 'Node.js', 'Docker', 'PostgreSQL'].map(t => (
                <span key={t} className="font-mono text-xs text-muted-foreground border border-border px-2 py-0.5 rounded-md">
                  {t}
                </span>
              ))}
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="flex items-center gap-5 mb-8"
            >
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <motion.div key={label} variants={iconVariant}>
                  <Link
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-3xl text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    <Icon />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={slideLeft}>
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary text-primary font-mono text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                Смотреть проекты
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Avatar */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="relative flex-shrink-0"
          >
            <motion.div
              animate={{ boxShadow: ['0 0 0 0 oklch(0.65 0.15 260 / 0.3)', '0 0 0 16px oklch(0.65 0.15 260 / 0)', '0 0 0 0 oklch(0.65 0.15 260 / 0)'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="rounded-full"
            >
              <Image
                src={Avatar}
                alt="Dmitriy Nikulshin"
                width={280}
                height={280}
                priority
                className="rounded-full w-52 h-52 md:w-72 md:h-72 object-cover border-2 border-primary/30"
                style={{ objectPosition: '50% 20%' }}
              />
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <span className="font-mono text-xs">scroll</span>
        <span className="text-lg">↓</span>
      </motion.div>
    </section>
  )
}
