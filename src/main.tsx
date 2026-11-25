import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
const el = document.getElementById('root');
if (!el) throw new Error('No se encontró #root');
createRoot(el).render(<React.StrictMode><App /></React.StrictMode>);