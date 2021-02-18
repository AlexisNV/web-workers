var result = [];

const SCRIPT_URL = 'worker.js';

const init = () => {
  const $workers = parseInt(document.getElementById('workers').value, 10);
  const $numProducts = parseInt(document.getElementById('products').value, 10);
  const $send = document.getElementById('send');
  $send.addEventListener('click', () => {
    const products = generateProducts($numProducts);
    const dividedProducts = divideArray(products, $workers);
    console.log(dividedProducts);
    dividedProducts.forEach(array => {
      const worker = new Worker('worker.js');
      worker.addEventListener('message', printProducts);
      worker.postMessage(JSON.stringify(array));
    });
  });
};

const printProducts = e => console.log(e.data);

const chunk = (array, chunk_size) =>
  Array(Math.ceil(array.length / chunk_size))
    .fill()
    .map((_, index) => index * chunk_size)
    .map(begin => array.slice(begin, begin + chunk_size));

const divideArray = (array, chunks) => {
  const pieces = Math.ceil(array.length / chunks);
  return chunk(array, pieces);
};

const generateProducts = numProducts =>
  Array.from({length: numProducts}, (_, index) => {
    index += 1;
    return {id: index, price: Math.random(1, 100), calculatedPrice: 0};
  });

window.addEventListener('load', init);
