import { twMerge } from "tailwind-merge";

export function Input({ className, ...props }) {
    return (
        <input
            className={twMerge(
                "w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all",
                className
            )}
            {...props}
        />
    );
}
