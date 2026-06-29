export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: 'Frontend' | 'Backend' | 'Tools & DevOps' | 'Sedang Dipelajari';
  iconName: string;
  description?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  credentialUrl: string;
  image: string;
  skillsLearned: string[];
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  tags: string[];
}

export interface PersonalPhoto {
  id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  cameraInfo?: string;
  date: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  date: string;
  role?: string; // e.g. "Dosen", "Rekan Mahasiswa", "Recruiter"
}
