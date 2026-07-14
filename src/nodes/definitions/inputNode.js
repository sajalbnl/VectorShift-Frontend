// inputNode.js

import { Position } from 'reactflow';
import { LogIn } from 'lucide-react';

export const inputNode = {
  type: 'customInput',
  label: 'Input',
  category: 'Input / Output',
  icon: LogIn,
  accent: '#10b981',
  fields: [
    {
      name: 'inputName',
      label: 'Name',
      type: 'text',
      default: (id) => id.replace('customInput-', 'input_'),
    },
    {
      name: 'inputType',
      label: 'Type',
      type: 'select',
      options: ['Text', 'File'],
      default: 'Text',
    },
  ],
  handles: [{ id: 'value', type: 'source', position: Position.Right }],
};
