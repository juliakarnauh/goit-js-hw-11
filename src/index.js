import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import { updateGallery } from './update.js';
import { SearchParams, getURL } from './search';
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
      const currentPage = Number(SearchParams.get('page'));
      const perPage = Number(SearchParams.get('per_page'));
      const displayedImages = (currentPage - 1) * perPage + images.length;
      if (displayedImages > totalHits) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      console.log(totalHits);
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
    }

    return images;
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure('Error fetching images');
  }
}

function infoSubmit(event, input, SearchParams) {
  event.preventDefault();

  if (input.value !== SearchParams.get('q')) {
    SearchParams.set('q', input.value);
    SearchParams.set('page', 1);
    currentPage = 1;
    galleryList.innerHTML = '';
    loadBtn.style.display = 'none';
  }

  setSearchParams(input, SearchParams);
  const URL = getURL(SearchParams);
  getImages(URL)
    .then(images => {
      galleryList.innerHTML = updateGallery(images);
      gallery = new SimpleLightbox('.gallery a').refresh();
      if (images.length === 0) {
        loadBtn.style.display = 'none';
      }
      else if(images.length < SearchParams.get('per_page')){
        loadBtn.style.display = 'none';
      } else {
        loadBtn.style.display = 'block';
      }
    })
    .catch(error => console.log(error));
}
async function loadMoreImg() {
  currentPage++;
  SearchParams.set('page', currentPage);
  const URL = getURL(SearchParams);

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
    if (images.length < SearchParams.get('per_page')) {
      loadBtn.style.display = 'none';
    }
  } catch (error) {
    console.log(error);
  }
}
function setSearchParams(input, SearchParams) {
  SearchParams.set('q', input.value);
}
form.addEventListener('submit', event =>
  infoSubmit(event, input, SearchParams)
);
loadBtn.addEventListener('click', loadMoreImg);
