const PRODUCTS = {
  scout: {
    type: "drone",
    name: "Scout Unit",
    price: 5000
  },

  guardian: {
    type: "drone",
    name: "Guardian Unit",
    price: 8000
  },

  repair_service: {
    type: "service",
    name: "Repair Service",
    price: 12000
  },

  sensor_pack: {
    type: "part",
    name: "Sensor Pack",
    price: 3000
  }
};

function getProduct(id) {
  return PRODUCTS[id];
}

module.exports = {
  PRODUCTS,
  getProduct
};