import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Star,
    MapPin,
    Eye,
    CheckCircle2,
    XCircle,
    X,
    Upload,
    Save,
    Loader2,
    LayoutGrid,
    Table as TableIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialListings = [
    {
        id: 1,
        name: "O'rmon bag'ridagi dacha",
        location: "Bo'stonliq, Toshkent",
        price: 1500000,
        rating: 4.8,
        status: "active",
        images: [
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=400"
        ],
        views: 1240,
        description: "Tabiat qo'ynidagi shinam dacha"
    },
    {
        id: 2,
        name: "Hovuzli zamonaviy villa",
        location: "Chimyon, Toshkent",
        price: 2500000,
        rating: 4.9,
        status: "active",
        images: [
            "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400"
        ],
        views: 850,
        description: "Barcha qulayliklarga ega zamonaviy villa"
    },
    {
        id: 3,
        name: "Tog' manzarali uy",
        location: "Zamin, Jizzax",
        price: 1200000,
        rating: 4.5,
        status: "inactive",
        images: [
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400"
        ],
        views: 420,
        description: "Tog' yonbag'ridagi sokin maskan"
    }
];

export const AdminListings = () => {
    const [listings, setListings] = useState(initialListings);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingListing, setEditingListing] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [viewType, setViewType] = useState('table'); // 'grid' or 'table'

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        price: '',
        description: '',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400']
    });

    const handleOpenModal = (listing = null) => {
        if (listing) {
            setEditingListing(listing);
            setFormData({
                name: listing.name,
                location: listing.location,
                price: listing.price,
                description: listing.description || '',
                status: listing.status,
                images: listing.images || [listing.image]
            });
        } else {
            setEditingListing(null);
            setFormData({
                name: '',
                location: '',
                price: '',
                description: '',
                status: 'active',
                images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400']
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            if (editingListing) {
                setListings(listings.map(l => l.id === editingListing.id ? { ...l, ...formData, price: Number(formData.price) } : l));
            } else {
                const newId = Math.max(...listings.map(l => l.id)) + 1;
                setListings([...listings, {
                    id: newId,
                    ...formData,
                    price: Number(formData.price),
                    rating: 0,
                    views: 0
                }]);
            }
            setIsSaving(false);
            setIsModalOpen(false);
        }, 1000);
    };

    const handleDelete = (id) => {
        if (window.confirm('Haqiqatdan ham ushbu dachani o\'chirib tashlamoqchimisiz?')) {
            setListings(listings.filter(l => l.id !== id));
        }
    };

    const toggleStatus = (id) => {
        setListings(listings.map(l =>
            l.id === id ? { ...l, status: l.status === 'active' ? 'inactive' : 'active' } : l
        ));
    };

    const filteredListings = listings.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-grow items-center gap-4 max-w-2xl">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Dachalarni qidirish..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm dark:text-white"
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
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center space-x-2 px-8 py-3.5 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-95 whitespace-nowrap"
                >
                    <Plus size={20} />
                    <span className="font-black text-sm uppercase tracking-wider">Yangi qo'shish</span>
                </button>
            </div>

            <AnimatePresence mode="wait">
                {viewType === 'table' ? (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-colors duration-500"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dacha</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Joylashuv</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Narx</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Reyting</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                    {filteredListings.length > 0 ? filteredListings.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                                                        <img src={listing.images?.[0] || listing.image} alt={listing.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        {listing.images?.length > 1 && (
                                                            <div className="absolute bottom-1 right-1 bg-black/50 backdrop-blur-sm text-[8px] text-white px-1 rounded-md font-black">
                                                                +{listing.images.length - 1}
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900 dark:text-white line-clamp-1">{listing.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">ID: #{listing.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                                    <MapPin size={14} className="mr-2 text-primary/60" />
                                                    <span className="text-xs font-bold">{listing.location}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-black text-gray-900 dark:text-white">
                                                    {listing.price.toLocaleString()} <span className="text-[10px] text-gray-400">so'm</span>
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl w-fit">
                                                    <Star size={12} fill="currentColor" />
                                                    <span className="text-xs font-black">{listing.rating}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <button
                                                    onClick={() => toggleStatus(listing.id)}
                                                    className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${listing.status === 'active'
                                                        ? 'bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-500 hover:text-white'
                                                        }`}
                                                >
                                                    {listing.status === 'active' ? <CheckCircle2 size={14} className="mr-1.5" /> : <XCircle size={14} className="mr-1.5" />}
                                                    {listing.status === 'active' ? 'Faol' : 'Nofaol'}
                                                </button>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => handleOpenModal(listing)}
                                                        className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-2xl transition-all"
                                                    >
                                                        <Edit size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(listing.id)}
                                                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-2xl transition-all"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Search size={48} className="text-gray-200 dark:text-gray-800 mb-4" />
                                                    <p className="text-gray-500 dark:text-gray-400 font-bold">Ma'lumot topilmadi</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredListings.length > 0 ? filteredListings.map((listing) => (
                            <motion.div
                                layout
                                key={listing.id}
                                className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all"
                            >
                                <div className="flex items-start space-x-4 mb-4">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 relative">
                                        <img src={listing.images?.[0] || listing.image} alt={listing.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        {listing.images?.length > 1 && (
                                            <div className="absolute bottom-1 right-1 bg-black/50 backdrop-blur-sm text-[8px] text-white px-1.5 py-0.5 rounded-lg font-black">
                                                +{listing.images.length - 1}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg mb-1 inline-block">#{listing.id}</span>
                                            <div className="flex items-center space-x-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg">
                                                <Star size={10} fill="currentColor" />
                                                <span className="text-[10px] font-black">{listing.rating}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-base font-black text-gray-900 dark:text-white truncate">{listing.name}</h3>
                                        <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                                            <MapPin size={12} className="mr-1 text-primary/60" />
                                            <span className="text-[10px] font-bold truncate">{listing.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                    <div className="flex flex-col">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kunlik narx</p>
                                        <p className="text-sm font-black text-gray-900 dark:text-white">
                                            {listing.price.toLocaleString()} <span className="text-[8px]">so'm</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => toggleStatus(listing.id)}
                                            className={`p-2 rounded-xl transition-all ${listing.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}
                                        >
                                            {listing.status === 'active' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(listing)}
                                            className="p-2 text-primary bg-primary/10 rounded-xl hover:bg-primary hover:text-white transition-all"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(listing.id)}
                                            className="p-2 text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full text-center py-20">
                                <Search size={48} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Hech narsa topilmadi</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
                            className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingListing ? 'Dachani tahrirlash' : 'Yangi dacha qo\'shish'}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nomi</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Dacha nomi..."
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Joylashuv</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Masalan: Bo'stonliq, Toshkent"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Narxi (bir kecha uchun)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="So'mda"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all appearance-none"
                                        >
                                            <option value="active">Faol</option>
                                            <option value="inactive">Nofaol</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Tavsif</label>
                                    <textarea
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Dacha haqida batafsil ma'lumot..."
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Rasmlar</label>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formData.images.length} ta rasm</span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm">
                                                <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            const newImages = formData.images.filter((_, i) => i !== index);
                                                            setFormData({ ...formData, images: newImages });
                                                        }}
                                                        className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/30 overflow-hidden">
                                            <Plus size={24} className="text-gray-400 mb-1" />
                                            <input
                                                type="text"
                                                placeholder="URL..."
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const url = e.target.value.trim();
                                                        if (url) {
                                                            setFormData({ ...formData, images: [...formData.images, url] });
                                                            e.target.value = '';
                                                        }
                                                    }
                                                }}
                                                className="w-full h-full absolute inset-0 opacity-0 cursor-pointer focus:opacity-100 focus:bg-white dark:focus:bg-gray-900 px-2 text-center text-[10px] font-medium outline-none transition-all"
                                            />
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter text-center px-2 pointer-events-none">URL yozib Enter'ni bosing</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-3">
                                <button
                                    disabled={isSaving}
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 transition-all disabled:opacity-50"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    disabled={isSaving}
                                    onClick={handleSave}
                                    className="px-8 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 flex items-center space-x-2 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    <span>{editingListing ? 'Saqlash' : 'Qo\'shish'}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
