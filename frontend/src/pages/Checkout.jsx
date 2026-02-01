import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import { listings } from '../data/listings';
import { ChevronLeft, CheckCircle, CreditCard, Wallet, Landmark, Phone, User, Calendar, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Checkout() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useI18n();
    const [step, setStep] = useState(1);
    const listing = listings.find(l => l.id === parseInt(id));

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        payment: 'payme'
    });

    if (!listing) return null;

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    if (step === 4) {
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
            {/* Stepper Header */}
            <div className="flex items-center justify-between mb-12">
                <button onClick={prevStep} disabled={step === 1} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full disabled:opacity-30">
                    <ChevronLeft />
                </button>
                <div className="flex items-center space-x-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                        </div>
                    ))}
                </div>
                <div className="w-8" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: Form */}
                <div className="lg:col-span-2 space-y-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">1. Reja va Sanalar</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-2xl flex items-center space-x-4">
                                    <Calendar className="text-primary-600" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Sanalar</p>
                                        <p className="font-semibold">12-may — 15-may</p>
                                    </div>
                                </div>
                                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-2xl flex items-center space-x-4">
                                    <Users className="text-primary-600" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Mehmonlar</p>
                                        <p className="font-semibold">4 kishi</p>
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
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button onClick={nextStep} className="w-full md:w-auto px-12 py-3 rounded-full mt-8">
                                To'lovga o'tish
                            </Button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold">3. To'lov usuli</h2>
                            <div className="space-y-3">
                                {[
                                    { id: 'payme', name: 'Payme', icon: CreditCard },
                                    { id: 'click', name: 'Click', icon: Wallet },
                                    { id: 'cash', name: 'Naqd pul', icon: Landmark },
                                ].map((m) => (
                                    <label key={m.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.payment === m.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-100 dark:border-gray-800'}`}>
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-2 rounded-xl ${formData.payment === m.id ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                                <m.icon className="w-6 h-6" />
                                            </div>
                                            <span className="font-bold">{m.name}</span>
                                        </div>
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={formData.payment === m.id}
                                            onChange={() => setFormData({ ...formData, payment: m.id })}
                                            className="w-5 h-5 accent-primary-600"
                                        />
                                    </label>
                                ))}
                            </div>
                            <Button onClick={nextStep} className="w-full md:w-auto px-12 py-4 rounded-full mt-8 font-bold text-lg">
                                {t('confirm_booking')}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right: Summary */}
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
                                <span className="text-gray-500">3 kecha</span>
                                <span className="font-bold">{(listing.pricePerNight * 3).toLocaleString()} UZS</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">To'lov xizmati</span>
                                <span className="font-bold">{(listing.pricePerNight * 3 * 0.05).toLocaleString()} UZS</span>
                            </div>
                            <div className="flex justify-between text-lg font-extrabold pt-4 text-primary-600">
                                <span>Jami:</span>
                                <span>{(listing.pricePerNight * 3 * 1.05).toLocaleString()} UZS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
