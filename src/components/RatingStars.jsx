import { Star } from 'lucide-react';

export function RatingStars({ rating, count }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex items-center space-x-1">
            <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                        key={s}
                        className={`w-4 h-4 ${s <= fullStars ? 'text-yellow-500 fill-yellow-500' : (s === fullStars + 1 && hasHalfStar ? 'text-yellow-500 fill-yellow-500 opacity-50' : 'text-gray-300')}`}
                    />
                ))}
            </div>
            {count !== undefined && (
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium ml-1">
                    ({count})
                </span>
            )}
        </div>
    );
}
