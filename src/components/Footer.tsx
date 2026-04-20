import Link from 'next/link'
import { FaGithub, FaTelegram } from 'react-icons/fa'
import { MdAlternateEmail } from 'react-icons/md'

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border py-8">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <span className="font-mono text-sm text-muted-foreground">
          <span className="text-primary">&lt;/&gt;</span>{' '}
          Dmitriy Nikulshin &copy; {new Date().getFullYear()}
        </span>

        <div className="flex items-center gap-5">
          <Link
            href="https://github.com/DNikulshin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-xl text-muted-foreground hover:text-primary transition-colors"
          >
            <FaGithub />
          </Link>
          <Link
            href="https://t.me/nikulshin_dev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="text-xl text-muted-foreground hover:text-primary transition-colors"
          >
            <FaTelegram />
          </Link>
          <Link
            href="mailto:d.nikulshin.dev@gmail.com"
            aria-label="Email"
            className="text-xl text-muted-foreground hover:text-primary transition-colors"
          >
            <MdAlternateEmail />
          </Link>
        </div>
      </div>
    </footer>
  )
}
