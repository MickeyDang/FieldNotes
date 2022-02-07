import React from 'react';
import {
  Container,
  Row,
  Col,
  Accordion,
} from 'react-bootstrap';
import './ListPanel.css';

interface ListPanelProps {
  onSearchChange: Function,
}

function ListPanel({ onSearchChange }: ListPanelProps) {
  // TODO: make the search query change based on form input.
  const updateSearch = () => onSearchChange(['Community Centres']);

  return (
    <Container fluid className="list-container">
      <Row>
        <Col>
          Searchbar
          <button type="button" onClick={updateSearch}>Search for Community Centres</button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Accordion defaultActiveKey={['reports', 'relationships']} flush alwaysOpen>

            <Accordion.Item eventKey="reports">
              <Accordion.Header> Reports </Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                est laborum.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="relationships">
              <Accordion.Header> Relationships </Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                est laborum.
              </Accordion.Body>
            </Accordion.Item>

          </Accordion>
        </Col>
      </Row>
    </Container>
  );
}

export default ListPanel;
