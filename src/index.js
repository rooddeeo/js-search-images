const { default: axios } = require('axios');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.input'),
  gallery: document.querySelector('.gallery'),
  btnSubmit: document.querySelector('.btnSubmit'),
  btnLoadMore: document.querySelector('.load-more'),
};

let page = 1;
let lastSearchQuery = '';
let totalHits;

refs.btnLoadMore.classList.add('hidden');

refs.form.addEventListener('submit', formSearch);
refs.btnLoadMore.addEventListener('click', loadMore);

async function serviseImageSearch(searchQuery, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API = '12002814-5debf547df742213b695907de';

  const params = new URLSearchParams({
    key: API,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 40,
  });

  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    totalHits = response.data.totalHits;
    if (response.data.hits.length === 0) {
      console.log(response.data.hits.length);
      refs.btnLoadMore.classList.add('hidden');
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else if (page < totalHits) {
      const markup = createMarkup(response.data.hits);
      refs.gallery.insertAdjacentHTML('beforeend', markup);
      const lightbox = new SimpleLightbox('.gallery a', { animationSpeed: 250 });
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

serviseImageSearch()
  .then(data => console.log(data))
  .catch(error => {
    console.log(error);
  });

async function formSearch(event) {
  event.preventDefault();
  console.log(event);
  const { searchQuery } = event.currentTarget.elements;
  console.log(searchQuery);
  lastSearchQuery = searchQuery.value;
  refs.gallery.innerHTML = '';

  try {
    const data = await serviseImageSearch(searchQuery.value);
    Notify.success(`Hooray! We found ${totalHits} images.`);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

function loadMore() {
  page += 1;
  console.log(page);
  serviseImageSearch(lastSearchQuery, page)
    .then(data => console.log(data))
    .catch(error => {
      console.log(error);
    });
}

function createMarkup(response) {
  return response
    .map(
      dat => `
      <div class="photo-card">
      <div class="photo-card-image">
      <a class = "photo-card-image-link" href="${dat.largeImageURL}">
      <img src="${dat.webformatURL}" alt="${dat.tags}" loading="lazy"/>
</a>
      </div>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${dat.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${dat.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${dat.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${dat.downloads}
        </p>
      </div>
    </div>
    `
    )
    .join('');
}
