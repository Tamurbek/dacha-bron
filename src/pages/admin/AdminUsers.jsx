import React, { useState } from 'react';
import {
    Users,
    UserPlus,
    Search,
    Shield,
    ShieldCheck,
    Mail,
    Calendar,
    MoreVertical,
    X,
    Trash2,
    Edit2,
    CheckCircle,
    Loader2,
    LayoutGrid,
    Table as TableIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialUsers = [
    { id: 1, name: "Temur Yoldoshev", email: "temur@example.com", role: "admin", joined: "2023-10-01", status: 'active' },
    { id: 2, name: "Ali Valiyev", email: "ali@example.com", role: "user", joined: "2024-01-15", status: 'active' },
    { id: 3, name: "Malika Rasulova", email: "malika@example.com", role: "user", joined: "2024-02-20", status: 'blocked' },
    { id: 4, name: "Javohir Orifov", email: "javohir@example.com", role: "user", joined: "2024-03-05", status: 'active' },
];

export const AdminUsers = () => {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [viewType, setViewType] = useState('table'); // 'grid' or 'table'

    const handleDeleteUser = (id) => {
        if (window.confirm('Foydalanuvchini o\'chirib tashlamoqchimisiz?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const toggleRole = (id) => {
        setUsers(users.map(u =>
            u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
        ));
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex flex-grow items-center gap-4 max-w-2xl">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Foydalanuvchilarni qidirish..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="hidden md:flex items-center bg-gray-50 dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <button
                            onClick={() => setViewType('grid')}
                            className={`p-2 rounded-xl transition-all ${viewType === 'grid' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewType('table')}
                            className={`p-2 rounded-xl transition-all ${viewType === 'table' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <TableIcon size={20} />
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center space-x-2 px-8 py-3.5 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-95 whitespace-nowrap"
                >
                    <UserPlus size={20} />
                    <span className="font-black text-sm uppercase tracking-wider">Yangi qo'shish</span>
                </button>
            </div>

            <AnimatePresence mode="wait">
                {viewType === 'grid' ? (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredUsers.map((user) => (
                            <motion.div
                                layout
                                key={user.id}
                                className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10 transition-colors ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        <span className="text-2xl font-black">{user.name.charAt(0)}</span>
                                    </div>
                                    <button
                                        onClick={() => toggleRole(user.id)}
                                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${user.role === 'admin'
                                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                            }`}
                                    >
                                        {user.role === 'admin' ? <ShieldCheck size={14} /> : <Shield size={14} />}
                                        <span>{user.role}</span>
                                    </button>
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">{user.name}</h3>
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-bold">
                                            <Mail size={16} className="mr-3 text-primary/60" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 font-bold">
                                            <Calendar size={16} className="mr-3 text-primary/60" />
                                            {user.joined}
                                        </div>
                                    </div>
                                    <div className="mt-8 flex items-center space-x-3">
                                        <button className="flex-grow py-3 bg-gray-50 dark:bg-gray-800 hover:bg-primary hover:text-white text-gray-900 dark:text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 border border-transparent hover:border-primary/20">Batafsil</button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all duration-300 border border-red-100 dark:border-red-900/30"><Trash2 size={20} /></button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-all duration-500"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Foydalanuvchi</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rol</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sana</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center font-black text-primary group-hover:bg-primary group-hover:text-white transition-all">{user.name.charAt(0)}</div>
                                                    <span className="text-sm font-black text-gray-900 dark:text-white">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-gray-500 dark:text-gray-400">{user.email}</td>
                                            <td className="px-8 py-5">
                                                <button onClick={() => toggleRole(user.id)} className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'}`}>{user.role}</button>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">{user.joined}</td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-2">
                                                    <button className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"><Edit2 size={18} /></button>
                                                    <button onClick={() => handleDeleteUser(user.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl relative z-10 p-8"
                        >
                            <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-white">Yangi foydalanuvchi</h3>
                            <div className="space-y-4">
                                <input type="text" placeholder="FISH" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-white" />
                                <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-white" />
                                <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-white">
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button
                                    className="w-full py-3 bg-primary-600 text-white rounded-xl font-black shadow-lg shadow-primary-600/20 flex items-center justify-center space-x-2 hover:bg-primary-700 transition-all mt-4"
                                    onClick={() => {
                                        setIsLoading(true);
                                        setTimeout(() => {
                                            setIsLoading(false);
                                            setIsModalOpen(false);
                                        }, 1000);
                                    }}
                                >
                                    {isLoading && <Loader2 size={18} className="animate-spin" />}
                                    <span>Saqlash</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
