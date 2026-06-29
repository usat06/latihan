import React, { useState } from 'react';
import { Calendar, MapPin, Tag, Compass, Layers, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from '../types';
import { ACTIVITIES_DATA } from '../data';
import { cleanMediaUrl } from '../utils/media';

export default function ActivitiesSection({ activities }: { activities: Activity[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="activities" className="py-24 bg-neutral-950 text-white relative">
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-8 bg-amber-500" />
              <span className="font-mono text-xs text-amber-500 tracking-wider uppercase">Pengalaman & Kegiatan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-sans tracking-tight font-medium" id="activities-heading">
              Foto Kegiatan & Event
            </h2>
          </div>
          <p className="text-neutral-400 font-sans text-sm max-w-md">
            Dokumentasi keterlibatan aktif saya dalam organisasi kampus, kompetisi inovasi teknologi, hingga pengabdian literasi digital.
          </p>
        </div>

        {/* Bento / Grid Layout for Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="activities-grid">
          {activities.map((act, index) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="bg-neutral-900/40 border border-neutral-900 rounded-2xl overflow-hidden hover:border-neutral-800 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              id={`activity-card-${act.id}`}
            >
              {/* Image with overlay tags */}
              <div className="relative aspect-[16/9] overflow-hidden bg-neutral-950">
                <img
                  src={cleanMediaUrl(act.image) || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"}
                  alt={act.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800";
                  }}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-103 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                {/* Corner tags badge */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <div className="bg-neutral-950/80 backdrop-blur-md text-[9px] font-mono text-amber-500 uppercase tracking-widest px-2.5 py-1 rounded border border-neutral-800">
                    Kategori: {(act.tags || [])[0] || 'Event'}
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                <div>
                  {/* Meta stats */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[10px] font-mono text-neutral-500 uppercase mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500/70" />
                      <span>{act.date || '2026'}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="truncate max-w-[180px]">{act.location || 'Indonesia'}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-sans font-medium text-white group-hover:text-amber-400 transition-colors">
                    {act.title || 'Judul Kegiatan'}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-3 font-light">
                    {act.description || 'Tidak ada deskripsi kegiatan.'}
                  </p>
                </div>

                {/* Badges footer */}
                <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-neutral-900/60">
                  {(act.tags || []).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-neutral-950 text-neutral-400 px-2 py-0.5 rounded border border-neutral-850"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
