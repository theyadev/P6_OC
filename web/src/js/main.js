// @ts-check

import { handleCloseModal } from "./modal.js";
import {
  populateBestMovies,
  populateMostPopular,
  populateWithRandomGenres,
} from "./populate.js";

window.onload = async () => {
  await populateBestMovies();
  await populateWithRandomGenres();
  await populateMostPopular();

  handleCloseModal();
};
