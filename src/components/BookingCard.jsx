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
                            placeholder="Sana tanlang"
                            icon={null}
                        />
                    </div>
                    <div className="flex-1 p-3">
                        <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Check-out</label>
                        <DatePicker
                            selected={checkOut}
                            onChange={(date) => setCheckOut(date)}
                            placeholder="Sana tanlang"
                            icon={null}
                        />
                    </div>
                </div>
                <div className="p-3">
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">{t('guests')}</label>
                    <select className="text-sm font-medium bg-transparent outline-none w-full bg-white dark:bg-gray-800">
                        <option>1 {t('guests')}</option>
                        <option>2 {t('guests')}</option>
                        <option>3 {t('guests')}</option>
                        <option>4+ {t('guests')}</option>
                    </select>
                </div>
            </div>

            <Button onClick={() => navigate(`/checkout/${listing.id}`)} className="w-full py-4 text-lg mb-4">
                {t('book_now')}
            </Button>

            <p className="text-center text-sm text-gray-500 mb-6 font-medium">Sizdan hozircha pul yechilmaydi</p>

            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                    <span className="underline underline-offset-4">{listing.pricePerNight.toLocaleString()} x 3 kecha</span>
                    <span className="font-semibold">{(listing.pricePerNight * 3).toLocaleString()} UZS</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                    <span className="underline underline-offset-4">Xizmat haqi (5%)</span>
                    <span className="font-semibold">{(listing.pricePerNight * 3 * 0.05).toLocaleString()} UZS</span>
                </div>
                <div className="pt-4 flex justify-between font-bold text-lg text-primary-600">
                    <span>Jami</span>
                    <span>{(listing.pricePerNight * 3 * 1.05).toLocaleString()} UZS</span>
                </div>
            </div>
        </div>
    );
}
