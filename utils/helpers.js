export function calculateOfferPrice (originalPrice, offerPercentage) {
    const newPrice = originalPrice - (originalPrice * (offerPercentage / 100));
    return Math.ceil(newPrice)
}