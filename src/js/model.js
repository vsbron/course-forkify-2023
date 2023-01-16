import { API_URL, API_KEY, RES_PER_PAGE } from "./config.js";
import { AJAX } from "./helpers.js";

// Declaring the global STATE variable
export const state = {
  recipe: {},
  search: {
    query: "",
    page: 1,
    results: [],
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  // Copying received data to a state.recipe object
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // Checks whethr there's the key. If there is, spreads it and stores it
    ...(recipe.key && { key: recipe.key }),
  };
};

// Writing the loadRecipe function
export const loadRecipe = async function (id) {
  try {
    // Getting data from helper function that does the fetch
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    // Storing received data into recipe variable
    state.recipe = createRecipeObject(data);

    // Checking whether the recipe is bookmarked
    if (state.bookmarks.some((bookmark) => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

// Getting the search results
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        // Checks whethr there's the key. If there is, spreads it and stores it
        ...(rec.key && { key: rec.key }),
      };
    });

    // Moving the search results back to a page 1
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    // newQuantity = oldQuantity * (newServings / oldServings) // Example => 2 * (4 / 8) = 4
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

// Adding the bookmarks object to a localStorage
const persistBookmarks = () =>
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));

// Adding the bookmark function
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Update the bookmarsk at the localStorage
  persistBookmarks();
};

// Deleting the bookmark function
export const deleteBookmark = function (id) {
  // Find the bookmarked recipe inside state object and delete it from the array
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // Update the bookmarsk at the localStorage
  persistBookmarks();
};

// Initialization function for getting the bookmarks from localStorage
const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// FOR TESTING PURPOSES: Clearing bookmarks function
const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};

// Uploading recipe function
export const uploadRecipe = async function (newRecipe) {
  try {
    // Getting the entries from Form and converting them to objects
    const ingredients = Object.entries(newRecipe)

      // Getting throught them and adjusting for the right format
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! Please use the correct format."
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // Creating the object for API
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
