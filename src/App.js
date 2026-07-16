import { Workflow } from 'lucide-react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { HistoryControls } from './history';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo">
            <Workflow size={15} strokeWidth={2.5} />
          </span>
          Pipeline Builder
        </div>
        <div className="app__actions">
          <HistoryControls />
          <SubmitButton />
        </div>
      </header>

      <div className="app__main">
        <aside className="app__sidebar">
          <PipelineToolbar />
        </aside>
        <main className="app__canvas">
          <PipelineUI />
        </main>
      </div>
    </div>
  );
}

export default App;
