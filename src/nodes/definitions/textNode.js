// textNode.js
// Part 3 replaces `fields` with a custom body (auto-resize) and turns `handles`
// into a function of data ({{ variable }} -> handle). Static for now.

import { Position } from 'reactflow';
import { Type } from 'lucide-react';

export const textNode = {
  type: 'text',
  label: 'Text',
  category: 'Utility',
  icon: Type,
  accent: '#0ea5e9',
  fields: [
    {
      name: 'text',
      label: 'Text',
      type: 'textarea',
      default: '{{ input }}',
    },
  ],
  handles: [{ id: 'output', type: 'source', position: Position.Right }],
};
