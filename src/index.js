const { default: axios } = require('axios');

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('[searchQuery]'),
  gallery: document.querySelector('.gallery'),
  button: document.querySelector('button'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let page = 1;
console.log(page);

refs.loadMoreBtn.classList.add('hidden');

refs.form.addEventListener('submit', formSearch);
refs.loadMoreBtn.addEventListener('click', loadMore);

async function formSearch(event) {
  event.preventDefault();
  const { searchQuery } = event.currentTarget.elements;
  console.log(searchQuery.value);
  await serviseImageSearch(searchQuery.value, page);
}

function loadMore() {
  page += 1;
  console.log(page);
}

async function serviseImageSearch(searchQuery, page) {
  const BASE_URL = 'https://pixabay.com/api/',
    API = '12002814-5debf547df742213b695907de';

  const params = new URLSearchParams({
    key: API,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 5,
  });

  await axios
    .get(`${BASE_URL}?${params}`)
    .then(response => {
      console.log(response);
      if (response.data.hits.length === 0) {
        console.log(
          "We're sorry, but you've reached the end of search results."
        );
      }
      if (page < response.data.totalHits) {
        refs.loadMoreBtn.classList.remove('hidden');
      } else {
        refs.loadMoreBtn.classList.add('hidden');
      }
      createMarkup(response);
    })
    .catch(error => console.log(error));
}

function createMarkup(response) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
  page = 1;

  const addCartToGallery = response.data.hits
    .map(
      dat => `<div class="photo-card">
      <img src="${dat.webformatURL}" alt="${dat.tags}" loading="lazy" />
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
    </div>`
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', addCartToGallery);
}
