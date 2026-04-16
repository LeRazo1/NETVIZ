export type DeviceType = 'router' | 'switch' | 'host' | 'cloud';

export interface DeviceInterface {
  id: string;
  name: string;
  ip: string;
  subnetMask: string;
  macAddress: string;
  isConnected: boolean;
}

export interface NetworkDeviceData {
  label: string;
  type: DeviceType;
  interfaces: DeviceInterface[];
  gateway?: string;
  icon?: string;
  os?: string;
}

export interface Subnet {
  id: string;
  networkAddress: string;
  mask: string;
  color: string;
}
