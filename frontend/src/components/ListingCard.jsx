import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, MapPin, Users, Bed } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { regions } from '../data/regions';

export function ListingCard({ listing }) {
    const { t, lang } = useI18n();
    const [favorites, setFavorites] = useLocalStorage('favorites', []);
    const [isFavorite, setIsFavorite] = useState(false);

    const regionName = regions.find(r => r.id === listing.region)?.name[lang] || listing.region;

    useEffect(() => {
        setIsFavorite(favorites.some((id) => id === listing.id));
    }, [favorites, listing.id]);

    const toggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isFavorite) {
            setFavorites(favorites.filter((id) => id !== listing.id));
        } else {
            setFavorites([...favorites, listing.id]);
        }
    };

    return (
        <Link to={`/listing/${listing.id}`} className="group block h-full bg-white dark:bg-gray-800/50 rounded-2xl p-2 md:p-0 md:bg-transparent md:dark:bg-transparent shadow-sm md:shadow-none hover:shadow-md md:hover:shadow-none transition-all">
            <div className="relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden mb-3">
                <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button
                    onClick={toggleFavorite}
                    className="absolute top-2 right-2 md:top-3 md:right-3 p-2 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
                >
                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-200'}`} />
                </button>
                <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-white text-[10px] md:text-xs font-bold ring-1 ring-white/20">
                    {regionName}
                </div>
            </div>

            <div className="px-1 pb-1 space-y-1">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {listing.title}
                    </h3>
                    <div className="flex items-center space-x-1 shrink-0 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-lg">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">{listing.rating}</span>
                    </div>
                </div>

                <div className="flex items-center text-[11px] md:text-sm text-gray-500 dark:text-gray-400 space-x-3">
                    <div className="flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1 text-primary-500/70" />
                        <span>{listing.guestsMax}</span>
                    </div>
                    <div className="flex items-center border-l border-gray-200 dark:border-gray-700 pl-3">
                        <Bed className="w-3.5 h-3.5 mr-1 text-primary-500/70" />
                        <span>{listing.rooms}</span>
                    </div>
                </div>

                <div className="pt-1.5 flex items-baseline space-x-1">
                    <span className="text-base md:text-lg font-extrabold text-primary-600">
                        {listing.pricePerNight.toLocaleString()}
                    </span>
                    <span className="text-[10px] md:text-xs font-semibold text-gray-500 dark:text-gray-400">
                        UZS / {t('per_night')}
                    </span>
                </div>
            </div>
        </Link>
    );
}
