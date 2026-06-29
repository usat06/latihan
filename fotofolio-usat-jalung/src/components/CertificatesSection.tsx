import React, { useState } from 'react';
import { Award, Calendar, Link, Check, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Certificate } from '../types';
import { CERTIFICATES_DATA } from '../data';
import { cleanMediaUrl } from '../utils/media';

export default function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="py-24 bg-neutral-900/30 text-white relative border-y border-neutral-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.015),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-8 bg-amber-500" />
              <span className="font-mono text-xs text-amber-500 tracking-wider uppercase">Sertifikasi & Kredensial</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-sans tracking-tight font-medium" id="certificates-heading">
              Sertifikat yang Diraih
            </h2>
          </div>
          <p className="text-neutral-400 font-sans text-sm max-w-md">
            Bukti formal kompetensi, pelatihan, dan kursus profesional berskala nasional maupun internasional yang telah saya selesaikan.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="certificates-grid">
          {certificates.map((cert) => (
            <motion.div
              whileHover={{ y: -4 }}
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="group cursor-pointer bg-neutral-950 border border-neutral-850 rounded-2xl overflow-hidden flex flex-col sm:flex-row h-full hover:border-amber-500/30 transition-all duration-300 shadow-md"
              id={`cert-card-${cert.id}`}
            >
              {/* Left Side: Mock Certificate Graphic / Image cover */}
              <div className="sm:w-2/5 relative overflow-hidden bg-neutral-900 aspect-video sm:aspect-auto">
                <img
                  src={cleanMediaUrl(cert.image) || "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800"}
                  alt={cert.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800";
                  }}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-neutral-950 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-md p-1.5 rounded border border-neutral-800 text-amber-500">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              {/* Right Side: Information */}
              <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                    <span>{cert.issuer || 'Kredensial'}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{cert.date || '2026'}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-sans font-medium text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    {cert.title || 'Sertifikat Kompetensi'}
                  </h3>
                </div>

                {/* Tags preview */}
                <div className="mt-4 pt-4 border-t border-neutral-900/60">
                  <div className="flex flex-wrap gap-1.5">
                    {(cert.skillsLearned || []).slice(0, 2).map((skill, index) => (
                      <span
                        key={index}
                        className="text-[10px] font-mono bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded border border-neutral-850"
                      >
                        {skill}
                      </span>
                    ))}
                    {(cert.skillsLearned || []).length > 2 && (
                      <span className="text-[10px] font-mono text-amber-500/80 px-1.5 py-0.5">
                        +{(cert.skillsLearned || []).length - 2} Lainnya
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal Lightbox for Full Certificate View */}
        <AnimatePresence>
          {selectedCert && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedCert(null)}
              id="cert-lightbox"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-neutral-950 w-full max-w-2xl rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl p-6 md:p-8"
                id="cert-lightbox-content"
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Issuer & Date Row */}
                <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-widest mb-3">
                  <Award className="w-4 h-4" />
                  <span>{selectedCert.issuer}</span>
                  <span className="text-neutral-700">•</span>
                  <span>{selectedCert.date}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-sans font-semibold text-white tracking-tight leading-tight">
                  {selectedCert.title}
                </h3>

                {/* Photo Badge preview */}
                <div className="my-6 aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-neutral-850">
                  <img
                    src={cleanMediaUrl(selectedCert.image) || "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800"}
                    alt={selectedCert.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Skills learned breakdown */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">Topik & Keahlian yang Dipelajari:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(selectedCert.skillsLearned || []).map((skill, index) => (
                      <div key={index} className="flex items-center gap-2 bg-neutral-900/50 border border-neutral-900 p-2.5 rounded-lg">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-neutral-200">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Credentials verification buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-neutral-900 font-mono text-xs text-neutral-500">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-600 uppercase">ID Kredensial</span>
                    <span className="text-neutral-300 font-mono text-xs">{selectedCert.credentialId}</span>
                  </div>

                  <a
                    href={selectedCert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                  >
                    <span>Verifikasi Sertifikat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
