// textNode.js

import { Position } from 'reactflow';
import { Type } from 'lucide-react';
import { TextNodeBody } from '../TextNodeBody';
import { parseVariables } from '../../lib/parseVariables';
import { textNodeWidth } from '../../lib/measureText';

export const textNode = {
  type: 'text',
  label: 'Text',
  category: 'Utility',
  icon: Type,
  accent: '#0ea5e9',

  // Custom body: the textarea grows with its content (BaseNode's `body` hatch).
  body: TextNodeBody,

  // Width follows the text; height is handled by the textarea inside the body.
  width: (data) => textNodeWidth(data?.text),

  // Handles as a function of data: every {{ variable }} in the text becomes a
  // target handle, and BaseNode spaces them down the left edge automatically.
  // Variable handles are prefixed so a variable literally named "output" can't
  // collide with the source handle below it.
  handles: (data) => [
    ...parseVariables(data?.text).map((name) => ({
      id: `var-${name}`,
      type: 'target',
      position: Position.Left,
      label: name,
    })),
    { id: 'output', type: 'source', position: Position.Right },
  ],

  fields: [{ name: 'text', type: 'textarea', default: '{{ input }}' }],
};
