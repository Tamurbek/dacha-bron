import { API_V1_URL } from '../../api/config';
import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Search,
    Star,
    Calendar,
    Trash2,
    Loader2,
    ChevronLeft,
    ChevronRight,
    MapPin,
    User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        fetchReviews(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    const fetchReviews = async (page = 1, search = '') => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_V1_URL}/reviews/?page=${page}&size=${pageSize}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            setReviews(data.items || []);
            setTotalPages(data.pages || 1);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteReview = async (id) => {
        if (window.confirm('Sharhni o\'chirib tashlamoqchimisiz?')) {
            try {
                const response = await fetch(`${API_V1_URL}/reviews/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchReviews(currentPage, searchTerm);
                }
            } catch (error) {
                alert('O\'chirishda xatolik yuz berdi');
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex flex-grow items-center gap-4 max-w-2xl">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Sharhlarni qidirish..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-all duration-500">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Foydalanuvchi</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Izoh</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sana</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" />
                                    </td>
                                </tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                                        Sharhlar topilmadi
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center font-black text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                    {review.user_name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900 dark:text-white">{review.user_name}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight flex items-center">
                                                        <MapPin size={10} className="mr-1" /> ID: {review.listing_id}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-200 dark:text-gray-700"}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md font-medium">
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {new Date(review.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination omitted if not needed, but good to have */}
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
