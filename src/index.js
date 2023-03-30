import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import { updateGallery } from './update.js';
import { searchQuery, getURL } from './search';
const form = document.querySelector('#search-form');
const input = document.querySelector('input');
const galleryList = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
let gallery;

let currentPage = 1;

async function getImages(URL) {
  try {
    const response = await axios.get(URL);
    const images = response.data.hits.map(hit => ({
      webformatURL: hit.webformatURL,
      largeImageURL: hit.largeImageURL,
      tags: hit.tags,
      likes: hit.likes,
      views: hit.views,
      comments: hit.comments,
      downloads: hit.downloads,
    }));

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      gallery = new SimpleLightbox('.gallery a').refresh();
      galleryList.innerHTML = updateGallery(images);
      loadBtn.style.display = 'block';
      const totalHits = response.data.totalHits;
      const currentPage = Number(searchQuery.get('page'));
      const perPage = Number(searchQuery.get('per_page'));
      const displayedImages = (currentPage - 1) * perPage + images.length;
      if (displayedImages >= totalHits) {
        loadBtn.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      console.log(totalHits);
    }

    return images;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Error fetching images');
  }
}

function infoSubmit(event, input, searchQuery) {
  event.preventDefault();

  if (input.value !== searchQuery.get('q')) {
    searchQuery.set('q', input.value);
    searchQuery.set('page', 1);
    currentPage = 1;
    galleryList.innerHTML = '';
    loadBtn.style.display = 'none';
  }

  setsearchQuery(input, searchQuery);
  const URL = getURL(searchQuery);
  getImages(URL)
    .then(images => {
      galleryList.innerHTML = updateGallery(images);
      gallery = new SimpleLightbox('.gallery a').refresh();
      if (images.length === 0) {
        loadBtn.style.display = 'none';
      } else {
        loadBtn.style.display = 'block';
      }
    })
    .catch(error => console.log(error));
}
async function loadMoreImg() {
  currentPage++;
  searchQuery.set('page', currentPage);
  const URL = getURL(searchQuery);

  try {
    gallery = new SimpleLightbox('.gallery a').refresh();
    const response = await axios.get(URL);
    const images = response.data.hits.map(hit => ({
      webformatURL: hit.webformatURL,
      largeImageURL: hit.largeImageURL,
      tags: hit.tags,
      likes: hit.likes,
      views: hit.views,
      comments: hit.comments,
      downloads: hit.downloads,
    }));

    galleryList.insertAdjacentHTML('beforeend', updateGallery(images));
    gallery = new SimpleLightbox('.gallery a').refresh();
    if (images.length < searchQuery.get('per_page')) {
      loadBtn.style.display = 'none';
    }
  } catch (error) {
    console.log(error);
  }
}
function setsearchQuery(input, searchQuery) {
  searchQuery.set('q', input.value);
}
form.addEventListener('submit', event =>
  infoSubmit(event, input, searchQuery)
);
loadBtn.addEventListener('click', loadMoreImg);
const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});
