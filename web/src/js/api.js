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
 * @typedef {"imdb" | "votes"} sortby
 * @param {{
 *  genre?: string;
 *  sortBy?: sortby[];
 * }} params
 * @returns {Promise<Movie[]>}
 */
export async function getTitles({ genre, sortBy }) {
  /**
   * @type {{
   *  genre: string[];
   *  sort_by: string[];
   * }}
   */
  const url_params = {
    genre: [],
    sort_by: [],
  };

  if (genre) url_params.genre.push(genre);

  if (sortBy?.includes("votes")) url_params.sort_by.push("-votes");

  if (sortBy?.includes("imdb")) url_params.sort_by.push("-imdb_score");

  const url_params_string = Object.keys(url_params)
    .map((key) => {
      return url_params[key].length > 0
        ? `${key}=${url_params[key].join(",")}`
        : null;
    })
    .filter(Boolean)
    .join("&");

  return getResults(`${API_URL}${TITLES_ENDPOINT}/?${url_params_string}`);
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
