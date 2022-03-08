/* eslint-disable max-len */
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
    <div className="details-container no-scrollbar">
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
            <p><b>Details</b></p>
            <p>
              The Victoria Park Playground Asset Mapping was a participatory planning activity organized at Victoria Park
              over two weekends in May of 2021. The activity engaged parents and children who visited the park, many from local neighbourhoods.
              <br />
              <br />
              This engagement highlighted the use by local daycare centres including Britannia Childcare Centre
              as well as a group of new parents championed by Kritika Mishra. The report highlights concerns regarding traffic volumes on Victoria Drive,
              and concerns for visibility and safety on the west side of the playground. Community members also brought forth concerns for safe places
              for older youth to gather.
            </p>
            <p><b>Participating Relationships</b></p>
            <p><i>Britannia Community Centre</i></p>
            <p><u>View Full Report</u></p>
          </div>
        </>
      )}
    </div>
  );
}

export default DetailsPage;
