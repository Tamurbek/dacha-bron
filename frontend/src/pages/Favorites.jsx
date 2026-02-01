import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/useI18n';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { listings } from '../data/listings';
import { ListingCard } from '../components/ListingCard';
import { Heart, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function Favorites() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [favorites] = useLocalStorage('favorites', []);
    const [favoriteListings, setFavoriteListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const filtered = listings.filter(l => favorites.includes(l.id));
        setFavoriteListings(filtered);
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, [favorites]);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center space-x-4 mb-10">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center">
                    <Heart className="w-6 h-6 fill-red-600" />
                </div>
                <h1 className="text-3xl font-extrabold">{t('favorites')}</h1>
            </div>

            {favoriteListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {favoriteListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                        <Heart className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t('empty_favorites')}</h3>
                    <p className="text-gray-500 max-w-xs mb-8">Dam olish uchun eng yaxshi joylarni saqlab qo'ying va ular shu yerda ko'rinadi.</p>
                    <Button onClick={() => navigate('/search')} className="flex items-center space-x-2 px-8">
                        <Home className="w-4 h-4" />
                        <span>Qidiruvga qaytish</span>
                    </Button>
                </div>
            )}
        </div>
    );
}
