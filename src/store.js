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

// How many undo steps to retain. Snapshots are cheap (they share the immutable
// node/edge arrays we already build), so this is just a memory guardrail.
const HISTORY_LIMIT = 100;

export const useStore = createWithEqualityFn((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    // Undo/redo stacks. Each entry is a { nodes, edges } snapshot. Because every
    // mutating action replaces these arrays immutably, storing the references is
    // enough — nothing mutates them out from under us.
    past: [],
    future: [],
    // Set while a node is mid-drag so we snapshot once per drag (at drag start),
    // not on every pointer-move `position` change. Not part of any snapshot.
    _dragging: false,
    // Capture the current canvas onto the undo stack and drop any redo history
    // (a fresh action invalidates the redo branch). Call this *before* applying
    // a mutation so the snapshot holds the pre-change state.
    takeSnapshot: () => {
        set({
            past: [...get().past, { nodes: get().nodes, edges: get().edges }].slice(-HISTORY_LIMIT),
            future: [],
        });
    },
    undo: () => {
        const { past, future, nodes, edges } = get();
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        set({
            past: past.slice(0, -1),
            future: [...future, { nodes, edges }],
            nodes: previous.nodes,
            edges: previous.edges,
        });
    },
    redo: () => {
        const { past, future, nodes, edges } = get();
        if (future.length === 0) return;
        const next = future[future.length - 1];
        set({
            past: [...past, { nodes, edges }],
            future: future.slice(0, -1),
            nodes: next.nodes,
            edges: next.edges,
        });
    },
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
        get().takeSnapshot();
        set({
            nodes: [...get().nodes, node]
        });
    },
    onNodesChange: (changes) => {
      // Record history for the changes that are real, committed edits — node
      // removal, and the start of a drag (so undo returns to the pre-drag spot).
      // The stream of `dragging: true` position changes and selection changes is
      // ignored so undo doesn't fill up with noise.
      const removing = changes.some((c) => c.type === 'remove');
      const dragStart = !get()._dragging &&
        changes.some((c) => c.type === 'position' && c.dragging);
      const dragEnd = changes.some((c) => c.type === 'position' && c.dragging === false);

      if (removing || dragStart) get().takeSnapshot();
      if (dragStart) set({ _dragging: true });
      if (dragEnd) set({ _dragging: false });

      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      if (changes.some((c) => c.type === 'remove')) get().takeSnapshot();
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      get().takeSnapshot();
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
