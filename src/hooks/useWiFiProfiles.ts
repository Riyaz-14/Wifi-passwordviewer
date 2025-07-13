import { useState, useEffect, useMemo } from 'react';
import { WiFiProfile } from '../types/wifi';
import { mockWiFiProfiles } from '../data/mockData';

export const useWiFiProfiles = () => {
  const [profiles, setProfiles] = useState<WiFiProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'signal' | 'lastConnected'>('name');
  const [filterBy, setFilterBy] = useState<'all' | 'connected' | 'secured' | 'open'>('all');

  // Simulate loading Wi-Fi profiles
  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfiles(mockWiFiProfiles);
      setIsLoading(false);
    };

    loadProfiles();
  }, []);

  // Filter and sort profiles
  const filteredAndSortedProfiles = useMemo(() => {
    let filtered = profiles.filter(profile => {
      // Search filter
      const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      let matchesFilter = true;
      switch (filterBy) {
        case 'connected':
          matchesFilter = profile.isConnected;
          break;
        case 'secured':
          matchesFilter = profile.security !== 'Open';
          break;
        case 'open':
          matchesFilter = profile.security === 'Open';
          break;
        default:
          matchesFilter = true;
      }
      
      return matchesSearch && matchesFilter;
    });

    // Sort profiles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'signal':
          return b.signal - a.signal;
        case 'lastConnected':
          return b.lastConnected.getTime() - a.lastConnected.getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [profiles, searchTerm, sortBy, filterBy]);

  return {
    profiles: filteredAndSortedProfiles,
    allProfiles: profiles,
    isLoading,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
  };
};