'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import ProductForm from '@/components/ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const { products, isLoaded } = useStore();

  const product = products.find(p => p.id === id);

  if (!isLoaded) {
    return <div className="p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center text-rose-600">ไม่พบสินค้าที่ต้องการแก้ไข</div>;
  }

  return <ProductForm initialProduct={product} isNew={false} />;
}
