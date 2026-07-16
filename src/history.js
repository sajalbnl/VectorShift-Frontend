// history.js
// Undo / redo controls for the pipeline canvas: two header buttons plus the
// familiar keyboard shortcuts. All the actual state lives in the store; this is
// just the surface that drives undo()/redo().

import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { Undo2, Redo2 } from 'lucide-react';
import { useStore } from './store';

const selector = (state) => ({
    undo: state.undo,
    redo: state.redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
});

// Don't hijack Cmd/Ctrl+Z while the user is editing a node's text field — the
// browser's native text undo should win there.
const isEditingText = (target) =>
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable);

export const HistoryControls = () => {
    const { undo, redo, canUndo, canRedo } = useStore(selector, shallow);

    useEffect(() => {
        const onKeyDown = (event) => {
            const mod = event.metaKey || event.ctrlKey;
            if (!mod || isEditingText(event.target)) return;

            const key = event.key.toLowerCase();
            // Redo: Cmd/Ctrl+Shift+Z or Ctrl+Y. Undo: Cmd/Ctrl+Z.
            if ((key === 'z' && event.shiftKey) || key === 'y') {
                event.preventDefault();
                redo();
            } else if (key === 'z') {
                event.preventDefault();
                undo();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [undo, redo]);

    return (
        <div className="history" role="group" aria-label="History">
            <button
                type="button"
                className="history__button"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                aria-label="Undo"
            >
                <Undo2 size={15} strokeWidth={2.5} />
            </button>
            <button
                type="button"
                className="history__button"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Shift+Z)"
                aria-label="Redo"
            >
                <Redo2 size={15} strokeWidth={2.5} />
            </button>
        </div>
    );
};
