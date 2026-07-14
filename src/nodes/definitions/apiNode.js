// apiNode.js
// Demonstrates: a field-heavy node. Every control type in one card, and the
// layout still holds without a line of bespoke markup.

import { Position } from 'reactflow';
import { Globe } from 'lucide-react';

export const apiNode = {
  type: 'api',
  label: 'API Request',
  category: 'Utility',
  icon: Globe,
  accent: '#6366f1',
  width: 260,
  fields: [
    {
      name: 'method',
      label: 'Method',
      type: 'select',
      options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      default: 'GET',
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      placeholder: 'https://api.example.com/v1',
      default: '',
    },
    {
      name: 'headers',
      label: 'Headers',
      type: 'textarea',
      rows: 2,
      placeholder: '{ "Authorization": "Bearer ..." }',
      default: '',
    },
    { name: 'timeout', label: 'Timeout (s)', type: 'number', min: 1, max: 120, default: 30 },
    { name: 'retry', label: 'Retry on failure', type: 'checkbox', default: true },
  ],
  handles: [
    { id: 'body', type: 'target', position: Position.Left, label: 'body' },
    { id: 'response', type: 'source', position: Position.Right, label: 'response' },
    { id: 'error', type: 'source', position: Position.Right, label: 'error' },
  ],
};
