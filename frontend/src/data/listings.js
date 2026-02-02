const regions = ['tashkent', 'zomin', 'chimgan', 'jizzax', 'charvak', 'amirsoy'];

const titles = [
    "Shinam Dacha", "Lux Villa", "Mountain Vista", "Pool Side Paradise",
    "Family Retreat", "Eco Stay", "Modern Mansion", "Grand Villa",
    "Hilltop Haven", "Lakefront Lodge", "Valley View", "Forest Cabin",
    "Summer House", "Winter Escape", "Sunset Villa", "Breeze Villa",
    "Zen Oasis", "Royal Dacha", "Hidden Gem", "Cloud Nine Villa"
];

const amenitiesList = ['pool', 'sauna', 'bbq', 'wifi', 'ac', 'kitchen'];

export const listings = Array.from({ length: 24 }).map((_, i) => {
    const id = i + 1;
    const region = regions[i % regions.length];
    const guestsMax = 4 + (i % 8);
    const rooms = 2 + (i % 4);

    return {
        id,
        title: `${titles[i % titles.length]} #${id}`,
        region,
        location: `${region.charAt(0).toUpperCase() + region.slice(1)}, Uzbekistan`,
        pricePerNight: 500000 + (i * 100000),
        rating: (4 + Math.random()).toFixed(1),
        reviewsCount: Math.floor(Math.random() * 50) + 5,
        guestsMax,
        rooms,
        beds: rooms + 1,
        baths: Math.max(1, rooms - 1),
        videoUrl: i % 3 === 0 ? "https://www.w3schools.com/html/mov_bbb.mp4" : null,
        amenities: amenitiesList.reduce((acc, amenity) => ({
            ...acc,
            [amenity]: Math.random() > 0.3
        }), {}),
        images: [
            `https://picsum.photos/seed/dacha-${id}-1/1200/800`,
            `https://picsum.photos/seed/dacha-${id}-2/1200/800`,
            `https://picsum.photos/seed/dacha-${id}-3/1200/800`,
            `https://picsum.photos/seed/dacha-${id}-4/1200/800`,
        ],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    };
});
