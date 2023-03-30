
 const searchQuery = new URLSearchParams({
	key: "34827086-10493c8e3456fbc81c5176912",
	q: "",
	image_type: "photo",
	orientation: "horizontal",
	safesearch: true,
	per_page: 40,
	page: 1,
});

function getURL(searchQuery) {
    return `https://pixabay.com/api/?${searchQuery.toString()}`;
  }
  

  export {searchQuery, getURL}