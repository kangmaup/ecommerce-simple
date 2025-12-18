'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [paramId, setParamId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setParamId(p.id));
  }, [params]);

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      if (!paramId) return;

      try {
        const res = await api.get(`/categories/${paramId}`);
        setName(res.data.name);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch category');
        setError('Failed to load category');
        setLoading(false);
      }
    };
    fetchCategory();
  }, [paramId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.put(`/categories/${paramId}`, { name });
      router.push('/dashboard/categories');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading category data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div className="flex items-center space-x-4">
        <Link href="/dashboard/categories" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <form onSubmit={handleSubmit} className="px-4 py-6 sm:p-8">
           <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Category Name</label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
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
            <Link href="/dashboard/categories" className="text-sm font-semibold leading-6 text-gray-900">Cancel</Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
