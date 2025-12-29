export const toNumber = (v: unknown): number => {
    if (v === null || v === undefined) return 0;
    const num = typeof v === 'number' ? v : Number(v);
    return isNaN(num) ? 0 : num;
};
