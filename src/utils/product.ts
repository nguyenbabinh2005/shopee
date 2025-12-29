import { toNumber } from './number';

export const normalizeProduct = (p: any) => {
    return {
        ...p,
        originalPrice: toNumber(p.originalPrice),
        discountAmount: toNumber(p.discountAmount),
        finalPrice: toNumber(p.finalPrice),
        totalPurchaseCount: toNumber(p.totalPurchaseCount ?? 0),
        rating: p.rating ?? 4.8,
        imageUrl:
            p.imageUrl && p.imageUrl.trim()
                ? p.imageUrl
                : 'https://via.placeholder.com/400x400?text=No+Image',
    };
};
