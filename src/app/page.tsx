"use client";

import { Header } from "@/components/Header";
import { WorkList } from "@/components/works/WorkList";
import Link from "next/link";
import { MdAlternateEmail } from "react-icons/md";

export default function Home() {
  return (
    <div className="flex flex-col h-screen container mx-auto px-2 py-2 gap-2">
      <Header />
      <main className="shadow-md px-2 py-2 flex flex-col flex-grow">
        <div className="px-2 py-4 w-full">
          <h3 className="text-center underline">Skills</h3>
          <ul>
            <li>Good - HTML, CSS, JavaScript</li>
            <li>Normal - TypeScript, React, NextJS</li>
            <li>Low - VueJS, NuxtJS</li>
          </ul>
          <hr />
        </div>
        <div className="flex flex-col gap-2 py-2">
          <h3 className="text-center underline">Works</h3>
          <WorkList />
        </div>
      </main>
      <footer className="flex justify-center items-center mt-auto shadow-md px-2 py-2 gap-8">
        <p>Developed by DMN {">"}_</p>
        <ul className="flex gap-1 justify-center items-center">
          <li
            className="px-1 py-0.5 shadow-md rounded-md hover:text-red-500/85"
            title="d.nikulshin.dev@gmail.com"
          >
            <Link
              href="mailto:d.nikulshin.dev@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <MdAlternateEmail className="text-lg" />
              <span>nikulshin.dev@gmail.com</span>
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}
