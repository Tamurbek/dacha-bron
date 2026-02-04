import { API_V1_URL } from '../../api/config';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Star,
    MapPin,
    CheckCircle2,
    XCircle,
    LayoutGrid,
    Table as TableIcon,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

export const AdminListings = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewType, setViewType] = useState('table'); // 'grid' or 'table'
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);

    const fetchListings = async (page = 1, search = '') => {
        try {
            const response = await fetch(`${API_V1_URL}/listings/?page=${page}&size=${pageSize}&search=${encodeURIComponent(search)}&status=all`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            const items = data.items || [];
            const mappedData = items.map(l => ({
                ...l,
                name: l.title,
                price: l.price_per_night,
                image: (l.images && l.images.length > 0) ? l.images[0] : '',
                videoUrl: l.video_url
            }));

            setListings(mappedData);
            setTotalPages(data.pages || 1);
        } catch (error) {
            console.error('Error fetching listings:', error);
            setListings([]);
            setTotalPages(1);
        }
    };

    useEffect(() => {
        fetchListings(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const handleDelete = async (id) => {
        if (window.confirm('Haqiqatdan ham ushbu dachani o\'chirib tashlamoqchimisiz?')) {
            try {
                const response = await fetch(`${API_V1_URL}/listings/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    await fetchListings();
                }
            } catch (error) {
                alert('O\'chirishda xatolik yuz berdi');
            }
        }
    };

    const toggleStatus = async (id) => {
        const listing = listings.find(l => l.id === id);
        if (!listing) return;

        const newStatus = listing.status === 'active' ? 'inactive' : 'active';

        try {
            const response = await fetch(`${API_V1_URL}/listings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setListings(listings.map(l =>
                    l.id === id ? { ...l, status: newStatus } : l
                ));
            }
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Statusni o\'zgartirishda xatolik yuz berdi');
        }
    };

    const filteredListings = listings; // Search is now handled by backend
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
                    onClick={() => navigate('/admin/listings/new')}
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
                                                        onClick={() => navigate(`/admin/listings/edit/${listing.id}`)}
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
                                            onClick={() => navigate(`/admin/listings/edit/${listing.id}`)}
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Sahifa {currentPage} / {totalPages}
                    </p>
                    <div className="flex items-center space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-500 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-500 transition-all shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            if (
                                totalPages > 7 &&
                                pageNum !== 1 &&
                                pageNum !== totalPages &&
                                (pageNum < currentPage - 1 || pageNum > currentPage + 1)
                            ) {
                                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                    return <span key={pageNum} className="text-gray-400">...</span>;
                                }
                                return null;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all shadow-sm ${currentPage === pageNum
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 hover:border-primary/50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-500 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-500 transition-all shadow-sm"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
