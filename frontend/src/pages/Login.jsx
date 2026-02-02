import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/admin';

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            if (email === 'admin' && password === 'admin') {
                localStorage.setItem('admin_token', 'fake-admin-token');
                navigate(from, { replace: true });
            } else {
                setError('Email yoki parol noto\'g\'ri');
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="p-8 sm:p-12">
                        <div className="flex flex-col items-center mb-10 text-center">
                            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-primary-50/50 dark:ring-primary-900/10">
                                <Lock className="w-8 h-8 text-primary-600" />
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Xush kelibsiz!</h1>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Panelga kirish uchun ma'lumotlarni kiriting</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center animate-shake">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Login</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary-600 focus:bg-white dark:focus:bg-gray-900 rounded-2xl outline-none text-gray-900 dark:text-white font-bold transition-all shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Parol</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-primary-600 focus:bg-white dark:focus:bg-gray-900 rounded-2xl outline-none text-gray-900 dark:text-white font-bold transition-all shadow-sm"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-700 rounded-md peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all"></div>
                                        <svg className="absolute w-3 h-3 text-white top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 transition-colors">Eslab qolish</span>
                                </label>
                                <button type="button" className="text-sm font-bold text-primary-600 hover:text-primary-700 underline underline-offset-4">Parolni unutdingizmi?</button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-primary-700 active:scale-[0.98] transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center space-x-3"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Tekshirilmoqda...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Tizimga kirish</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <p className="mt-8 text-center text-gray-500 font-bold text-xs uppercase tracking-widest">
                    &copy; 2024 Jrizzax Rest - Dacha Booking System
                </p>
            </div>
        </div>
    );
}
