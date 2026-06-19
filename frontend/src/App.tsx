import { useState, useEffect } from 'react';
import CursorFollower from './CursorFollower';

interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  jobType: 'INTERNSHIP' | 'FULL_TIME' | 'PART_TIME';
  status: 'APPLIED' | 'INTERVIEWING' | 'OFFER' | 'REJECTED';
  appliedDate: string;
  notes?: string;
}

export default function App() {
  const [apps, setApps] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '', jobTitle: '', jobType: 'FULL_TIME', status: 'APPLIED', appliedDate: '', notes: ''
  });
  

  const fetchApps = async () => {
    try {
      const res = await fetch(`https://job-tracker-6n7w.onrender.com/api/applications?status=${statusFilter}&search=${search}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setApps(data);
      } else {
        console.error("Backend sent an invalid payload format. Expected Array, got:", data);
        setApps([]); 
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApps([]); 
    }
  };

  useEffect(() => { fetchApps(); }, [statusFilter, search]);

  const handleOpenAdd = () => {
    setEditingApp(null);
    setFormData({ companyName: '', jobTitle: '', jobType: 'FULL_TIME', status: 'APPLIED', appliedDate: '', notes: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: Application) => {
    setEditingApp(app);
    setFormData({
      companyName: app.companyName,
      jobTitle: app.jobTitle,
      jobType: app.jobType,
      status: app.status,
      appliedDate: app.appliedDate,
      notes: app.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyName.trim().length < 2) {
      return alert("Company Name must be at least 2 characters long.");
    }

    const url = editingApp 
      ? `https://job-tracker-6n7w.onrender.com/api/applications/${editingApp.id}` 
      : `https://job-tracker-6n7w.onrender.com/api/applications`;
    const method = editingApp ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchApps();
      } else {
        const errData = await res.json();
        alert(errData.error || "Something went wrong.");
      }
    } catch (error) {
      alert("Failed to communicate with the server.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this job application?")) {
      try {
        await fetch(`https://job-tracker-6n7w.onrender.com/api/applications/${id}`, { 
          method: 'DELETE' 
        });
        fetchApps();
      } catch (error) {
        console.error("Error deleting application:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <CursorFollower/>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">💼 Job Application Tracker</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white p-4 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
            <input 
              type="text" placeholder="Search company or job title..." 
              className="border border-gray-300 p-2 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
            <select 
              className="border border-gray-300 p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <button onClick={handleOpenAdd} className="w-full md:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            + Add Application
          </button>
        </div>
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-semibold uppercase">
                  <th className="p-4">Company Name</th>
                  <th className="p-4">Job Title</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {apps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-gray-400">No applications found matching the criteria.</td>
                  </tr>
                ) : apps.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold text-gray-900">{app.companyName}</td>
                    <td className="p-4">{app.jobTitle}</td>
                    <td className="p-4 text-xs font-mono text-gray-500">{app.jobType.replace('_', ' ')}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'OFFER' ? 'bg-green-100 text-green-800' :
                        app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        app.status === 'INTERVIEWING' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>{app.status}</span>
                    </td>
                    <td className="p-4 text-sm">{app.appliedDate}</td>
                    <td className="p-4 text-right text-sm font-medium space-x-3">
                      <button onClick={() => handleOpenEdit(app)} className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button onClick={() => handleDelete(app.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 backdrop-blur-xs">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full space-y-4">
              <h2 className="text-xl font-bold text-gray-900">{editingApp ? '📝 Edit Application' : '✨ Add Application'}</h2>
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Company Name *</label>
                <input type="text" required minLength={2} className="border border-gray-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Job Title *</label>
                <input type="text" required className="border border-gray-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Job Type</label>
                  <select className="border border-gray-300 w-full p-2 rounded-lg bg-white" value={formData.jobType} onChange={e => setFormData({...formData, jobType: e.target.value as any})}>
                    <option value="FULL_TIME">Full-time</option>
                    <option value="PART_TIME">Part-time</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Status</label>
                  <select className="border border-gray-300 w-full p-2 rounded-lg bg-white" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEWING">Interviewing</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Applied Date *</label>
                <input type="date" required className="border border-gray-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.appliedDate} onChange={e => setFormData({...formData, appliedDate: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Notes (Optional)</label>
                <textarea className="border border-gray-300 w-full p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}