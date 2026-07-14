// nodeRegistry.js
// Every node type in the app. Adding a node means adding a definition file and
// listing it here — ui.js, toolbar.js, and the store all read from this.
// --------------------------------------------------

import { BaseNode } from './BaseNode';
import { resolveFieldDefault } from './fields';

import { inputNode } from './definitions/inputNode';
import { outputNode } from './definitions/outputNode';
import { llmNode } from './definitions/llmNode';
import { textNode } from './definitions/textNode';
import { filterNode } from './definitions/filterNode';
import { mathNode } from './definitions/mathNode';
import { apiNode } from './definitions/apiNode';
import { conditionNode } from './definitions/conditionNode';
import { noteNode } from './definitions/noteNode';

const DEFINITIONS = [
  inputNode,
  outputNode,
  llmNode,
  textNode,
  filterNode,
  mathNode,
  apiNode,
  conditionNode,
  noteNode,
];

export const NODE_CONFIGS = Object.fromEntries(
  DEFINITIONS.map((config) => [config.type, config])
);

// React Flow's `nodeTypes` map. Every node is the same component, closed over a
// different config — which is the whole point of the abstraction.
// Built once at module scope: rebuilding it per render remounts every node.
export const nodeTypes = Object.fromEntries(
  DEFINITIONS.map((config) => [config.type, (props) => <BaseNode {...props} config={config} />])
);

// Toolbar sections, in definition order, with no hardcoded category list.
export const nodeCategories = DEFINITIONS.reduce((groups, config) => {
  const group = groups.find((entry) => entry.category === config.category);
  if (group) {
    group.nodes.push(config);
  } else {
    groups.push({ category: config.category, nodes: [config] });
  }
  return groups;
}, []);

// A node is born with every field's default already in `data`, so the store is
// the single source of truth from the first render — no node invents its own.
export const getInitNodeData = (nodeId, type) => {
  const config = NODE_CONFIGS[type];
  const data = { id: nodeId, nodeType: type };

  config?.fields?.forEach((field) => {
    data[field.name] = resolveFieldDefault(field, nodeId);
  });

  return data;
};
