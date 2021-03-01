const calculatePrice = e => {
  postMessage(
    e.data.map(product => {
      return {
        ...product,
        calculatedPrice: product.price * 1.12 * Math.random(0.1 - 1.1),
      };
    }),
  );
};

onmessage = calculatePrice;
