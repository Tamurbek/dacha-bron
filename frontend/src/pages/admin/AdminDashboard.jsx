import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Users,
    Home,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    MoreVertical
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Yan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Iyun', value: 8000 },
    { name: 'Iyul', value: 9500 },
];

const StatCard = ({ title, value, subValue, icon: Icon, trend, percentage, color }) => (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
                <Icon className={color.replace('bg-', 'text-')} size={28} />
            </div>
            <div className={`flex items-center space-x-1 text-sm font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                <span>{percentage}%</span>
                {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            </div>
        </div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">{title}</h3>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-2 mt-1">
            <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
            {subValue && (
                <p className="text-xs font-bold text-red-500 dark:text-red-400 mt-0.5 sm:mt-0">
                    {subValue}
                </p>
            )}
        </div>
    </div>
);

export const AdminDashboard = () => {
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDark(document.documentElement.classList.contains('dark'));
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const chartColors = {
        grid: isDark ? '#1f2937' : '#f3f4f6',
        text: isDark ? '#9ca3af' : '#6b7280',
        tooltip: isDark ? '#111827' : '#ffffff'
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Sotuv jami"
                    value="24.5M"
                    subValue="5M qarz"
                    icon={DollarSign}
                    trend="up"
                    percentage="12.5"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Dachalar"
                    value="18"
                    icon={Home}
                    trend="up"
                    percentage="2.4"
                    color="bg-purple-500"
                />
                <StatCard
                    title="Buyurtmalar"
                    value="124"
                    icon={Calendar}
                    trend="down"
                    percentage="4.1"
                    color="bg-orange-500"
                />
                <StatCard
                    title="Mijozlar"
                    value="1,240"
                    icon={Users}
                    trend="up"
                    percentage="8.2"
                    color="bg-green-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-500">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Daromad tahlili</h3>
                            <p className="text-gray-500 text-sm">Oylik tushum ko'rsatkichlari</p>
                        </div>
                        <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold px-4 py-2 focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer">
                            <option>Oxirgi 7 kun</option>
                            <option>Oxirgi 30 kun</option>
                            <option>Shu yil</option>
                        </select>
                    </div>
                    <div className="h-[350px] w-full min-h-0 min-w-0 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: chartColors.text, fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    width={80}
                                    tick={{ fill: chartColors.text, fontSize: 10, fontWeight: 700 }}
                                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        backgroundColor: chartColors.tooltip,
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                        padding: '12px 16px',
                                        color: isDark ? '#fff' : '#000'
                                    }}
                                    itemStyle={{ color: '#3b82f6', fontWeight: 700 }}
                                    formatter={(value) => [`${value.toLocaleString()} so'm`, 'Daromad']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-500 overflow-hidden">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8">So'nggi buyurtmalar</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center font-black text-primary border border-gray-100 dark:border-gray-700 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        {item === 1 ? 'AN' : item === 2 ? 'ZB' : 'AT'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                            {item === 1 ? 'Alisher Navoiy' : item === 2 ? 'Zahiddin Bobur' : 'Amir Temur'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Chorvoq dacha • 2 kun</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-900 dark:text-white">{(450000 * item).toLocaleString()} so'm</p>
                                    <p className="text-[10px] px-2 py-1 rounded-lg bg-green-500/10 text-green-600 font-black uppercase tracking-wider">
                                        To'langan
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 text-sm font-black text-primary hover:bg-primary/5 rounded-2xl border border-transparent hover:border-primary/20 transition-all duration-300">
                        Barchasini ko'rish
                    </button>
                </div>
            </div>
        </div>
    );
};
