import './style.css'

const API_KEY = 'cbc56582dd79a5ca1e7d693e2a193233';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';


const dramaGrid = document.querySelector('#dramaGrid');
const totalCount = document.querySelector('#totalCount');
const averageRating = document.querySelector('#averageRating');
const favoritesCount = document.querySelector('#favoritesCount');

async function fetchKDramas() {
  try {
    const response = await fetch(
      `${BASE_URL}/search/tv?api_key=${API_KEY}&query=korean&page=1`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

dramaGrid.innerHTML = data.results
  .slice(0, 20)
  .map((drama) => {
    const poster = drama.poster_path
  ? `${IMAGE_URL}${drama.poster_path}`
  : '';
return `
  <article class="drama-card">
    <img src="${poster}" alt="${drama.name} poster">
    <h2>${drama.name}</h2>
    <p>Year: ${drama.first_air_date ? drama.first_air_date.split('-')[0] : 'Unknown'}</p>
    <p>Rating: ${drama.vote_average.toFixed(1)}</p>
  </article>
`;
  })
  .join('');

  } catch (error) {
    console.error(error);
  }
}

fetchKDramas();