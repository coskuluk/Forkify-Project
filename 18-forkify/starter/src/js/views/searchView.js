class SearchView {
  _parentEl = document.querySelector('.search');
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    //ne yaptık? parent elemente git dedik. ki bu da search class'ı oluyor html'deki. sonra bunun search field'ine git dedik. bunun da value'suna. yani input'ta kullanıcının yazacağı kelimeye git, demiş oluyorsun.
    this._clearInput(); //önce query'i aldık, sonra input kısmını sildik, sonra sonuçları listeledik. her aramada orası boş olmuş oldu sadece placeholder gözükecek.
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  //publisher - subscriber modelini buraya da uygulamamız gerekiyor. bu uygulamayı bu sefer de search fonksiyonunun butonunun tıklanması için yapıyoruz. burada event'i dinleyeceğiz, eylemi ise controller'da tanımlayacağız.

  //Aşağıda publisher subscriber pattern'i kullanacağız. şimdi burada search view içerisinde add event listener'imizi ekliyoruz. burada hangi eylemde bir yanıt oluşacağını belirliyoruz aslında. daha sonra bu yanıtın ne olacağını controller'da çalışacağız.

  //butonu seçmek yerine tüm formu seçtik. bu sayede butona tıklasa da enter'e bassa da olayı dahil etmiş olacağız. bu arada her şeyden önce preventdefault yapmayı unutmuyoruz formlarda.

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
