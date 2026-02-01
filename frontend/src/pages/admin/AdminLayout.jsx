import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    CalendarCheck,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Plus,
    Sun,
    Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../../components/Logo';

const SidebarLink = ({ to, icon: Icon, label, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
            ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-lg shadow-primary-500/30 ring-1 ring-primary-500/50'
            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
    >
        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
        <span className={active ? "font-bold" : "font-medium"}>{label}</span>
    </Link>
);

const BottomNavLink = ({ to, icon: Icon, active }) => (
    <Link
        to={to}
        className={`flex items-center justify-center w-full py-1 transition-all duration-300 ${active ? 'text-primary-600' : 'text-gray-400 dark:text-gray-500'}`}
    >
        <div className={`p-3 rounded-[1.5rem] transition-all duration-300 ${active ? 'bg-primary-500/10 scale-110' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}>
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
        </div>
    </Link>
);

export const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return document.documentElement.classList.contains('dark') ||
            localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Boshqaruv' },
        { path: '/admin/listings', icon: Home, label: 'Dachalar' },
        { path: '/admin/bookings', icon: CalendarCheck, label: 'Buyurtmalar' },
        { path: '/admin/users', icon: Users, label: 'Foydalanuvchilar' },
    ];

    const handleLogout = () => {
        if (window.confirm('Tizimdan chiqmoqchimisiz?')) {
            navigate('/');
        }
    };

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-500 text-gray-900 dark:text-gray-100 tracking-tight">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 sticky top-0 h-screen p-6 transition-colors duration-500">
                <div className="mb-10 px-2">
                    <Logo />
                </div>

                <nav className="flex-grow space-y-2">
                    {menuItems.map((item) => (
                        <SidebarLink
                            key={item.path}
                            to={item.path}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.path}
                        />
                    ))}
                </nav>

                <div className="mt-auto space-y-4">
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="font-medium">{isDarkMode ? 'Yorug\' rejim' : 'Tungi rejim'}</span>
                    </button>

                    <SidebarLink to="/admin/settings" icon={Settings} label="Sozlamalar" active={location.pathname === '/admin/settings'} />

                    <hr className="border-gray-100 dark:border-gray-800" />

                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Chiqish</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Top App Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 px-4 py-4 flex items-center justify-between transition-colors duration-500">
                <Logo iconOnly className="scale-90" />

                <div className="flex items-center space-x-2">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2.5 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-2xl transition-all"
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button className="p-2.5 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-2xl transition-all relative">
                        <Bell size={18} />
                        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    </button>
                    <Link
                        to="/admin/settings"
                        className={`p-2.5 rounded-2xl transition-all ${location.pathname === '/admin/settings' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800'}`}
                    >
                        <Settings size={18} />
                    </Link>
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar (iOS/Android Style) */}
            <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-[2.5rem] px-4 py-2 flex items-center justify-around shadow-2xl transition-all duration-500 overflow-hidden">
                {menuItems.map((item) => (
                    <BottomNavLink
                        key={item.path}
                        to={item.path}
                        icon={item.icon}
                        active={location.pathname === item.path}
                    />
                ))}
            </nav>

            {/* Main Content */}
            <main className="flex-grow w-full lg:max-w-[calc(100%-18rem)] pt-24 lg:pt-0 overflow-x-hidden min-h-screen pb-32 lg:pb-12">
                {/* Desktop Top Navbar */}
                <header className="hidden lg:flex items-center justify-between px-8 py-5 sticky top-0 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-md z-30 transition-colors duration-500">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white lowercase first-letter:uppercase">
                            {menuItems.find(item => item.path === location.pathname)?.label || 'Boshqaruv'}
                        </h1>
                        <p className="text-gray-500 text-sm">Xush kelibsiz, Admin</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2.5 text-gray-500 hover:bg-white dark:hover:bg-gray-900 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-800 rounded-xl transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-50 dark:border-gray-950"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800"></div>

                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">Admin</p>
                                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-blue-400 p-[2px]">
                                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-500">
                                    <span className="font-bold text-primary-600">A</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 lg:p-8 max-w-[1600px] mx-auto pb-8 lg:pb-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
