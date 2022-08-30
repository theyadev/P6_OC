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

export async function populateBestMovies() {
  const best_rated_section = document.querySelector(
    "#best_rated_movies > .movies"
  );

  if (best_rated_section === null) return;

  const popular = await getTitles({ sortBy: "imdb" });

  for (const title of popular) {
    best_rated_section.appendChild(generateMovieCard(title));
  }
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
