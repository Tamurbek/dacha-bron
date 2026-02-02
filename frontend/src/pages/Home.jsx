import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/useI18n';
import { SearchBar } from '../components/SearchBar';
import { ListingCard } from '../components/ListingCard';
import { listings } from '../data/listings';
import { regions } from '../data/regions';
import { Shield, Clock, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
    const { t, lang } = useI18n();
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/listings/?size=8');
                if (!response.ok) throw new Error('Ma\'lumotlarni yuklashda xatolik');
                const data = await response.json();

                // Map snake_case to camelCase from the 'items' array
                const mappedData = data.items.map(l => ({
                    ...l,
                    pricePerNight: l.price_per_night,
                    guestsMax: l.guests_max,
                    videoUrl: l.video_url
                }));

                setListings(mappedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListings();
    }, []);

    const featuredListings = listings.slice(0, 8);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="pb-16">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070"
                        className="w-full h-full object-cover"
                        alt="Hero Background"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 mt-12 md:mt-20">
                    <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white text-shadow-xl leading-tight tracking-tight">
                            O'zbekistonda dam olishni <br className="hidden sm:block" />
                            <span className="text-primary-400">biz bilan boshlang</span>
                        </h1>
                        <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto px-4 font-medium opacity-90">
                            Eng shinam dacha, villa va dam olish maskanlarini bir necha soniya ichida toping.
                        </p>
                    </div>
                    <SearchBar className="px-2 sm:px-0" />
                </div>
            </section>

            {/* Featured Listings */}
            <section className="max-w-7xl mx-auto px-4 mt-24">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{t('featured')}</h2>
                        <p className="text-gray-500 dark:text-gray-400">Biz tomonidan tanlangan eng yaxshi takliflar</p>
                    </div>
                    <Link to="/search" className="text-primary-600 font-bold hover:underline">
                        Barchasini ko'rish →
                    </Link>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {featuredListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            </section>

            {/* Regions Grid */}
            <section className="bg-gray-100 dark:bg-gray-900/50 py-24 mt-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">{t('regions')}</h2>
                        <p className="text-gray-500 dark:text-gray-400">O'zbekistonning eng go'zal go'shalari</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {regions.map((region) => (
                            <Link
                                key={region.id}
                                to={`/search?region=${region.id}`}
                                className="group relative h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                            >
                                <img
                                    src={region.image}
                                    alt={region.name[lang]}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-white font-bold">{region.name[lang]}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">{t('why_us')}</h2>
                    <p className="text-gray-500 dark:text-gray-400">Nima uchun minglab odamlar bizni tanlashadi?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { icon: Shield, title: "Xavfsiz Bron", desc: "Barcha joylar tekshirilgan va xavfsiz to'lov tizimiga ega." },
                        { icon: Zap, title: "Tezkor Tasdiq", desc: "Joy egasi bilan bog'lanish va tasdiqni kutish shart emas." },
                        { icon: Star, title: "Haqiqiy Sharhlar", desc: "Faqatgina ushbu joyda dam olgan foydalanuvchilar sharh qoldira oladi." },
                    ].map((feature, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-4 group">
                            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold">{feature.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
