// noteNode.js
// Demonstrates: the degenerate case. No handles, one field, no connections.
// The abstraction has to survive a node that opts out of almost everything.

import { StickyNote } from 'lucide-react';

export const noteNode = {
  type: 'note',
  label: 'Note',
  category: 'Utility',
  icon: StickyNote,
  accent: '#a3a3a3',
  fields: [
    {
      name: 'note',
      label: null,
      type: 'textarea',
      rows: 4,
      placeholder: 'Leave a note for your team...',
      default: '',
    },
  ],
  handles: [],
};
