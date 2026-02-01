import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import { useI18n } from '../../i18n/useI18n';

const CustomInput = forwardRef(({ value, onClick, placeholder, icon: Icon }, ref) => (
    <div
        className="flex items-center space-x-3 cursor-pointer group w-full"
        onClick={onClick}
        ref={ref}
    >
        {Icon && <Icon className="w-5 h-5 text-primary-600 group-hover:scale-110 transition-transform" />}
        <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold truncate">
                {value || placeholder}
            </span>
        </div>
    </div>
));

const uzMonths = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
];

const formatHeaderDate = (date, lang) => {
    if (lang === 'uz') {
        return `${uzMonths[date.getMonth()]} ${date.getFullYear()}`;
    }
    return new Intl.DateTimeFormat(lang === 'ru' ? 'ru-RU' : 'en-US', {
        month: 'long',
        year: 'numeric'
    }).format(date);
};

export function DatePicker({ selected, onChange, placeholder, icon = CalendarIcon, ...props }) {
    const { lang } = useI18n();

    return (
        <div className="relative datepicker-premium w-full">
            <ReactDatePicker
                selected={selected}
                onChange={onChange}
                customInput={<CustomInput placeholder={placeholder} icon={icon} />}
                dateFormat="dd.MM.yyyy"
                placeholderText={placeholder}
                calendarClassName="premium-calendar"
                portalId="datepicker-portal"
                nextMonthButtonLabel={<ChevronRight size={18} />}
                previousMonthButtonLabel={<ChevronLeft size={18} />}
                renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => (
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <button
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                            type="button"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all disabled:opacity-30"
                        >
                            <ChevronLeft size={18} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="text-sm font-black text-gray-900 dark:text-gray-100 capitalize tracking-tight">
                            {formatHeaderDate(date, lang)}
                        </span>
                        <button
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            type="button"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all disabled:opacity-30"
                        >
                            <ChevronRight size={18} className="text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                )}
                {...props}
            />
        </div>
    );
}

