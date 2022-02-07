import React from 'react';
import {
  Container,
  Row,
} from 'react-bootstrap';
import './App.css';
import Header from './components/Header';
import SelectedProjectPage from './components/SelectedProjectPage';

function App() {
  return (
    <Container fluid className="App">
      <Row>
        <Header />
      </Row>

      <Row>
        <SelectedProjectPage />
      </Row>

    </Container>
  );
}

export default App;
