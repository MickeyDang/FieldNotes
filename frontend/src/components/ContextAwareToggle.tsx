import React, { useState } from 'react';
import { useAccordionButton } from 'react-bootstrap';
import './ContextAwareToggle.css';

function ContextAwareToggle({ textBody, numItems, eventKey }: any) {
  const [visibleText, setVisibleText] = useState('Visible');

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => {
      setVisibleText(visibleText === 'Visible' ? 'Hidden' : 'Visible');
    },
  );

  return (
    <>
      <hr style={{
        borderWidth: '2px',
        borderColor: '#545148',
        borderStyle: 'solid',
        width: '100%',
      }}
      />
      <button
        style={{
          backgroundColor: '#2A2925',
          borderWidth: '0px',
        }}
        className="section-container"
        type="button"
        onClick={decoratedOnClick}
      >
        <p className="title-badge-container" style={{ color: 'white' }}>
          <span className="accordion-title">{textBody}</span>
          {' '}
          <span
            style={{ backgroundColor: '#ffffff10', color: '#d7cfbe' }}
            className="accordion-badge"
          >
            {numItems}
          </span>
        </p>
        <p style={{ color: 'white' }} className="accordion-label">{visibleText}</p>
      </button>
    </>
  );
}

export default ContextAwareToggle;
