'use client';

import { Edit, Trash2, MapPin } from 'lucide-react';

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

interface AddressCardProps {
  address: Address;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
}

export default function AddressCard({ address, onEdit, onDelete, onSetPrimary }: AddressCardProps) {
  return (
    <div className={`p-4 rounded-xl border transition-all ${address.is_primary ? 'border-unify-green bg-green-50/30' : 'border-gray-200 hover:border-gray-300'}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">{address.recipient_name}</span>
            {address.is_primary && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-unify-green rounded">Utama</span>
            )}
          </div>
          <p className="text-gray-600 text-sm">{address.phone_number}</p>
          <p className="text-gray-600 text-sm mt-2 max-w-md">
            {address.street}, {address.city}, {address.state} {address.zip_code}
          </p>
        </div>

        <div className="flex items-center gap-2">
           {!address.is_primary && (
             <button 
                onClick={() => onSetPrimary(address.id)}
                className="text-xs font-semibold text-gray-500 hover:text-unify-green px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                title="Jadikan Alamat Utama"
             >
                Set Utama
             </button>
           )}
           <div className="h-4 w-px bg-gray-200 mx-1"></div>
           <button 
             onClick={() => onEdit(address.id)}
             className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
             title="Ubah Alamat"
           >
             <Edit size={16} />
           </button>
           <button 
             onClick={() => onDelete(address.id)}
             className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
             title="Hapus Alamat"
           >
             <Trash2 size={16} />
           </button>
        </div>
      </div>
    </div>
  );
}
