// filterNode.js
// Demonstrates: multiple inputs feeding a single output.

import { Position } from 'reactflow';
import { Filter } from 'lucide-react';

export const filterNode = {
  type: 'filter',
  label: 'Filter',
  category: 'Logic',
  icon: Filter,
  accent: '#f59e0b',
  fields: [
    {
      name: 'operator',
      label: 'Keep rows where',
      type: 'select',
      options: [
        { value: 'contains', label: 'contains' },
        { value: 'equals', label: 'equals' },
        { value: 'startsWith', label: 'starts with' },
        { value: 'matches', label: 'matches regex' },
      ],
      default: 'contains',
    },
    { name: 'value', label: 'Value', type: 'text', placeholder: 'e.g. error', default: '' },
    { name: 'caseSensitive', label: 'Case sensitive', type: 'checkbox', default: false },
  ],
  handles: [
    { id: 'collection', type: 'target', position: Position.Left, label: 'items' },
    { id: 'criteria', type: 'target', position: Position.Left, label: 'criteria' },
    { id: 'result', type: 'source', position: Position.Right },
  ],
};
