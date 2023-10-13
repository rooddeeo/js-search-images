import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { serviseImageSearch } from './axios.js';

export const refs = {
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

serviseImageSearch()
  .then(data => console.log(data))
  .catch(error => {
    console.log(error);
  });

async function formSearch(event) {
  event.preventDefault();
  const { searchQuery } = event.currentTarget.elements;
  const queryValue = searchQuery.value.trim();

  if (!queryValue) {
    Notify.failure(
      "Please enter correct search data."
    );
    return;
  }

  console.log(searchQuery);
  lastSearchQuery = searchQuery.value;
  refs.gallery.innerHTML = '';

  try {
    const data = await serviseImageSearch(searchQuery.value);
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

export function createMarkup(response) {
  return response
    .map(
      dat => `
      <div class="photo-card">
      <div class="photo-card-image">
      <a class = "photo-card-image-link" href="${dat.largeImageURL}">
      <img src="${dat.webformatURL}" alt="${dat.tags}" title="${dat.tags}" loading="lazy"/>
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
