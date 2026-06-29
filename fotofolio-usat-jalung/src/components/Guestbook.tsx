import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Calendar, BookOpen, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GuestbookEntry } from '../types';
import { GUESTBOOK_SEED } from '../data';

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('Teman Kuliah');
  const [successMessage, setSuccessMessage] = useState('');

  // Load from Server on mount (with LocalStorage/Seed fallback)
  useEffect(() => {
    const loadGuestbook = async () => {
      try {
        const res = await fetch('/api/guestbook');
        if (res.ok) {
          const data = await res.json();
          if (data && data.status !== 'empty' && Array.isArray(data)) {
            setEntries(data);
            localStorage.setItem('ALIF_INFORMATIKA_GUESTBOOK', JSON.stringify(data));
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch guestbook from server:', err);
      }

      // Fallback
      const saved = localStorage.getItem('ALIF_INFORMATIKA_GUESTBOOK');
      if (saved) {
        try {
          setEntries(JSON.parse(saved));
        } catch (e) {
          setEntries(GUESTBOOK_SEED);
        }
      } else {
        setEntries(GUESTBOOK_SEED);
        localStorage.setItem('ALIF_INFORMATIKA_GUESTBOOK', JSON.stringify(GUESTBOOK_SEED));
      }
    };

    loadGuestbook();
  }, []);

  // Poll guestbook entries every 4 seconds for instant real-time synchronization
  useEffect(() => {
    const pollGuestbook = async () => {
      try {
        const res = await fetch('/api/guestbook');
        if (res.ok) {
          const data = await res.json();
          if (data && data.status !== 'empty' && Array.isArray(data)) {
            setEntries((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(data)) {
                localStorage.setItem('ALIF_INFORMATIKA_GUESTBOOK', JSON.stringify(data));
                return data;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.error('Failed to poll guestbook:', err);
      }
    };

    const interval = setInterval(pollGuestbook, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newEntry: GuestbookEntry = {
      id: `g-user-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      role: role,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('ALIF_INFORMATIKA_GUESTBOOK', JSON.stringify(updated));

    // Persist to the server
    try {
      await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error('Failed to save guestbook to server:', err);
    }

    // Reset Form
    setName('');
    setMessage('');
    setRole('Teman Kuliah');
    setSuccessMessage('Komentar Anda berhasil ditambahkan ke buku tamu!');

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <section id="guestbook" className="py-24 bg-neutral-950 text-white relative border-t border-neutral-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.02),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-8 bg-amber-500" />
              <span className="font-mono text-xs text-amber-500 tracking-wider uppercase">Buku Tamu & Saran</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-sans tracking-tight font-medium" id="guestbook-heading">
              Sapaan & Rekomendasi
            </h2>
          </div>
          <p className="text-neutral-400 font-sans text-sm max-w-md">
            Hubungi atau tinggalkan kesan pesan Anda! Sangat terbuka untuk saran teknis, rekomendasi riset, atau ajakan kolaborasi proyek.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Submit Guestbook Entry Form (Col 5) */}
          <div className="lg:col-span-5 bg-neutral-900/40 border border-neutral-900 p-6 md:p-8 rounded-2xl shadow-xl" id="guestbook-form-box">
            <div className="flex items-center gap-1.5 mb-4 text-xs font-mono uppercase tracking-wider text-neutral-300">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Tulis Pesan Buku Tamu</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" id="form-guestbook">
              {/* Name */}
              <div>
                <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Sarah Azhari"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 text-xs px-3 py-2.5 rounded text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500/40 transition-colors"
                  required
                />
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Status Hubungan</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-850 text-xs px-2.5 py-2.5 rounded text-neutral-300 focus:outline-none focus:border-amber-500/40 font-sans transition-colors"
                >
                  <option value="Dosen Pembimbing">Dosen / Tenaga Pengajar</option>
                  <option value="Rekan Mahasiswa">Teman Kuliah / Mahasiswa</option>
                  <option value="Perekrut / HR">Perekrut / HR Tech</option>
                  <option value="Rekan Satu Tim">Rekan Satu Tim Hackathon</option>
                  <option value="Pengunjung Umum">Pengunjung Umum</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Pesan / Masukan</label>
                <textarea
                  placeholder="Ketik pesan Anda di sini, misalnya masukan terhadap website portfolio, tawaran magang, atau sekedar menyapa..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-neutral-950 border border-neutral-850 text-xs px-3 py-2.5 rounded text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500/40 resize-none transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-xs uppercase font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan Buku Tamu</span>
              </button>
            </form>

            {successMessage && (
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 text-center font-sans flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Right Side: Overall Testimonials Feed (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between bg-neutral-900/30 border border-neutral-900 px-6 py-4 rounded-xl shadow-md">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <span className="font-mono text-xs text-neutral-300">Pesan yang Diterima</span>
              </div>
              <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{entries.length} Sapaan</span>
            </div>

            {/* Testimonials List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2" id="guestbook-feed">
              <AnimatePresence mode="popLayout">
                {entries.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-neutral-900/60 rounded-xl p-5 border border-neutral-850 flex flex-col justify-between hover:border-neutral-700 transition-colors duration-300"
                  >
                    <div>
                      {/* Name, category, and status */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 text-amber-500 flex items-center justify-center text-xs font-bold font-mono">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-neutral-100">{item.name}</h4>
                            {item.role && (
                              <span className="text-[9px] font-mono text-neutral-400 bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded mt-0.5 inline-block">
                                {item.role}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Date badge */}
                        <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                          <Calendar className="w-3 h-3 text-neutral-600" />
                          <span>{item.date}</span>
                        </div>
                      </div>

                      {/* Content Message */}
                      <p className="text-xs text-neutral-300 font-sans leading-relaxed pl-10 font-light">
                        "{item.message}"
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
