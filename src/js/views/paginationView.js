import View from "./view.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  _generateMarkup() {
    const curPage = this._data.page;
    let markup = "";
    // Find the num of pages
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      markup =
        this._generateMarkupButton("next") +
        this._generateIndex(curPage, numPages);
      return markup;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      markup =
        this._generateMarkupButton("prev") +
        this._generateIndex(curPage, numPages);
      return markup;
    }

    // Other (middle page)
    if (numPages > curPage) {
      markup =
        this._generateMarkupButton("prev") +
        this._generateMarkupButton("next") +
        this._generateIndex(curPage, numPages);
      return markup;
    }
    return markup + this._generateIndex(curPage, numPages);
  }

  _generateMarkupButton(nextPrev) {
    return `
      <button data-goto="${
        nextPrev === "prev" ? this._data.page - 1 : this._data.page + 1
      }" class="btn--inline pagination__btn--${nextPrev}">
        <span>Page ${
          nextPrev === "prev" ? this._data.page - 1 : this._data.page + 1
        }</span>
        <svg class="search__icon"><use href="${icons}#icon-arrow-${
      nextPrev === "prev" ? "left" : "right"
    }"></use></svg></button>
      `;
  }

  _generateIndex(curPage, numPages) {
    return `
      <div class="pagination__index">Page ${curPage} out of ${numPages}</div>
      `;
  }

  addHandlerClick(handler) {
    ["click"].forEach((ev) =>
      this._parentElement.addEventListener("click", function (e) {
        // Getting the button
        const btn = e.target.closest(".btn--inline");
        if (!btn) return; // Guard clause

        // Getting the go-to page from the button and passing ot to handler
        handler(+btn.dataset.goto);
      })
    );
  }
}

export default new PaginationView();
