import { API_V1_URL } from '../../api/config';
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ setCoordinates }) => {
    useMapEvents({
        click(e) {
            setCoordinates(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const ChangeMapCenter = ({ center }) => {
    const map = useMapEvents({});
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
};

import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Star,
    MapPin,
    Eye,
    CheckCircle2,
    XCircle,
    X,
    Upload,
    Save,
    Loader2,
    Video,
    LayoutGrid,
    Table as TableIcon,
    ChevronLeft,
    ChevronRight,
    Waves,
    Flame,
    Utensils,
    Wifi,
    Wind,
    Coffee,
    Users,
    Bed,
    Bath,
    Smile,
    GripVertical
} from 'lucide-react';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const iconMap = {
    Waves,
    Flame,
    Utensils,
    Wifi,
    Wind,
    Coffee,
    Smile
};
import { motion, AnimatePresence } from 'framer-motion';
import { regions } from '../../data/regions';

const initialListings = [
    {
        id: 1,
        name: "O'rmon bag'ridagi dacha",
        location: "Bo'stonliq, Toshkent",
        price: 1500000,
        rating: 4.8,
        status: "active",
        images: [
            "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=400"
        ],
        views: 1240,
        description: "Tabiat qo'ynidagi shinam dacha",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 2,
        name: "Hovuzli zamonaviy villa",
        location: "Chimyon, Toshkent",
        price: 2500000,
        rating: 4.9,
        status: "active",
        images: [
            "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400"
        ],
        views: 850,
        description: "Barcha qulayliklarga ega zamonaviy villa"
    },
    {
        id: 3,
        name: "Tog' manzarali uy",
        location: "Zamin, Jizzax",
        price: 1200000,
        rating: 4.5,
        status: "inactive",
        images: [
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400"
        ],
        views: 420,
        description: "Tog' yonbag'ridagi sokin maskan"
    }
];

const isVideo = (url) => {
    if (!url) return false;
    const hasVideoExt = url.match(/\.(mp4|webm|ogg|mov|m4v|hevc)($|\?)/i);
    const isSpecialVideo = url.includes('mov_bbb.mp4') ||
        url.includes('youtube.com') ||
        url.includes('youtu.be') ||
        (url.includes('/proxy/telegram/') && url.match(/\.(mp4|mov|webm)($|\?)/i));
    return hasVideoExt || isSpecialVideo;
};

const getYoutubeThumbnail = (url) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1].split('?')[0];
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
};

const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const SortableImage = ({ img, index, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: img });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 101 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative aspect-square rounded-2xl overflow-hidden group ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm bg-gray-100 dark:bg-gray-800 ${isDragging ? 'opacity-50' : ''}`}
        >
            {img.includes('youtube.com') || img.includes('youtu.be') ? (
                <img src={getYoutubeThumbnail(img)} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : isVideo(img) ? (
                <video src={img} className="w-full h-full object-cover" muted />
            ) : (
                <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) || <div className="w-full h-full bg-gray-200" />}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <div
                    {...attributes}
                    {...listeners}
                    className="p-2 bg-white/20 backdrop-blur-md text-white rounded-xl cursor-grab active:cursor-grabbing hover:bg-white/40 transition-colors"
                >
                    <GripVertical size={16} />
                </div>
                <button
                    onClick={() => onRemove(index)}
                    className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export const AdminListings = () => {
    const [listings, setListings] = useState(initialListings);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingListing, setEditingListing] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [viewType, setViewType] = useState('table'); // 'grid' or 'table'
    const [uploadingField, setUploadingField] = useState(null); // 'video' or 'gallery' or index
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);
    const [availableAmenities, setAvailableAmenities] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        price: '',
        description: '',
        status: 'active',
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400'],
        videoUrl: '',
        googleMapsUrl: '',
        latitude: 41.2995, // Tashkent default
        longitude: 69.2401,
        guests_max: 10,
        rooms: 4,
        beds: 5,
        baths: 2,
        amenities: {
            pool: false,
            sauna: false,
            bbq: false,
            wifi: false,
            ac: false,
            kitchen: false
        }
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setFormData((prev) => {
                const oldIndex = prev.images.indexOf(active.id);
                const newIndex = prev.images.indexOf(over.id);
                return {
                    ...prev,
                    images: arrayMove(prev.images, oldIndex, newIndex),
                };
            });
        }
    };

    const handleOpenModal = (listing = null) => {
        if (listing) {
            setEditingListing(listing);
            setFormData({
                name: listing.name || listing.title,
                location: listing.location,
                price: listing.price || listing.price_per_night,
                description: listing.description || '',
                status: listing.status || 'active',
                images: listing.images || [listing.image],
                videoUrl: listing.videoUrl || listing.video_url || '',
                googleMapsUrl: listing.google_maps_url || '',
                latitude: listing.latitude || 41.2995,
                longitude: listing.longitude || 69.2401,
                guests_max: listing.guests_max || 10,
                rooms: listing.rooms || 4,
                beds: listing.beds || 5,
                baths: listing.baths || 2,
                amenities: listing.amenities || {
                    pool: false,
                    sauna: false,
                    bbq: false,
                    wifi: false,
                    ac: false,
                    kitchen: false
                }
            });
        } else {
            setEditingListing(null);
            setFormData({
                name: '',
                location: '',
                price: '',
                description: '',
                status: 'active',
                images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400'],
                videoUrl: '',
                googleMapsUrl: '',
                latitude: 41.2995,
                longitude: 69.2401,
                guests_max: 10,
                rooms: 4,
                beds: 5,
                baths: 2,
                amenities: {
                    pool: false,
                    sauna: false,
                    bbq: false,
                    wifi: false,
                    ac: false,
                    kitchen: false
                }
            });
        }
        setIsModalOpen(true);
    };

    const fetchListings = async (page = 1, search = '') => {
        try {
            const response = await fetch(`${API_V1_URL}/listings/?page=${page}&size=${pageSize}&search=${encodeURIComponent(search)}&status=all`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();

            const items = data.items || [];
            const mappedData = items.map(l => ({
                ...l,
                name: l.title,
                price: l.price_per_night,
                image: (l.images && l.images.length > 0) ? l.images[0] : '',
                videoUrl: l.video_url
            }));

            setListings(mappedData);
            setTotalPages(data.pages || 1);
        } catch (error) {
            console.error('Error fetching listings:', error);
            setListings([]);
            setTotalPages(1);
        }
    };

    const fetchAvailableAmenities = async () => {
        try {
            const response = await fetch(`${API_V1_URL}/amenities/`);
            if (response.ok) {
                const data = await response.json();
                setAvailableAmenities(data);
            }
        } catch (error) {
            console.error('Error fetching amenities:', error);
        }
    };

    useEffect(() => {
        fetchListings(currentPage, searchTerm);
        fetchAvailableAmenities();
    }, [currentPage, searchTerm]);

    const handleSave = async () => {
        setIsSaving(true);
        const payload = {
            title: formData.name,
            region: formData.location.toLowerCase().includes('zomin') ? 'zomin' : 'jizzax',
            location: formData.location,
            price_per_night: Number(formData.price),
            description: formData.description,
            images: formData.images,
            video_url: formData.videoUrl,
            guests_max: Number(formData.guests_max),
            rooms: Number(formData.rooms),
            beds: Number(formData.beds),
            baths: Number(formData.baths),
            amenities: formData.amenities,
            google_maps_url: formData.googleMapsUrl,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            status: formData.status
        };

        try {
            let response;
            if (editingListing) {
                response = await fetch(`${API_V1_URL}/listings/${editingListing.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                response = await fetch(`${API_V1_URL}/listings/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (response.ok) {
                await fetchListings();
                setIsModalOpen(false);
            }
        } catch (error) {
            alert('Saqlashda xatolik yuz berdi');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Haqiqatdan ham ushbu dachani o\'chirib tashlamoqchimisiz?')) {
            try {
                const response = await fetch(`${API_V1_URL}/listings/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    await fetchListings();
                }
            } catch (error) {
                alert('O\'chirishda xatolik yuz berdi');
            }
        }
    };

    const toggleStatus = async (id) => {
        const listing = listings.find(l => l.id === id);
        if (!listing) return;

        const newStatus = listing.status === 'active' ? 'inactive' : 'active';

        try {
            const response = await fetch(`${API_V1_URL}/listings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setListings(listings.map(l =>
                    l.id === id ? { ...l, status: newStatus } : l
                ));
            }
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Statusni o\'zgartirishda xatolik yuz berdi');
        }
    };

    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingField(field);
        setUploadProgress(0);

        const formDataPayload = new FormData();
        formDataPayload.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_V1_URL}/upload/file`, true);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                setUploadProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                if (field === 'video') {
                    setFormData(prev => ({ ...prev, videoUrl: data.url }));
                } else if (field === 'gallery') {
                    setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }));
                }
                setUploadingField(null);
                setUploadProgress(0);
            } else {
                alert('Yuklashda xatolik yuz berdi');
                setUploadingField(null);
                setUploadProgress(0);
            }
        };

        xhr.onerror = () => {
            alert('Internet bilan aloqa yo\'q');
            setUploadingField(null);
            setUploadProgress(0);
        };

        xhr.send(formDataPayload);
    };

    const filteredListings = listings; // Search is now handled by backend
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-grow items-center gap-4 max-w-2xl">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Dachalarni qidirish..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="hidden md:flex items-center bg-gray-50 dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <button
                            onClick={() => setViewType('grid')}
                            className={`p-2 rounded-xl transition-all ${viewType === 'grid' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewType('table')}
                            className={`p-2 rounded-xl transition-all ${viewType === 'table' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <TableIcon size={20} />
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center space-x-2 px-8 py-3.5 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-95 whitespace-nowrap"
                >
                    <Plus size={20} />
                    <span className="font-black text-sm uppercase tracking-wider">Yangi qo'shish</span>
                </button>
            </div>

            <AnimatePresence mode="wait">
                {viewType === 'table' ? (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-colors duration-500"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Dacha</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Joylashuv</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Narx</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Reyting</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                    {filteredListings.length > 0 ? filteredListings.map((listing) => (
                                        <tr key={listing.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                                                        <img src={listing.images?.[0] || listing.image} alt={listing.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        {listing.images?.length > 1 && (
                                                            <div className="absolute bottom-1 right-1 bg-black/50 backdrop-blur-sm text-[8px] text-white px-1 rounded-md font-black">
                                                                +{listing.images.length - 1}
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900 dark:text-white line-clamp-1">{listing.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">ID: #{listing.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                                    <MapPin size={14} className="mr-2 text-primary/60" />
                                                    <span className="text-xs font-bold">{listing.location}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-black text-gray-900 dark:text-white">
                                                    {listing.price.toLocaleString()} <span className="text-[10px] text-gray-400">so'm</span>
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl w-fit">
                                                    <Star size={12} fill="currentColor" />
                                                    <span className="text-xs font-black">{listing.rating}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <button
                                                    onClick={() => toggleStatus(listing.id)}
                                                    className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${listing.status === 'active'
                                                        ? 'bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-500 hover:text-white'
                                                        }`}
                                                >
                                                    {listing.status === 'active' ? <CheckCircle2 size={14} className="mr-1.5" /> : <XCircle size={14} className="mr-1.5" />}
                                                    {listing.status === 'active' ? 'Faol' : 'Nofaol'}
                                                </button>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => handleOpenModal(listing)}
                                                        className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-2xl transition-all"
                                                    >
                                                        <Edit size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(listing.id)}
                                                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-2xl transition-all"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Search size={48} className="text-gray-200 dark:text-gray-800 mb-4" />
                                                    <p className="text-gray-500 dark:text-gray-400 font-bold">Ma'lumot topilmadi</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredListings.length > 0 ? filteredListings.map((listing) => (
                            <motion.div
                                layout
                                key={listing.id}
                                className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all"
                            >
                                <div className="flex items-start space-x-4 mb-4">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 relative">
                                        <img src={listing.images?.[0] || listing.image} alt={listing.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        {listing.images?.length > 1 && (
                                            <div className="absolute bottom-1 right-1 bg-black/50 backdrop-blur-sm text-[8px] text-white px-1.5 py-0.5 rounded-lg font-black">
                                                +{listing.images.length - 1}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg mb-1 inline-block">#{listing.id}</span>
                                            <div className="flex items-center space-x-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg">
                                                <Star size={10} fill="currentColor" />
                                                <span className="text-[10px] font-black">{listing.rating}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-base font-black text-gray-900 dark:text-white truncate">{listing.name}</h3>
                                        <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                                            <MapPin size={12} className="mr-1 text-primary/60" />
                                            <span className="text-[10px] font-bold truncate">{listing.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                    <div className="flex flex-col">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kunlik narx</p>
                                        <p className="text-sm font-black text-gray-900 dark:text-white">
                                            {listing.price.toLocaleString()} <span className="text-[8px]">so'm</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => toggleStatus(listing.id)}
                                            className={`p-2 rounded-xl transition-all ${listing.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}
                                        >
                                            {listing.status === 'active' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(listing)}
                                            className="p-2 text-primary bg-primary/10 rounded-xl hover:bg-primary hover:text-white transition-all"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(listing.id)}
                                            className="p-2 text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full text-center py-20">
                                <Search size={48} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Hech narsa topilmadi</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Sahifa {currentPage} / {totalPages}
                    </p>
                    <div className="flex items-center space-x-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-500 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-500 transition-all shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            // Show only a few page numbers around current page
                            if (
                                totalPages > 7 &&
                                pageNum !== 1 &&
                                pageNum !== totalPages &&
                                (pageNum < currentPage - 1 || pageNum > currentPage + 1)
                            ) {
                                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                    return <span key={pageNum} className="text-gray-400">...</span>;
                                }
                                return null;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all shadow-sm ${currentPage === pageNum
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-600 hover:border-primary/50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-500 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-500 transition-all shadow-sm"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSaving && setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {editingListing ? 'Dachani tahrirlash' : 'Yangi dacha qo\'shish'}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nomi</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Dacha nomi..."
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Joylashuv</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Masalan: Zomin or Jizzax shahri"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-4 md:col-span-2">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Locatsiya (Xaritadan tanlang yoki link kiriting)</label>
                                                {formData.googleMapsUrl && (
                                                    <button
                                                        type="button"
                                                        onClick={() => window.open(formData.googleMapsUrl, '_blank')}
                                                        className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                                                    >
                                                        Ochib ko'rish
                                                    </button>
                                                )}
                                            </div>

                                            <div className="h-64 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-inner z-0">
                                                <MapContainer center={[formData.latitude, formData.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                    <Marker position={[formData.latitude, formData.longitude]} />
                                                    <LocationMarker
                                                        setCoordinates={(lat, lng) => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                latitude: lat,
                                                                longitude: lng,
                                                                googleMapsUrl: `https://www.google.com/maps?q=${lat},${lng}`
                                                            }));
                                                        }}
                                                    />
                                                    <ChangeMapCenter center={[formData.latitude, formData.longitude]} />
                                                </MapContainer>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Latitude</label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={formData.latitude}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Longitude</label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={formData.longitude}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Google Maps Link</label>
                                                <input
                                                    type="text"
                                                    value={formData.googleMapsUrl}
                                                    onChange={(e) => {
                                                        const url = e.target.value;
                                                        setFormData(prev => ({ ...prev, googleMapsUrl: url }));

                                                        // Try to extract coordinates from URL if it's a google maps link
                                                        // Example: https://www.google.com/maps?q=41.2995,69.2401
                                                        // Or: https://www.google.com/maps/search/41.2995,69.2401
                                                        const coordRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
                                                        const qRegex = /[q|query]=(-?\d+\.\d+),(-?\d+\.\d+)/;

                                                        const match = url.match(coordRegex) || url.match(qRegex);
                                                        if (match) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                latitude: parseFloat(match[1]),
                                                                longitude: parseFloat(match[2])
                                                            }));
                                                        }
                                                    }}
                                                    placeholder="https://maps.google.com/..."
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Narxi (bir kecha uchun)</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="So'mda"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all appearance-none"
                                        >
                                            <option value="active">Faol</option>
                                            <option value="inactive">Nofaol</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Tavsif</label>
                                    <textarea
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Dacha haqida batafsil ma'lumot..."
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                                            <Users size={14} className="mr-2" /> Mehmonlar
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.guests_max}
                                            onChange={(e) => setFormData({ ...formData, guests_max: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                                            <LayoutGrid size={14} className="mr-2" /> Xonalar
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.rooms}
                                            onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                                            <Bed size={14} className="mr-2" /> Karavotlar
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.beds}
                                            onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                                            <Bath size={14} className="mr-2" /> Hammomlar
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.baths}
                                            onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Qulayliklar</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {availableAmenities.map((amenity) => {
                                            const Icon = iconMap[amenity.icon] || Smile;
                                            const key = amenity.name_uz; // Use name_uz as key for backwards compat or mapping
                                            return (
                                                <button
                                                    key={amenity.id}
                                                    type="button"
                                                    onClick={() => setFormData({
                                                        ...formData,
                                                        amenities: {
                                                            ...formData.amenities,
                                                            [key]: !formData.amenities[key]
                                                        }
                                                    })}
                                                    className={`flex items-center space-x-3 p-4 rounded-2xl border transition-all ${formData.amenities[key]
                                                        ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400 font-bold'
                                                        : 'bg-gray-50 border-gray-100 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                                                        }`}
                                                >
                                                    <Icon size={20} className={formData.amenities[key] ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'} />
                                                    <span className="text-[10px] uppercase tracking-wider">{amenity.name_uz}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                                            <Video size={16} className="mr-2 text-primary" />
                                            Asosiy Video
                                        </label>
                                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                            <button
                                                type="button"
                                                onClick={() => setUploadingField(uploadingField === 'link' ? null : 'link')}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${uploadingField !== 'video' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500'}`}
                                            >
                                                Link ulash
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors pointer-events-none flex items-center space-x-2">
                                                {uploadingField === 'video' ? (
                                                    <>
                                                        <Loader2 size={20} className="animate-spin text-primary-600" />
                                                        <span className="text-xs font-bold text-primary-600">{uploadProgress}%</span>
                                                    </>
                                                ) : <Upload size={20} />}
                                            </div>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => handleFileUpload(e, 'video')}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all file:hidden cursor-pointer"
                                            />
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                <span className="text-xs font-bold text-gray-400">
                                                    {uploadingField === 'video' ? 'Yuklanmoqda...' : 'Video faylni yuklash'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <Video size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.videoUrl}
                                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                                placeholder="YouTube yoki boshqa video linkini kiriting..."
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    {formData.videoUrl && (
                                        <div className="mt-2 relative aspect-video rounded-3xl overflow-hidden ring-1 ring-gray-100 dark:ring-gray-800 shadow-xl bg-gray-100 dark:bg-gray-800 group">
                                            {formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be') ? (
                                                <iframe
                                                    src={getYoutubeEmbedUrl(formData.videoUrl)}
                                                    className="w-full h-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            ) : isVideo(formData.videoUrl) ? (
                                                <video src={formData.videoUrl} className="w-full h-full object-cover" controls muted />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                                                    Video topilmadi
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md text-[10px] text-white font-black uppercase rounded-xl">Video Preview</div>
                                            <button
                                                onClick={() => setFormData({ ...formData, videoUrl: '' })}
                                                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-xl"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1">Asosiy video dacha sahifasining eng yuqori qismida ko'rinadi.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Galereya (Rasmlar va Videolar)</label>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formData.images.length} ta fayl</span>
                                    </div>
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={formData.images}
                                            strategy={rectSortingStrategy}
                                        >
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {formData.images.map((img, index) => (
                                                    <SortableImage
                                                        key={img}
                                                        img={img}
                                                        index={index}
                                                        onRemove={(idx) => {
                                                            const newImages = formData.images.filter((_, i) => i !== idx);
                                                            setFormData({ ...formData, images: newImages });
                                                        }}
                                                    />
                                                ))}
                                                <label className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/30 overflow-hidden cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all">
                                                    {uploadingField === 'gallery' ? (
                                                        <>
                                                            <Loader2 size={24} className="text-primary animate-spin mb-1" />
                                                            <span className="text-[10px] font-bold text-primary">{uploadProgress}%</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus size={24} className="text-gray-400 mb-1" />
                                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter text-center px-2 pointer-events-none">Fayl yuklash</span>
                                                        </>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*,video/*"
                                                        onChange={(e) => handleFileUpload(e, 'gallery')}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-3">
                                <button
                                    disabled={isSaving}
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 transition-all disabled:opacity-50"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    disabled={isSaving}
                                    onClick={handleSave}
                                    className="px-8 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 flex items-center space-x-2 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    <span>{editingListing ? 'Saqlash' : 'Qo\'shish'}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
