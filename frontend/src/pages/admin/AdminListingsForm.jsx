import { API_V1_URL } from '../../api/config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    Plus,
    X,
    Upload,
    Save,
    Loader2,
    Video,
    MapPin,
    Users,
    Bed,
    Bath,
    Smile,
    Maximize,
    Minimize,
    GripVertical,
    ChevronLeft,
    Waves,
    Flame,
    Utensils,
    Wifi,
    Wind,
    Coffee,
    LayoutGrid
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
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const iconMap = {
    Waves,
    Flame,
    Utensils,
    Wifi,
    Wind,
    Coffee,
    Smile
};

const LocationMarker = ({ setCoordinates }) => {
    const map = useMapEvents({
        move() {
            const center = map.getCenter();
            setCoordinates(center.lat, center.lng);
        },
    });
    return null;
};

const ChangeMapCenter = ({ center, trigger }) => {
    const map = useMapEvents({});
    useEffect(() => {
        map.setView(center, map.getZoom());
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [center, map, trigger]);
    return null;
};

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
                    type="button"
                    onClick={() => onRemove(index)}
                    className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export const AdminListingsForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [isSaving, setIsSaving] = useState(false);
    const [isMapFullscreen, setIsMapFullscreen] = useState(false);
    const [availableAmenities, setAvailableAmenities] = useState([]);
    const [uploadingField, setUploadingField] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        price: '',
        description: '',
        status: 'active',
        images: [],
        videoUrl: '',
        googleMapsUrl: '',
        latitude: 39.6332,
        longitude: 68.4993,
        guests_max: 10,
        rooms: 4,
        beds: 5,
        baths: 2,
        amenities: {}
    });

    useEffect(() => {
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

        const fetchListing = async () => {
            if (!isEditing) return;
            try {
                const response = await fetch(`${API_V1_URL}/listings/${id}`);
                if (response.ok) {
                    const l = await response.json();
                    setFormData({
                        name: l.title,
                        location: l.location,
                        price: l.price_per_night,
                        description: l.description || '',
                        status: l.status || 'active',
                        images: l.images || [],
                        videoUrl: l.video_url || '',
                        googleMapsUrl: l.google_maps_url || '',
                        latitude: l.latitude || 39.6332,
                        longitude: l.longitude || 68.4993,
                        guests_max: l.guests_max || 10,
                        rooms: l.rooms || 4,
                        beds: l.beds || 5,
                        baths: l.baths || 2,
                        amenities: l.amenities || {}
                    });
                }
            } catch (error) {
                console.error('Error fetching listing:', error);
            }
        };

        fetchAvailableAmenities();
        fetchListing();
    }, [id, isEditing]);

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

        xhr.send(formDataPayload);
    };

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
            if (isEditing) {
                response = await fetch(`${API_V1_URL}/listings/${id}`, {
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
                navigate('/admin/listings');
            }
        } catch (error) {
            alert('Saqlashda xatolik yuz berdi');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/admin/listings')}
                        className="p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 hover:text-primary transition-all shadow-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                            {isEditing ? 'Dachani tahrirlash' : 'Yangi dacha qo\'shish'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                            {isEditing ? `ID: #${id}` : 'Yangi dacha ma\'lumotlarini kiriting'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        disabled={isSaving}
                        onClick={() => navigate('/admin/listings')}
                        className="px-8 py-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 transition-all"
                    >
                        Bekor qilish
                    </button>
                    <button
                        disabled={isSaving}
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-10 py-3.5 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95"
                    >
                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        <span className="font-black text-sm uppercase tracking-wider">
                            {isEditing ? 'Saqlash' : 'Qo\'shish'}
                        </span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nomi</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Dacha nomi..."
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Joylashuv (Matn)</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="Masalan: Zomin or Jizzax shahri"
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Tavsif</label>
                            <textarea
                                rows="5"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Dacha haqida batafsil ma'lumot..."
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-900 dark:text-white transition-all resize-none font-medium"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                                    <Users size={14} className="mr-2" /> Mehmonlar
                                </label>
                                <input
                                    type="number"
                                    value={formData.guests_max}
                                    onChange={(e) => setFormData({ ...formData, guests_max: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                                    <LayoutGrid size={14} className="mr-2" /> Xonalar
                                </label>
                                <input
                                    type="number"
                                    value={formData.rooms}
                                    onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                                    <Bed size={14} className="mr-2" /> Karavotlar
                                </label>
                                <input
                                    type="number"
                                    value={formData.beds}
                                    onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                                    <Bath size={14} className="mr-2" /> Hammomlar
                                </label>
                                <input
                                    type="number"
                                    value={formData.baths}
                                    onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media Gallery */}
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider">Galereya</h3>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{formData.images.length} ta fayl</span>
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
                                    <label className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/30 overflow-hidden cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all group">
                                        {uploadingField === 'gallery' ? (
                                            <>
                                                <Loader2 size={24} className="text-primary animate-spin mb-1" />
                                                <span className="text-[10px] font-bold text-primary">{uploadProgress}%</span>
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={32} className="text-gray-300 group-hover:text-primary transition-colors" />
                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">Fayl qo'shish</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,video/*"
                                            onChange={(e) => handleFileUpload(e, 'gallery')}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </SortableContext>
                        </DndContext>

                        <div className="pt-6 border-t border-gray-50 dark:border-gray-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center">
                                    <Video size={16} className="mr-2 text-primary" />
                                    Asosiy Video (YouTube yoki Fayl)
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Upload size={20} />
                                    </div>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleFileUpload(e, 'video')}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-[10px] font-bold uppercase cursor-pointer transition-all file:hidden"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase pointer-events-none">
                                        {uploadingField === 'video' ? `Yuklanmoqda ${uploadProgress}%` : 'Faylni tanlang'}
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
                                        placeholder="YouTube video link..."
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing, Status, Location */}
                <div className="space-y-8">
                    {/* Price and Status */}
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Narxi (kunlik)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="So'mda"
                                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-lg font-black text-primary"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 uppercase">UZS</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold appearance-none transition-all"
                            >
                                <option value="active">🟢 Faol</option>
                                <option value="inactive">🔴 Nofaol</option>
                            </select>
                        </div>
                    </div>

                    {/* Interactive Map Picker */}
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Xarita belgilash</h3>
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

                        <div className={`${isMapFullscreen ? 'fixed inset-0 z-[10000] bg-white dark:bg-gray-950 p-6' : 'h-64 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-inner'} relative transition-none`}>
                            <button
                                type="button"
                                onClick={() => setIsMapFullscreen(!isMapFullscreen)}
                                className="absolute top-4 right-4 z-[10002] p-3 bg-white dark:bg-gray-800 rounded-xl shadow-2xl hover:scale-105 transition-all text-gray-900 dark:text-white border-2 border-primary-500"
                            >
                                {isMapFullscreen ? <Minimize size={26} /> : <Maximize size={22} />}
                            </button>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-[10001] pointer-events-none pb-0.5">
                                <div className="flex flex-col items-center">
                                    <MapPin className="w-10 h-10 text-primary-600 fill-primary-600/20 drop-shadow-xl" />
                                    <div className="w-2 h-2 bg-primary-600 rounded-full shadow-lg border-2 border-white -mt-1" />
                                </div>
                            </div>

                            <MapContainer
                                center={[formData.latitude, formData.longitude]}
                                zoom={13}
                                style={{ height: '100%', width: '100%', zIndex: 1 }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
                                <ChangeMapCenter center={[formData.latitude, formData.longitude]} trigger={isMapFullscreen} />
                            </MapContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <input
                                type="number"
                                step="any"
                                value={formData.latitude}
                                onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                                className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold"
                            />
                            <input
                                type="number"
                                step="any"
                                value={formData.longitude}
                                onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                                className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold"
                            />
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Qulayliklar</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {availableAmenities.map((amenity) => {
                                const Icon = iconMap[amenity.icon] || Smile;
                                const key = amenity.name_uz;
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
                                        className={`flex flex-col items-center justify-center space-y-2 p-4 rounded-2xl border transition-all ${formData.amenities[key]
                                            ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400 font-black ring-2 ring-primary-500/20'
                                            : 'bg-gray-50 border-gray-100 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 font-bold hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon size={24} />
                                        <span className="text-[8px] uppercase tracking-widest text-center">{amenity.name_uz}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
