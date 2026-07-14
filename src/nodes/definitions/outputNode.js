// outputNode.js

import { Position } from 'reactflow';
import { LogOut } from 'lucide-react';

export const outputNode = {
  type: 'customOutput',
  label: 'Output',
  category: 'Input / Output',
  icon: LogOut,
  accent: '#f43f5e',
  fields: [
    {
      name: 'outputName',
      label: 'Name',
      type: 'text',
      default: (id) => id.replace('customOutput-', 'output_'),
    },
    {
      name: 'outputType',
      label: 'Type',
      type: 'select',
      options: ['Text', 'Image'],
      default: 'Text',
    },
  ],
  handles: [{ id: 'value', type: 'target', position: Position.Left }],
};
