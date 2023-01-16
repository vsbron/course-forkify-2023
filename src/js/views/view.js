import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  /**
   *
   * @param {Object | Object[]} data The data to be rendered (eg. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of remdering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author VSBroN
   * @todo upload to GitHub and Netlify
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  update(data) {
    // Generating new markup as usual
    this._data = data;
    const newMarkup = this._generateMarkup();

    // Creating an array of all the newly created elements
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));

    // Getting the current elements on the page
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    // Comparing two arrays
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updates changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue !== null &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updates changed attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  // Clear the parent element
  _clear() {
    this._parentElement.innerHTML = "";
  }

  // Rendering the spinner icon
  renderSpinner() {
    const markup = `<div class="spinner"><svg><use href="${icons}#icon-loader"></use></svg></div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // Rendering the error message
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div><svg><use href="${icons}#icon-alert-triangle"></use></svg></div>
        <p>${message}</p>
      </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  // Rendering the success message
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div><svg><use href="${icons}#icon-smile"></use></svg></div>
        <p>${message}</p>
      </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
