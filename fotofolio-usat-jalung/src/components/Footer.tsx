import { 
  Code2, Code, Terminal, Laptop, Cpu, Globe, Database, Award, Layers, 
  Smartphone, Settings, Shield, BookOpen, Sparkles,
  Github, Linkedin, Mail, ArrowUp 
} from 'lucide-react';

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

interface FooterProps {
  profile: any;
}

export default function Footer({ profile }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-900 font-sans relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start mb-12">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-white font-mono tracking-wider text-base uppercase">
              <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-amber-500 flex items-center justify-center w-8 h-8">
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
              <span className="font-bold">{profile?.logoBold || 'ALIF'}</span>
              <span className="font-light text-neutral-400">{profile?.logoLight || '.DEV'}</span>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm leading-relaxed font-light">
              "Talk is cheap. Show me the code." — Linus Torvalds. Berkomitmen untuk terus belajar, mengeksplorasi arsitektur cloud, dan merancang perangkat lunak yang berfokus pada solusi dunia nyata.
            </p>
          </div>

          {/* Quick links Column */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-neutral-200 uppercase tracking-wider block font-bold">Menu Portofolio</span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="hover:text-amber-500 transition-colors focus:outline-none cursor-pointer"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('skills')}
                  className="hover:text-amber-500 transition-colors focus:outline-none cursor-pointer"
                >
                  Keahlian & Studi
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('certificates')}
                  className="hover:text-amber-500 transition-colors focus:outline-none cursor-pointer"
                >
                  Sertifikat Kompetensi
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('activities')}
                  className="hover:text-amber-500 transition-colors focus:outline-none cursor-pointer"
                >
                  Dokumentasi Kegiatan
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('personal-photos')}
                  className="hover:text-amber-500 transition-colors focus:outline-none cursor-pointer"
                >
                  Potret & Hobi
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('guestbook')}
                  className="hover:text-amber-500 transition-colors focus:outline-none cursor-pointer"
                >
                  Saran Buku Tamu
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <span className="text-neutral-200 font-mono uppercase tracking-wider block font-bold">Saluran Kolaborasi</span>
            <p className="text-neutral-400 font-light leading-relaxed">
              Membuka peluang riset bersama, kontribusi open source, bimbingan mahasiswa, maupun penawaran kerja magang (internship).
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-500 hover:border-amber-500/30 transition-all duration-300"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-500 hover:border-amber-500/30 transition-all duration-300"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:alif.dewantara@student.uni.ac.id"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-500 hover:border-amber-500/30 transition-all duration-300"
                title="Email Akademis"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & arrow top */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-neutral-600">
          <div>
            <span>© {new Date().getFullYear()} Alif Dewantara. Mahasiswa Teknik Informatika. All rights reserved.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-white transition-colors group focus:outline-none cursor-pointer"
            id="footer-back-to-top"
          >
            <span>KEMBALI KE ATAS</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
