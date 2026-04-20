'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export interface Skill {
  icon: ReactNode
  label: string
}

interface Props {
  skills: Skill[]
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export function SkillGrid({ skills }: Props) {
  return (
    <motion.div
      className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-x-3 gap-y-5 text-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {skills.map(({ icon, label }) => (
        <motion.div
          key={label}
          variants={itemVariants}
          whileHover={{ scale: 1.12, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-2 cursor-default"
        >
          <div className="text-4xl">{icon}</div>
          <span className="text-[10px] font-mono text-muted-foreground leading-tight">{label}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}
