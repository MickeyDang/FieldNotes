import React from 'react';
import { ReportProperties } from '../models/types';
import './DetailsPage.css';

interface DetailsPageProps {
  backToSearch: Function;
  selectedReport: ReportProperties | null;
}

function DetailsPage({ backToSearch, selectedReport }: DetailsPageProps) {
  const handleBackToSearch = () => backToSearch();

  const formatTags = (tags: string[]) => tags.join(', ');

  return (
    <div className="details-container">
      <button
        type="button"
        onClick={handleBackToSearch}
        className="back-button"
      >
        &#8592;
        Back to Search Results
      </button>
      {selectedReport !== null && (
        <>
          <div className="details-header">
            <img src="/report-blue.png" alt="" height="24" className="details-header-icon" />
            <div className="details-header-text">
              <p className="details-title">{selectedReport?.properties.name}</p>
              <div>
                <span className="details-tag-color">{formatTags(selectedReport.properties.tags)}</span>
                {' '}
                <span className="details-dot">&#8226;</span>
                {' '}
                <span className="details-date-color">{new Date(selectedReport.properties.creationDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="details-body">
            <p>Details</p>
            <p>Participating Relationships</p>
          </div>
        </>
      )}
    </div>
  );
}

export default DetailsPage;
