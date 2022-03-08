import React from 'react';
import {
  Row,
} from 'react-bootstrap';
import './App.css';
import Header from './components/Header';
import SelectedProjectPage from './components/SelectedProjectPage';

function App() {
  return (
    <div className="App no-scrollbar">
      <Row className="app-header-bar">
        <Header />
      </Row>
      <Row className="app-page">
        <SelectedProjectPage />
      </Row>
    </div>
  );
}

export default App;
