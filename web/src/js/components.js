// @ts-check

import { getTitleById } from "./api.js";
import { populateModal, toggleModal } from "./modal.js";

const width  = (window.innerWidth > 0) ? window.innerWidth : screen.width;

const isMobile = width < 768;

const no_of_movies = isMobile ? 3 : 4;

/**
 * @typedef {import("./api").Movie} Movie
 */

/**
 * @param {{
 *  src: string;
 *  alt: string;
 *  classes: string[];
 * }} params
 */
export function generateImage({ src, alt, classes }) {
  const image = document.createElement("img");
  image.classList.add(...classes);
  image.src = src;
  image.alt = alt;
  image.onerror = function () {
    this.onerror = null;
    this.src = "public/placeholder.jpeg";
  };

  return image;
}

export function generateListItem({ text }) {
  const listItem = document.createElement("li");
  listItem.innerText = text;

  return listItem;
}

/**
 * @param {Movie} movie
 * @returns {HTMLDivElement}
 */
export function generateMovieCard(movie) {
  const { id, title, year, image_url, genres } = movie;

  // Create main container for movie card
  const card = document.createElement("div");
  card.classList.add("movie-card");

  // Create image
  const card_image = generateImage({
    src: image_url,
    alt: `${title}'s Cover`,
    classes: ["movie-card__image"],
  });

  // Create content container
  const card_content = document.createElement("div");
  card_content.classList.add("movie-card__content");

  // Create title
  const card_title = document.createElement("h1");
  card_title.classList.add("movie-card__title");
  card_title.textContent = title;


  card_image.onclick = async function (e) {
    const title = await getTitleById(id);

    populateModal(title);

    toggleModal();
  };

  card_content.appendChild(card_title);

  card.appendChild(card_image);
  card.appendChild(card_content);

  return card;
}

/**
 * @param {Movie[]} movies
 * @param {number} index
 * @param {HTMLDivElement} section
 */
function populateSection(movies, index, section) {
  const mov = movies.slice(0).splice(index, no_of_movies);

  if (mov.length !== no_of_movies && index >= mov.length - 1)
    mov.push(...movies.slice(0, no_of_movies - mov.length));

  section.replaceChildren(...mov.map(generateMovieCard));
}

/**
 * @param {Movie[]} movies
 * @param {string} id
 */
export function generateCarousel(movies, id) {
  const section = document.getElementById(id);

  if (section === null) return;

  const carousel = document.createElement("div");

  carousel.classList.add("controls");

  const left_btn = document.createElement("button");
  left_btn.classList.add("controls__btn", "left");
  left_btn.innerHTML = '<i class="fas fa-chevron-left"></i>';

  const movies_div = document.createElement("div");
  movies_div.classList.add("movies");

  const right_btn = document.createElement("button");
  right_btn.classList.add("controls__btn", "right");
  right_btn.innerHTML = '<i class="fas fa-chevron-right"></i>';

  if (movies.length > no_of_movies) carousel.appendChild(left_btn);

  carousel.appendChild(movies_div);

  if (movies.length > no_of_movies) carousel.appendChild(right_btn);

  section.appendChild(carousel);

  let current_index = 0;

  const max_index = movies.length - 1;

  left_btn.onclick = () => {
    if (current_index === 0) current_index = max_index;
    else current_index--;
    populateSection(movies, current_index, movies_div);
  };

  right_btn.onclick = () => {
    if (current_index === max_index) current_index = 0;
    else current_index++;
    populateSection(movies, current_index, movies_div);
  };

  populateSection(movies, current_index, movies_div);
}
