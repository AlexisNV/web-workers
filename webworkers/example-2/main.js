const DOM = {
  $workers: document.getElementById('workers'),
  $products: document.getElementById('products'),
  $send: document.getElementById('send'),
  $databox: document.getElementById('databox'),
};
let result = [];
let workers = [];
let tasks = [];

function load() {
  DOM.$send.addEventListener('click', init);
}

function init() {
  const $numWorkers = DOM.$workers.value;
  const $numProducts = DOM.$products.value;
  const products = generateProducts($numProducts);
  const dividedProducts = divideArray(products, +$numWorkers);
  workers = generateWorkers($numWorkers);
  for (let i = 0; i < $numWorkers; i++) {
    tasks = [...tasks, {workerId: workers[i].id, chunk: dividedProducts[i]}];
    workers[i].worker.postMessage(tasks[i]);
  }
  DOM.$databox.innerHTML = '';
}

function printProducts(e) {
  result = [...result, ...e.data];
  let html = '';
  result.forEach(product => {
    html += `<p>ID: ${product.id} | Precio: ${product.price} | Precio calculado: ${product.calculatedPrice}</p>`;
  });
  DOM.$databox.innerHTML = html;
}

function printError(err) {
  workers = workers.filter(worker => worker.id !== err.id);
}

function chunk(array, chunk_size) {
  return Array(Math.ceil(array.length / chunk_size))
    .fill()
    .map((_, index) => index * chunk_size)
    .map(begin => array.slice(begin, begin + chunk_size));
}

function divideArray(array, chunks) {
  const pieces = Math.ceil(array.length / chunks);
  return chunk(array, pieces);
}

function generateWorkers(numWorkers) {
  for (let i = 0; i < numWorkers; i++) {
    const worker = new Worker('worker.js');
    worker.addEventListener('message', printProducts);
    worker.addEventListener('message', printError);
    workers = [...workers, {id: i, worker: worker}];
  }
  return workers;
}

function generateProducts(numProducts) {
  return Array.from({length: numProducts}, (_, index) => {
    index += 1;
    return {
      id: index,
      price: Math.floor(Math.random(1, 100) * 50),
      calculatedPrice: 0,
    };
  });
}
window.addEventListener('load', load);
