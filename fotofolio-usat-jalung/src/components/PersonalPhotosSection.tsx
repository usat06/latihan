import React, { useState } from 'react';
import { Camera, Calendar, MapPin, Eye, Info, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PersonalPhoto } from '../types';
import { PERSONAL_PHOTOS_DATA } from '../data';
import { cleanMediaUrl } from '../utils/media';

export default function PersonalPhotosSection({ photos }: { photos: PersonalPhoto[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<PersonalPhoto | null>(null);

  return (
    <section id="personal-photos" className="py-24 bg-neutral-900/40 text-white relative border-y border-neutral-900">
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-8 bg-amber-500" />
              <span className="font-mono text-xs text-amber-500 tracking-wider uppercase">Galeri Pribadi</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-sans tracking-tight font-medium" id="personal-photos-heading">
              Potret & Aktivitas Kreatif
            </h2>
          </div>
          <p className="text-neutral-400 font-sans text-sm max-w-md">
            Sisi kreatif saya di luar dunia coding. Fotografi jalanan, momen berdiskusi, eksplorasi alam, dan gaya hidup penyeimbang aktivitas akademis.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="personal-photos-grid">
          {(photos || []).map((photo) => (
            <motion.div
              key={photo.id}
              whileHover={{ y: -6 }}
              className="group relative bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer shadow-lg"
              onClick={() => setSelectedPhoto(photo)}
              id={`personal-photo-card-${photo.id}`}
            >
              {/* Image */}
              <img
                src={cleanMediaUrl(photo.image) || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"}
                alt={photo.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800";
                }}
                className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-103 transition-all duration-500"
              />

              {/* Gradient Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/30 group-hover:via-neutral-950/10 transition-colors duration-500" />

              {/* Eye hover prompt */}
              <div className="absolute top-4 right-4 bg-neutral-950/80 backdrop-blur-md p-1.5 rounded-full border border-neutral-800 text-neutral-400 group-hover:text-amber-400 transition-colors">
                <Eye className="w-4 h-4" />
              </div>

              {/* Bottom detail summary */}
              <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end">
                <div className="flex items-center gap-1 text-[9px] font-mono text-amber-500 uppercase tracking-widest mb-1.5">
                  <MapPin className="w-3 h-3" />
                  <span>{(photo.location || '').split(',')[0] || 'Studio'}</span>
                </div>
                <h3 className="text-sm font-sans font-medium text-white group-hover:text-amber-400 transition-colors truncate">
                  {photo.title || 'Karya Foto'}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 mt-1">
                  <Camera className="w-3 h-3 text-neutral-600" />
                  <span className="truncate">{photo.cameraInfo || 'Fujifilm X-T5'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox / Exif Detail Overlay modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
              onClick={() => setSelectedPhoto(null)}
              id="personal-photo-lightbox"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-neutral-950 max-w-4xl w-full rounded-2xl border border-neutral-850 overflow-hidden flex flex-col md:flex-row shadow-2xl"
                id="personal-photo-lightbox-content"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/80 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                 {/* Left side: Premium High-Res Image aspect */}
                <div className="md:w-3/5 bg-neutral-950 flex items-center justify-center aspect-square md:aspect-auto max-h-[80vh]">
                  <img
                    src={cleanMediaUrl(selectedPhoto.image) || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"}
                    alt={selectedPhoto.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800";
                    }}
                    className="w-full h-full object-cover md:max-h-[80vh]"
                  />
                </div>

                {/* Right side: Artistic Details / metadata */}
                <div className="p-6 md:p-8 md:w-2/5 flex flex-col justify-between bg-neutral-950 border-t md:border-t-0 md:border-l border-neutral-850">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-mono text-amber-500 uppercase tracking-widest mb-2">
                        <Camera className="w-4 h-4" />
                        <span>Karya Kreatif</span>
                      </div>
                      <h3 className="text-xl font-sans font-medium text-white tracking-tight">
                        {selectedPhoto.title || 'Karya Foto'}
                      </h3>
                      <p className="text-xs text-neutral-400 font-sans leading-relaxed mt-3 font-light">
                        {selectedPhoto.description || 'Tidak ada deskripsi tambahan.'}
                      </p>
                    </div>

                    {/* Metadata items list */}
                    <div className="space-y-3.5 pt-6 border-t border-neutral-900">
                      <div className="flex items-center gap-3 text-xs font-sans">
                        <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
                        <div>
                          <span className="text-[10px] text-neutral-600 uppercase block font-mono">Lokasi Pengambilan</span>
                          <span className="text-neutral-300 font-light">{selectedPhoto.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-sans">
                        <Calendar className="w-4 h-4 text-neutral-500 shrink-0" />
                        <div>
                          <span className="text-[10px] text-neutral-600 uppercase block font-mono">Tanggal</span>
                          <span className="text-neutral-300 font-light">{selectedPhoto.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-sans">
                        <Info className="w-4 h-4 text-neutral-500 shrink-0" />
                        <div>
                          <span className="text-[10px] text-neutral-600 uppercase block font-mono">Spesifikasi Kamera (EXIF)</span>
                          <span className="text-amber-500/95 font-mono text-xs font-medium">{selectedPhoto.cameraInfo}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-neutral-900 flex items-center gap-2 text-[10px] font-mono text-neutral-600">
                    <Zap className="w-3 h-3" />
                    <span>Dibidik menggunakan kamera analog/digital premium.</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
