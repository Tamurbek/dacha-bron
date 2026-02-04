import { API_V1_URL } from '../api/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import { listings } from '../data/listings';
import { Star, MapPin, Users, Bed, Bath, Wifi, Wind, Flame, Waves, Coffee, Utensils, Share2, Heart, ChevronLeft, ChevronRight, Play, Smile, Maximize, Minimize, X, CheckCircle2, LayoutGrid } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BookingCard } from '../components/BookingCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CustomVideoPlayer } from '../components/ui/CustomVideoPlayer';
import { regions } from '../data/regions';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { AnimatePresence, motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapRefresher = ({ trigger }) => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }, [map, trigger]);
    return null;
};

const isVideo = (url) => {
    if (!url) return false;
    // Check for common video extensions
    const hasVideoExt = url.match(/\.(mp4|webm|ogg|mov|m4v|hevc)($|\?)/i);
    // Check for known video patterns
    const isSpecialVideo = url.includes('mov_bbb.mp4') ||
        url.includes('youtube.com') ||
        url.includes('youtu.be') ||
        (url.includes('/proxy/telegram/') && url.match(/\.(mp4|mov|webm)($|\?)/i));

    return hasVideoExt || isSpecialVideo;
};

const getYoutubeThumbnail = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
};

const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : url;
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
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [shareStatus, setShareStatus] = useState('ideal'); // 'ideal' or 'copied'

    useEffect(() => {
        const fetchListing = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_V1_URL}/listings/${id}`);
                if (!response.ok) throw new Error('Dacha topilmadi');
                const data = await response.json();

                // Map snake_case from API to camelCase used in frontend components
                const mappedListing = {
                    ...data,
                    pricePerNight: data.price_per_night,
                    reviewsCount: data.reviews_count,
                    guestsMax: data.guests_max,
                    videoUrl: data.video_url,
                    googleMapsUrl: data.google_maps_url,
                    latitude: data.latitude,
                    longitude: data.longitude
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

    const handleShare = async () => {
        const shareData = {
            title: listing.title,
            text: `Dacha bron qilish: ${listing.title} - ${listing.location}`,
            url: window.location.href,
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setShareStatus('copied');
                setTimeout(() => setShareStatus('ideal'), 2000);
            }
        } catch (err) {
            console.error('Error sharing:', err);
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
        kitchen: Coffee,
        Waves, Flame, Utensils, Wifi, Wind, Coffee, Smile,
        'WI-FI': Wifi,
        'KONDITSIONER': Wind,
        'OSHXONA': Coffee,
        'HOVUZ': Waves,
        'SAUNA': Flame,
        'BARBEKYU': Utensils
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
                        <span className="font-medium">{listing.location}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Button
                        variant="ghost"
                        onClick={handleShare}
                        className={`flex items-center space-x-2 transition-all duration-300 ${shareStatus === 'copied' ? 'text-green-600' : ''}`}
                    >
                        {shareStatus === 'copied' ? (
                            <>
                                <CheckCircle2 className="w-4 h-4 animate-in zoom-in" />
                                <span>Nusxalandi!</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="w-4 h-4" />
                                <span>Ulashish</span>
                            </>
                        )}
                    </Button>
                    <Button variant="ghost" onClick={toggleFavorite} className="flex items-center space-x-2">
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        <span>{isFavorite ? 'Saqlangan' : 'Saqlash'}</span>
                    </Button>
                </div>
            </div>

            {/* Luxury Cinematic Hero Gallery */}
            <div className="relative mb-16 group">
                <div className="flex flex-col md:flex-row gap-4 h-[400px] md:h-[480px]">
                    {/* Primary Large Image */}
                    <div
                        className="flex-[1.8] relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-gray-100 dark:bg-gray-800 shadow-2xl shadow-black/5"
                        onClick={() => { setMainImage(0); setIsLightboxOpen(true); }}
                    >
                        <img
                            src={listing.images[0]}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            alt="Main Hero"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Premium Label */}
                        <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-2xl">
                            Premium Dacha
                        </div>
                    </div>

                    {/* Secondary Stacked Column */}
                    <div className="flex-1 flex flex-col gap-4">
                        {/* Top Secondary */}
                        <div
                            className="flex-1 relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-gray-100 dark:bg-gray-800 shadow-xl shadow-black/5"
                            onClick={() => { setMainImage(1); setIsLightboxOpen(true); }}
                        >
                            {listing.images[1] ? (
                                <img
                                    src={listing.images[1]}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    alt="Secondary 1"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">Rasm yo'q</div>
                            )}
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                        </div>

                        {/* Bottom Secondary + View All Trigger */}
                        <div
                            className="flex-1 relative cursor-pointer overflow-hidden rounded-[2.5rem] bg-gray-100 dark:bg-gray-800 shadow-xl shadow-black/5"
                            onClick={() => { setMainImage(2); setIsLightboxOpen(true); }}
                        >
                            {listing.images[2] ? (
                                <img
                                    src={listing.images[2]}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    alt="Secondary 2"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">Rasm yo'q</div>
                            )}

                            {/* Glassmorphism View All Card */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
                                    className="px-8 py-5 bg-black/40 backdrop-blur-2xl border border-white/20 rounded-[2rem] text-white flex flex-col items-center group/btn hover:bg-black/60 transition-all duration-500 transform hover:scale-105"
                                >
                                    <span className="text-3xl font-black mb-1">
                                        {listing.images.length > 3 ? `+${listing.images.length - 2}` : 'Barcha'}
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Rasmlar</span>

                                    <div className="mt-4 flex items-center space-x-2 text-[9px] font-black px-4 py-2 bg-white text-black rounded-full opacity-0 group-hover/btn:opacity-100 transition-all duration-500 translate-y-2 group-hover/btn:translate-y-0">
                                        <span>KO'RISH</span>
                                        <Maximize size={10} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Bottom Navigation Badge (Mobile only) */}
                <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="md:hidden absolute bottom-6 right-6 px-6 py-3 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex items-center space-x-2 border border-gray-100 dark:border-gray-800 z-10 animate-bounce"
                >
                    <LayoutGrid size={16} className="text-primary-600" />
                    <span className="text-[10px] font-black uppercase">Barcha rasmlar</span>
                </button>
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
                                            {Icon ? <Icon className="w-6 h-6" /> : <Smile className="w-6 h-6" />}
                                        </div>
                                        <span className="font-medium uppercase text-xs">{t(key) === key ? key : t(key)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="pt-10 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h2 className="text-2xl font-bold">{t('location')}</h2>
                            {listing.googleMapsUrl && (
                                <Button
                                    onClick={() => window.open(listing.googleMapsUrl, '_blank')}
                                    className="flex items-center justify-center space-x-2 shadow-lg shadow-primary-600/20 px-6 py-3"
                                >
                                    <MapPin className="w-4 h-4" />
                                    <span>{t('get_directions')}</span>
                                </Button>
                            )}
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 group hover:border-primary-500/30 transition-all duration-500 mb-6">
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-primary-600 group-hover:scale-110 transition-transform duration-500">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                        {listing.location}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium italic">
                                        {regionName}
                                    </p>
                                </div>
                            </div>

                            {listing.latitude && listing.longitude && (
                                <div className={`${isMapFullscreen ? 'fixed inset-0 z-[110] bg-white dark:bg-gray-950' : 'h-80 rounded-[1.5rem] overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm'} relative z-0 transition-all duration-500`}>
                                    <button
                                        onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                                        className="absolute top-4 right-4 z-[2000] p-3 bg-white dark:bg-gray-800 rounded-xl shadow-2xl hover:scale-105 transition-all text-gray-900 dark:text-white border-2 border-primary-500"
                                    >
                                        {isMapFullscreen ? <Minimize size={26} /> : <Maximize size={22} />}
                                    </button>
                                    <MapContainer center={[listing.latitude, listing.longitude]} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={[listing.latitude, listing.longitude]}>
                                            <Popup>
                                                <div className="font-bold">{listing.title}</div>
                                                <div className="text-xs">{listing.location}</div>
                                            </Popup>
                                        </Marker>
                                        <MapRefresher trigger={isMapFullscreen} />
                                    </MapContainer>
                                </div>
                            )}
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
            {/* Lightbox Modal */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-black overflow-hidden"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-[1010]"
                        >
                            <X className="w-6 h-6 md:w-8 md:h-8" />
                        </button>

                        <div className="w-full h-full flex flex-col overflow-hidden">
                            {/* Main Slide */}
                            <div className="flex-1 relative flex items-center justify-center p-2 md:p-12">
                                <motion.div
                                    key={mainImage}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative max-w-6xl w-full h-full flex items-center justify-center"
                                >
                                    {(() => {
                                        const totalItems = listing.images.length + (listing.videoUrl ? 1 : 0);
                                        const currentIdx = mainImage;

                                        if (listing.videoUrl && currentIdx === 0) {
                                            return listing.videoUrl.includes('youtube') ? (
                                                <iframe src={getYoutubeEmbedUrl(listing.videoUrl)} className="w-full h-full rounded-2xl" allowFullScreen />
                                            ) : (
                                                <video src={listing.videoUrl} className="max-h-full max-w-full rounded-2xl" controls autoPlay />
                                            )
                                        }

                                        const imgIdx = listing.videoUrl ? currentIdx - 1 : currentIdx;
                                        const media = listing.images[imgIdx];
                                        if (isVideo(media)) {
                                            return <video src={media} className="max-h-full max-w-full rounded-2xl" controls autoPlay />
                                        }
                                        return <img src={media} className="max-h-full max-w-full object-contain rounded-2xl" alt="" />
                                    })()}
                                </motion.div>
                            </div>

                            {/* Controls */}
                            <button
                                onClick={() => {
                                    const total = listing.images.length + (listing.videoUrl ? 1 : 0);
                                    setMainImage(prev => prev > 0 ? prev - 1 : total - 1);
                                }}
                                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 md:p-5 bg-black/20 md:bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-[1005]"
                            >
                                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
                            </button>
                            <button
                                onClick={() => {
                                    const total = listing.images.length + (listing.videoUrl ? 1 : 0);
                                    setMainImage(prev => prev < total - 1 ? prev + 1 : 0);
                                }}
                                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 md:p-5 bg-black/20 md:bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-[1005]"
                            >
                                <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                            </button>

                            {/* Thumbnail Row */}
                            <div className="h-24 md:h-32 bg-gray-900/80 backdrop-blur-2xl border-t border-white/5 flex items-center px-4 md:px-8 overflow-x-auto space-x-2 md:space-x-4 relative z-[1020] no-scrollbar">
                                {listing.videoUrl && (
                                    <div
                                        onClick={() => setMainImage(0)}
                                        className={`flex-shrink-0 h-16 md:h-20 w-24 md:w-32 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${mainImage === 0 ? 'border-primary-500 scale-105' : 'border-transparent opacity-50'}`}
                                    >
                                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                            <Play className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                        </div>
                                    </div>
                                )}
                                {listing.images.map((img, i) => {
                                    const idx = listing.videoUrl ? i + 1 : i;
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => setMainImage(idx)}
                                            className={`flex-shrink-0 h-16 md:h-20 w-24 md:w-32 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${mainImage === idx ? 'border-primary-500 scale-105' : 'border-transparent opacity-50'}`}
                                        >
                                            {isVideo(img) ? (
                                                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                                </div>
                                            ) : (
                                                <img src={img} className="w-full h-full object-cover" alt="" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
