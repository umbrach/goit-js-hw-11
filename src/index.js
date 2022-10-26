import Notiflix from 'notiflix';

import fetchImages from './js/fetchImages';
import renderImages from './js/markupImages';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreButtonEl = document.querySelector('.load-more');

let searchQuery = '';
let currentPage = 1;
let currentHits = 0;

async function onSearchSubmit(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.searchQuery.value.trim();
  console.log(searchQuery);
  currentPage = 1;

  if (searchQuery === '') {
    Notiflix.Notify.info('Sorry, you need to write something in the form');
    return;
  }

  const response = await fetchImages(searchQuery, currentPage);
  currentHits = response.hits.length;
  console.log(response);
  if (response.totalHits > 40) {
    loadMoreButtonEl.classList.remove('is-hidden');
  } else {
    loadMoreButtonEl.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
      galleryEl.innerHTML = '';
      renderImages(response.hits, galleryEl);
      lightbox.refresh();
    }

    if (response.totalHits === 0) {
      galleryEl.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreButtonEl.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMoreClick() {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  console.log(response);
  renderImages(response.hits, galleryEl);
  lightbox.refresh();
  currentHits += response.hits.length;
  console.log(currentHits);
  if (currentHits >= response.totalHits) {
    Notiflix.Notify.warning(
      `We're sorry, but you've reached the end of search results.`
    );
    loadMoreButtonEl.classList.add('is-hidden');
  }
}

searchFormEl.addEventListener('submit', onSearchSubmit);
loadMoreButtonEl.addEventListener('click', onLoadMoreClick);

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
