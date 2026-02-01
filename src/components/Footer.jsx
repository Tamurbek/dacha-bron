import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n';
import { Instagram, Facebook, Send } from 'lucide-react';

export function Footer() {
    const { t } = useI18n();
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">O</span>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-sky-500">
                                Orom.uz
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                            O'zbekistondagi eng yaxshi dacha va villalarni bron qilish platformasi. Biz bilan dam olishingiz maroqli o'tadi.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-gray-900 dark:text-gray-100">{t('regions')}</h4>
                        <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link to="/search?region=tashkent" className="hover:text-primary-600 transition-colors">Toshkent</Link></li>
                            <li><Link to="/search?region=zomin" className="hover:text-primary-600 transition-colors">Zomin</Link></li>
                            <li><Link to="/search?region=charvak" className="hover:text-primary-600 transition-colors">Chorvoq</Link></li>
                            <li><Link to="/search?region=amirsoy" className="hover:text-primary-600 transition-colors">Amirsoy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-gray-900 dark:text-gray-100">Yordam</h4>
                        <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link to="#" className="hover:text-primary-600 transition-colors">FAQ</Link></li>
                            <li><Link to="/admin" className="hover:text-primary-600 transition-colors font-semibold text-primary-600">Boshqaruv paneli</Link></li>
                            <li><Link to="#" className="hover:text-primary-600 transition-colors">Biz bilan bog'lanish</Link></li>
                            <li><Link to="#" className="hover:text-primary-600 transition-colors">Qoidalar</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-gray-900 dark:text-gray-100">Ijtimoiy tarmoqlar</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
                                <Send className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <p>© {year} Orom.uz. {t('all_rights')}.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <p>Made with ❤️ for Uzbekistan</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
