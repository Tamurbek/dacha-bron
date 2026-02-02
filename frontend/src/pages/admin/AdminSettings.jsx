import { API_V1_URL } from '../../api/config';
import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Moon, Globe, Save, CheckCircle, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminSettings = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);

    const [settings, setSettings] = useState({
        siteName: 'JIZZAXREST',
        email: 'info@jizzaxrest.com',
        notifications: true,
        darkMode: false,
        multiLang: true,
        botToken: '',
        channelId: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_V1_URL}/settings/telegram`);
                if (response.ok) {
                    const data = await response.json();
                    setSettings(prev => ({
                        ...prev,
                        botToken: data.bot_token || '',
                        channelId: data.channel_id || ''
                    }));
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('${API_V1_URL}/settings/telegram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bot_token: settings.botToken,
                    channel_id: settings.channelId
                })
            });

            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                alert('Xatolik yuz berdi');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Server bilan aloqa yo\'q');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="border-b border-gray-100 dark:border-gray-800 p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Settings className="mr-3 text-primary" size={24} />
                        Umumiy sozlamalar
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">Platformaning asosiy parametrlarini boshqarish</p>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Platforma nomi</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Aloqa uchun email</label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center">
                            <Send size={16} className="mr-2" />
                            Telegram Sozlamalari (Fayl saqlash uchun)
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Bot Token</label>
                                <input
                                    type="password"
                                    placeholder="8313441569:AAFCT..."
                                    value={settings.botToken}
                                    onChange={(e) => setSettings({ ...settings, botToken: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Kanal ID (yoki Username)</label>
                                <input
                                    type="text"
                                    placeholder="@my_channel_id"
                                    value={settings.channelId}
                                    onChange={(e) => setSettings({ ...settings, channelId: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Tizim funktsiyalari</h4>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Email xabarnomalar</p>
                                    <p className="text-xs text-gray-500">Yangi buyurtmalar haqida xabar berish</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.notifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-primary/20 transition-all">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600">
                                    <Moon size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Tungi rejim</p>
                                    <p className="text-xs text-gray-500">Interfeysni qorong'u rangga o'tkazish</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.darkMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.darkMode ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="pt-8 flex items-center justify-between">
                        <AnimatePresence>
                            {showSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex items-center text-green-500 font-bold text-sm"
                                >
                                    <CheckCircle size={18} className="mr-2" />
                                    Muvaffaqiyatli saqlandi!
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button
                            disabled={isSaving}
                            onClick={handleSave}
                            className="ml-auto flex items-center space-x-2 px-10 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-bold disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>O'zgarishlarni saqlash</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
