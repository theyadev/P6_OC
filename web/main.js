// @ts-check

const API_URL = "http://localhost:8000/api/v1";

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

async function getMostPopularTitles() {
  return get(`${API_URL}${TITLES_BY_IMDB_ENDPOINT}`);
}

async function getMostVotedTitles() {
  return get(`${API_URL}${TITLES_BY_VOTES_ENDPOINT}`);
}

async function getTitlesByGenre(genre) {
  return get(`${API_URL}${TITLES_BY_GENRE_ENDPOINT(genre)}`);
}

async function getTitleById(id) {
  return get(`${API_URL}${TITLE_BY_ID_ENDPOINT(id)}`);
}

async function getGenres() {
    return get(`${API_URL}${GENRES_ENDPOINT}`);
}
window.onload = async () => {
    const populardiv = document.getElementById("movies");

    if (populardiv === null) return

    const popular = await getMostPopularTitles();
    const genres = await getGenres()

    for (const title of popular) {

        console.log(title)
        populardiv.innerHTML += `<div class="movie">
            <h2>${title.title}</h2>
            <p>${title.description}</p>
            <p>${title.genres.join(", ")}</p>
            <p>${title.year}</p>
            <p>${title.director}</p>
            <p>${title.imdb_score}</p>
            <p>${title.votes}</p>
        </div>`;
    }
}
