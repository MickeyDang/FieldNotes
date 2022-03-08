/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import searchData from '../models/services/SearchService';
import findDateRange from '../models/services/DateRangeService';
import SearchPanel from './SearchPanel';
import MapPanel from './MapPanel';
import DetailsPage from './DetailsPage';
import './SelectedProjectPage.css';
import {
  BoundingBox,
  DateRangeProperties,
  Annotations,
  Project,
  TagCount,
  ReportProperties,
} from '../models/types';
import PanelNavigator from './PanelNavigator';
import NotebookPanel from './NotebookPanel';
import searchDataInProject from '../models/services/NotebookService';
import { fetchProject, updateProject } from '../models/services/ProjectService';

function SelectedProjectPage() {
  const [searchParams, setSearchParams] = useState({});
  const [selectedProject, setSelectedProject] = useState({
    projectId: '',
    repIds: [],
    relIds: [],
  } as Project);
  const [reports, setReports] = useState<any[]>([]);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({} as DateRangeProperties);
  const [annotations, setAnnotations] = useState({
    points: [],
    polygons: {
      type: 'FeatureCollection',
      features: [],
    },
    texts: [],
  } as Annotations);
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [tagsSummary, setTagsSummary] = useState<TagCount[]>([]);
  const [isDetailsMode, setIsDetailsMode] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportProperties | null>(null);

  const executeSearch = useCallback(async () => {
    const response = await searchData(searchParams);
    setReports(response.reports);
    setRelationships(response.relationships);
  }, [searchParams]);

  const executeNotebookSearch = useCallback(async () => {
    const response = await searchDataInProject('1234567890');
    setReports(response.reports);
    setRelationships(response.relationships);
  }, [isSearchMode]);

  useEffect(() => {
    if (isSearchMode) {
      executeSearch();
    } else {
      executeNotebookSearch();
    }
  }, [executeSearch, executeNotebookSearch]);

  useEffect(() => {
    const getProject = async () => {
      const response: Project = await fetchProject();
      setSelectedProject(response);
    };

    getProject().catch(console.error);
  }, []);

  // Get oldest and newest dates for time range filter
  useEffect(() => {
    const fetchData = async () => {
      const response: DateRangeProperties = await findDateRange();
      setDateRange(response);
    };

    fetchData().catch(console.error);
  }, []);

  const updateSearchQuery = (updatedSearchQuery: string[]) => {
    const updatedParams = { ...searchParams, searchQuery: updatedSearchQuery };
    if (!_.isEqual(updatedParams, searchParams)) {
      setSearchParams(updatedParams);
    }
  };

  const updateBoundingBoxQuery = (updatedBoundingBoxQuery: BoundingBox) => {
    const updatedParams = { ...searchParams, boundingBox: updatedBoundingBoxQuery };
    if (!_.isEqual(updatedParams, searchParams)) {
      setSearchParams(updatedParams);
    }
  };

  const updateTimeRange = (updatedTimeRangeQuery: number[]) => {
    const updatedParams = { ...searchParams, timeRange: updatedTimeRangeQuery };
    if (!_.isEqual(updatedParams, searchParams)) {
      setSearchParams(updatedParams);
    }
  };

  const updateSortQuery = (updatedSortQuery: string[]) => {
    const updatedParams = { ...searchParams, sortQuery: updatedSortQuery };
    if (!_.isEqual(updatedParams, searchParams)) {
      setSearchParams(updatedParams);
    }
  };

  const handleProjectUpdate = async (updatedProject: Project) => {
    const response = await updateProject(updatedProject);
    setSelectedProject(response);
  };

  const handleSearchToggle = () => setIsSearchMode(true);
  const handleNotebookToggle = () => setIsSearchMode(false);

  useEffect(() => {
    const allTags = reports.map((report) => report.properties.tags).flat();
    const tagsSummaryObj = allTags.reduce((total, value) => {
      // eslint-disable-next-line no-param-reassign
      total[value] = (total[value] || 0) + 1;
      return total;
    }, {});
    const uniqueTags = Object.keys(tagsSummaryObj);

    const tagsSummaryArr:TagCount[] = uniqueTags.map((tag) => [tag, tagsSummaryObj[tag]]);
    const tagsSummaryArrSorted: TagCount[] = tagsSummaryArr.sort((a, b) => b[1] - a[1]);
    setTagsSummary(tagsSummaryArrSorted);
  }, [reports, relationships]);
  const handleBackToSearch = () => {
    setIsDetailsMode(false);
    setSelectedReport(null);
  };
  const handleToDetails = (report: ReportProperties) => {
    setIsDetailsMode(true);
    setSelectedReport(report);
  };

  const handleReportClicked = (id: string) => {
    const reportFromId = reports.filter((rep: ReportProperties) => rep.properties.id === id);
    if (reportFromId.length === 1) {
      setIsDetailsMode(true);
      setSelectedReport(reportFromId[0]);
    }
  };

  return (
    <div className="project-view no-scrollbar">
      <div className="list-panel-container no-scrollbar">
        <PanelNavigator
          onSearchToggled={handleSearchToggle}
          onNotebookToggled={handleNotebookToggle}
        />
        {
          isSearchMode
            ? (
              <SearchPanel
                reportResults={reports}
                relationshipResults={relationships}
                onSearchChange={updateSearchQuery}
                onTimeRangeChange={updateTimeRange}
                dateRangeResults={dateRange}
                onSortChange={updateSortQuery}
                annotations={annotations}
                project={selectedProject}
                onProjectUpdate={handleProjectUpdate}
                toDetails={handleToDetails}
                searchParams={searchParams}
              />
            ) : (
              <NotebookPanel
                reportResults={reports}
                relationshipResults={relationships}
                project={selectedProject}
                onProjectUpdate={handleProjectUpdate}
              />
            )
        }
        {isDetailsMode && (
          <DetailsPage
            backToSearch={handleBackToSearch}
            selectedReport={selectedReport}
          />
        )}
      </div>
      <div className="map-panel-container no-scrollbar">
        <MapPanel
          isSearchMode={isSearchMode}
          reportResults={reports}
          relationshipResults={relationships}
          onBoundingBoxChange={updateBoundingBoxQuery}
          annotations={annotations}
          setAnnotations={setAnnotations}
          tagsSummary={tagsSummary}
          selectedProject={selectedProject}
          reportClicked={handleReportClicked}
          selectedReport={selectedReport}
        />
      </div>
    </div>
  );
}

export default SelectedProjectPage;
