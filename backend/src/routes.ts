import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { initDb } from './db';

export const router = Router();
router.get('/applications', (req: Request, res: Response) => {
  try {
    const db = initDb();
    const statusFilter = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    let query = `SELECT * FROM applications WHERE 1=1`;
    const params: any[] = [];

    if (statusFilter && statusFilter !== 'All') {
      query += ` AND status = ?`;
      params.push(statusFilter);
    }

    if (search) {
      query += ` AND (companyName LIKE ? OR jobTitle LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY createdAt DESC`;
    
    const applications = db.prepare(query).all(params);
    res.json(applications);
  } catch (error) {
    console.error("GET /applications error:", error);
    res.status(500).json({ error: 'Failed to retrieve applications' });
  }
});
router.get('/applications/:id', (req: Request, res: Response) => {
  try {
    const db = initDb();
    const app = db.prepare(`SELECT * FROM applications WHERE id = ?`).get([req.params.id]);
    
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json(app);
  } catch (error) {
    console.error("GET /applications/:id error:", error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/applications', (req: Request, res: Response) => {
  try {
    const db = initDb();
    const { companyName, jobTitle, jobType, status, appliedDate, notes } = req.body;
    
    if (!companyName || companyName.trim().length < 2) {
      return res.status(400).json({ error: 'Company Name is required and must be at least 2 characters' });
    }
    if (!jobTitle || !jobType || !status || !appliedDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    db.prepare(
      `INSERT INTO applications (id, companyName, jobTitle, jobType, status, appliedDate, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run([id, companyName.trim(), jobTitle.trim(), jobType, status, appliedDate, notes || '']);

    const newApp = db.prepare(`SELECT * FROM applications WHERE id = ?`).get([id]);
    res.status(201).json(newApp);
  } catch (error) {
    console.error("POST /applications error:", error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});
router.patch('/applications/:id', (req: Request, res: Response) => {
  try {
    const db = initDb();
    const { id } = req.params;
    
    const existing = db.prepare(`SELECT * FROM applications WHERE id = ?`).get([id]);
    if (!existing) return res.status(404).json({ error: 'Application not found' });

    const fields = ['companyName', 'jobTitle', 'jobType', 'status', 'appliedDate', 'notes'];
    const updates: string[] = [];
    const params: any[] = [];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    updates.push(`updatedAt = CURRENT_TIMESTAMP`);
    params.push(id); 

    db.prepare(`UPDATE applications SET ${updates.join(', ')} WHERE id = ?`).run(params);
    
    const updatedApp = db.prepare(`SELECT * FROM applications WHERE id = ?`).get([id]);
    res.json(updatedApp);
  } catch (error) {
    console.error("PATCH /applications error:", error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});
router.delete('/applications/:id', (req: Request, res: Response) => {
  try {
    const db = initDb();
    const result = db.prepare(`DELETE FROM applications WHERE id = ?`).run([req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error("DELETE /applications error:", error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});