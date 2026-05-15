import './style.css'

const API_KEY = 'cbc56582dd79a5ca1e7d693e2a193233';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';


const dramaGrid = document.querySelector('#dramaGrid');
const totalCount = document.querySelector('#totalCount');
const averageRating = document.querySelector('#averageRating');
const favoritesCount = document.querySelector('#favoritesCount');
const searchInput = document.querySelector('#searchInput');
const genreFilter = document.querySelector('#genreFilter');
const genreMap = {
  18: 'Drama',
  35: 'Comedy',
  10749: 'Romance',
  9648: 'Mystery',
  80: 'Crime',
  10759: 'Action',
  10765: 'Sci-Fi',
};


let allDramas = [];



function displayDramas(dramas) {
  dramaGrid.innerHTML = dramas
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
    const firstResponse = await fetch(
  `${BASE_URL}/search/tv?api_key=${API_KEY}&query=korean&page=1`
);

if (!firstResponse.ok) {
  throw new Error('Failed to fetch data');
}

const firstData = await firstResponse.json();

const totalPages = firstData.total_pages;

const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

const responses = await Promise.all(
  pages.map((page) => {
    return fetch(
      `${BASE_URL}/search/tv?api_key=${API_KEY}&query=korean&page=${page}`
    );
  })
);

const data = await Promise.all(
  responses.map((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  })
);

data.forEach((page) => {
  page.results.forEach((drama) => {
    if (
      Object.values({
        poster: drama.poster_path,
        year: drama.first_air_date,
        description: drama.overview
      }).every(Boolean)
    ) {
      allDramas.push(drama);
    }
  });
});
allDramas = allDramas.filter((drama, index, array) => {
  return index === array.findIndex((item) => item.id === drama.id);
});
   const genres = [...new Set(allDramas.map((drama) => drama.genre_ids).flat())];

  genres
  .filter((genre) => genreMap[genre])
  .forEach((genre) => {
  genreFilter.innerHTML += `
    <option value="${genre}">
      ${genreMap[genre] || 'Other'}
    </option>
  `;
});

    displayDramas(allDramas);
    updateStats(allDramas);
  } catch (error) {
    console.error(error);
  }
}

const sortSelect = document.querySelector('#sortSelect');

function updateDramaList() {
  const searchValue = searchInput.value.toLowerCase();
  const selectedGenre = genreFilter.value;
  const selectedSort = sortSelect.value;

  let filteredDramas = [...allDramas];

  filteredDramas = filteredDramas.filter((drama) => {
    return drama.name.toLowerCase().includes(searchValue);
  });

  if (selectedGenre !== 'all') {
    filteredDramas = filteredDramas.filter((drama) => {
      return drama.genre_ids.includes(Number(selectedGenre));
    });
  }

  if (selectedSort === 'rating') {
    filteredDramas.sort((a, b) => b.vote_average - a.vote_average);
  }

  if (selectedSort === 'year') {
    filteredDramas.sort((a, b) => {
      return parseInt(b.first_air_date) - parseInt(a.first_air_date);
    });
  }

  if (selectedSort === 'popular') {
    filteredDramas.sort((a, b) => b.popularity - a.popularity);
  }

  displayDramas(filteredDramas);
  updateStats(filteredDramas);
}

searchInput.addEventListener('input', updateDramaList);
genreFilter.addEventListener('change', updateDramaList);
sortSelect.addEventListener('change', updateDramaList);



fetchKDramas();



