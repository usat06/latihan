import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const PORTFOLIO_STORE_PATH = path.join(process.cwd(), 'portfolio-store.json');
  const GUESTBOOK_STORE_PATH = path.join(process.cwd(), 'guestbook-store.json');

  // API endpoint to fetch Google Drive Folder contents without API keys!
  app.get('/api/drive-folder', async (req, res) => {
    try {
      const { url } = req.query;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Parameter url tidak ditemukan.' });
      }

      // Extract folder ID
      let folderId = url.trim();
      const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]{15,})/i) || url.match(/[?&]id=([a-zA-Z0-9_-]{15,})/i);
      if (folderMatch && folderMatch[1]) {
        folderId = folderMatch[1];
      }

      if (!folderId || folderId.length < 15) {
        return res.status(400).json({ error: 'ID/URL Folder Google Drive tidak valid.' });
      }

      const driveUrl = `https://drive.google.com/drive/folders/${folderId}`;
      
      const response = await fetch(driveUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        }
      });

      if (!response.ok) {
        return res.status(500).json({ error: 'Gagal menghubungi Google Drive. Pastikan folder diset publik (Siapa saja yang memiliki link).' });
      }

      const html = await response.text();
      const results: { id: string; name: string; image: string }[] = [];

      // Regex matching Google Drive row pattern
      const rowRegex = /data-id="(1[a-zA-Z0-9_-]{32})"[^>]*>[\s\S]*?aria-label="([^"]+?)"/g;
      let match;
      while ((match = rowRegex.exec(html)) !== null) {
        const id = match[1];
        let name = match[2];

        // Clean name (e.g. "MyPhoto.JPG Image Shared" -> "MyPhoto.JPG")
        name = name.replace(/\s+(Image|Video|PDF|Shared|Google Drive Item|File|Folder|Spreadsheet|Document).*$/gi, '').trim();

        if (id !== folderId && !results.some(r => r.id === id)) {
          const imageLink = `https://lh3.googleusercontent.com/d/${id}`;
          results.push({ id, name, image: imageLink });
        }
      }

      return res.json({ folderId, count: results.length, files: results });
    } catch (error: any) {
      console.error('Error fetching drive folder:', error);
      return res.status(500).json({ error: error.message || 'Terjadi kesalahan internal saat membaca folder Google Drive.' });
    }
  });

  // GET portfolio data
  app.get('/api/portfolio', (req, res) => {
    try {
      if (fs.existsSync(PORTFOLIO_STORE_PATH)) {
        const data = fs.readFileSync(PORTFOLIO_STORE_PATH, 'utf-8');
        return res.json(JSON.parse(data));
      }
      return res.json({ status: 'empty' });
    } catch (err: any) {
      console.error('Error reading portfolio store:', err);
      return res.status(500).json({ error: 'Failed to read portfolio data from server.' });
    }
  });

  // POST/Save portfolio data
  app.post('/api/portfolio', (req, res) => {
    try {
      const payload = req.body;
      let existing = {};
      if (fs.existsSync(PORTFOLIO_STORE_PATH)) {
        try {
          existing = JSON.parse(fs.readFileSync(PORTFOLIO_STORE_PATH, 'utf-8'));
        } catch (e) {}
      }
      const updated = { ...existing, ...payload };
      fs.writeFileSync(PORTFOLIO_STORE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
      return res.json({ success: true });
    } catch (err: any) {
      console.error('Error writing portfolio store:', err);
      return res.status(500).json({ error: 'Failed to save portfolio data on server.' });
    }
  });

  // GET guestbook comments
  app.get('/api/guestbook', (req, res) => {
    try {
      if (fs.existsSync(GUESTBOOK_STORE_PATH)) {
        const data = fs.readFileSync(GUESTBOOK_STORE_PATH, 'utf-8');
        return res.json(JSON.parse(data));
      }
      return res.json({ status: 'empty' });
    } catch (err: any) {
      console.error('Error reading guestbook store:', err);
      return res.status(500).json({ error: 'Failed to read guestbook entries.' });
    }
  });

  // POST guestbook comment
  app.post('/api/guestbook', (req, res) => {
    try {
      const entries = req.body; // Expect array of entries or single entry to append
      fs.writeFileSync(GUESTBOOK_STORE_PATH, JSON.stringify(entries, null, 2), 'utf-8');
      return res.json({ success: true });
    } catch (err: any) {
      console.error('Error writing guestbook store:', err);
      return res.status(500).json({ error: 'Failed to save guestbook entries on server.' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
