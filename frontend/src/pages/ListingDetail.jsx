import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import { listings } from '../data/listings';
import { Star, MapPin, Users, Bed, Bath, Wifi, Wind, Flame, Waves, Coffee, Utensils, Share2, Heart, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BookingCard } from '../components/BookingCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { regions } from '../data/regions';

const isVideo = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg|mov|m4v)($|\?)/i) || url.includes('mov_bbb.mp4');
};

export function ListingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, lang } = useI18n();
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mainImage, setMainImage] = useState(0);
    const [favorites, setFavorites] = useLocalStorage('favorites', []);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/api/v1/listings/${id}`);
                if (!response.ok) throw new Error('Dacha topilmadi');
                const data = await response.json();

                // Map snake_case from API to camelCase used in frontend components
                const mappedListing = {
                    ...data,
                    pricePerNight: data.price_per_night,
                    reviewsCount: data.reviews_count,
                    guestsMax: data.guests_max,
                    videoUrl: data.video_url
                };

                setListing(mappedListing);
                setIsFavorite(favorites.includes(mappedListing.id));
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListing();
    }, [id, favorites]);

    const toggleFavorite = () => {
        if (isFavorite) {
            setFavorites(favorites.filter(fid => fid !== listing.id));
            setIsFavorite(false);
        } else {
            setFavorites([...favorites, listing.id]);
            setIsFavorite(true);
        }
    };

    if (isLoading) {
        return (
            <div className="animate-pulse max-w-7xl mx-auto px-4 py-10 space-y-8">
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                <div className="grid grid-cols-4 h-[500px] gap-4">
                    <div className="col-span-3 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
                    <div className="space-y-4">
                        <div className="h-1/3 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                        <div className="h-1/3 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                        <div className="h-1/3 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!listing) return <div className="text-center py-24">Listing not found</div>;

    const regionName = regions.find(r => r.id === listing.region)?.name[lang] || listing.region;

    const amenitiesIcons = {
        pool: Waves,
        sauna: Flame,
        bbq: Utensils,
        wifi: Wifi,
        ac: Wind,
        kitchen: Coffee
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span>{regionName}</span>
                        <span>•</span>
                        <span className="flex items-center"><Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" /> {listing.rating} ({listing.reviewsCount} sharh)</span>
                    </div>
                    <h1 className="text-3xl font-extrabold">{listing.title}</h1>
                    <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="underline font-medium">{listing.location}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Button variant="ghost" className="hidden sm:flex items-center space-x-2">
                        <Share2 className="w-4 h-4" />
                        <span>Ulashish</span>
                    </Button>
                    <Button variant="ghost" onClick={toggleFavorite} className="flex items-center space-x-2">
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        <span>{isFavorite ? 'Saqlangan' : 'Saqlash'}</span>
                    </Button>
                </div>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px] md:h-[500px] mb-12">
                <div className="md:col-span-3 relative rounded-3xl overflow-hidden group bg-gray-100 dark:bg-gray-800">
                    {listing.videoUrl && mainImage === 0 ? (
                        <video
                            src={listing.videoUrl}
                            className="w-full h-full object-cover"
                            controls
                            autoPlay
                            muted
                            loop
                        />
                    ) : (
                        (() => {
                            const currentMedia = listing.images[listing.videoUrl ? mainImage - 1 : mainImage];
                            return isVideo(currentMedia) ? (
                                <video src={currentMedia} className="w-full h-full object-cover" controls muted loop autoPlay />
                            ) : (
                                <img
                                    src={currentMedia}
                                    className="w-full h-full object-cover"
                                    alt="Main"
                                />
                            );
                        })()
                    )}

                    <button
                        onClick={() => {
                            const totalItems = listing.images.length + (listing.videoUrl ? 1 : 0);
                            setMainImage((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={() => {
                            const totalItems = listing.images.length + (listing.videoUrl ? 1 : 0);
                            setMainImage((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <ChevronRight />
                    </button>
                </div>
                <div className="hidden md:grid grid-rows-3 gap-4">
                    {listing.videoUrl && (
                        <div
                            className={`rounded-2xl overflow-hidden cursor-pointer border-4 transition-all relative ${mainImage === 0 ? 'border-primary-600' : 'border-transparent'}`}
                            onClick={() => setMainImage(0)}
                        >
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                            <img src={listing.images[0]} className="w-full h-full object-cover blur-[2px]" alt="Video Thumb" />
                        </div>
                    )}
                    {listing.images.slice(0, listing.videoUrl ? 2 : 3).map((img, i) => {
                        const actualIndex = listing.videoUrl ? i + 1 : i;
                        return (
                            <div
                                key={i}
                                className={`rounded-2xl overflow-hidden cursor-pointer border-4 transition-all relative ${mainImage === actualIndex ? 'border-primary-600' : 'border-transparent'}`}
                                onClick={() => setMainImage(actualIndex)}
                            >
                                {isVideo(img) && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                                        <Play className="w-6 h-6 text-white fill-white" />
                                    </div>
                                )}
                                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${actualIndex}`} />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Side: Details */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="flex justify-between items-center py-6 border-y border-gray-100 dark:border-gray-800">
                        <div className="flex space-x-8">
                            <div className="flex flex-col items-center">
                                <Users className="w-6 h-6 mb-1 text-gray-400" />
                                <span className="text-sm font-bold">{listing.guestsMax} kishi</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Bed className="w-6 h-6 mb-1 text-gray-400" />
                                <span className="text-sm font-bold">{listing.rooms} xona</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <Bath className="w-6 h-6 mb-1 text-gray-400" />
                                <span className="text-sm font-bold">{listing.baths} hammom</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">Tavsif</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {listing.description}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-6">{t('amenities')}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {Object.entries(listing.amenities).map(([key, value]) => {
                                const Icon = amenitiesIcons[key];
                                return (
                                    <div key={key} className={`flex items-center space-x-3 ${value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-300 dark:text-gray-600 line-through'}`}>
                                        <div className={`p-2 rounded-xl bg-gray-50 dark:bg-gray-900 ${value ? 'text-primary-600' : 'text-gray-300'}`}>
                                            {Icon && <Icon className="w-6 h-6" />}
                                        </div>
                                        <span className="font-medium uppercase text-xs">{t(key)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold mb-8">{t('reviews')}</h2>
                        <div className="space-y-8">
                            {[1, 2].map((r) => (
                                <div key={r} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-primary-200 text-primary-700 flex items-center justify-center font-bold">
                                            J
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Jasur Turdiyev</h4>
                                            <p className="text-xs text-gray-500">Iyun 2023</p>
                                        </div>
                                        <div className="flex ml-auto">
                                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Ajoyib joy! Hammasi toza va tartibli. Oilamiz bilan juda dam oldik. Tavsiya qilaman!
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Booking Card */}
                <div className="lg:block">
                    <BookingCard listing={listing} />
                </div>
            </div>
        </div>
    );
}
