import View from "./view.js";

class SearchView extends View {
  _parentElement = document.querySelector(".search");

  getQuery() {
    const query = this._parentElement.querySelector(".search__field").value;
    this._clear();
    return query;
  }

  // Clear the parent element
  _clear() {
    this._parentElement.querySelector(".search__field").value = "";
  }

  // Event handler
  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
