// parsePipeline.js
// The one place that knows how to talk to the backend.
// --------------------------------------------------

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:8000';

export const parsePipeline = async (nodes, edges) => {
  let response;

  try {
    response = await fetch(`${API_URL}/pipelines/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // The backend only reads id/source/target and ignores the rest, so we can
      // hand it React Flow's node and edge objects as they are.
      body: JSON.stringify({ nodes, edges }),
    });
  } catch (cause) {
    // fetch only rejects when the request never completed — server down, DNS,
    // or a CORS block. An HTTP 500 is a *resolved* promise, so it isn't here.
    throw new Error(`Could not reach the backend at ${API_URL}. Is it running?`, { cause });
  }

  if (!response.ok) {
    throw new Error(`The backend responded with ${response.status} ${response.statusText}.`);
  }

  return response.json();
};
