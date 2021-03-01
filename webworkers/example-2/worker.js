const calculatePrice = e => {
  postMessage(
    e.data.chunk.map(product => {
      return {
        ...product,
        calculatedPrice: product.price * 1.12 * Math.random(0.1 - 1.1),
      };
    }),
  );
};

const random = () => Math.floor(Math.random() * 100);

onmessage = calculatePrice;
