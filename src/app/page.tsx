"use client";

import { Header } from "@/components/Header";
import { WorkList } from "@/components/works/WorkList";
import Link from "next/link";
import { FaGithub, FaTelegram, FaHtml5, FaCss3Alt, FaJs, FaReact, FaVuejs, FaNodeJs, FaDatabase, FaDocker } from "react-icons/fa";
import { SiTypescript, SiNextdotjs, SiNuxtdotjs, SiPrisma } from "react-icons/si";
import { MdAlternateEmail } from "react-icons/md";
import Image from "next/image";
import Avatar from "@/images/avatar.webp";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Hero Section */}
        <section id="hero" className="flex flex-col items-center justify-between py-20 md:flex-row">
          <div className="mb-10 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:text-left">
            <h2 className="text-4xl font-bold mb-4">Dmitriy Nikulshin</h2>
            <p className="text-xl text-muted-foreground mb-6">
              Full-Stack разработчик, увлеченный созданием современных и эффективных веб-приложений.
            </p>
            <div className="flex justify-center gap-4 md:justify-start">
              <Link href="https://github.com/DNikulshin" target="_blank" rel="noopener noreferrer" className="text-4xl hover:text-primary">
                <FaGithub />
              </Link>
              <Link href="https://t.me/dmtr_nik" target="_blank" rel="noopener noreferrer" className="text-4xl hover:text-primary">
                <FaTelegram />
              </Link>
              <Link href="mailto:d.nikulshin.dev@gmail.com" className="text-4xl hover:text-primary">
                <MdAlternateEmail />
              </Link>
            </div>
          </div>
          <div className="md:w-1/3">
            <Image
              src={Avatar}
              alt="Dmitriy Nikulshin"
              className="rounded-full shadow-lg"
              width={300}
              height={300}
              priority
            />
          </div>
        </section>

        {/* Freelance Section */}
        <section id="freelance" className="py-16 my-8 bg-primary text-primary-foreground rounded-lg px-6 text-center">
            <h3 className="text-3xl font-bold mb-4">🤝 Ваш удалённый fullstack-специалист</h3>
            <p className="text-lg mb-2">От концепции до кода: React, TypeScript, Node.js, базы данных, API.</p>
            <p className="text-lg mb-6">Работаю как часть команды или самостоятельно — вам нужно лишь задание.</p>
            <Link href="https://t.me/dmtr_nik" target="_blank" rel="noopener noreferrer" className="text-lg underline hover:text-secondary font-bold">Связаться → @dmtr_nik</Link>
        </section>

        {/* About Me Section */}
        <section id="about" className="py-20 bg-card text-card-foreground rounded-lg px-6">
          <h3 className="text-3xl font-bold text-center mb-8">Обо мне</h3>
          <p className="max-w-3xl mx-auto text-center text-lg">
            Я - full-stack разработчик с опытом создания веб-приложений с нуля. Мне нравится работать как с фронтендом, так и с бэкендом, используя современные технологии для создания интуитивно понятных и производительных пользовательских интерфейсов. Постоянно учусь и совершенствую свои навыки, чтобы быть в курсе последних тенденций в веб-разработке.
          </p>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20">
          <h3 className="text-3xl font-bold text-center mb-12">Навыки</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <FaHtml5 className="text-6xl text-orange-500" />
              <span>HTML5</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaCss3Alt className="text-6xl text-blue-500" />
              <span>CSS3</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaJs className="text-6xl text-yellow-400" />
              <span>JavaScript</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <SiTypescript className="text-6xl text-blue-400" />
              <span>TypeScript</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaReact className="text-6xl text-cyan-400" />
              <span>React</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <SiNextdotjs className="text-6xl" />
              <span>Next.js</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaVuejs className="text-6xl text-green-500" />
              <span>Vue.js</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <SiNuxtdotjs className="text-6xl text-green-400" />
              <span>Nuxt.js</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaNodeJs className="text-6xl text-green-600" />
              <span>Node.js</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaDocker className="text-6xl text-blue-600" />
              <span>Docker</span>
            </div>
             <div className="flex flex-col items-center gap-2">
              <SiPrisma className="text-6xl text-gray-700 dark:text-gray-200" />
              <span>Prisma</span>
            </div>
             <div className="flex flex-col items-center gap-2">
              <FaDatabase className="text-6xl text-indigo-500" />
              <span>Databases</span>
            </div>
          </div>
        </section>

        {/* Works Section */}
        <section id="works" className="py-20">
          <h3 className="text-3xl font-bold text-center mb-12">Мои работы</h3>
          <WorkList type="slider" />
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-6">
        <div className="container mx-auto px-4 text-center">
          <p>Developed by Dmitriy Nikulshin &copy; {new Date().getFullYear()}</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="https://github.com/DNikulshin" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary">
              <FaGithub />
            </Link>
             <Link href="https://t.me/dmtr_nik" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-primary">
                <FaTelegram />
              </Link>
            <Link href="mailto:d.nikulshin.dev@gmail.com" className="text-2xl hover:text-primary">
              <MdAlternateEmail />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
