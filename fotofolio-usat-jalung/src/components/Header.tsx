import { useState, useEffect } from 'react';
import { 
  Code2, Code, Terminal, Laptop, Cpu, Globe, Database, Award, Layers, 
  Smartphone, Settings, Shield, BookOpen, Sparkles,
  Menu, X, Instagram, Mail, Github, Linkedin 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Helper to render selected logo icon dynamically
const getLogoIcon = (iconName: string) => {
  switch (iconName) {
    case 'Code': return <Code className="w-5 h-5" />;
    case 'Terminal': return <Terminal className="w-5 h-5" />;
    case 'Laptop': return <Laptop className="w-5 h-5" />;
    case 'Cpu': return <Cpu className="w-5 h-5" />;
    case 'Globe': return <Globe className="w-5 h-5" />;
    case 'Database': return <Database className="w-5 h-5" />;
    case 'Award': return <Award className="w-5 h-5" />;
    case 'Layers': return <Layers className="w-5 h-5" />;
    case 'Smartphone': return <Smartphone className="w-5 h-5" />;
    case 'Settings': return <Settings className="w-5 h-5" />;
    case 'Shield': return <Shield className="w-5 h-5" />;
    case 'BookOpen': return <BookOpen className="w-5 h-5" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5" />;
    case 'Code2':
    default:
      return <Code2 className="w-5 h-5" />;
  }
};

interface HeaderProps {
  activeSection: string;
  onOpenAdmin: () => void;
  profile: any;
}

export default function Header({ activeSection, onOpenAdmin, profile }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset logo clicks after 3 seconds of inactivity
  useEffect(() => {
    if (logoClicks > 0) {
      const timer = setTimeout(() => {
        setLogoClicks(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [logoClicks]);

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'skills', label: 'Keahlian' },
    { id: 'certificates', label: 'Sertifikat' },
    { id: 'activities', label: 'Kegiatan' },
    { id: 'personal-photos', label: 'Galeri Foto' },
    { id: 'guestbook', label: 'Buku Tamu' }
  ];

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of header
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

  const handleLogoClick = () => {
    scrollToSection('home');
    const nextClicks = logoClicks + 1;
    if (nextClicks >= 5) {
      onOpenAdmin();
      setLogoClicks(0);
    } else {
      setLogoClicks(nextClicks);
    }
  };

  return (
    <header
      id="app-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo (Acting as Hidden Admin Trigger: Click 5 times to open) */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 text-white font-mono tracking-wider text-base uppercase group focus:outline-none"
          id="btn-logo"
        >
          <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-amber-500 group-hover:text-amber-400 group-hover:border-amber-500/30 transition-all duration-300 flex items-center justify-center w-8 h-8">
            {profile?.logoType === 'image' && profile?.logoImage ? (
              <img
                src={profile.logoImage}
                className="w-5 h-5 object-contain rounded-xs"
                alt="Logo"
                referrerPolicy="no-referrer"
              />
            ) : (
              getLogoIcon(profile?.logoIcon || 'Code2')
            )}
          </div>
          <span className="font-bold tracking-tight text-white">{profile?.logoBold || 'ALIF'}</span>
          <span className="font-light text-neutral-400">{profile?.logoLight || '.DEV'}</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs tracking-wider" id="nav-desktop">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`transition-colors duration-300 uppercase focus:outline-none relative py-1 ${
                activeSection === item.id
                  ? 'text-amber-400 font-medium'
                  : 'text-neutral-400 hover:text-white'
              }`}
              id={`nav-item-${item.id}`}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Social / Contact Right Actions */}
        <div className="hidden md:flex items-center gap-3" id="nav-socials">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors p-2 hover:bg-neutral-900 rounded"
            id="social-github"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors p-2 hover:bg-neutral-900 rounded"
            id="social-linkedin"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <button
            onClick={() => scrollToSection('guestbook')}
            className="flex items-center gap-2 border border-neutral-800 hover:border-amber-500/50 bg-neutral-950/60 hover:bg-neutral-900/50 text-white font-mono text-xs tracking-wider uppercase px-4 py-2 rounded transition-all duration-300 focus:outline-none"
            id="social-contact"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-500" />
            <span>Kirim Pesan</span>
          </button>
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 hover:bg-neutral-900 rounded focus:outline-none"
            id="btn-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-neutral-950 border-b border-neutral-900 overflow-hidden"
            id="mobile-drawer"
          >
            <div className="px-6 py-6 flex flex-col gap-4 font-mono text-xs tracking-wider">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left py-2 border-b border-neutral-900 uppercase focus:outline-none ${
                    activeSection === item.id
                      ? 'text-amber-400 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  id={`mobile-nav-item-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center justify-between pt-4">
                <div className="flex gap-2">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white p-2 bg-neutral-900 rounded"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white p-2 bg-neutral-900 rounded"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
                <button
                  onClick={() => scrollToSection('guestbook')}
                  className="flex items-center gap-2 border border-neutral-800 bg-neutral-900 text-white uppercase px-4 py-2 rounded"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kirim Pesan</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
