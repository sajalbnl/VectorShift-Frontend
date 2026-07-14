// PipelineResult.js
// The "alert" the backend response triggers, as a modal instead of window.alert.
// --------------------------------------------------

import { useEffect } from 'react';
import { CircleCheck, TriangleAlert, X, Workflow, Spline } from 'lucide-react';

const Stat = ({ icon: Icon, value, label }) => (
  <div className="result__stat">
    <Icon className="result__stat-icon" size={16} strokeWidth={2} />
    <span className="result__stat-value">{value}</span>
    <span className="result__stat-label">{label}</span>
  </div>
);

export const PipelineResult = ({ result, error, onClose }) => {
  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const failed = Boolean(error);
  const isDag = result?.is_dag;

  return (
    <div className="result__backdrop" onClick={onClose}>
      <div
        className="result"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="result-title"
        // Without this a click inside the card bubbles to the backdrop and closes it.
        onClick={(event) => event.stopPropagation()}
      >
        <button className="result__close" onClick={onClose} aria-label="Close">
          <X size={15} strokeWidth={2.25} />
        </button>

        {failed ? (
          <>
            <span className="result__badge result__badge--error">
              <TriangleAlert size={19} strokeWidth={2} />
            </span>
            <h2 className="result__title" id="result-title">
              Could not parse the pipeline
            </h2>
            <p className="result__subtitle">{error}</p>
          </>
        ) : (
          <>
            <span className={`result__badge result__badge--${isDag ? 'ok' : 'warn'}`}>
              {isDag ? (
                <CircleCheck size={19} strokeWidth={2} />
              ) : (
                <TriangleAlert size={19} strokeWidth={2} />
              )}
            </span>

            <h2 className="result__title" id="result-title">
              {isDag ? 'Pipeline is valid' : 'Pipeline has a cycle'}
            </h2>

            <p className="result__subtitle">
              {isDag
                ? 'These nodes form a directed acyclic graph, so the pipeline can run end to end.'
                : 'These nodes contain a loop, so the pipeline would never finish. Remove the cycle to run it.'}
            </p>

            <div className="result__stats">
              <Stat
                icon={Workflow}
                value={result.num_nodes}
                label={result.num_nodes === 1 ? 'node' : 'nodes'}
              />
              <Stat
                icon={Spline}
                value={result.num_edges}
                label={result.num_edges === 1 ? 'edge' : 'edges'}
              />
              <Stat
                icon={isDag ? CircleCheck : TriangleAlert}
                value={isDag ? 'Yes' : 'No'}
                label="is a DAG"
              />
            </div>
          </>
        )}

        <button className="result__dismiss" onClick={onClose} autoFocus>
          Done
        </button>
      </div>
    </div>
  );
};
