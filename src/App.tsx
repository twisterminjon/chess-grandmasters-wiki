import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { GrandmastersList } from './components/GrandmastersList';
import './App.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<GrandmastersList />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;