// @ts-check

import { getGenres, getTitles } from "./api.js";
import { generateMovieCard } from "./components.js";

/**
 * @typedef {import("./api").Genre} Genre
 */

/**
 * @typedef {import("./api").Movie} Movie
 */

/**
 * @param {Movie} movie
 */
export function updateBestMovie(movie) {
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

/**
 * @param {Movie[]} movies
 * @param {number} index
 */
function populateBestMoviesSection(movies, index) {
  const mov = movies.slice(0).splice(index, 4);

  if (mov.length !== 4 && index >= mov.length - 1)
    mov.push(...movies.slice(0, 4 - mov.length));

  const best_rated_section = document.querySelector(
    "#best_rated_movies .movies"
  );

  best_rated_section?.replaceChildren(...mov.map(generateMovieCard));
}

export async function populateBestMovies() {
  const best_rated_section = document.querySelector(
    "#best_rated_movies .movies"
  );

  if (best_rated_section === null) return;

  const popular = await getTitles({ sortBy: "imdb" });

  /**
   * @type {HTMLButtonElement}
   */
  // @ts-ignore
  const left_btn = document.querySelector("#best_rated_movies .left");
  /**
   * @type {HTMLButtonElement}
   */
  // @ts-ignore
  const right_btn = document.querySelector("#best_rated_movies .right");

  let current_index = 0;

  const max_index = popular.length - 1;

  left_btn.onclick = () => {
    if (current_index === 0) current_index = max_index;
    else current_index--;
    populateBestMoviesSection(popular, current_index);
  };

  right_btn.onclick = () => {
    if (current_index === max_index) current_index = 0;
    else current_index++;
    populateBestMoviesSection(popular, current_index);
  };

  populateBestMoviesSection(popular, current_index);
}

/**
 * @param {number} index
 * @param {Genre} genre
 */
export async function populateGenre(index, genre) {
  const genre_div = document.getElementById(`category_${index}`);
  if (genre_div === null) return;

  const title = genre_div.querySelector("h3");

  if (title === null) return;
  title.innerHTML = genre.name;

  const movies = await getTitles({ genre: genre.name });
  const movies_div = genre_div.querySelector(".movies");

  if (movies_div === null) return;

  for (const movie of movies) {
    movies_div.appendChild(generateMovieCard(movie));
  }
}

export async function populateWithRandomGenres() {
  const genres = await getGenres();
  const randoms = genres.sort(() => 0.5 - Math.random()).slice(0, 3);

  for (let i = 1; i <= randoms.length; i++) {
    await populateGenre(i, randoms[i - 1]);
  }
}

export async function populateMostPopular() {
  const voteddiv = document.getElementById("best_movie");
  if (voteddiv === null) return;
  const voted = await getTitles({ sortBy: "votes" });
  updateBestMovie(voted[0]);
}
