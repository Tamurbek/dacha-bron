import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Save,
    Loader2,
    Waves,
    Flame,
    Utensils,
    Wifi,
    Wind,
    Coffee,
    Type,
    Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap = {
    Waves,
    Flame,
    Utensils,
    Wifi,
    Wind,
    Coffee,
    Type,
    Smile
};

export const AdminAmenities = () => {
    const [amenities, setAmenities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAmenity, setEditingAmenity] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [formData, setFormData] = useState({
        name_uz: '',
        name_ru: '',
        name_en: '',
        icon: 'Smile'
    });

    useEffect(() => {
        fetchAmenities();
    }, []);

    const fetchAmenities = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/v1/amenities/');
            if (response.ok) {
                const data = await response.json();
                setAmenities(data);
            }
        } catch (error) {
            console.error('Error fetching amenities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (amenity = null) => {
        if (amenity) {
            setEditingAmenity(amenity);
            setFormData({
                name_uz: amenity.name_uz,
                name_ru: amenity.name_ru,
                name_en: amenity.name_en,
                icon: amenity.icon || 'Smile'
            });
        } else {
            setEditingAmenity(null);
            setFormData({
                name_uz: '',
                name_ru: '',
                name_en: '',
                icon: 'Smile'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const url = editingAmenity
                ? `http://localhost:8000/api/v1/amenities/${editingAmenity.id}`
                : 'http://localhost:8000/api/v1/amenities/';

            const response = await fetch(url, {
                method: editingAmenity ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchAmenities();
                setIsModalOpen(false);
            }
        } catch (error) {
            alert('Saqlashda xatolik yuz berdi');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Haqiqatdan ham ushbu qulaylikni o\'chirib tashlamoqchimisiz?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/amenities/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    await fetchAmenities();
                }
            } catch (error) {
                alert('O\'chirishda xatolik yuz berdi');
            }
        }
    };

    const filteredAmenities = amenities.filter(a =>
        a.name_uz.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.name_ru.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-grow max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Qulayliklarni qidirish..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center space-x-2 px-8 py-3.5 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-95 whitespace-nowrap"
                >
                    <Plus size={20} />
                    <span className="font-black text-sm uppercase tracking-wider">Yangi qo'shish</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Icon</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nomi (UZ)</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nomi (RU)</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                                        Yuklanmoqda...
                                    </td>
                                </tr>
                            ) : filteredAmenities.length > 0 ? filteredAmenities.map((amenity) => {
                                const Icon = iconMap[amenity.icon] || Smile;
                                return (
                                    <tr key={amenity.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                                                <Icon size={20} />
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-gray-900 dark:text-white uppercase">{amenity.name_uz}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{amenity.name_ru}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => handleOpenModal(amenity)}
                                                    className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-2xl transition-all"
                                                >
                                                    <Edit size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(amenity.id)}
                                                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-2xl transition-all"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400">
                                        Ma'lumot topilmadi
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSaving && setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="text-xl font-bold">
                                    {editingAmenity ? 'Qulaylikni tahrirlash' : 'Yangi qulaylik'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-50">Nomi (UZ)</label>
                                        <input
                                            type="text"
                                            value={formData.name_uz}
                                            onChange={(e) => setFormData({ ...formData, name_uz: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Masalan: HOVUZ"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-50">Nomi (RU)</label>
                                        <input
                                            type="text"
                                            value={formData.name_ru}
                                            onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Masalan: Бассейн"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-50">Nomi (EN)</label>
                                        <input
                                            type="text"
                                            value={formData.name_en}
                                            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                                            placeholder="Masalan: Pool"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold opacity-50 text-gray-500 dark:text-gray-400">Ikonkasi</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {Object.keys(iconMap).map((iconName) => {
                                                const Icon = iconMap[iconName];
                                                return (
                                                    <button
                                                        key={iconName}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, icon: iconName })}
                                                        className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-1 ${formData.icon === iconName
                                                            ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/30'
                                                            : 'bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-400'}`}
                                                    >
                                                        <Icon size={20} />
                                                        <span className="text-[8px] font-black uppercase tracking-tighter">{iconName}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-50 dark:border-gray-800">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-700"
                                    >
                                        Bekor qilish
                                    </button>
                                    <button
                                        disabled={isSaving}
                                        onClick={handleSave}
                                        className="px-8 py-2.5 bg-primary-600 text-white rounded-xl font-bold flex items-center space-x-2"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        <span>Saqlash</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
