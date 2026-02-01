import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import { listings } from '../data/listings';
import { ListingCard } from '../components/ListingCard';
import { SearchBar } from '../components/SearchBar';
import { SlidersHorizontal, ChevronDown, LayoutGrid, X } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function SearchResults() {
    const { t } = useI18n();
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [limit, setLimit] = useState(12);

    // Filters State
    const [region, setRegion] = useState(searchParams.get('region') || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minGuests, setMinGuests] = useState(searchParams.get('guests') || '');
    const [minRooms, setMinRooms] = useState('');
    const [amenities, setAmenities] = useState({
        pool: false, sauna: false, bbq: false, wifi: false, ac: false, kitchen: false
    });
    const [sort, setSort] = useState('popular');

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 700);
        return () => clearTimeout(timer);
    }, [searchParams]);

    const filteredListings = useMemo(() => {
        let result = [...listings];

        if (region) result = result.filter(l => l.region === region);
        if (minGuests) result = result.filter(l => l.guestsMax >= parseInt(minGuests));
        if (minRooms) result = result.filter(l => l.rooms >= parseInt(minRooms));
        if (minPrice) result = result.filter(l => l.pricePerNight >= parseInt(minPrice));
        if (maxPrice) result = result.filter(l => l.pricePerNight <= parseInt(maxPrice));

        // Amenities
        const activeAmenities = Object.keys(amenities).filter(key => amenities[key]);
        if (activeAmenities.length > 0) {
            result = result.filter(l =>
                activeAmenities.every(a => l.amenities[a])
            );
        }

        // Sort
        if (sort === 'price-low') result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        if (sort === 'price-high') result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        if (sort === 'popular') result.sort((a, b) => b.rating - a.rating);

        return result;
    }, [region, minGuests, minRooms, minPrice, maxPrice, amenities, sort]);

    const toggleAmenity = (key) => {
        setAmenities(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleClearFilters = () => {
        setRegion('');
        setMinPrice('');
        setMaxPrice('');
        setMinGuests('');
        setMinRooms('');
        setAmenities({ pool: false, sauna: false, bbq: false, wifi: false, ac: false, kitchen: false });
        setSearchParams({});
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
            {/* Mobile Search Bar - more compact on scroll results */}
            <div className="mb-6 block lg:hidden">
                <SearchBar initialData={Object.fromEntries(searchParams)} className="shadow-lg" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Filters Sidebar (Desktop) */}
                <aside className={`fixed inset-x-0 bottom-0 z-[60] lg:relative lg:z-0 lg:block lg:w-[350px] lg:shrink-0 bg-white dark:bg-gray-950 p-6 lg:p-0 overflow-y-auto transition-transform duration-500 lg:translate-y-0 rounded-t-[3rem] lg:rounded-none h-[85vh] lg:h-auto shadow-[0_-20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.4)] lg:shadow-none border-t border-gray-100 dark:border-gray-800 lg:border-none ${showFilters ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}`}>
                    <div className="flex flex-col items-center mb-8 lg:hidden">
                        <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mb-6 cursor-pointer" onClick={() => setShowFilters(false)} />
                        <div className="flex items-center justify-between w-full">
                            <h2 className="text-2xl font-extrabold tracking-tight">{t('filters')}</h2>
                            <button onClick={() => setShowFilters(false)} className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-full hover:bg-gray-100 transition-colors border border-gray-100 dark:border-gray-800">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Price Range */}
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
                                <span className="text-base">{t('price_range')}</span>
                                <span className="text-[10px] text-gray-400 font-medium">UZS</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Min Rooms */}
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-base">{t('rooms')}</h4>
                            <div className="grid grid-cols-5 gap-1.5">
                                {[1, 2, 3, 4, '5+'].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setMinRooms(n.toString())}
                                        className={`py-2 rounded-lg text-xs font-bold border transition-all duration-300 ${minRooms === n.toString() ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/20' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-primary-500'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-base">{t('amenities')}</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {Object.keys(amenities).map((key) => (
                                    <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={amenities[key]}
                                                onChange={() => toggleAmenity(key)}
                                                className="peer h-5 w-5 appearance-none rounded-md border-2 border-gray-200 dark:border-gray-800 checked:bg-primary-600 checked:border-primary-600 transition-all duration-300"
                                            />
                                            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-1 pointer-events-none transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-gray-600 dark:text-gray-400 group-hover:text-primary-600 transition-colors uppercase text-[10px] font-bold tracking-wide">{t(key)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button variant="outline" className="w-full h-11 rounded-xl border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-sm" onClick={handleClearFilters}>
                                Tozalash
                            </Button>
                        </div>
                    </div>
                    {/* Padding for iOS home indicator */}
                    <div className="h-10 lg:hidden" />
                </aside>

                {/* Main Content */}
                <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0 px-1">
                        <div>
                            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">{filteredListings.length} ta natija topildi</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button onClick={() => setShowFilters(true)} className="lg:hidden flex-1 flex items-center justify-center space-x-2 h-11 rounded-xl shadow-sm" variant="outline">
                                <SlidersHorizontal className="w-4 h-4" />
                                <span className="font-bold">{t('filters')}</span>
                            </Button>

                            <div className="relative shrink-0 flex-1 md:flex-none">
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                    className="w-full md:w-auto pl-4 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold appearance-none focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all"
                                >
                                    <option value="popular">{t('popular')}</option>
                                    <option value="price-low">{t('price_low')}</option>
                                    <option value="price-high">{t('price_high')}</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800/20 p-2 rounded-2xl border border-gray-50 dark:border-gray-900 animate-pulse">
                                    <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-xl mb-4" />
                                    <div className="px-2 space-y-3">
                                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4" />
                                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-1/2" />
                                        <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-lg w-1/3 mt-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 mb-12">
                            {filteredListings.slice(0, limit).map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredListings.length > limit && (
                        <div className="flex justify-center pt-8 border-t border-gray-100 dark:border-gray-900 mt-12">
                            <Button onClick={() => setLimit(limit + 12)} className="px-12 h-14 rounded-2xl font-bold shadow-xl shadow-primary-500/20">
                                Yana yuklash
                            </Button>
                        </div>
                    )}

                    {!isLoading && filteredListings.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-50/50 dark:bg-gray-900/20 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800 px-6">
                            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl shadow-xl flex items-center justify-center mb-8 rotate-3">
                                <LayoutGrid className="w-10 h-10 text-primary-500" />
                            </div>
                            <h3 className="text-2xl font-extrabold mb-3 tracking-tight">Hozircha natija yo'q</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                                Qidiruv parametrlarini o'zgartirib ko'ring yoki filtrlarni tozalang. Bizda har qanday ta'mga mos dachalar bor!
                            </p>
                            <Button onClick={handleClearFilters} className="mt-10 px-10 h-12 rounded-2xl shadow-lg shadow-primary-500/20">
                                Filtrlarni tozalash
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {showFilters && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[55] lg:hidden animate-in fade-in duration-300"
                    onClick={() => setShowFilters(false)}
                />
            )}
        </div>
    );
}
