'use client';

import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    name: string;
  };
  image_url: string;
  created_at: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Unwrap params using React.use() or await in useEffect (Next.js 15 async params)
  const [paramId, setParamId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setParamId(p.id));
  }, [params]);

  useEffect(() => {
    if (!paramId) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${paramId}`);
        setProduct(res.data);
      } catch (err) {
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [paramId]);

  const handleDelete = async () => {
    if(!confirm("Are you sure you want to delete this product?")) return;
    try {
        await api.delete(`/products/${paramId}`);
        router.push('/dashboard/products');
    } catch (error) {
        alert("Failed to delete product");
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
  if (error || !product) return <div className="p-8 text-center text-red-500">{error || 'Product not found'}</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-4">
            <Link href="/dashboard/products" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
         </div>
         <div className="flex space-x-3">
            <Link 
              href={`/dashboard/products/${product.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
            >
              <Pencil className="mr-2 h-4 w-4 text-gray-500" />
              Edit
            </Link>
            <button 
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </button>
         </div>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="md:flex">
             <div className="md:w-1/3 bg-gray-50 p-8 flex items-center justify-center border-r border-gray-100">
                {product.image_url ? (
                   <img src={product.image_url} alt={product.name} className="max-w-full h-auto rounded-lg shadow-sm" />
                ) : (
                   <div className="h-40 w-40 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 text-4xl font-bold">
                      {product.name.charAt(0)}
                   </div>
                )}
             </div>
             <div className="p-8 md:w-2/3 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Description</h3>
                  <p className="mt-2 text-gray-900 leading-relaxed">{product.description || 'No description provided.'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Price</h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">RP {product.price.toLocaleString()}</p>
                   </div>
                   <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Stock</h3>
                      <span className={`inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-sm font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock} items left
                      </span>
                   </div>
                   <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Category</h3>
                      <p className="mt-1 text-base text-gray-900">{product.category?.name || '-'}</p>
                   </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Created At</h3>
                      <p className="mt-1 text-sm text-gray-500">{new Date(product.created_at).toLocaleDateString()}</p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
