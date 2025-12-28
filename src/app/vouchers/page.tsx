'use client';

import VoucherPage from '../VoucherPage';

export default function VouchersRoute() {
    // Lấy userId và isLoggedIn từ context hoặc localStorage
    const isLoggedIn = false; // TODO: Lấy từ auth state
    const userId = 1; // TODO: Lấy từ auth state

    return <VoucherPage userId={userId} isLoggedIn={isLoggedIn} />;
}