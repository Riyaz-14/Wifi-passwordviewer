import React from 'react';
import { WiFiProfile } from '../types/wifi';
import { Wifi, Shield, AlertTriangle, Clock } from 'lucide-react';

interface StatsCardProps {
  profiles: WiFiProfile[];
}

export const StatsCard: React.FC<StatsCardProps> = ({ profiles }) => {
  const totalProfiles = profiles.length;
  const connectedProfiles = profiles.filter(p => p.isConnected).length;
  const securedProfiles = profiles.filter(p => p.security !== 'Open').length;
  const openProfiles = profiles.filter(p => p.security === 'Open').length;

  const stats = [
    {
      label: 'Total Networks',
      value: totalProfiles,
      icon: Wifi,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Connected',
      value: connectedProfiles,
      icon: Wifi,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Secured',
      value: securedProfiles,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Open Networks',
      value: openProfiles,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};