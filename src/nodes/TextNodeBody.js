// TextNodeBody.js
// The Text node's custom body: a textarea that grows with its content.
// Width is handled by the node config (see textNode.js); height is handled here.
// --------------------------------------------------

import { useLayoutEffect, useRef } from 'react';
import { TEXT_FONT } from '../lib/measureText';
import { parseVariables } from '../lib/parseVariables';

export const TextNodeBody = ({ id, data, updateNodeField }) => {
  const textareaRef = useRef(null);
  const text = data?.text ?? '';
  const variables = parseVariables(text);

  // Grow to fit: collapse to `auto` first, otherwise scrollHeight can only ever
  // report the current (too-tall) height and the box never shrinks back down.
  // useLayoutEffect so the resize is painted in the same frame as the keystroke.
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [text]);

  const inputId = `${id}-text`;

  return (
    <div className="node-field">
      <label className="node-field__label" htmlFor={inputId}>
        Text
      </label>

      <textarea
        id={inputId}
        ref={textareaRef}
        className="node-control node-control--template"
        style={{ font: TEXT_FONT }}
        value={text}
        rows={1}
        spellCheck={false}
        placeholder="Write a prompt, use {{ variable }} for inputs"
        onChange={(event) => updateNodeField(id, 'text', event.target.value)}
      />

      <p className="text-node__hint">
        {variables.length === 0
          ? 'Type {{ name }} to add an input'
          : `${variables.length} input${variables.length === 1 ? '' : 's'}: ${variables.join(', ')}`}
      </p>
    </div>
  );
};
