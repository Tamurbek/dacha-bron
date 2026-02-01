import { twMerge } from "tailwind-merge";

export function Badge({ children, className }) {
    return (
        <span className={twMerge(
            "px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
            className
        )}>
            {children}
        </span>
    );
}
