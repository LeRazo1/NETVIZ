import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, Send } from 'lucide-react';
import { Node, Edge } from '@xyflow/react';

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

interface Props {
  nodes: Node[];
  edges: Edge[];
}

export function GeminiAssistant({ nodes, edges }: Props) {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const analyzeNetwork = async () => {
    setLoading(true);
    try {
      const ai = getAiClient();
      const networkData = {
        devices: nodes.map(n => ({
          label: n.data.label,
          type: n.data.type,
          config: n.data.interfaces
        })),
        connections: edges.map(e => ({
          from: nodes.find(n => n.id === e.source)?.data.label,
          to: nodes.find(n => n.id === e.target)?.data.label
        }))
      };

      const prompt = `As a Senior Network Architect, analyze this network topology and provide 3-4 professional suggestions for optimization, security, or subnetting.
      Topology Data: ${JSON.stringify(networkData)}
      
      Requirements:
      - Keep it professional and technical.
      - Mention specific networking concepts (VLANs, Redundancy, IP Schemes).
      - Use a concise advice-per-line format with bullet points.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setAdvice(response.text || "No insights found.");
    } catch (error) {
      console.error(error);
      setAdvice(error instanceof Error ? error.message : "Error connecting to Gemini. Please check your network config.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[#141414] bg-white p-4 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="font-serif italic text-sm font-bold">AI Network Consultant</h3>
        </div>
        <button 
          onClick={analyzeNetwork}
          disabled={loading || nodes.length === 0}
          className="p-2 bg-[#141414] text-white rounded hover:bg-[#2a2a2a] disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>

      <div className="min-h-[100px] text-xs font-mono leading-relaxed whitespace-pre-wrap opacity-80 overflow-y-auto max-h-[300px]">
        {advice || "Click analyze to get architectural insights based on your current topology."}
      </div>
    </div>
  );
}
