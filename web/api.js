// @ts-check

const API_URL = "http://127.0.0.1:7000/api/v1";

/**
 * @typedef {Object} Movie -
 * @property {string[]} actors -
 * @property {string[]} directors -
 * @property {string[]} genres -
 * @prop {number} id -
 * @prop {string} image_url -
 * @prop {string} imdb_score -
 * @prop {string} imdb_url -
 * @prop {string} title -
 * @prop {string} url -
 * @prop {number} votes -
 * @prop {string[]} writers -
 * @prop {number} year -
 */

/**
 * @typedef {Object} Genre -
 * @property {number} id -
 * @property {string} name -
 */

/**
 * @type {(genre: string) => string}
 * @param {string} genre
 * @returns {string}
 */
const TITLES_BY_GENRE_ENDPOINT = (genre) => `/titles?genre=${genre}`;

/**
 * @type {(genre: number) => string}
 * @param {number} id
 * @returns {string}
 */
const TITLE_BY_ID_ENDPOINT = (id) => `/titles/${id.toString()}`;

const TITLES_BY_IMDB_ENDPOINT = "/titles?sort_by=-imdb_score";
const TITLES_BY_VOTES_ENDPOINT = "/titles?sort_by=-votes";

const GENRES_ENDPOINT = "/genres";

/**
 * @type {(url: string) => Promise<any>}
 * @param {string} url
 * @returns {Promise<any>}
 */
async function get(url) {
  const response = await fetch(url);
  const data = await response.json();

  return data.results;
}

/**
 * @returns {Promise<Movie[]>}
 */
export async function getMostPopularTitles() {
  return get(`${API_URL}${TITLES_BY_IMDB_ENDPOINT}`);
}

/**
 * @returns {Promise<Movie[]>}
 */
export async function getMostVotedTitles() {
  return get(`${API_URL}${TITLES_BY_VOTES_ENDPOINT}`);
}

/**
 * @returns {Promise<Movie[]>}
 */
export async function getTitlesByGenre(genre) {
  return get(`${API_URL}${TITLES_BY_GENRE_ENDPOINT(genre)}`);
}

/**
 * @returns {Promise<Movie[]>}
 */
export async function getTitleById(id) {
  return get(`${API_URL}${TITLE_BY_ID_ENDPOINT(id)}`);
}

/**
 * @returns {Promise<Genre[]>}
 */
export async function getGenres() {
  return get(`${API_URL}${GENRES_ENDPOINT}`);
}
