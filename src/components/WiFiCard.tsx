import React, { useState } from 'react';
import { WiFiProfile } from '../types/wifi';
import { 
  Wifi, 
  Eye, 
  EyeOff, 
  Copy, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface WiFiCardProps {
  profile: WiFiProfile;
  onCopyPassword: (password: string) => void;
}

export const WiFiCard: React.FC<WiFiCardProps> = ({ profile, onCopyPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  const getSignalStrength = (signal: number) => {
    if (signal >= 80) return { strength: 'Excellent', color: 'text-green-600', bars: 4 };
    if (signal >= 60) return { strength: 'Good', color: 'text-blue-600', bars: 3 };
    if (signal >= 40) return { strength: 'Fair', color: 'text-yellow-600', bars: 2 };
    return { strength: 'Weak', color: 'text-red-600', bars: 1 };
  };

  const getSecurityIcon = (security: string) => {
    if (security === 'Open') return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <Shield className="w-4 h-4 text-green-600" />;
  };

  const formatLastConnected = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const signalInfo = getSignalStrength(profile.signal);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
            profile.isConnected ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            <Wifi className={`w-6 h-6 ${
              profile.isConnected ? 'text-green-600' : 'text-gray-600'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>{profile.name}</span>
              {profile.isConnected && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </h3>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1">
                {getSecurityIcon(profile.security)}
                <span className="text-sm text-gray-600">{profile.security}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-3 rounded-full ${
                        i < signalInfo.bars ? signalInfo.color.replace('text-', 'bg-') : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-sm ${signalInfo.color}`}>
                  {signalInfo.strength} ({profile.signal}%)
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{formatLastConnected(profile.lastConnected)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Password:</span>
            {profile.password ? (
              <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                {showPassword ? profile.password : '•'.repeat(profile.password.length)}
              </code>
            ) : (
              <span className="text-sm text-gray-500 italic">No password required</span>
            )}
          </div>
          
          {profile.password && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onCopyPassword(profile.password!)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
                title="Copy password"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};