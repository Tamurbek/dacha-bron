import { API_V1_URL } from '../../api/config';
import React, { useState, useEffect } from 'react';
import {
    Home,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Download,
    Mail,
    Phone,
    ChevronDown,
    LayoutGrid,
    Table as TableIcon,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialBookings = [
    {
        id: "BK-7821",
        customer: "Alisher Navoiy",
        property: "O'rmon bag'ridagi dacha",
        date: "2024-03-15 - 2024-03-17",
        amount: 3000000,
        status: "confirmed",
        phone: "+998 90 123 45 67"
    },
    {
        id: "BK-7822",
        customer: "Zahiddin Bobur",
        property: "Hovuzli zamonaviy villa",
        date: "2024-03-20 - 2024-03-22",
        amount: 5000000,
        status: "pending",
        phone: "+998 93 456 78 90"
    },
    {
        id: "BK-7823",
        customer: "Amir Temur",
        property: "Tog' manzarali uy",
        date: "2024-03-10 - 2024-03-12",
        amount: 2400000,
        status: "completed",
        phone: "+998 94 987 65 43"
    },
    {
        id: "BK-7824",
        customer: "Ibn Sino",
        property: "O'rmon bag'ridagi dacha",
        date: "2024-03-25 - 2024-03-27",
        amount: 3000000,
        status: "cancelled",
        phone: "+998 97 111 22 33"
    }
];

const StatusBadge = ({ status }) => {
    const styles = {
        confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500",
        pending: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500",
        completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500",
        cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500",
    };

    const icons = {
        confirmed: <CheckCircle size={12} className="mr-1" />,
        pending: <Clock size={12} className="mr-1" />,
        completed: <CheckCircle size={12} className="mr-1" />,
        cancelled: <XCircle size={12} className="mr-1" />,
    };

    const labels = {
        confirmed: "Tasdiqlangan",
        pending: "Kutilmoqda",
        completed: "Yakunlangan",
        cancelled: "Bekor qilingan",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
            {icons[status]}
            {labels[status]}
        </span>
    );
};

export const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeMenu, setActiveMenu] = useState(null);
    const [viewType, setViewType] = useState('table'); // 'grid' or 'table'
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchBookings(currentPage, statusFilter);
    }, [currentPage, statusFilter]);

    const fetchBookings = async (page = 1, status = 'all') => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_V1_URL}/bookings/?page=${page}&size=${pageSize}&status=${status}`);
            const data = await response.json();

            const mappedData = data.items.map(b => ({
                id: `BK-${b.id}`,
                realId: b.id,
                customer: b.user_name,
                property: b.listing_title,
                date: `${new Date(b.check_in).toLocaleDateString()} - ${new Date(b.check_out).toLocaleDateString()}`,
                amount: b.total_price,
                status: b.status,
                phone: "+998 00 000 00 00" // Backend doesn't have phone in booking, maybe in user?
            }));

            setBookings(mappedData);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        const realId = bookings.find(b => b.id === id)?.realId;
        if (!realId) return;

        try {
            const response = await fetch(`${API_V1_URL}/bookings/${realId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                fetchBookings(currentPage, statusFilter);
            }
        } catch (error) {
            alert('Statusni o\'zgartirishda xatolik yuz berdi');
        }
        setActiveMenu(null);
    };

    const filteredBookings = bookings; // Filtering handled by backend

    const stats = {
        total: bookings.length, // This is just for current page, ideally should be from a separate stats API
        paid: bookings.filter(b => b.status === 'completed' || b.status === 'confirmed').reduce((acc, b) => acc + b.amount, 0),
        debt: bookings.filter(b => b.status === 'pending').reduce((acc, b) => acc + b.amount, 0)
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Mini Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: 'Jami buyurtmalar', value: stats.total, unit: 'ta', color: 'text-primary' },
                    { label: 'To\'langan jami', value: stats.paid.toLocaleString(), unit: 'so\'m', color: 'text-green-500' },
                    { label: 'Qarz (kutilmoqda)', value: stats.debt.toLocaleString(), unit: 'so\'m', color: 'text-red-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                        <div className="flex items-center space-x-3">
                            <div className={`w-2 h-8 rounded-full ${stat.color === 'text-primary' ? 'bg-primary-600' : stat.color.replace('text-', 'bg-')}`} />
                            <div className="flex items-baseline space-x-1">
                                <p className={`text-2xl font-black ${stat.color === 'text-primary' ? 'text-primary-600 dark:text-primary-400' : stat.color}`}>{stat.value}</p>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{stat.unit}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-grow items-center gap-4 max-w-2xl">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buyurtmalar (ID, mijoz)..."
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
                <div className="flex items-center space-x-4">
                    <select
                        className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none text-sm font-black text-gray-700 dark:text-white cursor-pointer hover:border-primary/50 transition-colors"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Barcha statuslar</option>
                        <option value="pending">Kutilmoqda</option>
                        <option value="confirmed">Tasdiqlangan</option>
                        <option value="completed">Yakunlangan</option>
                        <option value="cancelled">Bekor qilingan</option>
                    </select>
                    <button className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-500 shadow-sm">
                        <Download size={22} />
                    </button>
                </div>
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
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mijoz</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Dacha</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sana</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Summa</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                    {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <span className="text-xs font-black text-primary-600 dark:text-primary-400 bg-primary-600/10 px-3 py-1.5 rounded-xl border border-primary-600/20">
                                                    {booking.id}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900 dark:text-white">{booking.customer}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-0.5">{booking.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{booking.property}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-black whitespace-nowrap bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-xl w-fit">
                                                    <Calendar size={14} className="mr-2 text-primary" />
                                                    {booking.date}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-base font-black text-gray-900 dark:text-white">
                                                    {booking.amount.toLocaleString()} <span className="text-[10px] text-gray-400">so'm</span>
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 relative">
                                                <button
                                                    onClick={() => setActiveMenu(activeMenu === booking.id ? null : booking.id)}
                                                    className="group flex items-center space-x-2 hover:opacity-80 transition-all bg-gray-50 dark:bg-gray-800/50 p-1 pr-3 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                                >
                                                    <StatusBadge status={booking.status} />
                                                    <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-transform duration-300" style={{ transform: activeMenu === booking.id ? 'rotate(180deg)' : 'none' }} />
                                                </button>
                                                <AnimatePresence>
                                                    {activeMenu === booking.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                className="absolute z-20 top-full left-6 mt-2 w-52 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 py-3 overflow-hidden"
                                                            >
                                                                {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                                                                    <button
                                                                        key={status}
                                                                        onClick={() => updateStatus(booking.id, status)}
                                                                        className={`w-full text-left px-5 py-2.5 text-xs font-black transition-all capitalize ${booking.status === status ? 'text-primary bg-primary/10' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                                                                    >
                                                                        {status === 'pending' ? 'Kutilmoqda' :
                                                                            status === 'confirmed' ? 'Tasdiqlangan' :
                                                                                status === 'completed' ? 'Yakunlangan' : 'Bekor qilingan'}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-3">
                                                    <a href={`tel:${booking.phone}`} className="p-3 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/40 rounded-2xl transition-all shadow-sm">
                                                        <Phone size={20} />
                                                    </a>
                                                    <button className="p-3 text-gray-400 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-2xl transition-all shadow-sm">
                                                        <Mail size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Search size={48} className="text-gray-200 dark:text-gray-800 mb-4" />
                                                    <p className="text-gray-500 dark:text-gray-400 font-bold">Buyurtmalar topilmadi</p>
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
                        {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                            <motion.div
                                layout
                                key={booking.id}
                                className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl group overflow-hidden relative"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-gray-900 dark:text-white line-clamp-1">{booking.customer}</h3>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{booking.id}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={booking.status} />
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 font-bold">
                                        <div className="w-6 h-6 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center mr-2">
                                            <Home size={12} className="text-primary" />
                                        </div>
                                        <span className="truncate">{booking.property}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 font-bold">
                                        <div className="w-6 h-6 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center mr-2">
                                            <Calendar size={12} className="text-primary" />
                                        </div>
                                        <span>{booking.date}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Jami summa</p>
                                        <p className="text-base font-black text-gray-900 dark:text-white">
                                            {booking.amount.toLocaleString()} <span className="text-[10px]">so'm</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <a href={`tel:${booking.phone}`} className="p-3 bg-green-50 dark:bg-green-950/20 text-green-600 rounded-2xl hover:bg-green-500 hover:text-white transition-all">
                                            <Phone size={18} />
                                        </a>
                                        <button
                                            onClick={() => setActiveMenu(activeMenu === booking.id ? null : booking.id)}
                                            className="p-3 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                                <Search size={48} className="mx-auto text-gray-200 dark:text-gray-800 mb-4" />
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Buyurtmalar topilmadi</p>
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
