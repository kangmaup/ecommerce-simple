'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import api from '@/lib/api';

interface Address {
  id?: string;
  recipient_name: string;
  phone_number: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  is_primary?: boolean;
}

interface AddressFormProps {
  initialData?: Address | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddressForm({ initialData, onSuccess, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<Address>({
      recipient_name: initialData?.recipient_name || '',
      phone_number: initialData?.phone_number || '',
      street: initialData?.street || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zip_code: initialData?.zip_code || '',
      is_primary: initialData?.is_primary || false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
       if (initialData?.id) {
          await api.put(`/addresses/${initialData.id}`, formData);
       } else {
          await api.post('/addresses', formData);
       }
       onSuccess();
    } catch (err: any) {
       console.error(err);
       setError(err.response?.data?.error || "Gagal menyimpan alamat");
    } finally {
       setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       {error && (
         <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
         </div>
       )}

       <Input 
         label="Nama Penerima"
         name="recipient_name" 
         value={formData.recipient_name}
         onChange={handleChange}
         placeholder="Nama Lengkap (Contoh: Budi Santoso)"
         required
       />

       <Input 
         label="Nomor HP"
         name="phone_number" 
         value={formData.phone_number}
         onChange={handleChange}
         placeholder="0812xxxxxxxx"
         required
       />

       <Input 
         label="Label Alamat / Jalan"
         name="street" 
         value={formData.street}
         onChange={handleChange}
         placeholder="Nama Jalan, No Rumah, RT/RW"
         required
       />
       
       <div className="grid grid-cols-2 gap-4">
         <Input 
           label="Kota"
           name="city" 
           value={formData.city}
           onChange={handleChange}
           placeholder="Contoh: Jakarta Selatan"
           required
         />
         <Input 
           label="Provinsi"
           name="state" 
           value={formData.state}
           onChange={handleChange}
           placeholder="Contoh: DKI Jakarta"
           required
         />
       </div>

       <Input 
         label="Kode Pos"
         name="zip_code" 
         value={formData.zip_code}
         onChange={handleChange}
         placeholder="5 Digit Kode Pos"
         required
       />

       <div className="pt-4 flex gap-3">
          <button 
             type="button" 
             onClick={onCancel}
             className="flex-1 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
             disabled={loading}
          >
             Batal
          </button>
          <button 
             type="submit" 
             className="flex-1 py-2.5 bg-unify-green text-white rounded-lg font-bold shadow-md hover:bg-unify-dark-green transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
             disabled={loading}
          >
             {loading ? 'Menyimpan...' : 'Simpan Alamat'}
          </button>
       </div>
    </form>
  );
}
