import { createRoot } from 'react-dom/client';
import { HotkeysProvider } from '@blueprintjs/core';
import App from './App';
import 'normalize.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <HotkeysProvider>
    <App />
  </HotkeysProvider>,
);
