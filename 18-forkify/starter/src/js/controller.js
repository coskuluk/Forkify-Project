import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

//polyfill
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//aşağıda asenkron js'i fetch ile kullandık. unutma fetch her zaman bir promise return eder. await ise fetch'in gelecek olan promise'ini bekler. ama sorun yok async olduğu için onu beklemesi genel akışı etkilemiyor.

const controlRecipes = async function () {
  try {
    //id'nin hard coding olmasını istemediğimiz için, ilgili tarifin id'sini almasını sağlıyoruz. daha sonra fetch ederken bu id'nin datasını fetch edeceğiz.

    const id = window.location.hash.slice(1);

    //tamamen hash'sız şekilde localhost'u yüklediğimizde, error verir. çünkü olmayan hash'in id'sini bulmaya çalışıyoruz. hata vermesin diye diyoruz ki id yoksa hiçbir şey yapma. bu sayede error almıyoruz:

    if (!id) return;
    recipeView.renderSpinner();

    // 0) UPDATE RESULTS VİEW TO MARK SELECTED SEARCH RESULT
    resultsView.update(model.getSearchResultsPage());

    // 1 - UPDATING  BOOKMARKS VIEW
    bookmarksView.update(model.state.bookmarks);

    //2) LOADING THE RECIPE
    await model.loadRecipe(id); //bu bir async fonksiyon (model.js'e bakabilirsin, async olarak tanımlanmış). o yüzden bir promise return edecek. o yüzden başına await ekleyelim async olarak işlem yapsın.

    // 3) Rendering Recipe

    recipeView.render(model.state.recipe);
    // const spinner = document.querySelector('.spinner');
    // spinner.parentNode.removeChild(spinner);

    //yukarıda ne yaptık? eğer recipeView'i export ederken new recipeView olarak ve export default olarak export etmeseydik, yeni recipeView'i burada const ile yaratmamız gerekecekti. Bu da daha çok iş demekti. Ama zaten recipeView.js içerisinde new recipeView()'i export ettik, yenisini yaratarak export ettik diye, burada direkt bir variable yapmadan kullanabildik. bu bir yöntem ama diğerini yapsak da işe yarardı. Bu biraz daha az iş yapmamızı sağlıyor.
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1 - GET SEARCH QUERY
    const query = searchView.getQuery();
    if (!query) return;

    // 2 - LOAD SEARCH RESULTS

    await model.loadSearchResults(query);

    // 3 - RENDER RESULTS
    //aşağıda sadece on tanesinin sıralanmasını sağladık.

    resultsView.render(model.getSearchResultsPage());

    // 4 - INITIAL PAGINATION BUTTONS RENDERING

    //şimdi aşağıda, search ile ilgili tüm verileri render'e aldık. render'i de model.js'te tanımlamıştık ve bu fonksiyon ilgili cluster'daki data'yı alıp this.data yapıyordu. bu sayede paginationView'de henüz hiçbir şey yapmadan result data'mızı almış olduk.
    // const spinner = document.querySelector('.spinner');
    // spinner.parentNode.removeChild(spinner);

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1 - RENDER NEW RESULTS
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2- RENDER NEW PAGINATION BUTTONS
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings stored in the state

  //şimdi iş bölümü sistemi iyi işlesin istiyoruz. bu yüzden state'te yapacağımız değişikliği model.js dosyasında yapmamız gerekiyor. recipe view'de daha sonra yapacağımız değişikliği ise ayrı bir yerde. bunun için model.js'te bir fonksiyon yarattık ve şimdi de onu çağırdık.

  model.updateServings(newServings);
  //şimdi de tüm recipe'yi yeni view'le yeniden render etmek yani güncellemek istiyoruz. bunun için recipe view'i yeni hali ile, yeni servings sayısı ile yeniden basıyoruz.

  //Dom updating algoritması oluşturacağız. bu yüzden burada serving'leri kontrol ettikten sonra aktifleştirdiğimiz yeniden rendering işlemi yerine, yeni bir updating işlemi tanımlayalım.

  // RecipeView.render(model.state.recipe);

  recipeView.update(model.state.recipe);
  //update the recipe view
};

const controlAddBookmark = function () {
  // 1 - ADD / REMOVE BOOKMARK
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //bookmark butonunun değiştirme işlemini recipeview'de yaptık. ama bunun bir işe yaraması için en son burada recipeview'i de update etmemiz gerekiyor.

  // 2 - UPDATE RECIPE VIEW
  recipeView.update(model.state.recipe);

  // 3 - RENDER BOOKMARKS
  bookmarksView.render(model.state.bookmarks);
};

//view'deki fonksiyonun içine controlRecipes koymak için init'i oluşturduk. çok basit aslında. teorik olarak anladığımız şeyden çok daha basit.

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // SHOW LOADING SPINNER
    addRecipeView.renderSpinner();
    //Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //RECİPE'yi render etmemiz gerekiyor şimdi. yani her şeyi ekledik ama herhangi bir recipe view'e eklemedik. kullanıcılar formatted şekilde göremiyorlar. şimdi ekranda gösterme zamanı.
    recipeView.render(model.state.recipe);

    // success mesajı yayınla
    addRecipeView.renderMessage();

    //RENDER BOOKMARKVIEW
    bookmarksView.render(model.state.bookmarks);

    //change ID in the URL (ÇÜNKÜ her bir tarifin ayrı bir id'sinin olması gerekiyor ama şu an öyle değil)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //modal ekranını kapat ki recipe gözüksün

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('hey', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults); //bunu init içinde yapıyoruz da bu fonksiyon sayfa yüklenir yüklenmez hemen var olsun. search fonksiyonunun çalışmadığı bir zaman dilimi istemiyoruz.
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
