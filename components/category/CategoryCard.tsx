'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './CategoryCard.css';

interface Category {
  id?: number;
  category_id?: number;
  name: string;
  image?: string;
}

interface Props {
  category: Category;
}

export default function CategoryCard({ category }: Props) {
  const router = useRouter();

  const categoryId = category.category_id || category.id;

  return (
    <div
      className="perfect-cat-card"
      onClick={() => router.push(`/products?category=${categoryId}`)}
    >
      <div className="perfect-cat-img">
        <Image
          src={category.image || '/images/default-cat.jpg'}
          alt={category.name}
          width={200}
          height={200}
          className="object-cover"
        />
      </div>

      <div className="perfect-cat-name">{category.name}</div>
    </div>
  );
}
