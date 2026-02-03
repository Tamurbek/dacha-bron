import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from './ui/Button';
import { useI18n } from '../i18n/useI18n';
import { DatePicker } from './ui/DatePicker';
import { useState } from 'react';

export function BookingCard({ listing }) {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [guests, setGuests] = useState(1);

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 1;
        const diffTime = Math.abs(checkOut - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    };

    const nights = calculateNights();
    const basePrice = listing.pricePerNight * nights;
    const serviceFee = Math.round(basePrice * 0.05);
    const total = basePrice + serviceFee;

    const handleBooking = () => {
        if (!checkIn || !checkOut) {
            alert(t('select_dates_alert'));
            return;
        }

        const params = new URLSearchParams({
            checkIn: checkIn ? checkIn.toISOString() : '',
            checkOut: checkOut ? checkOut.toISOString() : '',
            guests: guests.toString()
        });
        navigate(`/checkout/${listing.id}?${params.toString()}`);
    };

    return (
        <div className="sticky top-24 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-baseline mb-8">
                <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {listing.pricePerNight.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm">UZS / {t('per_night')}</span>
                </div>
                <div className="text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" />
                    {listing.rating}
                </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-2xl mb-8">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-1 p-3 border-r border-gray-200 dark:border-gray-700">
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Check-in</label>
                        <DatePicker
                            selected={checkIn}
                            onChange={(date) => setCheckIn(date)}
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={new Date()}
                            placeholder="Sana tanlang"
                            icon={null}
                        />
                    </div>
                    <div className="flex-1 p-3">
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Check-out</label>
                        <DatePicker
                            selected={checkOut}
                            onChange={(date) => setCheckOut(date)}
                            selectsEnd
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={checkIn || new Date()}
                            placeholder="Sana tanlang"
                            icon={null}
                        />
                    </div>
                </div>
                <div className="p-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">{t('guests')}</label>
                    <select
                        className="text-sm font-medium bg-transparent outline-none w-full bg-white dark:bg-gray-800"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                    >
                        <option value={1}>1 {t('guests')}</option>
                        <option value={2}>2 {t('guests')}</option>
                        <option value={3}>3 {t('guests')}</option>
                        <option value={4}>4 {t('guests')}</option>
                        <option value={5}>5 {t('guests')}</option>
                        <option value={10}>10+ {t('guests')}</option>
                    </select>
                </div>
            </div>

            <Button onClick={handleBooking} className="w-full py-4 text-lg mb-4">
                {t('book_now')}
            </Button>

            <p className="text-center text-sm text-gray-500 mb-6 font-medium">Sizdan hozircha pul yechilmaydi</p>

            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                    <span className="underline underline-offset-4">{listing.pricePerNight.toLocaleString()} x {nights} {t('per_night')}</span>
                    <span className="font-semibold">{basePrice.toLocaleString()} UZS</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                    <span className="underline underline-offset-4">Xizmat haqi (5%)</span>
                    <span className="font-semibold">{serviceFee.toLocaleString()} UZS</span>
                </div>
                <div className="pt-4 flex justify-between font-bold text-lg text-primary-600">
                    <span>Jami</span>
                    <span>{total.toLocaleString()} UZS</span>
                </div>
            </div>
        </div>
    );
}

