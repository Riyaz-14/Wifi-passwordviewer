export interface WiFiProfile {
  id: string;
  name: string;
  password: string | null;
  security: string;
  signal: number;
  lastConnected: Date;
  isConnected: boolean;
}

export interface WiFiScanResult {
  profiles: WiFiProfile[];
  scanTime: Date;
  totalProfiles: number;
}