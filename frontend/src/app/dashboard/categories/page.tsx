'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Note: Backend FindAll currently doesn't support search via query params for categories in this simple implementation
  // But we can filter client-side for now or implement search in backend later.
  // Given the implementation plan, we stuck to basic FindAll. I'll add client-side search for better UX.
  const [search, setSearch] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
      if(!confirm("Are you sure you want to delete this category?")) return;
      try {
          await api.delete(`/categories/${id}`);
          fetchCategories();
      } catch (error) {
          alert("Failed to delete category");
      }
  }

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">Manage product categories</p>
        </div>
        <Link
          href="/dashboard/categories/create"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Plus className="-ml-0.5 mr-2 h-4 w-4" />
          Add Category
        </Link>
      </div>

       {/* Search */}
       <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                 <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">Loading categories...</td>
                 </tr>
              ) : filteredCategories.length === 0 ? (
                 <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">
                        {categories.length === 0 ? "No categories found." : "No matching categories."}
                    </td>
                 </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-500">{category.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/dashboard/categories/${category.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                         <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">
                         <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
