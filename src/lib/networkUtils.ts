/**
 * Simple IP and subnet utilities
 */

export const isValidIP = (ip: string): boolean => {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const n = parseInt(part, 10);
    return !isNaN(n) && n >= 0 && n <= 255 && part === n.toString();
  });
};

export const ipToLong = (ip: string): number => {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
};

export const longToIp = (long: number): string => {
  return [
    (long >>> 24) & 0xff,
    (long >>> 16) & 0xff,
    (long >>> 8) & 0xff,
    long & 0xff
  ].join('.');
};

export const getNetworkAddress = (ip: string, mask: string): string => {
  const ipLong = ipToLong(ip);
  const maskLong = ipToLong(mask);
  return longToIp((ipLong & maskLong) >>> 0);
};

export const isInSameSubnet = (ip1: string, ip2: string, mask: string): boolean => {
  const net1 = ipToLong(ip1) & ipToLong(mask);
  const net2 = ipToLong(ip2) & ipToLong(mask);
  return net1 === net2;
};

export const generateMAC = (): string => {
  return "XX:XX:XX:XX:XX:XX".replace(/X/g, () => 
    "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))
  );
};
