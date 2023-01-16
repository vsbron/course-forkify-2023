import View from "./view.js";

import icons from "url:../../img/icons.svg";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _message = "Recipe was successfully uploaded";

  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  // Method for hiding the window
  hideWindow() {
    this._window.classList.add("hidden");
    this._overlay.classList.add("hidden");
  }

  // Method for toggling classes
  toggleWindow() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
    setTimeout(
      function () {
        this.reset();
      }.bind(this),
      1000
    );
  }

  // Adding handler to load event and bindin toggleWindow function
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerUpload(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();

      // Converts form data to a array
      const dataArr = [...new FormData(this)];

      // Converts form data from array to an object
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  _generateMarkup() {}

  reset() {
    this._clear();
    const markup = `
    <div class="upload__column">
      <h3 class="upload__heading">Recipe data</h3>
      <label>Title</label>
      <input required name="title" type="text" placeholder="Title of your recipe" />
      <label>URL</label>
      <input required name="sourceUrl" type="text" placeholder="The URL of the recipe"/>
      <label>Image URL</label>
      <input required name="image" type="text" placeholder="URL for recipe cover image" />
      <label>Publisher</label>
      <input required name="publisher" type="text" placeholder="Publisher name"/>
      <label>Prep time</label>
      <input required name="cookingTime" type="number" placeholder="Time to cook" />
      <label>Servings</label>
      <input required name="servings" type="number" placeholder="Number of servings"/>
    </div>

    <div class="upload__column">
      <h3 class="upload__heading">Ingredients</h3>
      <label>Ingredient 1</label>
      <input
        type="text"
        required
        name="ingredient-1"
        placeholder="Format: 'Quantity, Unit, Description'"
      />
      <label>Ingredient 2</label>
      <input
        type="text"
        name="ingredient-2"
        placeholder="Format: 'Quantity, Unit, Description'"
      />
      <label>Ingredient 3</label>
      <input
        type="text"
        name="ingredient-3"
        placeholder="Format: 'Quantity, Unit, Description'"
      />
      <label>Ingredient 4</label>
      <input
        type="text"
        name="ingredient-4"
        placeholder="Format: 'Quantity, Unit, Description'"
      />
      <label>Ingredient 5</label>
      <input
        type="text"
        name="ingredient-5"
        placeholder="Format: 'Quantity, Unit, Description'"
      />
      <label>Ingredient 6</label>
      <input
        type="text"
        name="ingredient-6"
        placeholder="Format: 'Quantity, Unit, Description'"
      />
    </div>

    <button class="btn upload__btn">
      <svg>
        <use href="${icons}#icon-upload-cloud"></use>
      </svg>
      <span>Upload</span>
    </button>
    `;
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}

export default new AddRecipeView();
