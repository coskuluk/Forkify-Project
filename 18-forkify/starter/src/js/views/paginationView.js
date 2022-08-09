import icons from 'url:../../img/icons.svg';

import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    //burada event delegation yapacağız. çünkü eğer iki buton varsa ikisini de kapsamak istiyoruz. bunları da teker teker ele almak istemiyoruz. event delegation, her ikisini de seçmemizi ve click event'ini listen etmemizi sağlayacak. parent element'i hedefleyeceğiz.

    this._parentElement.addEventListener('click', function (e) {
      //ortak class'larını seçiyoruz önce. ortak parent'i. btn--inline olduğunu görüyoruz markup'ı inceleyince. bunu seçmek kapsayıcı çünkü svg, ya da use kısmına tıklasalar bile yine de tıklamalarını dinleyebileceğiz.

      const btn = e.target.closest('.btn--inline');

      if (!btn) return;
      console.log(btn);

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Birçok senaryomuz var. her birini ayrı ayrı çalışacağız.

    //REFACTORING IS MY CHALLENGE . I WILL DO IT LATER.

    //SAYFA 1 - BAŞKA SAYFALAR DA VAR
    if (curPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    //SON SAYFA
    if (curPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;
    }

    //ORTA SAYFALAR
    if (curPage < numPages) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    //SAYFA 1 - BAŞKA SAYFA YOK
    return '';
  }
}

export default new PaginationView();
