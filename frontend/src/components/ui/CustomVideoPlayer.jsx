import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

export const CustomVideoPlayer = ({ src, poster, autoPlay = false, className = "" }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(autoPlay); // Autoplay usually requires mute
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            const current = video.currentTime;
            const duration = video.duration;
            if (duration) {
                setProgress((current / duration) * 100);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setShowControls(true);
        };

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('ended', handleEnded);

        // Disable right click context menu
        video.addEventListener('contextmenu', (e) => e.preventDefault());

        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('contextmenu', (e) => e.preventDefault());
        };
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(e => {
                    console.log("Autoplay prevented:", e);
                    setIsPlaying(false);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    const togglePlay = (e) => {
        e.stopPropagation();
        setIsPlaying(!isPlaying);
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = (e) => {
        e.stopPropagation();
        if (!document.fullscreenElement) {
            videoRef.current.parentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleSeek = (e) => {
        e.stopPropagation();
        const video = videoRef.current;
        if (!video) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percent = x / width;

        video.currentTime = percent * video.duration;
    };

    return (
        <div
            className={`relative group bg-black overflow-hidden ${className}`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            onContextMenu={(e) => e.preventDefault()}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain"
                onClick={togglePlay}
                playsInline
                controlsList="nodownload" // Additional layer of protection
            />

            {/* Big Play Button Overlay */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] cursor-pointer" onClick={togglePlay}>
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 group-hover:bg-primary-600/80">
                        <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-current ml-1" />
                    </div>
                </div>
            )}

            {/* Controls Bar */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <div
                    className="w-full h-1.5 bg-gray-600 rounded-full cursor-pointer mb-4 relative group/progress"
                    onClick={handleSeek}
                >
                    <div
                        className="h-full bg-primary-500 rounded-full relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                    </div>
                </div>

                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                        <button onClick={togglePlay} className="hover:text-primary-400 transition-colors">
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                        </button>

                        <button onClick={toggleMute} className="hover:text-primary-400 transition-colors">
                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={toggleFullscreen} className="hover:text-primary-400 transition-colors">
                            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
