import View from "./view.js";
import PreviewView from "./previewView.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _grandParentElement = document.querySelector(".search-results");
  _errorMessage = "No recipes found for your query! Please try again!";
  _message = "Hooray!";

  _generateMarkup() {
    return this._data
      .map((result) => PreviewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
