// @ts-check

const API_URL = "http://127.0.0.1:8000/api/v1";

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
 * @typedef {Object} MovieDetails -
 * @property {number} avg_vote -
 * @property {number | null} budget -
 * @property {string} budget_currency -
 * @prop {string} company -
 * @prop {string[]} countries -
 * @prop {string} date_published -
 * @prop {string} description -
 * @prop {number} duration -
 * @prop {string} languages -
 * @prop {string} long_description -
 * @prop {number} metascore -
 * @prop {string} original_title -
 * @prop {string} rated -
 * @prop {number | null} reviews_from_critics -
 * @prop {number} reviews_from_users -
 * @prop {number | null} usa_gross_income -
 * @prop {number | null} worldwide_gross_income -
 */

/**
 * @typedef {Movie & MovieDetails} FullMovie
 */

/**
 * @typedef {Object} Genre -
 * @property {number} id -
 * @property {string} name -
 */

/**
 * @param {string} genre
 * @returns {string}
 */
const PARAM_GENRE = (genre) => `genre=${genre}`;
const PARAM_IMDB = "sort_by=-imdb_score";
const PARAM_VOTES = "sort_by=-votes";

const TITLES_ENDPOINT = "/titles";
const GENRES_ENDPOINT = "/genres";

/**
 * @param {string} url
 * @returns {Promise<any>}
 */
async function getResults(url) {
  const response = await get(url);

  return response.results;
}

/**
 * @param {string} url
 * @returns {Promise<any>}
 */
async function get(url) {
  const response = await fetch(url);
  const data = await response.json();

  return data;
}

/**
 * @param {{ 
 *  genre?: string;
 *  sortBy?: "imdb" | "votes";
 * }} params
 * @returns {Promise<Movie[]>}
 */
export async function getTitles({ genre, sortBy }) {
  const url_params = [];

  if (genre) {
    url_params.push(PARAM_GENRE(genre));
  }

  if (sortBy === "imdb") {
    url_params.push(PARAM_IMDB);
  } else if (sortBy === "votes") {
    url_params.push(PARAM_VOTES);
  }

  return getResults(
    `${API_URL}${TITLES_ENDPOINT}${
      url_params.length > 0 ? "?" : ""
    }${url_params.join("&")}`
  );
}

/**
 * @param {number} id
 * @returns {Promise<FullMovie>}
 */
export async function getTitleById(id) {
  return get(`${API_URL}${TITLES_ENDPOINT}/${id}`);
}

/**
 * @returns {Promise<Genre[]>}
 */
export async function getGenres() {
  return getResults(`${API_URL}${GENRES_ENDPOINT}`);
}
