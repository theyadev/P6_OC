// @ts-check

import { getTitleById } from "./api.js";
import { populateModal, toggleModal } from "./modal.js";

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

  // Create year
  const card_year = document.createElement("p");
  card_year.classList.add("movie-card__year");
  card_year.textContent = year.toString();

  // Create genres
  const card_genres = document.createElement("ul");
  card_genres.classList.add("movie-card__genres");
  const genre_lis = genres.map((genre) => generateListItem({ text: genre }));
  card_genres.append(...genre_lis);

  // Create button
  const card_button = document.createElement("button");
  card_button.classList.add("movie-card__button");
  card_button.textContent = "More Info";
  card_button.onclick = async function (e) {
    const title = await getTitleById(id);

    populateModal(title);

    toggleModal();
  };

  card_content.appendChild(card_title);
  card_content.appendChild(card_year);
  card_content.appendChild(card_genres);
  card_content.appendChild(card_button);

  card.appendChild(card_image);
  card.appendChild(card_content);

  return card;
}
