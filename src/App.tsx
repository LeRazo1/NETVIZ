import React, { useState, useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Edge, 
  Node, 
  addEdge, 
  useNodesState, 
  useEdgesState,
  Panel,
  XYPosition,
  OnConnect
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Router as RouterIcon, 
  Monitor, 
  Cpu, 
  Cloud, 
  Settings2, 
  Plus, 
  Zap, 
  Trash2,
  Share2,
  FileCode,
  Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'react-hot-toast';

import { NetworkNode } from './components/NetworkNode';
import { NetworkStats } from './components/NetworkStats';
import { GeminiAssistant } from './components/GeminiAssistant';
import { SubnetCalculator } from './components/SubnetCalculator';
import { DeviceType, DeviceInterface } from './types';
import { generateMAC } from './lib/networkUtils';

// Node types definition
const nodeTypes = {
  networkNode: NetworkNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Connection logic
  const onConnect: OnConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { strokeWidth: 2 } }, eds));
    toast.success('Physical link established');
  }, [setEdges]);

  // Drag and Drop Logic
  const onDragStart = (event: React.DragEvent, nodeType: DeviceType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as DeviceType;

      if (!type) return;

      const position: XYPosition = {
        x: event.clientX - 240, 
        y: event.clientY - 40,
      };

      const newNode: Node = {
        id: `node_${Date.now()}`,
        type: 'networkNode',
        position,
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
          type,
          interfaces: [
            { id: 'eth0', name: 'eth0', ip: '', subnetMask: '255.255.255.0', macAddress: generateMAC(), isConnected: false }
          ],
          os: 'NetOS v1.0'
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Node Selection and Editing
  const selectedNode = useMemo(() => 
    nodes.find((n) => n.id === selectedNodeId), 
  [nodes, selectedNodeId]);

  const updateNodeData = (id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  };

  const deleteSelected = () => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
      setSelectedNodeId(null);
      toast.error('Device removed');
    }
  };

  const simulatePing = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Predicting packet flow...',
        success: 'Routing tables verified!',
        error: 'Network unreachable',
      }
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#E4E3E0] text-[#141414] font-sans overflow-hidden select-none">
      <Toaster position="bottom-right" />
      
      {/* Toolbox Sidebar */}
      <aside className="w-80 border-r border-[#141414] bg-[#E4E3E0] flex flex-col z-20 overflow-hidden">
        <div className="p-6 border-b border-[#141414] flex items-center gap-2">
          <Network className="w-8 h-8 text-blue-600" />
          <h1 className="font-serif italic text-xl font-bold tracking-tight">NetViz.adm</h1>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8 scrollbar-hide">
          <section>
            <h2 className="font-serif italic text-xs uppercase opacity-40 tracking-widest mb-4">Infrastructure</h2>
            <div className="grid grid-cols-2 gap-3">
              <div 
                draggable 
                onDragStart={(e) => onDragStart(e, 'router')}
                className="flex flex-col items-center gap-2 p-3 rounded border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-all cursor-grab active:cursor-grabbing bg-white/50"
              >
                <RouterIcon className="w-5 h-5" />
                <span className="text-[9px] font-mono">ROUTER</span>
              </div>
              <div 
                draggable 
                onDragStart={(e) => onDragStart(e, 'switch')}
                className="flex flex-col items-center gap-2 p-3 rounded border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-all cursor-grab active:cursor-grabbing bg-white/50"
              >
                <Cpu className="w-5 h-5" />
                <span className="text-[9px] font-mono">SWITCH</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif italic text-xs uppercase opacity-40 tracking-widest mb-4">Endpoints</h2>
            <div className="grid grid-cols-2 gap-3">
              <div 
                draggable 
                onDragStart={(e) => onDragStart(e, 'host')}
                className="flex flex-col items-center gap-2 p-3 rounded border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-all cursor-grab active:cursor-grabbing bg-white/50"
              >
                <Monitor className="w-5 h-5" />
                <span className="text-[9px] font-mono">HOST</span>
              </div>
              <div 
                draggable 
                onDragStart={(e) => onDragStart(e, 'cloud')}
                className="flex flex-col items-center gap-2 p-3 rounded border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-all cursor-grab active:cursor-grabbing bg-white/50"
              >
                <Cloud className="w-5 h-5" />
                <span className="text-[9px] font-mono">CLOUD</span>
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-[#141414]/10">
            <SubnetCalculator />
            <NetworkStats />
            <GeminiAssistant nodes={nodes} edges={edges} />
          </section>
        </div>

        <div className="p-4 border-t border-[#141414] bg-[#141414]/5 flex gap-2">
          <button className="flex-1 px-4 py-2 bg-[#141414] text-[#E4E3E0] rounded font-mono text-[10px] uppercase hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
            <Share2 className="w-3 h-3" /> Export
          </button>
          <button className="px-3 py-2 border border-[#141414] rounded hover:bg-[#141414]/5">
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 relative bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onPaneClick={() => setSelectedNodeId(null)}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#ccc" variant={"dots" as any} gap={20} size={1} />
          <Controls />
          
          <Panel position="top-right" className="flex gap-2">
            <button 
              onClick={simulatePing}
              className="px-6 py-2 bg-[#141414] text-[#E4E3E0] border border-[#141414] font-mono text-xs uppercase flex items-center gap-2 hover:bg-[#2a2a2a] transition-colors shadow-[4px_4px_0px_0px_rgba(20,20,20,0.2)]"
            >
              <Zap className="w-4 h-4 text-yellow-400" /> Run Topology Validation
            </button>
          </Panel>
        </ReactFlow>
      </main>

      {/* Properties Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.aside 
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            className="w-80 border-l border-[#141414] bg-[#E4E3E0] shadow-2xl z-20 flex flex-col"
          >
            <div className="p-6 border-b border-[#141414] flex justify-between items-center bg-[#141414] text-[#E4E3E0]">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-blue-400" />
                <h2 className="font-serif italic text-lg tracking-tight">Layer 2/3 Config</h2>
              </div>
              <button 
                onClick={deleteSelected}
                className="p-2 hover:bg-red-500/20 rounded transition-colors text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <section>
                <h3 className="font-serif italic text-xs uppercase opacity-40 tracking-widest mb-3">Identity</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase mb-1 block opacity-60">Hostname</label>
                    <input 
                      type="text" 
                      value={selectedNode.data.label as string}
                      onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                      className="w-full bg-white border border-[#141414] p-2 font-mono text-sm focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-shadow outline-none"
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-serif italic text-xs uppercase opacity-40 tracking-widest">Network Interfaces</h3>
                  <button 
                    onClick={() => {
                      const currentInterfaces = (selectedNode.data as any).interfaces || [];
                      const interfaces = [...currentInterfaces];
                      interfaces.push({
                        id: `eth${interfaces.length}`,
                        name: `eth${interfaces.length}`,
                        ip: '',
                        subnetMask: '255.255.255.0',
                        macAddress: generateMAC(),
                        isConnected: false
                      });
                      updateNodeData(selectedNode.id, { interfaces });
                    }}
                    className="p-1 hover:bg-[#141414]/10 border border-[#141414]/20 rounded"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {(selectedNode.data as any).interfaces.map((iface: DeviceInterface, index: number) => (
                    <div key={iface.id} className="p-4 border border-[#141414] bg-white space-y-3 shadow-[2px_2px_0px_0px_rgba(20,20,20,0.1)]">
                      <div className="flex justify-between items-center text-[10px] family-mono font-bold border-b border-[#141414]/5 pb-2">
                        <span className="italic">{iface.name}</span>
                        <span className="opacity-30">{iface.macAddress}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-[9px] font-mono uppercase opacity-50 mb-1 block">IPv4 Address</label>
                          <input 
                            type="text" 
                            placeholder="0.0.0.0"
                            value={iface.ip}
                            onChange={(e) => {
                              const interfaces = [...(selectedNode.data as any).interfaces];
                              interfaces[index] = { ...iface, ip: e.target.value };
                              updateNodeData(selectedNode.id, { interfaces });
                            }}
                            className="w-full bg-[#E4E3E0]/30 border-b border-[#141414] text-xs font-mono py-1 outline-none focus:bg-white transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono uppercase opacity-50 mb-1 block">Subnet Mask</label>
                          <input 
                            type="text" 
                            placeholder="255.255.255.0"
                            value={iface.subnetMask}
                            onChange={(e) => {
                              const interfaces = [...(selectedNode.data as any).interfaces];
                              interfaces[index] = { ...iface, subnetMask: e.target.value };
                              updateNodeData(selectedNode.id, { interfaces });
                            }}
                            className="w-full bg-[#E4E3E0]/30 border-b border-[#141414] text-xs font-mono py-1 outline-none focus:bg-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {selectedNode.data.type === 'host' && (
                <section>
                  <h3 className="font-serif italic text-xs uppercase opacity-40 tracking-widest mb-3">Static Routing</h3>
                  <div className="p-4 border border-[#141414] bg-white shadow-[2px_2px_0px_0px_rgba(20,20,20,0.1)]">
                    <label className="text-[9px] font-mono uppercase opacity-50 mb-1 block">Default Gateway</label>
                    <input 
                      type="text" 
                      placeholder="192.168.1.1"
                      value={(selectedNode.data as any).gateway || ''}
                      onChange={(e) => updateNodeData(selectedNode.id, { gateway: e.target.value })}
                      className="w-full bg-[#E4E3E0]/30 border-b border-[#141414] text-xs font-mono py-1 outline-none"
                    />
                  </div>
                </section>
              )}
            </div>

            <div className="p-4 border-t border-[#141414] bg-[#141414] text-[#E4E3E0]/40 text-[9px] font-mono flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-3 h-3" />
                <span>TERMINAL ACTIVE</span>
              </div>
              <span className="animate-pulse">_</span>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
