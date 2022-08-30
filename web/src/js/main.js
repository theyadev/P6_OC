// @ts-check
import { getTitles, getGenres, getTitleById } from "./api.js";

/**
 * @typedef {import("./api").Movie} Movie
 */

/**
 * @typedef {import("./api").FullMovie} FullMovie
 */

/**
 * @typedef {import("./api").Genre} Genre
 */

/**
 * @param {Movie} movie
 * @returns {string}
 */
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

/**
 * @param {Movie} movie
 */
function updateBestMovie(movie) {
  const { title, image_url } = movie;

  /**
   * @type {HTMLImageElement | null}
   */
  // @ts-ignore
  const bm_image = document.getElementById("best_movie_image");
  const bm_title = document.getElementById("best_movie_title");

  if (bm_image === null || bm_title === null) return;

  bm_image.src = image_url;
  bm_title.textContent = title;
}

async function populateBestMovies() {
  const best_rated_section = document.querySelector(
    "#best_rated_movies > .movies"
  );

  if (best_rated_section === null) return;

  const popular = await getTitles({ sortBy: "imdb" });

  for (const title of popular) {
    best_rated_section.innerHTML += generateMovieCard(title);
  }
}

/**
 * @param {number} index
 * @param {Genre} genre
 */
async function populateGenre(index, genre) {
  const genre_div = document.getElementById(`category_${index}`);
  if (genre_div === null) return;

  const title = genre_div.querySelector("h3");

  if (title === null) return;
  title.innerHTML = genre.name;

  const movies = await getTitles({ genre: genre.name });
  const movies_div = genre_div.querySelector(".movies");

  if (movies_div === null) return;

  for (const movie of movies) {
    movies_div.innerHTML += generateMovieCard(movie);
  }
}

async function populateWithRandomGenres() {
  const genres = await getGenres();
  const randoms = genres.sort(() => 0.5 - Math.random()).slice(0, 3);

  for (let i = 1; i <= randoms.length; i++) {
    await populateGenre(i, randoms[i - 1]);
  }
}

async function populateMostPopular() {
  const voteddiv = document.getElementById("best_movie");
  if (voteddiv === null) return;
  const voted = await getTitles({ sortBy: "votes" });
  updateBestMovie(voted[0]);
}

/**
 *
 * @param {FullMovie} movie
 */
function populateModal(movie) {
  const modal = document.getElementById("modal_content");

  if (modal === null) return;

  const {
    title,
    year,
    image_url,
    genres,
    description,
    directors,
    actors,
    date_published,
    rated,
    imdb_score,
    duration,
    countries,
    worldwide_gross_income,
  } = movie;

  const genresList = genres.map((genre) => `<li>${genre}</li>`).join("");
  const directorsList = directors
    .map((director) => `<li>${director}</li>`)
    .join("");
  const actorsList = actors.map((actor) => `<li>${actor}</li>`).join("");
  const countriesList = countries
    .map((country) => `<li>${country}</li>`)
    .join("");

  modal.innerHTML = `
    <img class="modal__content__image" src="${image_url}" alt="" />
    <h1 class="modal__content__title">${title}</h1>
    <p class="modal__content__description">${description}</p>
    <div class="modal__content__details">
        <ul>${genresList}</ul>
        <ul>${directorsList}</ul>
        <ul>${actorsList}</ul>
    </div>
    <div class="modal__content__details">
        <p>${date_published}</p>
        <p>${rated}</p>
        <p>${imdb_score}</p>
        <p>${duration}</p>
        <ul>${countriesList}</ul>
        <p>${worldwide_gross_income}</p>
    </div>
  `;
}


function toggleModal() {
  const modal = document.getElementById("modal");
  if (modal === null) return;
  modal.classList.toggle("modal--visible");
}

window.onload = async () => {
  const modal = document.getElementById("modal");

  if (modal === null) return;

  await populateBestMovies();
  await populateWithRandomGenres();
  await populateMostPopular();

  const modal_btn = document.getElementById("close_modal");

  if (modal_btn === null) return;

  modal_btn.onclick = toggleModal

  /**
   * @type {HTMLButtonElement[]}
   */
  // @ts-ignore
  const buttons = document.querySelectorAll(".movie-card__button");

  for (const button of buttons) {
    button.onclick = async function () {
      const id = button.getAttribute("data-id");

      if (id === null) return;

      const title = await getTitleById(parseInt(id));

      populateModal(title);

      toggleModal()
    };
  }
};
