import icons from 'url:../../img/icons.svg';

import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  //aşağıdaki fonksiyonun ne zaman aktif olmasını istiyoruz? sayfa yüklenince. o zaman controller'da yapacak bir işimiz yok. çünkü spesifik bir event yaratmaya gerek yok.

  //klasik bir tarzda constructor fonksiyonu.

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  //NOTE ABOUT HOW THIS KEYWORD WORKS IN THIS SCENARIO

  //BAŞTA toggleWindow() u oluşturmamıştık ve ilgili kodu doğrudan aşağıdaki fonksiyonun içine yazmıştık. AMA
  // HANDLER fonksiyonunun içinde this keyword, handler'in attach olduğu dom elementini işaret eder. yani burada da _btnOpen'i işaret etti. Bu yüzden hata verdi. Bu yüzden this keyword'u ayrı bir metod içerisine yerleştirdik. This keyword, metod içerisinde, metodu çağıran objeyi işaret eder. Yani addRecipeView'i işaret etti. ve bunun içerisindeki _overlay ile _window'u başarılı bir şekilde seçmiş oldu. daha sonra toggleWindow'u aşağıdaki fonksiyona yazdık. fakat yine btnOpen'i seçme tehlikesi oldu. bu yüzden bind(THİS) dedik. bunu yapmak, this olarak objeyi almaya fonksiyonu zorladı. İşte bu kadar!

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      //aşağıdaki formdata, bir çeşit modern aPI aslında. formu alıp bir array'e dönüştürdük onu kullanarak.

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
