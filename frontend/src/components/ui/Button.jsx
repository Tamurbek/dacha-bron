import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Button({ className, variant = "primary", ...props }) {
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 active:scale-95",
        outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 active:scale-95 dark:hover:bg-primary-900/20",
        ghost: "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 active:scale-95",
    };

    return (
        <button
            className={twMerge(
                "px-4 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
