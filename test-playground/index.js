function calculateTotal(price, tax) {
  return price * (1 + tax);
}

const user = {
  name: 'John Doe',
  role: 'admin'
};

function init() {
  console.log('Downloading more RAM...');
  console.log('App starting');
  calculateTotal(100, 0.2);
}
init();
