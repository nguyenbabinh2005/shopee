'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
    title: string;
    showBackButton?: boolean;
}

export default function PageHeader({ title, showBackButton = true }: PageHeaderProps) {
    const router = useRouter();

    return (
        <div className="bg-orange-500 text-white p-4">
            <div className="max-w-7xl mx-auto flex items-center gap-4">
                {showBackButton && (
                    <button onClick={() => router.push('/')} className="hover:opacity-80">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                )}
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>
        </div>
    );
}