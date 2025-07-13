import React, { useState } from 'react';
import { Header } from './components/Header';
import { WiFiCard } from './components/WiFiCard';
import { SearchFilter } from './components/SearchFilter';
import { StatsCard } from './components/StatsCard';
import { ExportButton } from './components/ExportButton';
import { useWiFiProfiles } from './hooks/useWiFiProfiles';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

function App() {
  const {
    profiles,
    allProfiles,
    isLoading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
  } = useWiFiProfiles();

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleCopyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      setNotification({
        type: 'success',
        message: 'Password copied to clipboard!',
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to copy password',
      });
    }

    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Scanning Wi-Fi Profiles
              </h2>
              <p className="text-gray-600">
                Retrieving saved network credentials from your system...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsCard profiles={allProfiles} />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex-1 w-full sm:w-auto">
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filterBy={filterBy}
              onFilterChange={setFilterBy}
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Saved Wi-Fi Networks
            </h2>
            <p className="text-gray-600">
              {profiles.length} of {allProfiles.length} networks shown
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <ExportButton profiles={profiles} />
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Wi-Fi Profiles Grid */}
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No networks found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterBy !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No saved Wi-Fi profiles were found on this system.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profiles.map((profile) => (
              <WiFiCard
                key={profile.id}
                profile={profile}
                onCopyPassword={handleCopyPassword}
              />
            ))}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Security Notice
              </h3>
              <div className="text-blue-800 space-y-2">
                <p>
                  • This tool only accesses locally stored Wi-Fi credentials on your device
                </p>
                <p>
                  • No data is transmitted to external servers or stored remotely
                </p>
                <p>
                  • Administrator privileges may be required for full functionality
                </p>
                <p>
                  • Use responsibly and only on systems you own or have permission to access
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;