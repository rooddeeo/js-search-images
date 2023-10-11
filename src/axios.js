const { default: axios } = require('axios');
import SimpleLightbox from 'simplelightbox';
import { refs } from './index.js';
import { createMarkup } from './index.js';

async function serviseImageSearch(searchQuery, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API = '12002814-5debf547df742213b695907de';

  const per_page = 40;

  const params = new URLSearchParams({
    key: API,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page,
  });

  if (!searchQuery || searchQuery.trim() === '') {
    return;
  }

  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    totalHits = response.data.totalHits;
    totalPage = Math.ceil(totalHits / per_page);
    if (response.data.hits.length === 0) {
      console.log(response.data.hits.length);
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else if (page < totalPage) {
      const markup = createMarkup(response.data.hits);
      refs.gallery.insertAdjacentHTML('beforeend', markup);
      const lightbox = new SimpleLightbox('.gallery a', {
        animationSpeed: 250,
      });
      lightbox.refresh();
      refs.btnLoadMore.classList.remove('hidden');
    } else {
      refs.btnLoadMore.classList.add('hidden');
    }

    return response.data.hits;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { serviseImageSearch };