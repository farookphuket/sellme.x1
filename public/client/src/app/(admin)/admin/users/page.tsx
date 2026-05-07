"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { setCookie, getCookie, deleteCookie, hasCookie } from 'cookies-next';
import { UserPlus, Edit, Trash2, X, Save, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roleOptions, setRoleOptions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isRestored, setIsRestored] = useState(false); // สถานะแจ้งว่ากู้คืนข้อมูลมาจาก Cookie

  // สถานะสำหรับเก็บข้อความจาก Backend
  const [messages, setMessages] = useState<{ type: 'error' | 'success', text: string } | null>(null);

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

  useEffect(() => {
    fetchUsers();
    fetchRoles();

    // ตรวจสอบข้อมูลร่างใน Cookie เมื่อโหลดหน้า
    const savedDraft = getCookie('user_form_draft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft as string);
        setFormData(parsedDraft.data);
        setIsEditing(parsedDraft.isEditing);
        setIsOpen(true);
        setIsRestored(true); // แจ้งเตือนว่านี่คือข้อมูลที่กู้คืนมา
      } catch (e) { console.error("Draft error", e); }
    }
  }, []);

  // ฟังก์ชันอัปเดตข้อมูลและเก็บลง Cookie ทุกครั้งที่มีการเปลี่ยนแปลง
  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    setCookie('user_form_draft', JSON.stringify({ data: newFormData, isEditing }), { maxAge: 3600 });
  };

  const handleRoleChange = (role: any) => {
    const currentRoles = [...formData.roles];
    const index = currentRoles.findIndex(r => r.id === role.id);
    if (index > -1) {
      currentRoles.splice(index, 1);
    } else {
      currentRoles.push(role);
    }
    handleInputChange('roles', currentRoles);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsEditing(null);
    setFormData(initialForm);
    setIsRestored(false);
    setMessages(null);
    deleteCookie('user_form_draft');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages(null); // ล้างข้อความเก่า
    try {
      const payload = {
        ...formData,
        roles: formData.roles.map(r => r.id)
      };

      let response;
      if (isEditing) {
        response = await api.put(`/users/${isEditing}`, payload);
      } else {
        response = await api.post('/users', payload);
      }

      setMessages({ type: 'success', text: response.data.message || 'Saved successfully!' });

      // หน่วงเวลาปิด Modal เพื่อให้ User เห็นข้อความ Success
      setTimeout(() => {
        deleteCookie('user_form_draft');
        handleCloseModal();
        fetchUsers();
      }, 1500);

    } catch (err: any) {
      // ดึง Error Message จาก Laravel (Validator)
      const errorData = err.response?.data;
      const errorMsg = errorData?.errors
        ? Object.values(errorData.errors).flat().join(', ')
        : (errorData?.message || "Error saving user");

      setMessages({ type: 'error', text: errorMsg });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          <UserPlus className="w-5 h-5" /> Add User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Roles</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
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
                      setFormData({ name: user.name, email: user.email, roles: user.roles || [] });
                      setIsOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                  ><Edit className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-[80%] h-fit max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit User' : 'Create User'}</h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"><X /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">

              {/* ส่วนแจ้งเตือนกู้คืนข้อมูลร่าง */}
              {isRestored && (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-800 animate-pulse">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">ระบบกู้คืนข้อมูลที่คุณกรอกค้างไว้ล่าสุดให้โดยอัตโนมัติ (Draft Restored)</span>
                </div>
              )}

              {/* แสดงข้อความ Error/Success จาก Backend */}
              {messages && (
                <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
                  messages.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'
                }`}>
                  {messages.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm font-bold">{messages.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter The password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="example@mail.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> User Roles (Select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {roleOptions.map((role) => {
                    const isSelected = formData.roles.some((r: any) => r.id === role.id);
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

              <div className="pt-6 flex justify-end gap-4 border-t border-gray-100">
                <button type="button" onClick={handleCloseModal} className="px-8 py-3 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" className="px-12 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2 transition-all">
                  <Save className="w-4 h-4" /> {isEditing ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
