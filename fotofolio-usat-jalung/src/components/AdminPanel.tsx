import React, { useState } from 'react';
import { 
  X, Lock, Unlock, Settings, Edit3, Trash2, Plus, Save, Download, Upload, 
  Check, AlertCircle, Eye, EyeOff, User, Award, Briefcase, Camera, Code2, Database,
  Loader2, FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Skill, Certificate, Activity, PersonalPhoto } from '../types';
import { cleanMediaUrl } from '../utils/media';

interface AdminPanelProps {
  profile: any;
  setProfile: (p: any) => void;
  skills: Skill[];
  setSkills: (s: Skill[]) => void;
  certificates: Certificate[];
  setCertificates: (c: Certificate[]) => void;
  activities: Activity[];
  setActivities: (a: Activity[]) => void;
  photos: PersonalPhoto[];
  setPhotos: (p: PersonalPhoto[]) => void;
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}

export default function AdminPanel({
  profile,
  setProfile,
  skills,
  setSkills,
  certificates,
  setCertificates,
  activities,
  setActivities,
  photos,
  setPhotos,
  isOpen,
  setIsOpen
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'certificates' | 'activities' | 'photos' | 'backup'>('profile');
  
  // Status feedback
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Form states
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<string | null>(null);

  // Form data states
  const [skillForm, setSkillForm] = useState<Partial<Skill>>({ name: '', level: 80, category: 'Frontend', iconName: 'Code2', description: '' });
  const [certForm, setCertForm] = useState<Partial<Certificate>>({ title: '', issuer: '', date: '', credentialId: '', credentialUrl: '', image: '', skillsLearned: [] });
  const [activityForm, setActivityForm] = useState<Partial<Activity>>({ title: '', date: '', location: '', description: '', image: '', tags: [] });
  const [photoForm, setPhotoForm] = useState<Partial<PersonalPhoto>>({ title: '', description: '', location: '', image: '', cameraInfo: '', date: '' });
  
  // Helper for lists comma strings
  const [skillsLearnedText, setSkillsLearnedText] = useState('');
  const [tagsText, setTagsText] = useState('');

  // Google Drive folder import states
  const [driveFolderUrl, setDriveFolderUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStats, setImportStats] = useState<{ count: number } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '#<=1qaz12e?') {
      setIsAuthenticated(true);
      setErrorMsg('');
      setPasswordInput('');
    } else {
      setErrorMsg('Sandi admin salah! Silakan coba lagi.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsOpen(false);
  };

  const triggerStatus = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // --- PROFILE FUNCTIONS ---
  const handleProfileChange = (field: string, value: any) => {
    let finalValue = value;
    if (field === 'avatar' || field === 'image' || field === 'heroBackground' || field === 'logoImage') {
      finalValue = cleanMediaUrl(value);
    }
    const updated = { ...profile, [field]: finalValue };
    setProfile(updated);
    localStorage.setItem('ALIF_INFORMATIKA_PROFILE', JSON.stringify(updated));
    triggerStatus('Profil berhasil diperbarui!');
  };

  const handleStatChange = (index: number, field: 'label' | 'value', value: string) => {
    const updatedStats = [...profile.stats];
    updatedStats[index] = { ...updatedStats[index], [field]: value };
    const updated = { ...profile, stats: updatedStats };
    setProfile(updated);
    localStorage.setItem('ALIF_INFORMATIKA_PROFILE', JSON.stringify(updated));
    triggerStatus('Statistik berhasil diperbarui!');
  };

  // --- SKILL FUNCTIONS ---
  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name) return;

    let updated: Skill[];
    if (editingType === 'skill' && editingIndex !== null) {
      updated = [...skills];
      updated[editingIndex] = { ...skills[editingIndex], ...skillForm } as Skill;
    } else {
      const newSkill: Skill = {
        id: `s-custom-${Date.now()}`,
        name: skillForm.name || '',
        level: Number(skillForm.level) || 50,
        category: skillForm.category || 'Frontend',
        iconName: skillForm.iconName || 'Code2',
        description: skillForm.description || ''
      };
      updated = [...skills, newSkill];
    }

    setSkills(updated);
    localStorage.setItem('ALIF_INFORMATIKA_SKILLS', JSON.stringify(updated));
    setSkillForm({ name: '', level: 80, category: 'Frontend', iconName: 'Code2', description: '' });
    setEditingIndex(null);
    setEditingType(null);
    triggerStatus('Keahlian berhasil disimpan!');
  };

  const handleDeleteSkill = (index: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus keahlian ini?')) {
      const updated = skills.filter((_, i) => i !== index);
      setSkills(updated);
      localStorage.setItem('ALIF_INFORMATIKA_SKILLS', JSON.stringify(updated));
      triggerStatus('Keahlian berhasil dihapus!');
    }
  };

  // --- CERTIFICATE FUNCTIONS ---
  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) return;

    const parsedSkills = skillsLearnedText.split(',').map(s => s.trim()).filter(Boolean);
    const cleanedImage = cleanMediaUrl(certForm.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800');
    const finalForm = { ...certForm, image: cleanedImage, skillsLearned: parsedSkills };

    let updated: Certificate[];
    if (editingType === 'certificate' && editingIndex !== null) {
      updated = [...certificates];
      updated[editingIndex] = { ...certificates[editingIndex], ...finalForm } as Certificate;
    } else {
      const newCert: Certificate = {
        id: `cert-custom-${Date.now()}`,
        title: certForm.title || '',
        issuer: certForm.issuer || '',
        date: certForm.date || new Date().toISOString().split('T')[0],
        credentialId: certForm.credentialId || '',
        credentialUrl: certForm.credentialUrl || '',
        image: cleanedImage,
        skillsLearned: parsedSkills
      };
      updated = [...certificates, newCert];
    }

    setCertificates(updated);
    localStorage.setItem('ALIF_INFORMATIKA_CERTIFICATES', JSON.stringify(updated));
    setCertForm({ title: '', issuer: '', date: '', credentialId: '', credentialUrl: '', image: '', skillsLearned: [] });
    setSkillsLearnedText('');
    setEditingIndex(null);
    setEditingType(null);
    triggerStatus('Sertifikat berhasil disimpan!');
  };

  const handleDeleteCertificate = (index: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) {
      const updated = certificates.filter((_, i) => i !== index);
      setCertificates(updated);
      localStorage.setItem('ALIF_INFORMATIKA_CERTIFICATES', JSON.stringify(updated));
      triggerStatus('Sertifikat berhasil dihapus!');
    }
  };

  // --- ACTIVITY FUNCTIONS ---
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title || !activityForm.location) return;

    const parsedTags = tagsText.split(',').map(t => t.trim()).filter(Boolean);
    const cleanedImage = cleanMediaUrl(activityForm.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800');
    const finalForm = { ...activityForm, image: cleanedImage, tags: parsedTags };

    let updated: Activity[];
    if (editingType === 'activity' && editingIndex !== null) {
      updated = [...activities];
      updated[editingIndex] = { ...activities[editingIndex], ...finalForm } as Activity;
    } else {
      const newAct: Activity = {
        id: `act-custom-${Date.now()}`,
        title: activityForm.title || '',
        date: activityForm.date || new Date().toISOString().split('T')[0],
        location: activityForm.location || '',
        description: activityForm.description || '',
        image: cleanedImage,
        tags: parsedTags
      };
      updated = [...activities, newAct];
    }

    setActivities(updated);
    localStorage.setItem('ALIF_INFORMATIKA_ACTIVITIES', JSON.stringify(updated));
    setActivityForm({ title: '', date: '', location: '', description: '', image: '', tags: [] });
    setTagsText('');
    setEditingIndex(null);
    setEditingType(null);
    triggerStatus('Kegiatan berhasil disimpan!');
  };

  const handleDeleteActivity = (index: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      const updated = activities.filter((_, i) => i !== index);
      setActivities(updated);
      localStorage.setItem('ALIF_INFORMATIKA_ACTIVITIES', JSON.stringify(updated));
      triggerStatus('Kegiatan berhasil dihapus!');
    }
  };

  // --- PHOTO FUNCTIONS ---
  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title || !photoForm.image) return;

    const cleanedImage = cleanMediaUrl(photoForm.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800');
    const finalForm = { ...photoForm, image: cleanedImage };

    let updated: PersonalPhoto[];
    if (editingType === 'photo' && editingIndex !== null) {
      updated = [...photos];
      updated[editingIndex] = { ...photos[editingIndex], ...finalForm } as PersonalPhoto;
    } else {
      const newPhoto: PersonalPhoto = {
        id: `p-custom-${Date.now()}`,
        title: photoForm.title || '',
        description: photoForm.description || '',
        location: photoForm.location || '',
        image: cleanedImage,
        cameraInfo: photoForm.cameraInfo || 'Fujifilm X-T5',
        date: photoForm.date || new Date().toISOString().split('T')[0]
      };
      updated = [...photos, newPhoto];
    }

    setPhotos(updated);
    localStorage.setItem('ALIF_INFORMATIKA_PHOTOS', JSON.stringify(updated));
    setPhotoForm({ title: '', description: '', location: '', image: '', cameraInfo: '', date: '' });
    setEditingIndex(null);
    setEditingType(null);
    triggerStatus('Potret foto berhasil disimpan!');
  };

  const handleDeletePhoto = (index: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
      const updated = photos.filter((_, i) => i !== index);
      setPhotos(updated);
      localStorage.setItem('ALIF_INFORMATIKA_PHOTOS', JSON.stringify(updated));
      triggerStatus('Foto berhasil dihapus!');
    }
  };

  const handleImportDriveFolder = async () => {
    if (!driveFolderUrl) return;
    setIsImporting(true);
    setImportStats(null);
    try {
      const response = await fetch(`/api/drive-folder?url=${encodeURIComponent(driveFolderUrl)}`);
      const data = await response.json();
      if (response.ok && data.files && data.files.length > 0) {
        // Create PersonalPhoto objects for each file
        const newPhotos: PersonalPhoto[] = data.files.map((file: any, index: number) => ({
          id: `p-drive-${file.id}-${Date.now()}-${index}`,
          title: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
          description: `Foto kegiatan yang diimpor otomatis dari Google Drive Folder.`,
          location: 'Google Drive Folder',
          image: file.image,
          cameraInfo: 'Kamera Digital',
          date: new Date().toISOString().split('T')[0]
        }));

        const updated = [...photos, ...newPhotos];
        setPhotos(updated);
        localStorage.setItem('ALIF_INFORMATIKA_PHOTOS', JSON.stringify(updated));
        setImportStats({ count: data.files.length });
        setDriveFolderUrl('');
        triggerStatus(`Berhasil mengimpor ${data.files.length} foto dari Google Drive!`);
      } else {
        alert(data.error || 'Tidak ada foto yang ditemukan atau folder tidak dapat diakses.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Terjadi kesalahan koneksi saat mengimpor foto.');
    } finally {
      setIsImporting(false);
    }
  };

  // --- EXPORT & IMPORT FUNCTIONS ---
  const handleExportData = () => {
    const backup = {
      profile,
      skills,
      certificates,
      activities,
      photos
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Alif_Portfolio_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerStatus('Konfigurasi web berhasil diekspor!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile) {
            setProfile(parsed.profile);
            localStorage.setItem('ALIF_INFORMATIKA_PROFILE', JSON.stringify(parsed.profile));
          }
          if (parsed.skills) {
            setSkills(parsed.skills);
            localStorage.setItem('ALIF_INFORMATIKA_SKILLS', JSON.stringify(parsed.skills));
          }
          if (parsed.certificates) {
            setCertificates(parsed.certificates);
            localStorage.setItem('ALIF_INFORMATIKA_CERTIFICATES', JSON.stringify(parsed.certificates));
          }
          if (parsed.activities) {
            setActivities(parsed.activities);
            localStorage.setItem('ALIF_INFORMATIKA_ACTIVITIES', JSON.stringify(parsed.activities));
          }
          if (parsed.photos) {
            setPhotos(parsed.photos);
            localStorage.setItem('ALIF_INFORMATIKA_PHOTOS', JSON.stringify(parsed.photos));
          }
          triggerStatus('Konfigurasi web berhasil diimpor!');
        } catch (error) {
          alert('Format file cadangan tidak valid!');
        }
      };
    }
  };

  return (
    <>
      {/* Main slide-over / Modal Admin Box */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm" id="admin-modal-overlay">
            <motion.div
              initial={{ x: '100%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.8 }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="bg-neutral-950 border-l border-neutral-850 w-full max-w-2xl h-full flex flex-col justify-between shadow-2xl relative"
              id="admin-panel-container"
            >
              {/* Header inside Panel */}
              <div className="p-6 border-b border-neutral-900 bg-neutral-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-sans font-medium text-white">Panel Administrasi Web</h3>
                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Alif Dewantara Portfolio Engine</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 text-neutral-500 hover:text-white transition-colors border border-neutral-850"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* AUTHENTICATION SHIELD */}
              {!isAuthenticated ? (
                <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 text-amber-500 flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <h4 className="text-sm font-sans font-medium text-white">Verifikasi Akses Admin</h4>
                    <p className="text-xs text-neutral-500">
                      Masukkan kata sandi administrator untuk mengedit, menambah, atau mencadangkan data portofolio.
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan sandi administrator"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2.5 rounded text-xs text-neutral-200 focus:outline-none focus:border-amber-500/40 text-center font-mono"
                        required
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {errorMsg && (
                      <div className="text-[11px] text-red-400 bg-red-500/10 p-2.5 rounded border border-red-500/20 font-sans">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-xs uppercase font-bold py-2.5 rounded transition-colors cursor-pointer"
                    >
                      Buka Kunci Panel
                    </button>
                  </form>
                </div>
              ) : (
                /* AUTHENTICATED CONTROL PANEL WORKSPACE */
                <div className="flex-grow flex flex-col overflow-hidden">
                  
                  {/* Tabs Selector Bar */}
                  <div className="flex overflow-x-auto border-b border-neutral-900 bg-neutral-900/20 text-xs font-mono">
                    <button
                      onClick={() => { setActiveTab('profile'); setEditingIndex(null); setEditingType(null); }}
                      className={`px-4 py-3 shrink-0 uppercase border-b-2 transition-all ${activeTab === 'profile' ? 'border-amber-500 text-white bg-neutral-900/40' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
                    >
                      Profil
                    </button>
                    <button
                      onClick={() => { setActiveTab('skills'); setEditingIndex(null); setEditingType(null); }}
                      className={`px-4 py-3 shrink-0 uppercase border-b-2 transition-all ${activeTab === 'skills' ? 'border-amber-500 text-white bg-neutral-900/40' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
                    >
                      Keahlian
                    </button>
                    <button
                      onClick={() => { setActiveTab('certificates'); setEditingIndex(null); setEditingType(null); }}
                      className={`px-4 py-3 shrink-0 uppercase border-b-2 transition-all ${activeTab === 'certificates' ? 'border-amber-500 text-white bg-neutral-900/40' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
                    >
                      Sertifikat
                    </button>
                    <button
                      onClick={() => { setActiveTab('activities'); setEditingIndex(null); setEditingType(null); }}
                      className={`px-4 py-3 shrink-0 uppercase border-b-2 transition-all ${activeTab === 'activities' ? 'border-amber-500 text-white bg-neutral-900/40' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
                    >
                      Kegiatan
                    </button>
                    <button
                      onClick={() => { setActiveTab('photos'); setEditingIndex(null); setEditingType(null); }}
                      className={`px-4 py-3 shrink-0 uppercase border-b-2 transition-all ${activeTab === 'photos' ? 'border-amber-500 text-white bg-neutral-900/40' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
                    >
                      Galeri Foto
                    </button>
                    <button
                      onClick={() => { setActiveTab('backup'); setEditingIndex(null); setEditingType(null); }}
                      className={`px-4 py-3 shrink-0 uppercase border-b-2 transition-all ${activeTab === 'backup' ? 'border-amber-500 text-white bg-neutral-900/40' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
                    >
                      Cadangan JSON
                    </button>
                  </div>

                  {/* Panel Scrollable Content Body */}
                  <div className="flex-grow overflow-y-auto p-6 space-y-6">

                    {/* TAB: PROFILE EDIT */}
                    {activeTab === 'profile' && (
                      <div className="space-y-4 font-sans text-xs">
                        <h4 className="font-mono text-[10px] text-amber-500 uppercase tracking-wider font-bold">Edit Informasi Profil Utama</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Nama Lengkap</label>
                            <input
                              type="text"
                              value={profile.name}
                              onChange={(e) => handleProfileChange('name', e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Gelar / Bidang Studi</label>
                            <input
                              type="text"
                              value={profile.title}
                              onChange={(e) => handleProfileChange('title', e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Spesialisasi</label>
                            <input
                              type="text"
                              value={profile.specialization}
                              onChange={(e) => handleProfileChange('specialization', e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Universitas / Kampus</label>
                            <input
                              type="text"
                              value={profile.university}
                              onChange={(e) => handleProfileChange('university', e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Biografi Ringkas</label>
                            <textarea
                              rows={3}
                              value={profile.bio}
                              onChange={(e) => handleProfileChange('bio', e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40 resize-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">URL Avatar / Foto Profil</label>
                            <input
                              type="text"
                              value={profile.avatar}
                              onChange={(e) => handleProfileChange('avatar', e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">URL Latar Belakang Beranda</label>
                            <input
                              type="text"
                              value={profile.heroBackground || ''}
                              onChange={(e) => handleProfileChange('heroBackground', e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40"
                              placeholder="https://images.unsplash.com/..."
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Email Akademis</label>
                            <input
                              type="text"
                              value={profile.email}
                              onChange={(e) => handleProfileChange('email', e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40"
                            />
                          </div>

                          {/* Media URL Help Guide */}
                          <div className="md:col-span-2 mt-2 p-3 bg-neutral-950 border border-neutral-850 rounded-lg text-[10px] text-neutral-400 font-sans space-y-1">
                            <div className="flex items-center gap-1.5 text-amber-500 font-semibold uppercase tracking-wider text-[9px] font-mono">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>💡 Panduan Tautan Media & Foto (Instagram, Google Photos, dll.)</span>
                            </div>
                            <p className="leading-relaxed">
                              Sistem ini <strong>secara otomatis mengonversi</strong> tautan dari <strong>Instagram Post/Reel</strong>, <strong>Google Drive</strong>, dan <strong>Dropbox</strong> menjadi format gambar langsung tanpa error!
                            </p>
                            <p className="leading-relaxed text-[9px] text-neutral-500">
                              <strong>Tautan Google Photos:</strong> Jangan gunakan link sharing pendek (seperti <code>photos.app.goo.gl</code>). Cara benar: Buka foto di browser Google Photos, klik kanan gambarnya, lalu pilih <strong>"Copy Image Address"</strong> (Salin Alamat Gambar). Tempel alamat gambar langsung yang diawali dengan <code>https://lh3.googleusercontent.com/...</code> agar bisa tampil langsung.
                            </p>
                          </div>
                        </div>

                        {/* Branding & Theme Customization Section */}
                        <div className="border-t border-neutral-900 pt-6 mt-6 space-y-4">
                          <h5 className="font-mono text-[10px] text-amber-500 uppercase tracking-widest font-bold">Kustomisasi Logo & Tema (Real-time)</h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Teks Logo (Tebal)</label>
                              <input
                                type="text"
                                value={profile.logoBold || ''}
                                onChange={(e) => handleProfileChange('logoBold', e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40"
                                placeholder="ALIF"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Teks Logo (Tipis / Ekstensi)</label>
                              <input
                                type="text"
                                value={profile.logoLight || ''}
                                onChange={(e) => handleProfileChange('logoLight', e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40"
                                placeholder=".DEV"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-neutral-900/60 py-4 my-2">
                            <div>
                              <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Tipe Lambang Logo</label>
                              <select
                                value={profile.logoType || 'icon'}
                                onChange={(e) => handleProfileChange('logoType', e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40 text-xs"
                              >
                                <option value="icon">Ikon Lucide (Modern)</option>
                                <option value="image">Gambar Kustom (Tautan URL / Drive)</option>
                              </select>
                            </div>
                            
                            { (profile.logoType || 'icon') === 'icon' ? (
                              <div className="md:col-span-2">
                                <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Pilih Ikon Logo</label>
                                <select
                                  value={profile.logoIcon || 'Code2'}
                                  onChange={(e) => handleProfileChange('logoIcon', e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40 text-xs"
                                >
                                  <option value="Code2">Code2 (&lt;/&gt; Box)</option>
                                  <option value="Code">Code (&lt;/&gt;)</option>
                                  <option value="Terminal">Terminal (&gt;_)</option>
                                  <option value="Laptop">Laptop (Komputer)</option>
                                  <option value="Cpu">CPU (Prosesor)</option>
                                  <option value="Globe">Globe (Web/Internet)</option>
                                  <option value="Database">Database (Penyimpanan)</option>
                                  <option value="Award">Award (Sertifikat)</option>
                                  <option value="Layers">Layers (Arsitektur)</option>
                                  <option value="Smartphone">Smartphone (Mobile)</option>
                                  <option value="Settings">Settings (Pengaturan)</option>
                                  <option value="Shield">Shield (Keamanan)</option>
                                  <option value="BookOpen">Book (Edukasi)</option>
                                  <option value="Sparkles">Sparkles (AI/Inovatif)</option>
                                </select>
                              </div>
                            ) : (
                              <div className="md:col-span-2">
                                <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Tautan Gambar Logo (Mendukung Google Drive)</label>
                                <input
                                  type="text"
                                  value={profile.logoImage || ''}
                                  onChange={(e) => handleProfileChange('logoImage', e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-850 px-3 py-2 rounded text-neutral-200 focus:outline-none focus:border-amber-500/40 text-xs"
                                  placeholder="Contoh: Masukkan URL Gambar atau Tautan Google Drive"
                                />
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Warna Aksen Highlight</label>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="color"
                                  value={profile.accentColor || '#f59e0b'}
                                  onChange={(e) => handleProfileChange('accentColor', e.target.value)}
                                  className="w-8 h-8 rounded bg-transparent border border-neutral-800 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={profile.accentColor || '#f59e0b'}
                                  onChange={(e) => handleProfileChange('accentColor', e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-850 px-2 py-1 rounded text-xs text-neutral-300 uppercase font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Warna Background Utama</label>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="color"
                                  value={profile.backgroundColor || '#050505'}
                                  onChange={(e) => handleProfileChange('backgroundColor', e.target.value)}
                                  className="w-8 h-8 rounded bg-transparent border border-neutral-800 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={profile.backgroundColor || '#050505'}
                                  onChange={(e) => handleProfileChange('backgroundColor', e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-850 px-2 py-1 rounded text-xs text-neutral-300 uppercase font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Warna Background Kartu</label>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="color"
                                  value={profile.cardColor || '#121212'}
                                  onChange={(e) => handleProfileChange('cardColor', e.target.value)}
                                  className="w-8 h-8 rounded bg-transparent border border-neutral-800 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={profile.cardColor || '#121212'}
                                  onChange={(e) => handleProfileChange('cardColor', e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-850 px-2 py-1 rounded text-xs text-neutral-300 uppercase font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                                Opasitas Gambar Latar Belakang ({profile.heroBackgroundOpacity !== undefined ? profile.heroBackgroundOpacity : '8'}%)
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="50"
                                value={profile.heroBackgroundOpacity !== undefined ? profile.heroBackgroundOpacity : '8'}
                                onChange={(e) => handleProfileChange('heroBackgroundOpacity', e.target.value)}
                                className="w-full h-1 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                              />
                            </div>
                            <div className="flex items-center gap-6 pt-4">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={profile.showTechGrid !== false}
                                  onChange={(e) => handleProfileChange('showTechGrid', e.target.checked)}
                                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                                />
                                <span className="text-[10px] font-mono text-neutral-400 uppercase">Pola Grid Teknikal</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={profile.showAmbientGlow !== false}
                                  onChange={(e) => handleProfileChange('showAmbientGlow', e.target.checked)}
                                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-0"
                                />
                                <span className="text-[10px] font-mono text-neutral-400 uppercase">Cahaya Ambient</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Profile stats array editors */}
                        <div className="border-t border-neutral-900 pt-4 mt-6">
                          <h5 className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-3">Statistik Pencapaian</h5>
                          <div className="grid grid-cols-2 gap-4">
                            {profile.stats.map((stat: any, sIdx: number) => (
                              <div key={sIdx} className="bg-neutral-900/30 p-3 border border-neutral-900 rounded-lg space-y-2">
                                <span className="text-[9px] font-mono text-amber-500 uppercase">Stat #{sIdx + 1}</span>
                                <div>
                                  <label className="text-[8px] font-mono text-neutral-500 uppercase block">Label</label>
                                  <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => handleStatChange(sIdx, 'label', e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-850 px-2 py-1 rounded text-[11px]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[8px] font-mono text-neutral-500 uppercase block">Nilai</label>
                                  <input
                                    type="text"
                                    value={stat.value}
                                    onChange={(e) => handleStatChange(sIdx, 'value', e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-850 px-2 py-1 rounded text-[11px]"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: SKILLS PANEL */}
                    {activeTab === 'skills' && (
                      <div className="space-y-6">
                        {/* New or Edit Skill Form */}
                        <form onSubmit={handleSaveSkill} className="bg-neutral-900/40 border border-neutral-900 p-4 rounded-xl space-y-3 font-sans text-xs">
                          <span className="font-mono text-[9px] text-amber-500 uppercase font-bold block">
                            {editingType === 'skill' ? 'Ubah Detail Keahlian' : 'Tambah Keahlian Baru'}
                          </span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Nama Keahlian</label>
                              <input
                                type="text"
                                placeholder="Misalnya: Go (Golang)"
                                value={skillForm.name}
                                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Kemahiran (%)</label>
                              <input
                                type="number"
                                min={1}
                                max={100}
                                value={skillForm.level}
                                onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Kategori</label>
                              <select
                                value={skillForm.category}
                                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as any })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-2.5 py-2 rounded"
                              >
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                                <option value="Tools & DevOps">Tools & DevOps</option>
                                <option value="Sedang Dipelajari">Sedang Dipelajari</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Nama Ikon Lucide</label>
                              <select
                                value={skillForm.iconName}
                                onChange={(e) => setSkillForm({ ...skillForm, iconName: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-2.5 py-2 rounded font-mono"
                              >
                                <option value="Code2">Code2</option>
                                <option value="Server">Server</option>
                                <option value="Database">Database</option>
                                <option value="GitBranch">GitBranch</option>
                                <option value="Box">Box</option>
                                <option value="Cloud">Cloud</option>
                                <option value="BrainCircuit">BrainCircuit</option>
                                <option value="Terminal">Terminal</option>
                                <option value="ShieldAlert">ShieldAlert</option>
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Deskripsi Ringkas</label>
                              <input
                                type="text"
                                placeholder="Eksplorasi pembuatan REST API, optimasi, dsb."
                                value={skillForm.description}
                                onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            {editingType === 'skill' && (
                              <button
                                type="button"
                                onClick={() => { setEditingIndex(null); setEditingType(null); setSkillForm({ name: '', level: 80, category: 'Frontend', iconName: 'Code2', description: '' }); }}
                                className="bg-neutral-950 hover:bg-neutral-900 text-neutral-400 border border-neutral-850 px-3 py-1.5 rounded"
                              >
                                Batal
                              </button>
                            )}
                            <button
                              type="submit"
                              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-[10px] font-bold uppercase px-4 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{editingType === 'skill' ? 'Perbarui Keahlian' : 'Tambah Keahlian'}</span>
                            </button>
                          </div>
                        </form>

                        {/* List of Skills */}
                        <div className="space-y-2">
                          <span className="font-mono text-[10px] text-neutral-500 uppercase block tracking-widest">Daftar Keahlian Aktif ({skills.length})</span>
                          <div className="grid grid-cols-1 gap-2">
                            {skills.map((s, idx) => (
                              <div key={s.id} className="bg-neutral-900/50 border border-neutral-900 rounded-lg p-3 flex items-center justify-between text-xs">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white">{s.name}</span>
                                    <span className="text-[8px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded uppercase">{s.category}</span>
                                  </div>
                                  <p className="text-[10px] text-neutral-500 mt-1 line-clamp-1">{s.description || 'Tidak ada deskripsi'}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => { setEditingIndex(idx); setEditingType('skill'); setSkillForm(s); }}
                                    className="p-1.5 rounded bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSkill(idx)}
                                    className="p-1.5 rounded bg-neutral-950 hover:bg-red-950/40 text-neutral-400 hover:text-red-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: CERTIFICATES PANEL */}
                    {activeTab === 'certificates' && (
                      <div className="space-y-6">
                        {/* New or Edit Certificate Form */}
                        <form onSubmit={handleSaveCertificate} className="bg-neutral-900/40 border border-neutral-900 p-4 rounded-xl space-y-3 font-sans text-xs">
                          <span className="font-mono text-[9px] text-amber-500 uppercase font-bold block">
                            {editingType === 'certificate' ? 'Ubah Detail Sertifikat' : 'Tambah Sertifikat Baru'}
                          </span>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Judul Sertifikat / Pelatihan</label>
                              <input
                                type="text"
                                placeholder="Contoh: Machine Learning Specialization"
                                value={certForm.title}
                                onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Penerbit Kredensial</label>
                              <input
                                type="text"
                                placeholder="Contoh: Dicoding Indonesia"
                                value={certForm.issuer}
                                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Tanggal Terbit</label>
                              <input
                                type="date"
                                value={certForm.date}
                                onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">ID Kredensial</label>
                              <input
                                type="text"
                                placeholder="DSC-882190-FRONTEND"
                                value={certForm.credentialId}
                                onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">URL Verifikasi Kredensial</label>
                              <input
                                type="text"
                                placeholder="https://dicoding.com"
                                value={certForm.credentialUrl}
                                onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Foto Banner / Image URL</label>
                              <input
                                type="text"
                                placeholder="https://images.unsplash.com/..."
                                value={certForm.image}
                                onChange={(e) => setCertForm({ ...certForm, image: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                              />
                              <div className="mt-1.5 p-2 bg-neutral-950/80 border border-neutral-850 rounded text-[9px] text-neutral-400 font-sans space-y-0.5">
                                <span className="text-amber-500 font-mono font-bold uppercase tracking-wider text-[8px] block">💡 Sistem Auto-Konversi Aktif:</span>
                                <p className="leading-relaxed">Tautan Instagram (Post/Reel), Google Drive, dan Dropbox otomatis dikonversi jadi direct-image.</p>
                                <p className="leading-relaxed text-[8px] text-neutral-500"><strong>Google Photos:</strong> Klik kanan foto di browser, pilih "Copy Image Address", lalu paste URL yang diawali dengan <code>https://lh3.googleusercontent.com/...</code>.</p>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Topik Keahlian (Pisahkan dengan koma)</label>
                              <input
                                type="text"
                                placeholder="Contoh: Web Optimization, PWA, Cypress, Clean Code"
                                value={skillsLearnedText}
                                onChange={(e) => setSkillsLearnedText(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            {editingType === 'certificate' && (
                              <button
                                type="button"
                                onClick={() => { setEditingIndex(null); setEditingType(null); setCertForm({ title: '', issuer: '', date: '', credentialId: '', credentialUrl: '', image: '', skillsLearned: [] }); setSkillsLearnedText(''); }}
                                className="bg-neutral-950 hover:bg-neutral-900 text-neutral-400 border border-neutral-850 px-3 py-1.5 rounded"
                              >
                                Batal
                              </button>
                            )}
                            <button
                              type="submit"
                              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-[10px] font-bold uppercase px-4 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{editingType === 'certificate' ? 'Perbarui Sertifikat' : 'Tambah Sertifikat'}</span>
                            </button>
                          </div>
                        </form>

                        {/* List of Certificates */}
                        <div className="space-y-2">
                          <span className="font-mono text-[10px] text-neutral-500 uppercase block tracking-widest">Daftar Sertifikat Aktif ({certificates.length})</span>
                          <div className="grid grid-cols-1 gap-2">
                            {certificates.map((c, idx) => (
                              <div key={c.id} className="bg-neutral-900/50 border border-neutral-900 rounded-lg p-3 flex items-center justify-between text-xs">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white line-clamp-1 max-w-[340px]">{c.title}</span>
                                    <span className="text-[8px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded uppercase">{c.issuer}</span>
                                  </div>
                                  <p className="text-[10px] text-neutral-500 mt-1">Sertifikat ID: {c.credentialId || '-'}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => { 
                                      setEditingIndex(idx); 
                                      setEditingType('certificate'); 
                                      setCertForm(c); 
                                      setSkillsLearnedText(c.skillsLearned.join(', '));
                                    }}
                                    className="p-1.5 rounded bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCertificate(idx)}
                                    className="p-1.5 rounded bg-neutral-950 hover:bg-red-950/40 text-neutral-400 hover:text-red-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: ACTIVITIES PANEL */}
                    {activeTab === 'activities' && (
                      <div className="space-y-6">
                        {/* New or Edit Activity Form */}
                        <form onSubmit={handleSaveActivity} className="bg-neutral-900/40 border border-neutral-900 p-4 rounded-xl space-y-3 font-sans text-xs">
                          <span className="font-mono text-[9px] text-amber-500 uppercase font-bold block">
                            {editingType === 'activity' ? 'Ubah Detail Kegiatan' : 'Tambah Kegiatan Baru'}
                          </span>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Judul / Kegiatan</label>
                              <input
                                type="text"
                                placeholder="Contoh: Juara 2 Hackathon Smart City Nasional"
                                value={activityForm.title}
                                onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Lokasi Event / Tempat</label>
                              <input
                                type="text"
                                placeholder="Gedung Edukasi Utama & Balai Kota"
                                value={activityForm.location}
                                onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Tanggal Kegiatan</label>
                              <input
                                type="date"
                                value={activityForm.date}
                                onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded font-mono"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Foto Banner / Cover Image URL</label>
                              <input
                                type="text"
                                placeholder="https://images.unsplash.com/..."
                                value={activityForm.image}
                                onChange={(e) => setActivityForm({ ...activityForm, image: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                              />
                              <div className="mt-1.5 p-2 bg-neutral-950/80 border border-neutral-850 rounded text-[9px] text-neutral-400 font-sans space-y-0.5">
                                <span className="text-amber-500 font-mono font-bold uppercase tracking-wider text-[8px] block">💡 Sistem Auto-Konversi Aktif:</span>
                                <p className="leading-relaxed">Tautan Instagram (Post/Reel), Google Drive, dan Dropbox otomatis dikonversi jadi direct-image.</p>
                                <p className="leading-relaxed text-[8px] text-neutral-500"><strong>Google Photos:</strong> Klik kanan foto di browser, pilih "Copy Image Address", lalu paste URL yang diawali dengan <code>https://lh3.googleusercontent.com/...</code>.</p>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Deskripsi Kegiatan</label>
                              <textarea
                                rows={3}
                                placeholder="Tulis rincian jalannya event, keterlibatan, dsb."
                                value={activityForm.description}
                                onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded resize-none"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Tag Kategori (Pisahkan dengan koma)</label>
                              <input
                                type="text"
                                placeholder="IoT, AI, React Native, Kepemimpinan"
                                value={tagsText}
                                onChange={(e) => setTagsText(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            {editingType === 'activity' && (
                              <button
                                type="button"
                                onClick={() => { setEditingIndex(null); setEditingType(null); setActivityForm({ title: '', date: '', location: '', description: '', image: '', tags: [] }); setTagsText(''); }}
                                className="bg-neutral-950 hover:bg-neutral-900 text-neutral-400 border border-neutral-850 px-3 py-1.5 rounded"
                              >
                                Batal
                              </button>
                            )}
                            <button
                              type="submit"
                              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-[10px] font-bold uppercase px-4 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{editingType === 'activity' ? 'Perbarui Kegiatan' : 'Tambah Kegiatan'}</span>
                            </button>
                          </div>
                        </form>

                        {/* List of Activities */}
                        <div className="space-y-2">
                          <span className="font-mono text-[10px] text-neutral-500 uppercase block tracking-widest">Daftar Kegiatan Aktif ({activities.length})</span>
                          <div className="grid grid-cols-1 gap-2">
                            {activities.map((a, idx) => (
                              <div key={a.id} className="bg-neutral-900/50 border border-neutral-900 rounded-lg p-3 flex items-center justify-between text-xs">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white line-clamp-1 max-w-[340px]">{a.title}</span>
                                    <span className="text-[8px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded uppercase">{a.location.split(',')[0]}</span>
                                  </div>
                                  <p className="text-[10px] text-neutral-500 mt-1 line-clamp-1">{a.description}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => { 
                                      setEditingIndex(idx); 
                                      setEditingType('activity'); 
                                      setActivityForm(a); 
                                      setTagsText(a.tags.join(', '));
                                    }}
                                    className="p-1.5 rounded bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteActivity(idx)}
                                    className="p-1.5 rounded bg-neutral-950 hover:bg-red-950/40 text-neutral-400 hover:text-red-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: PHOTOS PANEL */}
                    {activeTab === 'photos' && (
                      <div className="space-y-6">
                        {/* Bulk Import from Google Drive Folder */}
                        <div className="bg-neutral-900/40 border border-neutral-900 p-4 rounded-xl space-y-3 font-sans text-xs">
                          <div className="flex items-center gap-1.5 text-amber-500 font-semibold uppercase tracking-wider text-[10px] font-mono">
                            <FolderOpen className="w-4 h-4 shrink-0" />
                            <span>📥 Impor Massal dari Google Drive Folder</span>
                          </div>
                          <p className="text-neutral-400 text-[11px] leading-relaxed">
                            Masukkan link folder Google Drive publik (contoh: <code>https://drive.google.com/drive/folders/1KKp9GcJ5FrgrEcR76VwfQzRddpdk68jF</code>) untuk mengambil dan menampilkan semua foto di dalamnya secara otomatis!
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="https://drive.google.com/drive/folders/..."
                              value={driveFolderUrl}
                              onChange={(e) => setDriveFolderUrl(e.target.value)}
                              className="flex-1 bg-neutral-950 border border-neutral-850 px-3 py-2 rounded focus:outline-none focus:border-amber-500/40"
                            />
                            <button
                              type="button"
                              disabled={isImporting || !driveFolderUrl}
                              onClick={handleImportDriveFolder}
                              className="bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-mono text-[10px] font-bold uppercase px-4 py-2 rounded flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed transition-colors"
                            >
                              {isImporting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                              <span>{isImporting ? 'Mengimpor...' : 'Impor Foto'}</span>
                            </button>
                          </div>
                          {importStats && (
                            <div className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded text-[10px] text-amber-400 font-mono flex items-center gap-2">
                              <Check className="w-3.5 h-3.5" />
                              <span>Berhasil mengimpor {importStats.count} foto dari Google Drive!</span>
                            </div>
                          )}
                        </div>

                        {/* New or Edit Photo Form */}
                        <form onSubmit={handleSavePhoto} className="bg-neutral-900/40 border border-neutral-900 p-4 rounded-xl space-y-3 font-sans text-xs">
                          <span className="font-mono text-[9px] text-amber-500 uppercase font-bold block">
                            {editingType === 'photo' ? 'Ubah Detail Foto' : 'Tambah Potret Foto Baru'}
                          </span>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Judul Foto / Momen</label>
                              <input
                                type="text"
                                placeholder="Contoh: Fokus di Balik Meja Kerja"
                                value={photoForm.title}
                                onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Spesifikasi EXIF Kamera</label>
                              <input
                                type="text"
                                placeholder="Sony Alpha 7 IV, FE 50mm f/1.2"
                                value={photoForm.cameraInfo}
                                onChange={(e) => setPhotoForm({ ...photoForm, cameraInfo: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Lokasi Foto</label>
                              <input
                                type="text"
                                placeholder="Kawasan MRT Bundaran HI, Jakarta"
                                value={photoForm.location}
                                onChange={(e) => setPhotoForm({ ...photoForm, location: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Tanggal Diambil</label>
                              <input
                                type="date"
                                value={photoForm.date}
                                onChange={(e) => setPhotoForm({ ...photoForm, date: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded font-mono"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Gambar Banner / Photo URL</label>
                              <input
                                type="text"
                                placeholder="https://images.unsplash.com/..."
                                value={photoForm.image}
                                onChange={(e) => setPhotoForm({ ...photoForm, image: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded"
                                required
                              />
                              <div className="mt-1.5 p-2 bg-neutral-950/80 border border-neutral-850 rounded text-[9px] text-neutral-400 font-sans space-y-0.5">
                                <span className="text-amber-500 font-mono font-bold uppercase tracking-wider text-[8px] block">💡 Sistem Auto-Konversi Aktif:</span>
                                <p className="leading-relaxed">Tautan Instagram (Post/Reel), Google Drive, dan Dropbox otomatis dikonversi jadi direct-image.</p>
                                <p className="leading-relaxed text-[8px] text-neutral-500"><strong>Google Photos:</strong> Klik kanan foto di browser, pilih "Copy Image Address", lalu paste URL yang diawali dengan <code>https://lh3.googleusercontent.com/...</code>.</p>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="text-[9px] font-mono text-neutral-500 uppercase block mb-1">Kisah / Deskripsi Ringkas</label>
                              <textarea
                                rows={2}
                                placeholder="Tulis cerita di balik pemotretan..."
                                value={photoForm.description}
                                onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                                className="w-full bg-neutral-950 border border-neutral-850 px-3 py-2 rounded resize-none"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            {editingType === 'photo' && (
                              <button
                                type="button"
                                onClick={() => { setEditingIndex(null); setEditingType(null); setPhotoForm({ title: '', description: '', location: '', image: '', cameraInfo: '', date: '' }); }}
                                className="bg-neutral-950 hover:bg-neutral-900 text-neutral-400 border border-neutral-850 px-3 py-1.5 rounded"
                              >
                                Batal
                              </button>
                            )}
                            <button
                              type="submit"
                              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-[10px] font-bold uppercase px-4 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{editingType === 'photo' ? 'Perbarui Foto' : 'Tambah Foto'}</span>
                            </button>
                          </div>
                        </form>

                        {/* List of Photos */}
                        <div className="space-y-2">
                          <span className="font-mono text-[10px] text-neutral-500 uppercase block tracking-widest">Daftar Potret Foto Aktif ({photos.length})</span>
                          <div className="grid grid-cols-1 gap-2">
                            {photos.map((p, idx) => (
                              <div key={p.id} className="bg-neutral-900/50 border border-neutral-900 rounded-lg p-3 flex items-center justify-between text-xs">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-white">{p.title}</span>
                                    <span className="text-[8px] font-mono text-neutral-400 bg-neutral-950 border border-neutral-900 px-1.5 py-0.2 rounded uppercase">{p.cameraInfo}</span>
                                  </div>
                                  <p className="text-[10px] text-neutral-500 mt-1 line-clamp-1">{p.location}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => { setEditingIndex(idx); setEditingType('photo'); setPhotoForm(p); }}
                                    className="p-1.5 rounded bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePhoto(idx)}
                                    className="p-1.5 rounded bg-neutral-950 hover:bg-red-950/40 text-neutral-400 hover:text-red-400"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: BACKUP & DATA MANAGEMENT */}
                    {activeTab === 'backup' && (
                      <div className="space-y-6 font-sans text-xs">
                        <div className="bg-neutral-900/30 p-5 rounded-xl border border-neutral-900 space-y-4">
                          <h4 className="font-mono text-xs text-white uppercase font-bold flex items-center gap-1.5">
                            <Download className="w-4 h-4 text-amber-500" />
                            <span>Ekspor Data Portofolio (JSON)</span>
                          </h4>
                          <p className="text-neutral-500 leading-relaxed text-[11px]">
                            Gunakan tombol ekspor untuk mengunduh semua data profil, keahlian, sertifikasi, kegiatan, dan foto Anda sebagai file JSON tunggal. Anda dapat menggunakannya sebagai cadangan aman untuk diimpor kembali kapan saja.
                          </p>
                          <button
                            onClick={handleExportData}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white font-mono uppercase text-[10px] py-2.5 px-4 rounded border border-neutral-800 flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-500" />
                            <span>Unduh Cadangan JSON</span>
                          </button>
                        </div>

                        <div className="bg-neutral-900/30 p-5 rounded-xl border border-neutral-900 space-y-4">
                          <h4 className="font-mono text-xs text-white uppercase font-bold flex items-center gap-1.5">
                            <Upload className="w-4 h-4 text-amber-500" />
                            <span>Impor Data Portofolio (JSON)</span>
                          </h4>
                          <p className="text-neutral-500 leading-relaxed text-[11px]">
                            Unggah berkas JSON cadangan yang telah Anda ekspor sebelumnya untuk memperbarui seluruh isi website portofolio secara instan. Pilihan ini akan menimpa data yang tersimpan di memori browser Anda saat ini.
                          </p>
                          <div className="flex items-center gap-3">
                            <label className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-[10px] font-bold uppercase py-2.5 px-4 rounded-lg cursor-pointer flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Pilih Berkas JSON</span>
                              <input
                                type="file"
                                accept=".json"
                                onChange={handleImportData}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Panel Footer / Status feedback */}
                  <div className="p-4 border-t border-neutral-900 bg-neutral-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AnimatePresence>
                        {saveStatus ? (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-emerald-400 flex items-center gap-1 font-sans"
                          >
                            <Check className="w-4 h-4" />
                            <span>{saveStatus}</span>
                          </motion.div>
                        ) : (
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">Perubahan disimpan otomatis di memori lokal.</span>
                        )}
                      </AnimatePresence>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="bg-neutral-900 hover:bg-red-950/30 text-neutral-500 hover:text-red-400 text-[10px] font-mono uppercase px-3 py-1.5 rounded border border-neutral-850 transition-colors cursor-pointer"
                    >
                      Keluar Admin
                    </button>
                  </div>

                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
