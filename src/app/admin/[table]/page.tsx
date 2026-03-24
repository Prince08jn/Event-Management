
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { adminConfig, ColumnConfig, TableConfig } from '@/lib/admin-config';
import { useParams, useRouter } from 'next/navigation';
import { LayoutGrid, List as ListIcon, Plus } from 'lucide-react';

export default function AdminTablePage() {
  const params = useParams();
  const router = useRouter();
  const tableName = params.table as string;
  const config = adminConfig[tableName];

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    if (tableName && !config) {
        // Handle unknown table
        return;
    }
    fetchData();
  }, [tableName]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: rows, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false, nullsFirst: false }) // Fallback sort if created_at exists
        .limit(100);

      if (fetchError) {
          // Try fetching without sort if created_at is missing (some tables might not have it or it might be different)
           const { data: retryRows, error: retryError } = await supabase.from(tableName).select('*').limit(100);
           if (retryError) throw retryError;
           setData(retryRows || []);
      } else {
        setData(rows || []);
      }
    
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setData(data.filter(row => row.id !== id));
    } catch (err: any) {
      alert('Error deleting record: ' + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Re-use loading state for save
    try {
      const payload = { ...formData };
      
      // Handle File Uploads
      for (const key in payload) {
        if (payload[key] instanceof File) {
            const file = payload[key] as File;
            const fileExt = file.name.split('.').pop();
            const fileName = `${tableName}/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            
            // Upload to Supabase Storage (assuming bucket 'uploads' exists, falling back to 'public' if not)
            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(fileName, file);

            if (uploadError) {
                // Try fallback bucket 'public'
                 const { error: fallbackError } = await supabase.storage
                    .from('public')
                    .upload(fileName, file);
                
                if (fallbackError) throw new Error(`Upload failed: ${uploadError.message} / ${fallbackError.message}`);
            }
            
            const { data: { publicUrl } } = supabase.storage
                .from('uploads')
                .getPublicUrl(fileName);
                
            payload[key] = publicUrl;
        }
      }

      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;

      if (currentRecord?.id) {
        // Update
        const { error: updateError } = await supabase
          .from(tableName)
          .update(payload)
          .eq('id', currentRecord.id);
        
        if (updateError) throw updateError;
      } else {
        // Create
        const { error: createError } = await supabase
          .from(tableName)
          .insert(payload);
          
        if (createError) throw createError;
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert('Error saving record: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (record: any = null) => {
    setCurrentRecord(record);
    if (record) {
      setFormData(record);
    } else {
      setFormData({});
    }
    setIsModalOpen(true);
  };

  if (!config) {
    return <div className="p-6">Table configuration not found for {tableName}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 capitalize tracking-tight">{config.label}</h1>
           <p className="text-sm text-gray-500 mt-1">Manage {config.label.toLowerCase()} records</p>
        </div>
        
        <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    title="List View"
                >
                    <ListIcon size={18} />
                </button>
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Grid View"
                >
                    <LayoutGrid size={18} />
                </button>
            </div>

            <button
            onClick={() => openModal()}
            className="bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center space-x-2"
            >
            <Plus size={18} />
            <span>Add New</span>
            </button>
        </div>
      </div>

      {loading && !isModalOpen ? (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl shadow-sm">{error}</div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((row) => (
                <div key={row.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col">
                     {/* Image Header if available */}
                     {config.cardConfig?.imageKey && row[config.cardConfig.imageKey] ? (
                         <div className="h-48 w-full bg-gray-100 relative">
                             <img 
                                src={row[config.cardConfig.imageKey]} 
                                alt={row[config.cardConfig.titleKey] || 'Card Image'}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image'; }}
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                     ) : (
                        <div className="h-24 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-3xl font-bold opacity-20">
                                {String(row[config.cardConfig?.titleKey || config.columns[0].key]).charAt(0).toUpperCase()}
                            </span>
                        </div>
                     )}

                     <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                            {String(row[config.cardConfig?.titleKey || config.columns[0].key] || 'Untitled')}
                        </h3>
                        {config.cardConfig?.subtitleKey && (
                            <p className="text-sm text-gray-500 mb-2 font-medium">
                                {String(row[config.cardConfig.subtitleKey] || '')}
                            </p>
                         )}
                         
                        <div className="space-y-1 mt-auto pt-4 border-t border-gray-100 text-xs text-gray-500">
                             {/* Show up to 3 fields that are not title/subtitle/image */}
                            {config.columns
                                .filter(col => 
                                    col.key !== config.cardConfig?.titleKey && 
                                    col.key !== config.cardConfig?.subtitleKey && 
                                    col.key !== config.cardConfig?.imageKey &&
                                    col.key !== 'id'
                                )
                                .slice(0, 3)
                                .map(col => (
                                    <div key={col.key} className="flex justify-between">
                                        <span className="font-medium text-gray-400">{col.label}:</span>
                                        <span className="truncate max-w-[50%]">{String(row[col.key] || '-')}</span>
                                    </div>
                                ))
                            }
                        </div>
                     </div>
                     
                     <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        <button
                            onClick={() => openModal(row)}
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-white text-blue-600 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(row.id)}
                            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-white text-red-600 transition-colors"
                        >
                            Del
                        </button>
                     </div>
                </div>
            ))}
             {data.length === 0 && (
                 <div className="col-span-full py-20 text-center text-gray-400">
                     <p className="text-xl font-medium">No records found</p>
                 </div>
            )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  {config.columns.map(col => (
                    <th key={col.key} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-gray-50/80 transition-colors">
                    {config.columns.map(col => (
                      <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                         {renderCell(row[col.key], col.type)}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => openModal(row)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="text-rose-500 hover:text-rose-700 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                     <td colSpan={config.columns.length + 1} className="px-6 py-16 text-center text-gray-400">
                       <p className="text-base font-medium">No records found</p>
                       <p className="text-xs mt-1">Get started by adding a new one.</p>
                     </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal / Slide-over */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsModalOpen(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
              <form onSubmit={handleSave}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {currentRecord ? 'Edit Record' : 'Create New Record'}
                  </h3>
                  <div className="space-y-4">
                    {config.columns.map(col => (
                      <div key={col.key}>
                        <label className="block text-sm font-medium text-gray-700">{col.label}</label>
                        {renderInput(col, formData, setFormData)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderCell(value: any, type: string) {
    if (value === null || value === undefined) return <span className="text-gray-400">-</span>;
    if (type === 'boolean') {
        return value ? <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Yes</span> : <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">No</span>;
    }
    if (type === 'date' || type === 'datetime') {
        try {
            return new Date(value).toLocaleDateString();
        } catch {
            return value;
        }
    }
    if (type === 'image') {
        return value ? (
            <div className="relative h-10 w-16 bg-gray-100 rounded overflow-hidden group hover:scale-[3.0] transition-transform origin-left z-10 hover:shadow-xl hover:z-50">
                <img 
                    src={value} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
            </div>
        ) : <span className="text-gray-300 italic text-xs">No image</span>;
    }
    if (typeof value === 'object') return JSON.stringify(value);
    // Limit long text
    const str = String(value);
    return str.length > 50 ? str.substring(0, 50) + '...' : str;
}

function renderInput(col: ColumnConfig, formData: any, setFormData: any) {
    const handleChange = (val: any) => {
        setFormData((prev: any) => ({ ...prev, [col.key]: val }));
    };

    if (col.type === 'boolean') {
        return (
            <select
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                value={formData[col.key] !== undefined ? String(formData[col.key]) : ''}
                onChange={(e) => handleChange(e.target.value === 'true')}
            >
                <option value="">Select...</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>
        );
    }
    
    if (col.type === 'select' && col.options) {
        return (
             <select
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                value={formData[col.key] || ''}
                onChange={(e) => handleChange(e.target.value)}
            >
                 <option value="">Select...</option>
                {col.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        );
    }

    if (col.type === 'date') {
        return (
            <input
                type="date"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                value={formData[col.key] ? String(formData[col.key]).split('T')[0] : ''}
                onChange={(e) => handleChange(e.target.value)}
            />
        );
    }

    if (col.type === 'textarea') {
        return (
             <textarea
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                rows={4}
                value={formData[col.key] || ''}
                onChange={(e) => handleChange(e.target.value)}
                required={col.required}
                disabled={col.readonly}
            />
        );
    }

    if (col.type === 'image') {
        return (
            <div className="mt-1 flex items-center space-x-4">
                {formData[col.key] && typeof formData[col.key] === 'string' && (
                    <div className="flex-shrink-0 h-16 w-16 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                        <img 
                            src={formData[col.key]} 
                            alt="Current" 
                            className="h-full w-full object-cover" 
                        />
                    </div>
                )}
                <div className="flex-1">
                    <input
                        type="file"
                        accept="image/*"
                         className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleChange(e.target.files[0]);
                            }
                        }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload a new image to replace.</p>
                </div>
            </div>
        );
    }

    if (col.type === 'number') {
        return (
             <input
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                value={formData[col.key] || ''}
                onChange={(e) => handleChange(e.target.value)}
            />
        );
    }

    return (
        <input
            type="text"
            disabled={col.readonly}
            className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2 ${col.readonly ? 'bg-gray-100 text-gray-500' : ''}`}
            value={formData[col.key] || ''}
            onChange={(e) => handleChange(e.target.value)}
            required={col.required}
        />
    );
}
