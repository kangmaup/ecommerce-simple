'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import AddressCard from '@/components/address/AddressCard';
import AddressForm from '@/components/address/AddressForm';
import Modal from '@/components/ui/Modal';
import api from '@/lib/api';
import { Plus } from 'lucide-react';

interface Address {
  id: string;
  recipient_name: string;
  phone_number: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  is_primary: boolean;
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/addresses');
      setAddresses(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSetPrimary = async (id: string) => {
    try {
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            is_primary: addr.id === id
        })));

        await api.put(`/addresses/${id}`, { is_primary: true });
        fetchAddresses();
    } catch (error) {
        console.error("Failed to set primary", error);
        alert("Gagal mengubah alamat utama");
        fetchAddresses();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus alamat ini?")) return;
    try {
        await api.delete(`/addresses/${id}`);
        setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (error) {
        console.error("Failed to delete address", error);
        alert("Gagal menghapus alamat");
    }
  };

  const handleEdit = (id: string) => {
     const addr = addresses.find(a => a.id === id);
     if (addr) {
       setEditingAddress(addr);
       setIsModalOpen(true);
     }
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  }

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchAddresses();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar />
      
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Daftar Alamat</h1>
                <button 
                  onClick={handleAdd}
                  className="flex items-center gap-2 bg-unify-green text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-unify-dark-green transition-colors"
                >
                    <Plus size={18} />
                    Tambah Alamat Baru
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map(addr => (
                        <AddressCard 
                            key={addr.id} 
                            address={addr} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete}
                            onSetPrimary={handleSetPrimary}
                        />
                    ))}

                    {addresses.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-500">
                            <p>Belum ada alamat tersimpan.</p>
                            <button onClick={handleAdd} className="text-unify-green font-semibold mt-2 hover:underline">Tambah Alamat</button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingAddress ? "Ubah Alamat" : "Tambah Alamat Baru"}
      >
         <AddressForm 
            initialData={editingAddress} 
            onSuccess={handleSuccess} 
            onCancel={() => setIsModalOpen(false)}
         />
      </Modal>
    </div>
  );
}
