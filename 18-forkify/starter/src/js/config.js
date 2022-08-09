
//sürekli olarak üzerinde konfigürasyon yapmamız gerekebilecek şeyleri bu dosyaya alacağız. mesela fetch url'i. mesela oradaki v2, v3 olabilir çünkü versiyon değişebilir, değil mi? onu burada tanımlarsak sadece burada değiştirmek zorunda kalırız. üzerinde birden fazla dosyada oynama yapıp değiştirdiğimiz şeyleri düşünüp sadece onları buraya alacağız

//asla değişmeyecek constant variable'ları tamamen büyük harfle tanımlayabilirsin config içinde.  export da ettik ki diğer dosyalarda kullanabilelim.


export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';

export const TIMEOUT_SEC = 10;
export const RES_PER_PAGE = 10;
export const KEY = 'ccef2419-fbe1-4be8-9dbd-190a9ef71276';
export const MODAL_CLOSE_SEC = 2.5;