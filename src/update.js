
 function updateGallery(images) {
    const markup = images.map((image) => `
    <a href="${image.largeImageURL}"><img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${image.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${image.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${image.downloads}
        </p>
    </div></a>`).join("");
  
    return markup;
  };

  export {updateGallery}