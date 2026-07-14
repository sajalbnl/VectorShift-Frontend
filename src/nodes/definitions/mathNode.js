// mathNode.js
// Demonstrates: three handles on one side, auto-spaced to 25/50/75% with no
// manual `top:` arithmetic anywhere in this file.

import { Position } from 'reactflow';
import { Calculator } from 'lucide-react';

export const mathNode = {
  type: 'math',
  label: 'Math',
  category: 'Logic',
  icon: Calculator,
  accent: '#14b8a6',
  fields: [
    {
      name: 'operation',
      label: 'Operation',
      type: 'select',
      options: [
        { value: 'add', label: 'a + b' },
        { value: 'subtract', label: 'a - b' },
        { value: 'multiply', label: 'a x b' },
        { value: 'divide', label: 'a / b' },
        { value: 'power', label: 'a ^ b' },
      ],
      default: 'add',
    },
    { name: 'precision', label: 'Decimals', type: 'number', min: 0, max: 10, default: 2 },
  ],
  handles: [
    { id: 'a', type: 'target', position: Position.Left, label: 'a' },
    { id: 'b', type: 'target', position: Position.Left, label: 'b' },
    { id: 'scale', type: 'target', position: Position.Left, label: 'scale' },
    { id: 'result', type: 'source', position: Position.Right },
  ],
};
