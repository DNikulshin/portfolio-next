import Link from 'next/link'
import { FaTelegram } from 'react-icons/fa'
import { MdAlternateEmail } from 'react-icons/md'

export function ContactSection() {
  return (
    <div className="py-20 px-6 bg-primary rounded-2xl text-primary-foreground text-center">
      <span className="font-mono text-primary-foreground/60 text-xs tracking-widest uppercase">
        // 04 contact
      </span>
      <h2 className="text-3xl font-bold mt-2 mb-3">Работаем вместе?</h2>
      <p className="text-lg text-primary-foreground/80 mb-2">
        Ваш удалённый fullstack-специалист — от задачи до результата.
      </p>
      <p className="text-base text-primary-foreground/70 mb-8">
        Работаю как часть команды или самостоятельно.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="https://t.me/nikulshin_dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-foreground text-primary font-semibold hover:opacity-90 transition-opacity"
        >
          <FaTelegram className="text-xl" />
          @nikulshin_dev
        </Link>
        <Link
          href="mailto:d.nikulshin.dev@gmail.com"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary-foreground/40 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-colors"
        >
          <MdAlternateEmail className="text-xl" />
          Написать письмо
        </Link>
      </div>
    </div>
  )
}
