import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import { API_V1_URL } from '../api/config';
import { formatPhoneNumber } from '../utils/format';
import { ChevronLeft, CheckCircle, CreditCard, Wallet, Landmark, Phone, User, Calendar, Users, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Checkout() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useI18n();
    const [step, setStep] = useState(1);
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get search params for dates and guests
    const searchParams = new URLSearchParams(location.search);
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const guestsParam = searchParams.get('guests') || '1';

    const checkInDate = checkInParam ? new Date(checkInParam) : null;
    const checkOutDate = checkOutParam ? new Date(checkOutParam) : null;

    useEffect(() => {
        const fetchListing = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_V1_URL}/listings/${id}`);
                if (!response.ok) throw new Error('Listing not found');
                const data = await response.json();
                setListing({
                    ...data,
                    pricePerNight: data.price_per_night,
                    guestsMax: data.guests_max
                });
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        payment: 'payme'
    });

    if (isLoading) return <div className="text-center py-24">{t('loading')}</div>;
    if (!listing) return <div className="text-center py-24">Dacha topilmadi</div>;

    const calculateNights = () => {
        if (!checkInDate || !checkOutDate) return 1;
        const diffTime = Math.abs(checkOutDate - checkInDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    };

    const nights = calculateNights();
    const basePrice = listing.pricePerNight * nights;
    const serviceFee = Math.round(basePrice * 0.05);
    const total = basePrice + serviceFee;

    const formatDate = (date) => {
        if (!date) return 'Tanlanmagan';
        return date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' });
    };

    const nextStep = () => {
        if (step === 2) {
            handleCompleteBooking();
        } else {
            setStep(step + 1);
        }
    };

    const prevStep = () => setStep(step - 1);

    const handleCompleteBooking = async () => {
        try {
            const bookingData = {
                listing_id: parseInt(id),
                check_in: checkInDate.toISOString(),
                check_out: checkOutDate.toISOString(),
                guests: parseInt(guestsParam),
                customer_name: formData.name,
                customer_phone: formData.phone,
                total_price: total
            };

            const response = await fetch(`${API_V1_URL}/bookings/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create booking');
            }

            setStep(3);
        } catch (error) {
            console.error('Booking error:', error);
            alert(`Xatolik yuz berdi: ${error.message}`);
        }
    };

    if (step === 3) {
        return (
            <div className="max-w-xl mx-auto px-4 py-24 text-center">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <CheckCircle className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-extrabold mb-4">{t('success_msg')}</h1>
                <p className="text-gray-500 mb-10">
                    Sizning so'rovingiz qabul qilindi. Tez orada operatorimiz siz bilan bog'lanib, barcha tafsilotlarni tasdiqlaydi.
                </p>
                <Button onClick={() => navigate('/')} className="px-12 py-3 rounded-full">
                    Bosh sahifaga qaytish
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-12">
                <button onClick={prevStep} disabled={step === 1} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full disabled:opacity-30">
                    <ChevronLeft />
                </button>
                <div className="flex items-center space-x-4">
                    {[1, 2].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                {s}
                            </div>
                            {s < 2 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                        </div>
                    ))}
                </div>
                <div className="w-8" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">1. Reja va Sanalar</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-2xl flex items-center space-x-4">
                                    <Calendar className="text-primary-600" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Sanalar</p>
                                        <p className="font-semibold">{formatDate(checkInDate)} — {formatDate(checkOutDate)}</p>
                                    </div>
                                </div>
                                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-2xl flex items-center space-x-4">
                                    <Users className="text-primary-600" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Mehmonlar</p>
                                        <p className="font-semibold">{guestsParam} kishi</p>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={nextStep} className="w-full md:w-auto px-12 py-3 rounded-full mt-8">
                                Davom etish
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">2. Aloqa ma'lumotlari</h2>
                            <div className="space-y-4 max-w-lg">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t('name')}</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            placeholder="To'liq ismingiz"
                                            className="pl-12 py-3"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t('phone')}</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            placeholder="+998"
                                            className="pl-12 py-3"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button onClick={nextStep} className="w-full md:w-auto px-12 py-3 rounded-full mt-8" disabled={!formData.name || !formData.phone}>
                                {t('confirm_booking')}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="col-span-1">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 sticky top-24 border border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-xl mb-6">Xulosa</h3>
                        <div className="flex items-start space-x-4 mb-8">
                            <img src={listing.images[0]} className="w-24 h-24 rounded-2xl object-cover" />
                            <div>
                                <h4 className="font-bold text-sm line-clamp-2">{listing.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">{listing.region}</p>
                                <div className="flex items-center mt-2 text-xs font-bold">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                                    {listing.rating}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">{nights} kecha</span>
                                <span className="font-bold">{basePrice.toLocaleString()} UZS</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">To'lov xizmati</span>
                                <span className="font-bold">{serviceFee.toLocaleString()} UZS</span>
                            </div>
                            <div className="flex justify-between text-lg font-extrabold pt-4 text-primary-600">
                                <span>Jami:</span>
                                <span>{total.toLocaleString()} UZS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

