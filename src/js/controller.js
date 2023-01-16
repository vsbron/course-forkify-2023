//////////////////////////////////////////////////////////////////////////////
//// IMPORTS ////
/////////////////
import { MODAL_CLOSE_SEC } from "./config.js";
import * as model from "./model.js";
import addRecipeView from "./views/addRecipeView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import recipeView from "./views/recipeView.js";
import resultsView from "./views/resultsView.js";
import searchView from "./views/searchView.js";

import "core-js/stable";
import "regenerator-runtime";

//////////////////////////////////////////////////////////////////////////////
//// THE CODE ////
//////////////////

// Controller for loading and rendering the recipe
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return; // Guard clause
    recipeView.renderSpinner(); // Rendering spinner while loading the recipe

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// Controller for loading and rendering search results and pagination
const controlSearchResults = async function () {
  try {
    // 1) Putting spinner on results div
    resultsView.renderSpinner();

    // 2) Get search query (If empty, show error)
    const query = searchView.getQuery();
    if (!query) {
      resultsView.renderError(
        "Your search query is empty. Please type something..."
      );
      return;
    }

    // 3) Load search results
    await model.loadSearchResults(query);

    // 4) Render results
    resultsView.render(model.getSearchResultsPage());

    // 5) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// Controller for loading and rendering search results and pagination when clicking pagination
const controlPaginaion = function (goToPage) {
  // Getting the new results for desirable page
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Rerender the pagination buttons
  paginationView.render(model.state.search);
};

// Controller for adjusting the ingredients based on a servings number
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Checks if the recipe is bookmarked
  !model.state.recipe.bookmarked
    ? model.addBookmark(model.state.recipe) // If not -> adds bookmark
    : model.deleteBookmark(model.state.recipe.id); // If it is -> Removes bookmark

  // Updating the markup
  recipeView.update(model.state.recipe);

  // Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Render the bookmarks window
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the recipe
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close form
    setTimeout(function () {
      addRecipeView.hideWindow();
    }, MODAL_CLOSE_SEC * 1000);
    // Reset the addRecipe window
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

// Init function with handler functions
const init = function () {
  // BookmarksView handler function controlBookmarks
  bookmarksView.addHandlerRender(controlBookmarks);

  // RecipeView handler function controlRecipes
  recipeView.addHandlerRender(controlRecipes);

  // RecipeView handler function controlServings
  recipeView.addHandlerUpdateServings(controlServings);

  // SearchView handler function controlSearchResults
  searchView.addHandlerSearch(controlSearchResults);

  // PaginationView handler function controlPaginaion
  paginationView.addHandlerClick(controlPaginaion);

  // PaginationView handler function controlPaginaion
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  // AddRecipeView handler function controlAddRecipe
  addRecipeView._addHandlerUpload(controlAddRecipe);
};

// Start the web app
init();
