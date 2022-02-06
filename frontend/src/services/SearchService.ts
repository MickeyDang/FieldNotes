import { SearchParameters } from '../components/SelectedProjectPage';

function formatParameters(params: SearchParameters) {
  return {
    query: params.searchQuery?.join(',') ?? '',
    box: params.boundingBox ? `${params.boundingBox?.[0].join(',')}-${params.boundingBox?.[1].join(',')}` : '',
  };
}

async function getAllData(params: SearchParameters) {
  const res = await fetch(`http://localhost:8000/alldata?${new URLSearchParams(formatParameters(params))}`);
  const data = await res.json();
  return data;
}

export default getAllData;
