import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import { Package } from 'lucide-react';
import type { BahanBaku } from '../../types';

export default function BahanBakuList() {
  const [bahanBakuList, setBahanBakuList] = useState<BahanBaku[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBahanBaku = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/staff/bahan-baku');
      const data = res.data.bahan_baku || res.data.data || res.data;
      setBahanBakuList(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data bahan baku');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBahanBaku();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stok Bahan Baku</h1>
          <p className="text-gray-600 mt-1">Pantau stok bahan baku yang tersedia saat ini</p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bahanBakuList.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white rounded-xl border border-dashed border-gray-200 text-gray-500">
              Tidak ada data bahan baku yang dapat dilihat.
            </div>
          ) : (
            bahanBakuList.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl shrink-0">
                    <Package size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight" title={item.nama}>
                    {item.nama}
                  </h3>
                </div>
                <div className="pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Stok Aktual</p>
                  <div className="text-3xl font-bold text-gray-900 tracking-tight">
                    {item.stok} <span className="text-base font-semibold text-gray-500">{item.satuan}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
