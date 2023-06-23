const calculateEarn = async (price) => {
  const discount = price * 0.2;
  const remainingPrice = price - discount;

  return {
    discount,
    remainingPrice,
  };
};

module.exports = {
  calculateEarn,
};
