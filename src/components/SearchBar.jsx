import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { regions } from '../data/regions';
import { Button } from './ui/Button';

export function SearchBar({ className, initialData = {} }) {
    const { t, lang } = useI18n();
    const navigate = useNavigate();
    const [region, setRegion] = useState(initialData.region || '');
    const [fromDate, setFromDate] = useState(initialData.from || '');
    const [toDate, setToDate] = useState(initialData.to || '');
    const [guests, setGuests] = useState(initialData.guests || '1');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (region) params.append('region', region);
        if (fromDate) params.append('from', fromDate);
        if (toDate) params.append('to', toDate);
        if (guests) params.append('guests', guests);

        navigate(`/search?${params.toString()}`);
    };

    return (
        <div className={`w-full max-w-5xl mx-auto ${className}`}>
            <div className="bg-white dark:bg-gray-800 p-3 md:p-2 rounded-[2rem] md:rounded-full shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-stretch md:items-center space-y-1 md:space-y-0">
                {/* Region */}
                <div className="flex-1 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl md:rounded-full transition-colors cursor-pointer group relative">
                    <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 block pl-8 mb-0.5">{t('region')}</label>
                    <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-primary-600" />
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-semibold w-full appearance-none cursor-pointer placeholder-gray-400"
                        >
                            <option value="">{t('search_placeholder')}</option>
                            {regions.map((r) => (
                                <option key={r.id} value={r.id}>{r.name[lang]}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-gray-700 mx-2" />
                <div className="block md:hidden border-t border-gray-100 dark:border-gray-700 my-1 mx-4" />

                {/* Dates */}
                <div className="flex-1 flex flex-col sm:flex-row gap-1 sm:gap-0">
                    <div className="flex-1 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl md:rounded-full transition-colors cursor-pointer group">
                        <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 block pl-8 mb-0.5">{t('from')}</label>
                        <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-primary-600" />
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm font-semibold w-full cursor-pointer dark:invert dark:hue-rotate-180"
                            />
                        </div>
                    </div>

                    <div className="hidden sm:block w-px h-8 bg-gray-100 dark:bg-gray-700 my-auto" />
                    <div className="block sm:hidden border-t border-gray-50 dark:border-gray-800 mx-8" />

                    <div className="flex-1 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl md:rounded-full transition-colors cursor-pointer group">
                        <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 block pl-8 mb-0.5">{t('to')}</label>
                        <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-primary-600" />
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm font-semibold w-full cursor-pointer dark:invert dark:hue-rotate-180"
                            />
                        </div>
                    </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-gray-700 mx-2" />
                <div className="block md:hidden border-t border-gray-100 dark:border-gray-700 my-1 mx-4" />

                {/* Guests */}
                <div className="flex-1 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl md:rounded-full transition-colors cursor-pointer group">
                    <label className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 block pl-8 mb-0.5">{t('guests')}</label>
                    <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-primary-600" />
                        <select
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-semibold w-full appearance-none cursor-pointer"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 20].map((n) => (
                                <option key={n} value={n}>{n} {t('guests')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Action */}
                <div className="p-1 mt-2 md:mt-0">
                    <Button
                        onClick={handleSearch}
                        className="w-full md:w-auto h-12 md:h-14 px-10 rounded-2xl md:rounded-full flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/30"
                    >
                        <Search className="w-5 h-5" />
                        <span className="md:hidden lg:inline font-bold">{t('find')}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
