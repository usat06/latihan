import React, { useState, useEffect } from 'react';
import { Terminal, Code2, Heart, Award, ArrowRight, ChevronDown, Sparkles, Database, BookOpen, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import SkillsSection from './components/SkillsSection';
import CertificatesSection from './components/CertificatesSection';
import ActivitiesSection from './components/ActivitiesSection';
import PersonalPhotosSection from './components/PersonalPhotosSection';
import Guestbook from './components/Guestbook';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { DEVELOPER_PROFILE, SKILLS_DATA, CERTIFICATES_DATA, ACTIVITIES_DATA, PERSONAL_PHOTOS_DATA } from './data';
import { cleanMediaUrl } from './utils/media';

function hexToRgb(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '245, 158, 11'; // fallback amber-500
}

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Dynamic portfolio states initialized from localStorage or seed fallback
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('ALIF_INFORMATIKA_PROFILE');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force-update the avatar if it does not contain the newly requested Google Drive file ID
        if (!parsed.avatar || !parsed.avatar.includes("1FsC4u0FJS_Pppgl3kNO_5vZXIjnmo--G")) {
          parsed.avatar = DEVELOPER_PROFILE.avatar;
          localStorage.setItem('ALIF_INFORMATIKA_PROFILE', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {}
    }
    return DEVELOPER_PROFILE;
  });

  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('ALIF_INFORMATIKA_SKILLS');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SKILLS_DATA;
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('ALIF_INFORMATIKA_CERTIFICATES');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return CERTIFICATES_DATA;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('ALIF_INFORMATIKA_ACTIVITIES');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ACTIVITIES_DATA;
  });

  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('ALIF_INFORMATIKA_PHOTOS');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return PERSONAL_PHOTOS_DATA;
  });

  // Fetch portfolio data from server on mount & pre-seed if empty
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            if (data.status === 'empty') {
              // Pre-seed server with current state if server is completely empty
              syncWithServer({
                profile,
                skills,
                certificates,
                activities,
                photos
              });
            } else {
              if (data.profile) {
                setProfile(data.profile);
                localStorage.setItem('ALIF_INFORMATIKA_PROFILE', JSON.stringify(data.profile));
              }
              if (data.skills) {
                setSkills(data.skills);
                localStorage.setItem('ALIF_INFORMATIKA_SKILLS', JSON.stringify(data.skills));
              }
              if (data.certificates) {
                setCertificates(data.certificates);
                localStorage.setItem('ALIF_INFORMATIKA_CERTIFICATES', JSON.stringify(data.certificates));
              }
              if (data.activities) {
                setActivities(data.activities);
                localStorage.setItem('ALIF_INFORMATIKA_ACTIVITIES', JSON.stringify(data.activities));
              }
              if (data.photos) {
                setPhotos(data.photos);
                localStorage.setItem('ALIF_INFORMATIKA_PHOTOS', JSON.stringify(data.photos));
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to load portfolio from server:', err);
      }
    };
    fetchPortfolio();
  }, []);

  // Poll portfolio data from server every 4 seconds to instantly sync edits to all users in real-time
  useEffect(() => {
    const pollPortfolio = async () => {
      // Do not poll or overwrite if the Admin Panel is open to prevent losing unsaved/active typing focus
      if (isAdminOpen) return;

      try {
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const data = await response.json();
          if (data && data.status !== 'empty') {
            if (data.profile) {
              setProfile((prev: any) => {
                if (JSON.stringify(prev) !== JSON.stringify(data.profile)) {
                  localStorage.setItem('ALIF_INFORMATIKA_PROFILE', JSON.stringify(data.profile));
                  return data.profile;
                }
                return prev;
              });
            }
            if (data.skills) {
              setSkills((prev: any) => {
                if (JSON.stringify(prev) !== JSON.stringify(data.skills)) {
                  localStorage.setItem('ALIF_INFORMATIKA_SKILLS', JSON.stringify(data.skills));
                  return data.skills;
                }
                return prev;
              });
            }
            if (data.certificates) {
              setCertificates((prev: any) => {
                if (JSON.stringify(prev) !== JSON.stringify(data.certificates)) {
                  localStorage.setItem('ALIF_INFORMATIKA_CERTIFICATES', JSON.stringify(data.certificates));
                  return data.certificates;
                }
                return prev;
              });
            }
            if (data.activities) {
              setActivities((prev: any) => {
                if (JSON.stringify(prev) !== JSON.stringify(data.activities)) {
                  localStorage.setItem('ALIF_INFORMATIKA_ACTIVITIES', JSON.stringify(data.activities));
                  return data.activities;
                }
                return prev;
              });
            }
            if (data.photos) {
              setPhotos((prev: any) => {
                if (JSON.stringify(prev) !== JSON.stringify(data.photos)) {
                  localStorage.setItem('ALIF_INFORMATIKA_PHOTOS', JSON.stringify(data.photos));
                  return data.photos;
                }
                return prev;
              });
            }
          }
        }
      } catch (err) {
        console.error('Failed to poll portfolio from server:', err);
      }
    };

    const interval = setInterval(pollPortfolio, 4000);
    return () => clearInterval(interval);
  }, [isAdminOpen]);

  // Helper to sync state changes to backend server instantly
  const syncWithServer = async (payload: any) => {
    try {
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Failed to sync changes with server:', err);
    }
  };

  const setProfileWithSync = (val: any) => {
    setProfile((prev: any) => {
      const updated = typeof val === 'function' ? val(prev) : val;
      setTimeout(() => {
        syncWithServer({ profile: updated });
        localStorage.setItem('ALIF_INFORMATIKA_PROFILE', JSON.stringify(updated));
      }, 0);
      return updated;
    });
  };

  const setSkillsWithSync = (val: any) => {
    setSkills((prev: any) => {
      const updated = typeof val === 'function' ? val(prev) : val;
      setTimeout(() => {
        syncWithServer({ skills: updated });
        localStorage.setItem('ALIF_INFORMATIKA_SKILLS', JSON.stringify(updated));
      }, 0);
      return updated;
    });
  };

  const setCertificatesWithSync = (val: any) => {
    setCertificates((prev: any) => {
      const updated = typeof val === 'function' ? val(prev) : val;
      setTimeout(() => {
        syncWithServer({ certificates: updated });
        localStorage.setItem('ALIF_INFORMATIKA_CERTIFICATES', JSON.stringify(updated));
      }, 0);
      return updated;
    });
  };

  const setActivitiesWithSync = (val: any) => {
    setActivities((prev: any) => {
      const updated = typeof val === 'function' ? val(prev) : val;
      setTimeout(() => {
        syncWithServer({ activities: updated });
        localStorage.setItem('ALIF_INFORMATIKA_ACTIVITIES', JSON.stringify(updated));
      }, 0);
      return updated;
    });
  };

  const setPhotosWithSync = (val: any) => {
    setPhotos((prev: any) => {
      const updated = typeof val === 'function' ? val(prev) : val;
      setTimeout(() => {
        syncWithServer({ photos: updated });
        localStorage.setItem('ALIF_INFORMATIKA_PHOTOS', JSON.stringify(updated));
      }, 0);
      return updated;
    });
  };

  // Intersection Observer for scroll tracking to keep header synced
  useEffect(() => {
    const sections = ['home', 'skills', 'certificates', 'activities', 'personal-photos', 'guestbook'];
    const observers = sections.map((sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId);
          }
        },
        {
          rootMargin: '-30% 0px -60% 0px' // Trigger active state when section is centered
        }
      );
      observer.observe(element);
      return { observer, element };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.element);
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const customAccentColor = profile.accentColor || '#f59e0b';
  const customBgColor = profile.backgroundColor || '#050505';
  const customCardColor = profile.cardColor || '#121212';
  const accentRgb = hexToRgb(customAccentColor);
  const bgRgb = hexToRgb(customBgColor);
  const bgOpacityFloat = profile.heroBackgroundOpacity !== undefined ? Number(profile.heroBackgroundOpacity) / 100 : 0.08;
  const showTechGrid = profile.showTechGrid !== false;
  const showAmbientGlow = profile.showAmbientGlow !== false;

  return (
    <div className="bg-neutral-950 min-h-screen text-white overflow-x-hidden selection:bg-amber-500 selection:text-neutral-950 font-sans">
      {/* Dynamic Style overrides for real-time customizable colors and backgrounds */}
      <style>{`
        :root {
          --accent-color: ${customAccentColor};
          --accent-rgb: ${accentRgb};
          --bg-color: ${customBgColor};
          --card-color: ${customCardColor};
        }
        
        /* Customize body & backgrounds */
        body, .bg-neutral-950 {
          background-color: var(--bg-color) !important;
        }
        
        #app-header.bg-neutral-950\\/90 {
          background-color: rgba(${bgRgb}, 0.9) !important;
        }
        
        /* Overrides for dynamic card backgrounds */
        .bg-neutral-900, .bg-neutral-900\\/40, .bg-neutral-900\\/50, .bg-neutral-900\\/80, .bg-neutral-900\\/90 {
          background-color: var(--card-color) !important;
        }
        
        /* Primary accent overrides for text color */
        .text-amber-500, .group-hover\\:text-amber-400:hover, .hover\\:text-amber-400:hover {
          color: var(--accent-color) !important;
        }
        
        /* Primary accent overrides for background color */
        .bg-amber-500, .hover\\:bg-amber-400:hover, .hover\\:bg-amber-500:hover {
          background-color: var(--accent-color) !important;
        }
        
        .bg-amber-500\\/5 {
          background-color: rgba(var(--accent-rgb), 0.05) !important;
        }
        
        .bg-amber-500\\/10 {
          background-color: rgba(var(--accent-rgb), 0.1) !important;
        }
        
        .bg-amber-500\\/20 {
          background-color: rgba(var(--accent-rgb), 0.2) !important;
        }
        
        /* Selection highlight color */
        ::selection, .selection\\:bg-amber-500::selection {
          background-color: var(--accent-color) !important;
          color: #050505 !important;
        }
        
        /* Primary accent overrides for border color */
        .border-amber-500, .border-amber-500\\/20, .border-amber-500\\/30, .border-amber-500\\/40, .group-hover\\:border-amber-500\\/30:hover, .focus\\:border-amber-500\\/40:focus {
          border-color: var(--accent-color) !important;
        }
        
        /* Specific elements */
        .border-neutral-800, .border-neutral-900, .border-neutral-850 {
          border-color: rgba(var(--accent-rgb), 0.15) !important;
        }
      `}</style>

      {/* Sticky Navigation Header */}
      <Header activeSection={activeSection} onOpenAdmin={() => setIsAdminOpen(true)} profile={profile} />

      {/* Hero / Beranda Section (Displays profile photo, name below it, stats and tags with a premium technical background) */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center pt-24 pb-16 md:py-0 overflow-hidden bg-neutral-950"
      >
        {/* Cinematic Technical Background Image with ambient overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <img 
            src={cleanMediaUrl(profile.heroBackground) || "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=1920"} 
            alt="Technical Background Workspace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover mix-blend-screen scale-105 filter blur-[1px] transition-all duration-1000"
            style={{ opacity: bgOpacityFloat }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/80 to-neutral-950" style={{ backgroundImage: `linear-gradient(to bottom, transparent, var(--bg-color))` }} />
        </div>

        {/* Background ambient lighting effects */}
        {showAmbientGlow && (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full filter blur-3xl pointer-events-none" />
          </>
        )}
        
        {showTechGrid && (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full flex flex-col items-center">
          
          {/* Main Hero Container with Profile layout */}
          <div className="w-full flex flex-col items-center text-center space-y-6">
            
            {/* Owner Image with high tech styling borders */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
              className="relative group"
            >
              {/* Outer decorative rings */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 to-purple-600 rounded-full blur opacity-45 group-hover:opacity-75 transition-opacity duration-500" />
              
              {/* Corner tech indicators */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400 z-10 rounded-tl" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-purple-500 z-10 rounded-br" />

              {/* Profile Image Wrap */}
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-neutral-900 bg-neutral-900">
                <img
                  src={cleanMediaUrl(profile.avatar)}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Verified student status badge */}
              <div className="absolute bottom-1 right-2 bg-neutral-950/95 text-amber-500 border border-neutral-800 p-1.5 rounded-full shadow-lg" title="Teknik Informatika Terverifikasi">
                <Code2 className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Name below the Photo & Academic Info */}
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center gap-1.5"
              >
                <span className="h-px w-4 bg-amber-500/70" />
                <span className="font-mono text-xs text-amber-500 uppercase tracking-widest">{profile.university}</span>
                <span className="h-px w-4 bg-amber-500/70" />
              </motion.div>

              {/* Full Name */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-sans tracking-tight font-bold text-white uppercase"
              >
                {profile.name}
              </motion.h1>

              {/* Specialization Text */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg font-mono text-neutral-400 font-light max-w-xl mx-auto"
              >
                {profile.specialization}
              </motion.p>
            </div>

            {/* Structured Biography summary */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-2xl text-xs md:text-sm text-neutral-400 font-sans font-light leading-relaxed text-center"
            >
              {profile.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-2"
              id="hero-ctas"
            >
              <button
                onClick={() => scrollToSection('guestbook')}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-xs uppercase font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-amber-500/15 focus:outline-none hover:scale-103 cursor-pointer"
              >
                <span>Hubungi & Kirim Sapaan</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </motion.div>

            {/* Dynamic statistics block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-neutral-900 max-w-3xl w-full text-center"
              id="hero-stats"
            >
              {profile.stats.map((stat: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <span className="block text-2xl md:text-3xl font-mono font-bold text-amber-500">{stat.value}</span>
                  <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </motion.div>

          </div>

          {/* Floating Down Indicator */}
          <button
            onClick={() => scrollToSection('skills')}
            className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-neutral-600 hover:text-white transition-colors focus:outline-none cursor-pointer"
            id="hero-scroll-indicator"
          >
            <span className="font-mono text-[9px] uppercase tracking-widest">GULIR KE KEAHLIAN</span>
            <ChevronDown className="w-4 h-4 text-amber-500 animate-bounce" />
          </button>

        </div>
      </section>

      {/* Skills Section */}
      <SkillsSection skills={skills} />

      {/* Certificates Section */}
      <CertificatesSection certificates={certificates} />

      {/* Activities Section */}
      <ActivitiesSection activities={activities} />

      {/* Personal Gallery Section */}
      <PersonalPhotosSection photos={photos} />

      {/* Guestbook Section */}
      <Guestbook />

      {/* Footer Section */}
      <Footer profile={profile} />

      {/* Interactive Admin Panel overlay */}
      <AdminPanel
        profile={profile}
        setProfile={setProfileWithSync}
        skills={skills}
        setSkills={setSkillsWithSync}
        certificates={certificates}
        setCertificates={setCertificatesWithSync}
        activities={activities}
        setActivities={setActivitiesWithSync}
        photos={photos}
        setPhotos={setPhotosWithSync}
        isOpen={isAdminOpen}
        setIsOpen={setIsAdminOpen}
      />
    </div>
  );
}
