'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';

interface Property {
  id: string;
  slug: string;
  status: string;
  type: string;
  price: number;
  location: string;
  featured: boolean;
  translations: Array<{
    locale: string;
    title: string;
  }>;
}

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('An error occurred');
    }
  };

  const filteredProperties = properties.filter((property) => {
    const searchLower = searchTerm.toLowerCase();
    const title = property.translations?.[0]?.title?.toLowerCase() || '';
    const location = property.location?.toLowerCase() || '';
    return title.includes(searchLower) || location.includes(searchLower);
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sold':
        return 'bg-green-600';
      case 'available':
        return 'bg-blue-600';
      case 'leased':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white">Properties</h1>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <Plus size={20} />
          <span>Add Property</span>
        </Link>
      </div>

      <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-white text-center py-12">Loading...</div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-12 border border-gray-800 text-center">
          <p className="text-gray-400 text-lg">No properties found</p>
          <Link
            href="/admin/properties/new"
            className="inline-block mt-4 text-blue-400 hover:text-blue-300"
          >
            Add your first property
          </Link>
        </div>
      ) : (
        <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Location</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-white">
                          {property.translations?.[0]?.title || 'Untitled'}
                        </div>
                        <div className="text-sm text-gray-400">{property.slug}</div>
                        {property.featured && (
                          <span className="inline-block mt-1 text-xs bg-yellow-600 text-white px-2 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 capitalize">{property.type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                          property.status
                        )}`}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">
                      €{property.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{property.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/properties/${property.slug}`}
                          target="_blank"
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/properties/${property.id}/edit`}
                          className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-600/20 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

