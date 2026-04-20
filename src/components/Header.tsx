'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub } from 'react-icons/fa'
import { RxHamburgerMenu, RxCross2 } from 'react-icons/rx'

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main bar */}
      <div
        className={`transition-all duration-300 ${
          scrolled || menuOpen
            ? 'bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-mono" onClick={closeMenu}>
            <span className="text-primary font-bold text-lg">&lt;/&gt;</span>
            <span className="text-sm font-semibold hidden sm:block">DNikulshin</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Основная навигация">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/DNikulshin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub профиль"
              className="text-xl text-muted-foreground hover:text-primary transition-colors"
            >
              <FaGithub />
            </Link>

            <button
              className="md:hidden text-xl text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {menuOpen ? <RxCross2 /> : <RxHamburgerMenu />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown — absolute, не толкает контент */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 w-full md:hidden bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-lg"
            aria-label="Мобильная навигация"
          >
            {navLinks.map(({ href, label }, i) => (
              <motion.a
                key={href}
                href={href}
                onClick={closeMenu}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="block px-6 py-4 font-mono text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors border-b border-border/30 last:border-0"
              >
                {label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
