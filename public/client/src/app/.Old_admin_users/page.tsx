"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { UserPlus, Edit, Trash2, X, Save, ShieldCheck } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [roleOptions, setRoleOptions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const initialForm = { name: '', email: '', roles: [] as any[] };
  const [formData, setFormData] = useState(initialForm);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoleOptions(res.data);
    } catch (err) { console.error("Fetch roles error", err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) { console.error("Fetch users error", err); }
  };


  const fetchUser = async (u) => {
    try {
      const res = await api.get(`/users/${u}`);
      setUser(res.data);
    } catch (err) { console.error(`Fetch user ${u} error`, err); }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();

    const savedDraft = getCookie('user_form_draft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft as string);
        setFormData(parsedDraft.data);
        setIsEditing(parsedDraft.isEditing);
        setIsOpen(true);
      } catch (e) { console.error("Draft error", e); }
    }
  }, []);

  // ฟังก์ชันสลับการเลือก Role
  const handleRoleChange = (role: any) => {
    const currentRoles = [...formData.roles];
    const index = currentRoles.findIndex(r => r.id === role.id);

    if (index > -1) {
      currentRoles.splice(index, 1);
    } else {
      currentRoles.push(role);
    }

    updateAndSaveDraft({ ...formData, roles: currentRoles });
  };

  const updateAndSaveDraft = (newData: typeof formData) => {
    setFormData(newData);
    setCookie('user_form_draft', JSON.stringify({ data: newData, isEditing }), { maxAge: 3600 });
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsEditing(null);
    setFormData(initialForm);
    deleteCookie('user_form_draft');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ส่งข้อมูลเฉพาะ ID ของ Roles ไปที่ Backend
      const payload = {
        ...formData,
        roles: formData.roles.map(r => r.id)
      };

      if (isEditing) {
        await api.put(`/users/${isEditing}`, payload);
      } else {
        await api.post('/users', payload);
      }
      deleteCookie('user_form_draft');
      handleCloseModal();
      fetchUsers();
    } catch (err) { alert("Error saving user"); }
  };

  return (
    <div className="p-8">
      {/* Header และ Table เหมือนเดิม... */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"><UserPlus className="w-5 h-5" /> Add User</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          {/* Table Header... */}
          <tbody className="divide-y divide-gray-100">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles?.map((r: any) => (
                      <span key={r.id} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase border border-blue-100">
                        {r.display_name || r.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => {
                      setIsEditing(user.id);
                      fetchUser(user.id);
                      // โหลดข้อมูลเก่าลงใน Form รวมถึง Roles ที่เป็น Array ของ Object
                      setFormData({
                        name: user.name,
                        email: user.email,
                        roles: user.roles || []
                      });
                      setIsOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"
                  ><Edit className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL TOGGLE (ปรับขนาดเป็น 80%) --- */}
      {isOpen && (
        {/* --- หากมีการ Refresh หน้า หรือเปลี่ยนข้อมูลในฟอร์มโดยไม่ได้กด Save ให้โหลดหน้านี้พร้อมข้อมูลที่ยังไม่ได้ Save ขึ้นมาและแจ้งให้ User ที่กำลังแก้ไขข้อมูลนี้ทราบ ด้วย-*/}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          {/* แก้ไขขนาดที่นี่: max-w-[80%] */}
          <div className="bg-white w-full max-w-[80%] h-fit max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit User' : 'Create User'}</h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-200 rounded-full text-gray-400"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> User Roles (Select multiple)
                </label>
                {/* ขยาย Grid เป็น 4 คอลัมน์เพื่อให้เข้ากับขนาด Modal ที่ใหญ่ขึ้น */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {roleOptions.map((role) => {
                    const isSelected = formData.roles.some(r => r.id === role.id);
                    return (
                      <label key={role.id} className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'}`}>
                        <input type="checkbox" checked={isSelected} onChange={() => handleRoleChange(role)} className="hidden" />
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        <span className="text-sm font-bold">{role.display_name || role.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

            {/* ส่วนนี้แจ้งข้อความ Error และ Success ที่ส่งมาจาก Host */}

              <div className="pt-6 flex justify-end gap-4 border-t border-gray-100">
                <button type="button" onClick={handleCloseModal} className="px-8 py-3 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" className="px-12 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
