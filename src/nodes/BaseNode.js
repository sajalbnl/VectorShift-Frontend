// BaseNode.js
// The single component every node is built from. A node config describes
// *what* it is (title, icon, fields, handles); BaseNode renders it.
// --------------------------------------------------

import { memo, useEffect, useMemo } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';
import { NodeField } from './fields';

const SIDES = {
  [Position.Left]: 'top',
  [Position.Right]: 'top',
  [Position.Top]: 'left',
  [Position.Bottom]: 'left',
};

// Handles may be a static array, or a function of the node's data — the latter
// is what lets the Text node grow handles from {{ variables }} as you type.
const resolveHandles = (config, data) =>
  typeof config.handles === 'function' ? config.handles(data) ?? [] : config.handles ?? [];

// Spread N handles evenly down (or across) whichever side they sit on:
// one handle -> 50%, two -> 33%/66%, three -> 25%/50%/75%.
// This is why no node ever hand-writes `top: ${100/3}%` again.
const withOffsets = (handles) => {
  const perSide = handles.reduce((acc, handle) => {
    (acc[handle.position] ??= []).push(handle);
    return acc;
  }, {});

  return Object.entries(perSide).flatMap(([position, sideHandles]) =>
    sideHandles.map((handle, index) => ({
      ...handle,
      offset: {
        [SIDES[position]]: `${((index + 1) / (sideHandles.length + 1)) * 100}%`,
      },
    }))
  );
};

export const BaseNode = memo(({ id, data, selected, config }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const pruneStaleEdges = useStore((state) => state.pruneStaleEdges);
  const updateNodeInternals = useUpdateNodeInternals();

  const handles = resolveHandles(config, data);

  // A primitive that changes only when the handle *set* changes, so the effect
  // below stays quiet while the user is merely editing a field.
  const handleSignature = handles.map((h) => `${h.type}:${h.position}:${h.id}`).join('|');

  useEffect(() => {
    // React Flow caches each node's handle list. A handle added without this
    // notification renders but stays invisible to the connection system, so a
    // {{ variable }} handle would look right and refuse to connect.
    updateNodeInternals(id);

    // A removed {{ variable }} takes its handle with it; drop any edge left
    // dangling from it.
    pruneStaleEdges(id, handles.map((handle) => `${id}-${handle.id}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, handleSignature, updateNodeInternals, pruneStaleEdges]);

  const positionedHandles = useMemo(
    () => withOffsets(handles),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleSignature]
  );

  const Icon = config.icon;
  const Body = config.body;

  // Width may be a function of data — the Text node grows as you type.
  const width = typeof config.width === 'function' ? config.width(data) : config.width;

  return (
    <div
      className={`node node--${config.type} ${selected ? 'node--selected' : ''}`}
      style={{ '--node-accent': config.accent, width }}
    >
      <header className="node__header">
        {Icon && (
          <span className="node__icon">
            <Icon size={14} strokeWidth={2.25} />
          </span>
        )}
        <span className="node__title">{config.label}</span>
      </header>

      <div className="node__body">
        {/* Escape hatch: a node with genuinely custom UI supplies its own body. */}
        {Body ? (
          <Body id={id} data={data} config={config} updateNodeField={updateNodeField} />
        ) : (
          config.fields?.map((field) => (
            <NodeField
              key={field.name}
              nodeId={id}
              field={field}
              value={data?.[field.name]}
              onChange={(value) => updateNodeField(id, field.name, value)}
            />
          ))
        )}
      </div>

      {positionedHandles.map((handle) => (
        <Handle
          key={`${handle.type}-${handle.position}-${handle.id}`}
          type={handle.type}
          position={handle.position}
          id={`${id}-${handle.id}`}
          className="node__handle"
          style={handle.offset}
        >
          {handle.label && <span className="node__handle-label">{handle.label}</span>}
        </Handle>
      ))}
    </div>
  );
});
