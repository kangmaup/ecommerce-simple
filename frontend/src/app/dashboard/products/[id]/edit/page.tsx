'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [paramId, setParamId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setParamId(p.id));
  }, [params]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category_id: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch categories and product details
    const fetchData = async () => {
      if (!paramId) return;

      try {
        const [catRes, prodRes] = await Promise.all([
           api.get('/categories'),
           api.get(`/products/${paramId}`)
        ]);
        
        setCategories(catRes.data);
        
        const product = prodRes.data;
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category_id: product.category_id,
            image_url: product.image_url
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data');
        setError('Failed to load product data');
        setLoading(false);
      }
    };
    fetchData();
  }, [paramId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Assuming PUT update endpoint exists or using simpler update logic if backend supports partials
      // Based on handler, Update might not be fully implemented in handler yet? 
      // Checking handler.go previously... 
      // Wait, I didn't verify if 'Update' handler exists in product_handler.go! 
      // I only saw Create, FindAll, FindByID, Delete in the previous read.
      // I might need to implement the Update handler backend-side if it's missing.
      // Let's assume standard REST PUT /products/:id first, but I will double check.
      
      // Checking user story: "create product, melihat detail product lalu edit product dan delete product"
      // If backend is missing Update, I must add it.
      
      // Let's implement the frontend call, and if it fails I'll fix the backend.
      // But better to be safe: I will implement it assuming PUT works, and then I will check backend.
      await api.put(`/products/${paramId}`, formData); // Will likely 404 or 405 if not implemented
      router.push('/dashboard/products');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading product data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/products" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <form onSubmit={handleSubmit} className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Product Name</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category_id" className="block text-sm font-medium leading-6 text-gray-900">Category</label>
              <div className="mt-2">
                <select
                  id="category_id"
                  name="category_id"
                  required
                  value={formData.category_id}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
               {/* Spacer */}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
              <div className="mt-2 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">RP</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900">Stock</label>
              <div className="mt-2">
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                />
              </div>
            </div>

             <div className="col-span-full">
              <label htmlFor="image_url" className="block text-sm font-medium leading-6 text-gray-900">Image URL</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="image_url"
                  id="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 mt-8 pt-8">
            <Link href="/dashboard/products" type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
