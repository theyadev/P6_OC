// @ts-check

import { getGenres, getTitles } from "./api.js";
import { generateCarousel } from "./components.js";

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
  const popular = await getTitles({ sortBy: ["imdb", "votes"] });

  generateCarousel(popular, "best_rated_movies");
}

/**
 * @param {number} index
 * @param {Genre} genre
 */
export async function populateGenre(index, genre) {
  const genre_div = document.getElementById(`category_${index}`);
  const genre_nav = document.getElementById(`nav_category_${index}`);

  if (genre_div === null || genre_nav === null) return;

  genre_nav.textContent = genre.name;

  const title = genre_div.querySelector("h3");

  if (title === null) return;
  title.innerHTML = genre.name;

  const movies = await getTitles({ genre: genre.name, sortBy: ["imdb", "votes"] });

  generateCarousel(movies, `category_${index}`);
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
  const voted = await getTitles({ sortBy: ["votes"] });
  updateBestMovie(voted[0]);
}
