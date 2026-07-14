import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <span className="app__brand">Pipeline Builder</span>
        <SubmitButton />
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
