// @ts-check
import { getMostPopularTitles, getGenres, getTitlesByGenre , getMostVotedTitles} from "./api.js";

function generateMovieCard(movie) {
  const { id, title, year, image_url, genres } = movie;
  const genresList = genres.map((genre) => `<li>${genre}</li>`).join("");

  return `
    <div class="movie-card">
      <img class="movie-card__image" src="${image_url}" alt="${title}">
      <div class="movie-card__content">
        <h2 class="movie-card__title">${title}</h2>
        <h3 class="movie-card__year">${year}</h3>
        <ul class="movie-card__genres">${genresList}</ul>
        <button class="movie-card__button" data-id="${id}">More info</button>
      </div>
    </div>
  `;
}

function updateBestMovie(movie) {
  const { title, image_url} = movie;

  /**
   * @type {HTMLImageElement | null}
   */
  // @ts-ignore
  const bm_image = document.getElementById("best_movie_image");
  const bm_title = document.getElementById("best_movie_title")

  if (bm_image === null || bm_title === null) return;

  bm_image.src = image_url;
  bm_title.textContent = title;
}

window.onload = async () => {
  const populardiv = document.getElementById("best_rated_movies");

  if (populardiv === null) return;

  const popular = await getMostPopularTitles();

  for (const title of popular) {
    console.log(title)
    populardiv.innerHTML += generateMovieCard(title);
  }

  const genres = await getGenres();
  const randoms = genres.sort(() => 0.5 - Math.random()).slice(0, 3);

  for (let i = 1; i <= randoms.length; i++) {
    const category_div = document.getElementById(`category_${i}`);
    const category = randoms[i - 1];
    if (category_div === null) continue;

    const title = category_div.querySelector("h3");

    if (title === null) continue;
    title.innerHTML = category.name;

    const movies = await getTitlesByGenre(category.name);
    const movies_div = category_div.querySelector(".movies");

    if (movies_div === null) continue;

    for (const movie of movies) {
      movies_div.innerHTML += generateMovieCard(movie);
    }
  }

  const voteddiv = document.getElementById("best_movie");
  if (voteddiv === null) return;
  const voted = await getMostVotedTitles();
  updateBestMovie(voted[0]);
};
