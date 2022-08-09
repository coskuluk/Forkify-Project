//helper fonksiyonlarımızı buraya koymak için bir dosya açtık.

// import { time } from 'console';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

//REFACTORING
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    //eski hali: ${API_URL}/${id}
    //Aşağıda Promise.race kullandık. bu nasıl çalışıyordu? içine iki tane promise alıyordu ve hangisi daha önce tamamlanırsa onu işliyordu. Yani şunu demiş oluyoruz: fethcPro beş saniyeden önce tamamlanırsa oradan devam et. ama eğer tamamlanmazsa, timeout'u işleme koy ve olayı bitir. Bunu async section'unda görmüştük. hatırlamıyorsan geri dön.

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    //buradaki on sayısını kafamıza göre belirledik. yani kodumuzu okuyan kişi abi bu on nedir diyecektir. o yüzden bu da aslında config dosyamızda handle etmemiz gereken bir şey. isteyen onu değiştirebilmeli kolaylıkla. config dosyamıza bakalım.

    //fetch'ten gelecek olan datayı her zaman tekrar json ile await etmen gerekiyor ki okunur hale gelsin. klasik. buna da her zaman const data ismini ver.

    const data = await res.json();

    //yukarıdaki data id yanlış olursa gelecek olan error'u handle edelim.

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; //burada getJSON bir promise return eder. burada return edilen data da, bu promise'in resolved value'sudur. dolayısıyla getJSON'u işleeyen model.js'teki loadRecipe fonksiyonu, bu promise value'sunu alır ve const data içerisine store eder. daha sonra ise onu kullanır. İşte böylelikle async fonksiyonu bir başka async fonksiyonu çağırmış olur.
  } catch (err) {
    throw err; //burada error'un handle edilmesini istemiyoruz. model.js'te handle edilmesini istiyoruz. bu yüzden de throw err yazdık. böylelikle model.js'teki error mesajı ile handle etmiş olacağız.
  }
};

//şimdi fetch işlemini birçok yerde defalarca yapmamız gerekebilir teorik olarak. bu app'te sadece modal'da yapacağız ama normalde fetch sürekli farklı yerlerde yapılabilir. o yüzden fetch yapıp json'u normal data'ya çevirdiğimiz ve error'u handle ettiğimiz kapsül işlemi ayrı bir fonksiyonda helper'da ele almak çok sağlıklı bir yaklaşım. aşağıda model.js'ten aldığımız bu fonksiyonu helpers'a taşıyıp onu bir variable haline getiriyoruz.

// export const getJSON = async function (url) {
//   try {
//     const fetchPro = fetch(url);
//     //eski hali: ${API_URL}/${id}
//     //Aşağıda Promise.race kullandık. bu nasıl çalışıyordu? içine iki tane promise alıyordu ve hangisi daha önce tamamlanırsa onu işliyordu. Yani şunu demiş oluyoruz: fethcPro beş saniyeden önce tamamlanırsa oradan devam et. ama eğer tamamlanmazsa, timeout'u işleme koy ve olayı bitir. Bunu async section'unda görmüştük. hatırlamıyorsan geri dön.

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

//     //buradaki on sayısını kafamıza göre belirledik. yani kodumuzu okuyan kişi abi bu on nedir diyecektir. o yüzden bu da aslında config dosyamızda handle etmemiz gereken bir şey. isteyen onu değiştirebilmeli kolaylıkla. config dosyamıza bakalım.

//     //fetch'ten gelecek olan datayı her zaman tekrar json ile await etmen gerekiyor ki okunur hale gelsin. klasik. buna da her zaman const data ismini ver.

//     const data = await res.json();

//     //yukarıdaki data id yanlış olursa gelecek olan error'u handle edelim.

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data; //burada getJSON bir promise return eder. burada return edilen data da, bu promise'in resolved value'sudur. dolayısıyla getJSON'u işleeyen model.js'teki loadRecipe fonksiyonu, bu promise value'sunu alır ve const data içerisine store eder. daha sonra ise onu kullanır. İşte böylelikle async fonksiyonu bir başka async fonksiyonu çağırmış olur.
//   } catch (err) {
//     throw err; //burada error'un handle edilmesini istemiyoruz. model.js'te handle edilmesini istiyoruz. bu yüzden de throw err yazdık. böylelikle model.js'teki error mesajı ile handle etmiş olacağız.
//   }
// };

// fetch fonksiyonunu kullanarak API'den data çekebiliyorduk. Bunun yanı sıra, API'te data gönderme sürecinde de fetch fonksiyonunu kullanabiliriz. SENDJSON'u da bunun için oluşturduk.

// export const sendJSON = async function (url, uploadData) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
