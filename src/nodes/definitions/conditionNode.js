// conditionNode.js
// Demonstrates: branching. Two *source* handles, so a pipeline can fork.

import { Position } from 'reactflow';
import { GitBranch } from 'lucide-react';

export const conditionNode = {
  type: 'condition',
  label: 'Condition',
  category: 'Logic',
  icon: GitBranch,
  accent: '#ec4899',
  fields: [
    {
      name: 'comparator',
      label: 'If input',
      type: 'select',
      options: [
        { value: 'isTruthy', label: 'is truthy' },
        { value: 'isEmpty', label: 'is empty' },
        { value: 'gt', label: 'is greater than' },
        { value: 'lt', label: 'is less than' },
        { value: 'eq', label: 'equals' },
      ],
      default: 'isTruthy',
    },
    { name: 'compareTo', label: 'Compare to', type: 'text', placeholder: 'optional', default: '' },
  ],
  handles: [
    { id: 'input', type: 'target', position: Position.Left },
    { id: 'true', type: 'source', position: Position.Right, label: 'true' },
    { id: 'false', type: 'source', position: Position.Right, label: 'false' },
  ],
};
