import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { initDb } from './db';

export const router = Router();
router.get('/applications', async (req: Request, res: Response) => {
  try {
    const db = await initDb();
    const { status, search } = req.query;

    let query = `SELECT * FROM applications WHERE 1=1`;
    const params: any[] = [];

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (companyName LIKE ? OR jobTitle LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY createdAt DESC`;

    const applications = await db.all(query, params);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve applications' });
  }
});
router.get('/applications/:id', async (req: Request, res: Response) => {
  try {
    const db = await initDb();
    const app = await db.get(`SELECT * FROM applications WHERE id = ?`, [req.params.id]);
    
    if (!app) return res.status(404).json({ error: 'Application not found' });
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/applications', async (req: Request, res: Response) => {
  try {
    const db = await initDb();
    const { companyName, jobTitle, jobType, status, appliedDate, notes } = req.body;
    if (!companyName || companyName.trim().length < 2) {
      return res.status(400).json({ error: 'Company Name is required and must be at least 2 characters' });
    }
    if (!jobTitle || !jobType || !status || !appliedDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    await db.run(
      `INSERT INTO applications (id, companyName, jobTitle, jobType, status, appliedDate, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, companyName.trim(), jobTitle.trim(), jobType, status, appliedDate, notes || '']
    );

    const newApp = await db.get(`SELECT * FROM applications WHERE id = ?`, [id]);
    res.status(201).json(newApp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create application' });
  }
});
router.patch('/applications/:id', async (req: Request, res: Response) => {
  try {
    const db = await initDb();
    const { id } = req.params;
    
    const existing = await db.get(`SELECT * FROM applications WHERE id = ?`, [id]);
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

    await db.run(`UPDATE applications SET ${updates.join(', ')} WHERE id = ?`, params);
    
    const updatedApp = await db.get(`SELECT * FROM applications WHERE id = ?`, [id]);
    res.json(updatedApp);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application' });
  }
});
router.delete('/applications/:id', async (req: Request, res: Response) => {
  try {
    const db = await initDb();
    const result = await db.run(`DELETE FROM applications WHERE id = ?`, [req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
});