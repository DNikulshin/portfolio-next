const stats = [
  { label: '91+ repo', desc: 'публичных репозиториев' },
  { label: 'Fullstack', desc: 'фронт + бэк + деплой' },
  { label: 'Remote', desc: 'удалённая работа' },
]

export function AboutSection() {
  return (
    <div className="py-20 px-6 bg-card rounded-2xl border border-border">
      <span className="font-mono text-primary text-xs tracking-widest uppercase">// 01 about</span>
      <h2 className="text-3xl font-bold mt-2 mb-6">Обо мне</h2>
      <p className="max-w-3xl text-lg text-muted-foreground leading-relaxed mb-10">
        Строю полноценные продукты с нуля — от проектирования API до деплоя в Docker.
        Работаю с React и Next.js на фронте, Node.js / NestJS / Fastify на бэке,
        PostgreSQL и Redis для хранения данных. Настраиваю CI/CD через GitHub Actions,
        управляю инфраструктурой через Caddy и Cloudflare.
        91 публичный репозиторий — большинство из них реальные рабочие инструменты,
        а не учебные проекты.
      </p>

      <div className="flex flex-wrap gap-4">
        {stats.map(({ label, desc }) => (
          <div
            key={label}
            className="flex flex-col gap-0.5 px-5 py-3 rounded-lg border border-border bg-background"
          >
            <span className="font-mono text-primary font-bold text-lg">{label}</span>
            <span className="text-sm text-muted-foreground">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
