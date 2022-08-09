import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet!! Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  //controller'da bookmarks.render çalıştığında ne olur? render generatemarkup'ı çalıştırır. yani aşağıdaki metod çalışır. bu metodun içinde, hem bookmarks hem de results için ortak olarak kullanılan markup'ı tekrar etmemek için, onu previewView.js'e almıştık. burada data'yı alıyor ve map ile her seferinde previewView'e giderek oradaki markup'ı yaratıyor. ama bunu yaratırken aslında onu string olarak return ediyor. Doğrudan DOM'da yaratmıyor. Zaten string olarak return etsin diye false olarak belirledik. DOM'a ekleme yapmasın bu şeyi string olarak return etsin istiyoruz sadece. 
  
  //SONRA, previewView.render(bookmark, false)) bunun hepsi bir string return etmiş oldu. map da bu string'lerden oluşan bir array yaratmış oldu. Son olarak join metodu, bir sürü string'ten oluşan bu array'i tek bir string'e çevirdi tekrardan. Böylelikle render etmek istediğimiz tüm markup tek bir string olarak elimizde olmuş oldu.

  //YANİ TÜM FONKSİYONELLİĞİ, ANA MARKUP'I previewview'e aldıktan sonra yine de hepsini burada ve resultsview'de toplayabilmemizi sağlayan şey, generateMarkup kodu. aynısını resultsview'e de yaptık orada da alsın diye.




  _generateMarkup() {
    return this._data
    .map(bookmark => previewView.render(bookmark, false))
    .join('');
  }

}

export default new BookmarksView();
