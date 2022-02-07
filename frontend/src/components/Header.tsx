import React from 'react';
import {
  Container,
  Row,
  Navbar,
} from 'react-bootstrap';

function Header() {
  return (
    <Navbar>
      <Container>
        <Navbar.Brand>
          Project # X
        </Navbar.Brand>
        <Navbar.Text>
          <Row>
            PURPOSE
          </Row>
          <Row>
            XXXX
          </Row>
        </Navbar.Text>
        <Navbar.Text>
          <Row>
            CREATED
          </Row>
          <Row>
            XXXX
          </Row>
        </Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default Header;
