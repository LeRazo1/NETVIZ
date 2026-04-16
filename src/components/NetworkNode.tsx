import { Handle, Position, NodeProps } from '@xyflow/react';
import { Router, Server, Laptop, Cloud, Hash } from 'lucide-react';
import { NetworkDeviceData } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nodeIcons = {
  router: <Router className="w-6 h-6" />,
  switch: <Hash className="w-6 h-6" />,
  host: <Laptop className="w-6 h-6" />,
  cloud: <Cloud className="w-6 h-6" />,
};

const nodeColors = {
  router: 'bg-red-500/10 border-red-500 text-red-500',
  switch: 'bg-blue-500/10 border-blue-500 text-blue-500',
  host: 'bg-emerald-500/10 border-emerald-500 text-emerald-500',
  cloud: 'bg-sky-400/10 border-sky-400 text-sky-400',
};

export function NetworkNode({ data, selected }: NodeProps<any>) {
  const deviceData = data as NetworkDeviceData;
  const Icon = nodeIcons[deviceData.type];

  return (
    <div className={cn(
      "px-4 py-3 rounded-xl border-2 transition-all duration-200 shadow-sm min-w-[140px]",
      nodeColors[deviceData.type],
      selected ? "ring-4 ring-offset-2 ring-blue-500/20 scale-105" : "hover:border-opacity-100",
      "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
    )}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-zinc-400 border-2 border-white dark:border-zinc-950" />
      
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          nodeColors[deviceData.type],
          "border-none"
        )}>
          {Icon}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {deviceData.type}
          </span>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[100px]">
            {deviceData.label}
          </span>
        </div>
      </div>

      {deviceData.interfaces && deviceData.interfaces.length > 0 && (
        <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          {deviceData.interfaces.map(iface => (
            <div key={iface.id} className="flex justify-between items-center text-[10px] family-mono opacity-70">
              <span>{iface.name}</span>
              <span className="font-mono">{iface.ip || 'no-ip'}</span>
            </div>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-zinc-400 border-2 border-white dark:border-zinc-950" />
    </div>
  );
}
