import React, { useState } from 'react';
import { Download, FileText, Database } from 'lucide-react';
import { WiFiProfile } from '../types/wifi';

interface ExportButtonProps {
  profiles: WiFiProfile[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ profiles }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    const headers = ['Network Name', 'Password', 'Security', 'Signal Strength', 'Last Connected', 'Status'];
    const csvContent = [
      headers.join(','),
      ...profiles.map(profile => [
        `"${profile.name}"`,
        `"${profile.password || 'N/A'}"`,
        `"${profile.security}"`,
        profile.signal,
        `"${profile.lastConnected.toISOString()}"`,
        profile.isConnected ? 'Connected' : 'Disconnected'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wifi-profiles-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify({
      exportDate: new Date().toISOString(),
      totalProfiles: profiles.length,
      profiles: profiles.map(profile => ({
        name: profile.name,
        password: profile.password,
        security: profile.security,
        signalStrength: profile.signal,
        lastConnected: profile.lastConnected.toISOString(),
        isConnected: profile.isConnected
      }))
    }, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wifi-profiles-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    
    // Simulate export delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (format === 'csv') {
      exportToCSV();
    } else {
      exportToJSON();
    }
    
    setIsExporting(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleExport('csv')}
        disabled={isExporting}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FileText className="w-4 h-4" />
        <span>Export CSV</span>
      </button>
      
      <button
        onClick={() => handleExport('json')}
        disabled={isExporting}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Database className="w-4 h-4" />
        <span>Export JSON</span>
      </button>
      
      {isExporting && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Download className="w-4 h-4 animate-bounce" />
          <span>Exporting...</span>
        </div>
      )}
    </div>
  );
};