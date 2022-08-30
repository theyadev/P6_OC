// @ts-check

import { generateListItem } from "./components.js";

/**
 * @typedef {import("./api").FullMovie} FullMovie
 */

/**
 * @param {FullMovie} movie
 */
export function populateModal({
  title,
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
}) {
  /**
   * @type {HTMLImageElement | null}
   */
  // @ts-ignore
  const image_el = document.querySelector(".modal__content__image");
  const title_el = document.querySelector(".modal__content__title");
  const description_el = document.querySelector(".modal__content__description");
  const genres_el = document.querySelector(".modal__content__details__genres");
  const directors_el = document.querySelector(
    ".modal__content__details_directors"
  );
  const actors_el = document.querySelector(".modal__content__details__actors");
  const date_el = document.querySelector(".modal__content__details__date");
  const rated_el = document.querySelector(".modal__content__details__rated");
  const score_el = document.querySelector(".modal__content__details__score");
  const duration_el = document.querySelector(
    ".modal__content__details__duration"
  );
  const countries_el = document.querySelector(
    ".modal__content__details__countries"
  );
  const income_el = document.querySelector(".modal__content__details__income");

  if (
    !image_el ||
    !title_el ||
    !description_el ||
    !genres_el ||
    !directors_el ||
    !actors_el ||
    !date_el ||
    !rated_el ||
    !score_el ||
    !duration_el ||
    !countries_el ||
    !income_el
  )
    return;

  const genre_lis = genres.map((genre) => generateListItem({ text: genre }));
  const director_lis = directors.map((director) =>
    generateListItem({ text: director })
  );
  const actor_lis = actors.map((actor) => generateListItem({ text: actor }));
  const country_lis = countries.map((country) =>
    generateListItem({ text: country })
  );

  image_el.src = image_url;
  image_el.alt = `${title}'s Cover`;

  genres_el.replaceChildren(...genre_lis);
  directors_el.replaceChildren(...director_lis);
  actors_el.replaceChildren(...actor_lis);
  countries_el.replaceChildren(...country_lis);

  title_el.textContent = title;
  description_el.textContent = description;
  date_el.textContent = date_published;
  rated_el.textContent = rated;
  score_el.textContent = imdb_score;
  duration_el.textContent = duration.toString();
  income_el.textContent = worldwide_gross_income?.toString() ?? "N/A";
}

export function toggleModal() {
  const modal = document.getElementById("modal");
  if (modal === null) return;
  modal.classList.toggle("modal--visible");
}

export function handleCloseModal() {
  const modal_btn = document.getElementById("close_modal");
  const modal = document.getElementById("modal");

  if (modal_btn) modal_btn.onclick = toggleModal;

  // If the modal is visible, close it when the user clicks anywhere outside of it.
  document.onclick = (e) => {
    if (e.target === modal) toggleModal();
  };
}
