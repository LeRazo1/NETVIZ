import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Activity } from 'lucide-react';

const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    traffic: Math.floor(Math.random() * 800) + 200,
    latency: Math.floor(Math.random() * 50) + 10,
  }));
};

export function NetworkStats() {
  const data = generateData();

  return (
    <div className="border border-[#141414] bg-white p-4 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-emerald-600" />
        <h3 className="font-serif italic text-sm font-bold uppercase tracking-widest">Real-time Throughput (Mbps)</h3>
      </div>
      
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#141414', 
                color: '#fff', 
                border: 'none', 
                fontSize: '10px',
                fontFamily: 'monospace'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="traffic" 
              stroke="#141414" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTraffic)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#141414]/10">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono opacity-50 uppercase">Packets/Sec</span>
          <span className="text-sm font-bold family-mono">1,240 pkts</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono opacity-50 uppercase">Error Rate</span>
          <span className="text-sm font-bold family-mono text-emerald-600">0.002%</span>
        </div>
      </div>
    </div>
  );
}
