// store.js

// createWithEqualityFn (not `create`) is what supports the useStore(selector, shallow)
// overload in zustand v4 without a deprecation warning.
import { createWithEqualityFn } from "zustand/traditional";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = createWithEqualityFn((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    // Delete a {{ variable }} that had an edge attached and its handle vanishes,
    // leaving the edge anchored to nothing. Called by BaseNode whenever a node's
    // handle set changes, so it protects every node, not just the Text node.
    pruneStaleEdges: (nodeId, handleIds) => {
      const isStale = (edge) =>
        (edge.target === nodeId && edge.targetHandle && !handleIds.includes(edge.targetHandle)) ||
        (edge.source === nodeId && edge.sourceHandle && !handleIds.includes(edge.sourceHandle));

      const edges = get().edges;
      const kept = edges.filter((edge) => !isStale(edge));

      // Don't touch state when nothing is stale: an unconditional set() here
      // would loop forever against the effect that calls this.
      if (kept.length !== edges.length) {
        set({ edges: kept });
      }
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        // Replace the node rather than mutating it: React Flow memoizes nodes by
        // object identity, so an in-place edit renders stale (typing looks frozen).
        nodes: get().nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
            : node
        ),
      });
    },
  }));
