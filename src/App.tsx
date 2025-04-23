import { OverlaysProvider } from '@blueprintjs/core';
import React from 'react';
import './App.css';
import DataProvider from './DataProvider';

const App: React.FC = () => {
  return (
    <div className="App" id="root">
      <OverlaysProvider>
        <DataProvider />
      </OverlaysProvider>
    </div>
  );
};

export default App;
