import axios from 'axios';

export default async function fetchImages(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '30848188-838038a8b40bb43baa3f98f48';
  const filter = `key=${key}&q=${value}&image_type=photo&min_width=800&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${url}?${filter}`).then(response => response.data);
}
