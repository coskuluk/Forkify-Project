//burada yapacağımız şey, view dosyasında olan tüm alt dosyalarda ortak olarak kullanılan metod ve fonksiyonları bir araya toplamak. böylelikle onları sadece burada tutacağız ve hepsi buradan alıyor olacak. amacımız bu.

//controller'da Dom updating konuşurken bahsettiğimiz update işlemini view'de tanımlayacağız. çünkü bunun tüm işlemlerde geçerli olabilecek bir fonksiyon olmasını istiyoruz.

import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  //aşağıda bir doc oluşturmanın örneği var. beraber çalıştığın diğer geliştiricilere her bir fonksiyonunun ne yaptığını açıklamak için yapıyorsun bunu. ne alıyor, ne veriyor nasıl yapıyor bu fonksiyon vs. 

  /**
   *  Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe) 
   * @param {boolean} [=true] Of false, create markup string instead of rendering to the DOM 
   * @returns {undefined | string} A markup is returned if render=false
   * @this {Object} View instance
   * @author Cosku Yavas
   * @todo Finish implementation 
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    //parent elementimiz neydi? en üstte tanımladık recipe'ti. işte böyle recipe'i tanımlamış olduk.
  }

  //AŞAĞIDA DOM UPDATE STRATEJİMİZ YER ALIYOR.

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //updates changed text

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(`U+1F600`, newEl.firstElementChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      // UPDATES CHANGED ATTRIBUTES

      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
    //   //stratejimiz şu = öncelikle burada bir markup yaratacağız. ama render etmeyeceğiz. yaratılan markup'ı mevcut HTML ile karşılaştıracağız. birbiri ile farklı olan kısmı seçip sadece o kısmı render edeceğiz. bu sayede browser yükü azalmış olacak.
  }

  _clear() {
    this._parentElement.innerHTML = '';
    //istediğimiz zaman recipe'i silebilmek için bunu ayrı bir metod olarak tanımladık. bu sayede her seferinde kod yazmamız gerekmeyecek. dıy prensibi yani. bunu da render'in içinde call edelim ki işleme alınsın. bunu da generateMarkup'tan önce yapalım ki önce silinsin, sonra yenisi eklensin.
  }

  renderSpinner = function () {
    //bir şeyler yüklenirken oluşan loading işareti için aşağıdaki çalışmayı yapıyoruz.

    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
