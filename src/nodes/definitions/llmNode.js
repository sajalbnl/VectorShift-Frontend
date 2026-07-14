// llmNode.js

import { Position } from 'reactflow';
import { Sparkles } from 'lucide-react';

export const llmNode = {
  type: 'llm',
  label: 'LLM',
  category: 'AI',
  icon: Sparkles,
  accent: '#8b5cf6',
  fields: [
    {
      name: 'model',
      label: 'Model',
      type: 'select',
      options: ['gpt-4o', 'claude-opus-4-8', 'claude-sonnet-5', 'llama-3.1-70b'],
      default: 'claude-opus-4-8',
    },
    {
      name: 'temperature',
      label: 'Temperature',
      type: 'number',
      min: 0,
      max: 2,
      step: 0.1,
      default: 0.7,
    },
  ],
  // Two targets on the left get auto-spaced to 33% / 66% by BaseNode.
  handles: [
    { id: 'system', type: 'target', position: Position.Left, label: 'system' },
    { id: 'prompt', type: 'target', position: Position.Left, label: 'prompt' },
    { id: 'response', type: 'source', position: Position.Right },
  ],
};
