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

    console.log(data.results);
  } catch (error) {
    console.error(error);
  }
}