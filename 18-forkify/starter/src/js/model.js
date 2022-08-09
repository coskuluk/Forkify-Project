// import { search } from 'core-js/fn/symbol';
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON } from './helpers.js';
import { AJAX } from './helpers.js';
//state, app'le ilgili tüm data'yı saklasın istiyoruz böyle bir yaklaşımımız var. bu yüzden search query'i bile belki daha sonra ihtiyaç olur diye sakladık.

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

//aşağıdaki fonksiyonumuz aslında bir şey return etmiyor. sadece fetch edilen recipe data'sını alıp onu daha sonra kullanabileceğimiz okunabilir bir obje haline getiriyor.

export const createRecipeObject = function (data) {
  const { recipe } = data.data;
  //yukarıda object destructuring yaptık. aslında let recipe = data.data.recipe idi kodumuz. ama iki tarafta da recipe olunca böyle yapabiliyorsun. kafan karışmasın yani.

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //CONDITIONALLY ADDING PROPERTIES TO AN OBJECT ---->>> short circuiting yaptık. eğer recipe.key diye bir şey varsa ikinci kısma geçer, yoksa hiçbir şey yapmaz. eğer varsa, o değer, alır ve  spread eder. key: recipe.key demek ile aynı şeyi yapmış olur. bizim eklemediğimiz recipe'lerde key olmayacağı için, direkt key: recipe.key olarak ekleme şansımız yoktu. böyle eklememiz gerekiyor.
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    //recipe yükleme sırasında ilgili recipE'lerin bookmark değerlerine bakıyoruz ve diyoruz ki, eğer bookmark.id'si güncel id ile eşleşiyorsa true yap, eşleşmiyorsa false yap. bu sayede tüm recipe'ler ya true ya da false olmak zorunda olacak. bu arada bu noktada state'teki bookmark array'ini de neden yarattığımızı anlamış olduk. böylelikle o array'deki id'leri normal loaded recipe'lerin id'si ile kıyaslayabildik.

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (err) {
    //temporary error handling. daha sonra bunu geliştireceğiz.

    console.log(`HEY ${err}`); //helpers.js'ten gelen error'u burada handle etmiş olacağız. buraya throw edilmişti error.
    throw err;
  }
};

//starting implement THE SEARCH FUNCTIONALITY load fonksiyonunu yapmaya başlıyoruz.

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    /// temp error handling
    console.error(`${err}`); //helpers.js'ten gelen error'u burada handle etmiş olacağız. buraya throw edilmişti error.
    throw err;
  }
};

//başlangıç ve bitiş noktalarını hardcoding yapmak istemiyoruz. bunun yerine hesaplansın istiyoruz.
//eğer page yerine bir şey pass etmemişsek otomatik olarak sayfa 1'i göstermesi lazım.

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 10;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  //bu fonksiyonun yapacağı şey state'e ulaşmak, state içinden ingredients'e erişmek ve her birinin sayısını değiştirmek. amaç bu.
  //yeni bir array istemediğimiz için map yerine for each kullanıyorum. map de kullanabilirdim ama gerek yok.

  //aşağıda önce yeni serving'i hesapladık. ama state'te gösterilen serving bilgisini değiştirmek ayrı bir iş. onu sonraki adımda yapacağız.
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newQt = OldQt * New Servings / Old Servings gibi bir formül uyguladık burada.
  });

  state.recipe.servings = newServings;
};

//bookmark array'i için yaptığımız her bir değişikliği local storage'ye kaydedecek olan bir fonksiyon yarattık. bu fonksiyonu bookmark için yaptığımız her işlem sonrasında çağıracağız. böylelikle silmeyi de eklemeyi de biliyor olacak.

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add Bookmark
  state.bookmarks.push(recipe);

  //Mark Current Recipe as Bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

//genelde bir şeyi eklerken tüm datayı ele alırız, silerken ise sadece id'si ile çalışırız. bu bir yaklaşım. burada da böyle yapıyoruz. sen de böyle yapmaya çalış.

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  //yukarıda diyoruz ki, state.bookmark array'i içerisinde şu anki id'i ile id'si eşleşen elementi bul ve onun index değerini bana söyle.

  //remove bookmark
  //neyin silineceğini belirlemek için bir stratejimiz var. indexi alırız çünkü o indexi sileceğiz ve bir deriz çünkü sadece o indexteki şeyi sileceğiz, yani 1 adet şeyi sileceğiz. şimdi ihtiyaç olan şey ilgili id'nin bookmarks'ta kaçıncı index'te olduğu.
  state.bookmarks.splice(index, 1);

  //mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

//sayfa yüklendiğinde local storage'de bir şey varsa otomatik olarak yüklenmesini istiyoruz. o halde bunun için bir initilization fonksiyonu yaratmalıyız. böyle durumlarda init ismini verirsen genel kullanıma uygun olur.

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong formatting. Please try again with the correct format!'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
