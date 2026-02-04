export const formatPrice = (price) => {
    if (price === undefined || price === null || price === '') return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const unformatPrice = (formattedPrice) => {
    if (typeof formattedPrice !== 'string') return formattedPrice;
    return formattedPrice.replace(/\s/g, '');
};
