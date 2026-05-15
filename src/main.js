import './style.css'

const API_KEY = 'cbc56582dd79a5ca1e7d693e2a193233';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';


const dramaGrid = document.querySelector('#dramaGrid');
const totalCount = document.querySelector('#totalCount');
const averageRating = document.querySelector('#averageRating');
const favoritesCount = document.querySelector('#favoritesCount');
const searchInput = document.querySelector('#searchInput');

let allDramas = [];



function displayDramas(dramas) {
  dramaGrid.innerHTML = dramas
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
          <p>Popularity: ${Math.round(drama.popularity)}</p>
          <p>
            ${
              drama.overview
                ? drama.overview.substring(0, 120) + '...'
                : 'Description unavailable.'
            }
          </p>
          <button class="favorite-btn">♡ Add to favorites</button>
        </article>
      `;
    })
    .join('');
}


function updateStats(dramas) {
  totalCount.textContent = dramas.length;

  const totalRating = dramas.reduce((sum, drama) => {
    return sum + drama.vote_average;
  }, 0);

  const average = totalRating / dramas.length;

  averageRating.textContent = average.toFixed(1);
}


async function fetchKDramas() {
  try {
    const response = await fetch(
      `${BASE_URL}/search/tv?api_key=${API_KEY}&query=korean&page=1`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();

    allDramas = data.results;

    displayDramas(allDramas);
    updateStats(allDramas);
  } catch (error) {
    console.error(error);
  }
}

searchInput.addEventListener('input', () => {
  const searchValue = searchInput.value.toLowerCase();

  const filteredDramas = allDramas.filter((drama) => {
    return drama.name.toLowerCase().includes(searchValue);
  });

  displayDramas(filteredDramas);
  updateStats(filteredDramas);
});

fetchKDramas();


