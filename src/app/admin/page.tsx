'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, List, TrendingUp, DollarSign, Building2 } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        const properties = data.properties || [];

        const available = properties.filter((p: any) => p.status === 'available').length;
        const sold = properties.filter((p: any) => p.status === 'sold').length;
        const totalValue = properties.reduce((sum: number, p: any) => sum + (p.price || 0), 0);

        setStats({
          total: properties.length,
          available,
          sold,
          totalValue,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.total,
      icon: Building2,
      color: 'bg-blue-600',
    },
    {
      title: 'Available',
      value: stats.available,
      icon: List,
      color: 'bg-green-600',
    },
    {
      title: 'Sold',
      value: stats.sold,
      icon: TrendingUp,
      color: 'bg-purple-600',
    },
    {
      title: 'Total Value',
      value: `€${(stats.totalValue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'bg-yellow-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <Plus size={20} />
          <span>Add Property</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/properties"
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-white transition-colors"
          >
            <List className="mb-2" size={24} />
            <h3 className="font-semibold">View All Properties</h3>
            <p className="text-sm text-gray-400 mt-1">Manage your property listings</p>
          </Link>
          <Link
            href="/admin/properties/new"
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-white transition-colors"
          >
            <Plus className="mb-2" size={24} />
            <h3 className="font-semibold">Add New Property</h3>
            <p className="text-sm text-gray-400 mt-1">Create a new property listing</p>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg text-white transition-colors"
          >
            <Building2 className="mb-2" size={24} />
            <h3 className="font-semibold">View Website</h3>
            <p className="text-sm text-gray-400 mt-1">See how it looks to visitors</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

