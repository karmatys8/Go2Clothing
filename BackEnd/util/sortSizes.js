const sizeToNumber = {
  "Onesize": -100,
  '4XS': -5,
  '3XS': -4,
  'XXS': -3,
  'XS': -2,
  'S': -1,
  'M': 0,
  'L': 1,
  'XL': 2,
  'XXL': 3,
  '3XL': 4,
  '4XL': 5,
};

const getSizeValue = (size) => typeof size === 'number'
  ? size
  : sizeToNumber[size];

function sortSizes(sizes) {
  sizes.sort((a, b) => getSizeValue(a) - getSizeValue(b));
}

module.exports = {
  getSizeValue,
  sortSizes
};