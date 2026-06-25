import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home.jsx';

export const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
