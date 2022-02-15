import React from 'react';
import './Header.css';

function Header() {
  return (
    <div className="header">
      <div className="project-text">
        Project #22
      </div>
      <div>
        <div className="header-text">
          PURPOSE
        </div>
        <div className="description-text">
          Research planning for equitable park space development in East Vancouver.
        </div>
      </div>
      <div>
        <div className="header-text">
          CREATED
        </div>
        <div className="description-text">
          October 8, 2021
        </div>
      </div>
    </div>

  );
}

export default Header;
