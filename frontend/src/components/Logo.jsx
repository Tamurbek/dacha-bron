import React from 'react';
import { Link } from 'react-router-dom';

export function Logo({ className = "", iconOnly = false, light = false }) {
    return (
        <Link to="/" className={`flex items-center space-x-2 group ${className}`}>
            <div className={`relative w-10 h-10 flex items-center justify-center rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105 ${light ? 'bg-white' : 'bg-primary-600 shadow-lg shadow-primary-500/20'}`}>
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-8 h-8 ${light ? 'text-primary-600' : 'text-white'}`}
                >
                    {/* Background Mountains */}
                    <path
                        d="M20 55L40 25L55 45L75 15L85 30V65H20V55Z"
                        fill="currentColor"
                        className="opacity-20"
                    />
                    <path
                        d="M20 57L40 27L55 47L75 17L85 32"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* A-Frame House */}
                    <path
                        d="M32 65L50 35L68 65H32Z"
                        fill={light ? "currentColor" : "white"}
                        className={light ? "opacity-10" : ""}
                    />
                    <path
                        d="M32 65L50 35L68 65"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Window/Door */}
                    <rect x="47" y="55" width="6" height="7" rx="1" fill="currentColor" />

                    {/* Elegant Waves */}
                    <path
                        d="M15 70C30 60 50 80 85 70"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="opacity-40"
                    />
                    <path
                        d="M10 78C30 68 50 88 90 75"
                        stroke="currentColor"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
            {!iconOnly && (
                <div className="flex flex-col leading-none">
                    <span className={`text-xl md:text-2xl font-black italic tracking-tighter ${light ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        JIZZAX<span className="text-primary-600">REST</span>
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${light ? 'text-white/80' : 'text-gray-400'}`}>
                        Premium Stay
                    </span>
                </div>
            )}
        </Link>
    );
}
