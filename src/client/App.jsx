import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { GameRoom } from './pages/GameRoom.jsx';
import { Home } from './pages/Home.jsx';

export const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/:room/:playerName" element={<GameRoom />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
