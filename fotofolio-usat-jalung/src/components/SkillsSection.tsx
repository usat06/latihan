import React, { useState } from 'react';
import { Code2, Server, Terminal, Settings, ArrowRight, BrainCircuit, ShieldCheck, Database, GitBranch, Box, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Skill } from '../types';
import { SKILLS_DATA } from '../data';

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Frontend' | 'Backend' | 'Tools & DevOps' | 'Sedang Dipelajari'>('All');

  const categories: ('All' | 'Frontend' | 'Backend' | 'Tools & DevOps' | 'Sedang Dipelajari')[] = [
    'All', 'Frontend', 'Backend', 'Tools & DevOps', 'Sedang Dipelajari'
  ];

  const filteredSkills = selectedCategory === 'All'
    ? (skills || [])
    : (skills || []).filter(s => s.category === selectedCategory);

  // Helper to map icon string to actual Lucide Icon
  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return <Code2 className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      case 'Paintbrush': return <Code2 className="w-5 h-5 text-emerald-400" />;
      case 'Server': return <Server className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5 text-blue-400" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5 text-amber-500" />;
      case 'Box': return <Box className="w-5 h-5 text-cyan-400" />;
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5 text-purple-400 animate-pulse" />;
      case 'Cloud': return <Cloud className="w-5 h-5 text-sky-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  return (
    <section id="skills" className="py-24 bg-neutral-950 text-white relative">
      {/* Background visual cues */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-blue-600/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-8 bg-amber-500" />
              <span className="font-mono text-xs text-amber-500 tracking-wider uppercase">Teknologi & Keahlian</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-sans tracking-tight font-medium" id="skills-heading">
              Keahlian & Bidang Studi
            </h2>
          </div>
          <p className="text-neutral-400 font-sans text-sm max-w-md">
            Arsitektur tumpukan teknologi modern yang saya kuasai secara mendalam serta fokus eksplorasi tren terkini di bidang Informatika.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-neutral-900 pb-6" id="skills-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-mono rounded-lg transition-all duration-300 focus:outline-none border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-neutral-950 border-amber-500 font-semibold'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-850 hover:text-white hover:border-neutral-800'
              }`}
              id={`tab-skill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat === 'All' ? 'Semua Teknologi' : cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          id="skills-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.div
                layout
                key={skill.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`p-6 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                  skill.category === 'Sedang Dipelajari'
                    ? 'bg-neutral-900/40 border-purple-900/30 hover:border-purple-500/30'
                    : 'bg-neutral-900/60 border-neutral-850 hover:border-amber-500/30'
                }`}
                id={`skill-card-${skill.id}`}
              >
                <div>
                  {/* Title & Icon Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg border ${
                        skill.category === 'Sedang Dipelajari'
                          ? 'bg-purple-950/40 border-purple-900 text-purple-400'
                          : 'bg-neutral-950 border-neutral-800 text-amber-500'
                      }`}>
                        {getSkillIcon(skill.iconName)}
                      </div>
                      <div>
                        <h3 className="text-base font-sans font-medium text-white">{skill.name}</h3>
                        <span className={`text-[9px] font-mono tracking-widest uppercase block ${
                          skill.category === 'Sedang Dipelajari' ? 'text-purple-400' : 'text-neutral-500'
                        }`}>
                          {skill.category}
                        </span>
                      </div>
                    </div>

                    {/* Numeric percentage */}
                    <div className="font-mono text-sm font-semibold text-neutral-400">
                      {skill.level}%
                    </div>
                  </div>

                  {/* Description */}
                  {skill.description && (
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans mb-5 font-light">
                      {skill.description}
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 mt-auto">
                  <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-900/60">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        skill.category === 'Sedang Dipelajari'
                          ? 'bg-gradient-to-r from-purple-600 to-purple-400'
                          : 'bg-gradient-to-r from-amber-600 to-amber-400'
                      }`}
                    />
                  </div>
                  {skill.category === 'Sedang Dipelajari' && (
                    <div className="flex items-center gap-1 text-[9px] font-mono text-purple-400 uppercase tracking-wider mt-1">
                      <ArrowRight className="w-2.5 h-2.5 animate-bounce-horizontal" />
                      <span>Fokus Riset & Pembelajaran Mandiri</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
