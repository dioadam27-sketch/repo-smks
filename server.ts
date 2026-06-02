import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

// Configuration
const PORT = 3000;
const REMOTE_API_BASE = "https://pkkii.pendidikan.unair.ac.id/smks/api.php";
const LOCAL_DB_PATH = path.join(process.cwd(), 'local_db.json');

// Initialize local DB if not exists
if (!fs.existsSync(LOCAL_DB_PATH)) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify({
    users: [
      {
        id: "sys_1",
        username: "admin",
        nama_lengkap: "Administrator (Local Fallback)",
        role: "System Developer",
        created_at: new Date().toISOString()
      }
    ],
    unit_ksm: [],
    pra_pendidikan: [],
    ipe: [],
    modul_ipe: [],
    student_inbound: [],
    kunjungan: [],
    mou: [],
    akselerasi: [],
    pelatihan: [],
    pelatihan_unggulan: [],
    inhouse_training: [],
    monitoring_jam: [],
    kerjasama_skp: [],
    studi_banding: [],
    dokter_observer: [],
    magang: [],
    penelitian: [],
    penelitian_publikasi: [],
    uji_etik: [],
    buku_isbn: [],
    kepk: [],
    pengabdian_masyarakat: [],
    produk_inovasi: [],
    prapendidikan_komkordik: [],
    orientasi_ksm: [],
    pendapatan_pendidikan: [],
    pajanan_peserta: []
  }, null, 2));
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // API Proxy with Fallback Logic
  app.all("/api/:resource", async (req, res) => {
    const { resource } = req.params;
    const { id } = req.query;
    const method = req.method;
    
    // Construct remote URL
    let remoteUrl = `${REMOTE_API_BASE}?resource=${resource}`;
    if (id) remoteUrl += `&id=${id}`;

    console.log(`[Proxy] ${method} ${remoteUrl}`);

    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10s timeout

      const response = await fetch(remoteUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        signal: abortController.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      } else {
        throw new Error(`Remote API error: ${response.status}`);
      }
    } catch (error: any) {
      console.error(`[Proxy Error] ${resource}:`, error.message);
      
      // FALLBACK TO LOCAL JSON DB
      try {
        const dbContent = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf-8'));
        const table = dbContent[resource] || [];

        if (method === 'GET') {
          if (id) {
            const item = table.find((i: any) => i.id === id);
            return res.json({ status: "success", data: item ? [item] : [] });
          }
          return res.json({ status: "success", data: table });
        }

        if (method === 'POST') {
          const newItem = { id: req.body.id || `gen_${Date.now()}`, ...req.body, created_at: new Date().toISOString() };
          dbContent[resource] = [...table, newItem];
          fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(dbContent, null, 2));
          return res.json({ status: "success", id: newItem.id, message: "Saved to local fallback storage" });
        }

        if (method === 'PUT' && id) {
          dbContent[resource] = table.map((i: any) => i.id === id ? { ...i, ...req.body } : i);
          fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(dbContent, null, 2));
          return res.json({ status: "success", message: "Updated in local fallback storage" });
        }

        if (method === 'DELETE' && id) {
          dbContent[resource] = table.filter((i: any) => i.id !== id);
          fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(dbContent, null, 2));
          return res.json({ status: "success", message: "Deleted from local fallback storage" });
        }

        return res.status(503).json({ status: "error", message: "Remote API unavailable and unsupported local operation" });
      } catch (localError) {
        return res.status(500).json({ status: "error", message: "Dual Backend Failure" });
      }
    }
  });

  // Specialized Login Route
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const response = await fetch(`${REMOTE_API_BASE}?resource=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        return res.json(await response.json());
      }
      throw new Error();
    } catch {
      // Offline fallback for admin
      if (username === "admin" && password === "112233") {
        return res.json({
          status: "success",
          user: { id: "sys_1", username: "admin", nama_lengkap: "Administrator (Offline)", role: "System Developer" }
        });
      }
      return res.status(401).json({ status: "error", message: "Backend offline and credentials invalid" });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    console.log(`Local DB: ${LOCAL_DB_PATH}`);
  });
}

startServer();
