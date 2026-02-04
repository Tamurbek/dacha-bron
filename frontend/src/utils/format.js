export const formatPrice = (price) => {
    if (price === undefined || price === null || price === '') return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const unformatPrice = (formattedPrice) => {
    if (typeof formattedPrice !== 'string') return formattedPrice;
    return formattedPrice.replace(/\s/g, '');
};
export const formatPhoneNumber = (value) => {
    if (!value) return value;

    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Handle case where user might have pasted a full number with 998 or without
    let pureDigits = digits;
    if (digits.startsWith('998')) {
        pureDigits = digits.substring(3);
    }

    // Limit to 9 digits
    pureDigits = pureDigits.substring(0, 9);

    let result = '+998';

    if (pureDigits.length > 0) {
        result += ' ' + pureDigits.substring(0, 2);
    }
    if (pureDigits.length > 2) {
        result += ' ' + pureDigits.substring(2, 5);
    }
    if (pureDigits.length > 5) {
        result += ' ' + pureDigits.substring(5, 7);
    }
    if (pureDigits.length > 7) {
        result += ' ' + pureDigits.substring(7, 9);
    }

    return result;
};
