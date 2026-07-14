// submit.js

import { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { Play, LoaderCircle } from 'lucide-react';
import { useStore } from './store';
import { parsePipeline } from './services/parsePipeline';
import { PipelineResult } from './PipelineResult';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);

    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const onSubmit = async () => {
        setIsRunning(true);
        setResult(null);
        setError(null);

        try {
            setResult(await parsePipeline(nodes, edges));
        } catch (failure) {
            setError(failure.message);
        } finally {
            // finally, so a failed request can't leave the button spinning forever.
            setIsRunning(false);
        }
    };

    const dismiss = () => {
        setResult(null);
        setError(null);
    };

    return (
        <>
            <button
                type="submit"
                className="submit__button"
                onClick={onSubmit}
                disabled={isRunning}
            >
                {isRunning ? (
                    <LoaderCircle className="submit__spinner" size={13} strokeWidth={2.5} />
                ) : (
                    <Play size={13} strokeWidth={2.5} fill="currentColor" />
                )}
                {isRunning ? 'Parsing...' : 'Run pipeline'}
            </button>

            {(result || error) && (
                <PipelineResult result={result} error={error} onClose={dismiss} />
            )}
        </>
    );
}
