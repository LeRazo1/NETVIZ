import { useState } from 'react';
import { Calculator } from 'lucide-react';

export function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.1');
  const [mask, setMask] = useState('255.255.255.0');

  const calculate = () => {
    // Very simple calculation for display
    const ipParts = ip.split('.').map(Number);
    const maskParts = mask.split('.').map(Number);
    
    if (ipParts.length !== 4 || maskParts.length !== 4) return null;

    const network = ipParts.map((part, i) => part & maskParts[i]).join('.');
    const broadcast = ipParts.map((part, i) => (part & maskParts[i]) | (255 - maskParts[i])).join('.');
    
    return { network, broadcast };
  };

  const results = calculate();

  return (
    <div className="p-4 border border-[#141414] bg-white shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="w-4 h-4" />
        <h3 className="font-serif italic text-xs font-bold uppercase tracking-widest">Subnet Calc</h3>
      </div>
      
      <div className="space-y-3">
        <input 
          type="text" 
          value={ip} 
          onChange={(e) => setIp(e.target.value)} 
          placeholder="IP Address"
          className="w-full text-xs font-mono border-b border-[#141414] outline-none py-1"
        />
        <input 
          type="text" 
          value={mask} 
          onChange={(e) => setMask(e.target.value)} 
          placeholder="Subnet Mask"
          className="w-full text-xs font-mono border-b border-[#141414] outline-none py-1"
        />
        
        {results && (
          <div className="mt-2 pt-2 border-t border-[#141414]/5 space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="opacity-50 uppercase">Network:</span>
              <span className="font-bold">{results.network}</span>
            </div>
            <div className="flex justify-between text-[11px] font-mono">
              <span className="opacity-50 uppercase">Broadcast:</span>
              <span className="font-bold">{results.broadcast}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
