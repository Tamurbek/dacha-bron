import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Heart, Languages, Search, SlidersHorizontal, Smartphone } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { Button } from './ui/Button';

export function Header() {
    const { t, lang, setLang } = useI18n();
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem('theme');
        if (stored) return stored === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [isMobileSim, setIsMobileSim] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isMobileSim) {
            document.body.classList.add('mobile-sim');
        } else {
            document.body.classList.remove('mobile-sim');
        }
    }, [isMobileSim]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <header className="sticky top-0 z-50 w-full glass border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-600 rounded-lg md:rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg md:text-xl">O</span>
                        </div>
                        <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-sky-500 hidden xs:block">
                            Orom.uz
                        </span>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Language Dropdown */}
                        <div className="relative group">
                            <Button variant="ghost" className="p-2">
                                <Languages className="w-5 h-5" />
                                <span className="ml-1 uppercase text-xs font-bold">{lang}</span>
                            </Button>
                            <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                {['uz', 'ru', 'en'].map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLang(l)}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl uppercase"
                                    >
                                        {l === 'uz' ? "O'zbek" : l === 'ru' ? "Русский" : "English"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Simulator Toggle */}
                        <Button
                            variant="ghost"
                            onClick={() => setIsMobileSim(!isMobileSim)}
                            className={`hidden md:flex p-2 items-center space-x-2 ${isMobileSim ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-600 dark:text-gray-300'}`}
                            title="Mobile Preview"
                        >
                            <Smartphone className="w-5 h-5" />
                            <span className="text-xs font-bold">Mobile</span>
                        </Button>

                        {/* Dark Mode Toggle */}
                        <Button
                            variant="ghost"
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 text-gray-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {isDark ? <Sun className="w-5 h-5 transition-transform hover:rotate-90 duration-500" /> : <Moon className="w-5 h-5 text-indigo-600 transition-transform hover:-rotate-12 duration-500" />}
                        </Button>

                        {/* Favorites */}
                        <Link to="/favorites">
                            <Button variant="ghost" className="p-2 relative">
                                <Heart className="w-5 h-5" />
                            </Button>
                        </Link>

                        <Button onClick={() => navigate('/search')} className="hidden sm:flex items-center space-x-2">
                            <Search className="w-4 h-4" />
                            <span>{t('search')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
