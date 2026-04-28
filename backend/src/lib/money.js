function toNumber(value) {
  return Number(value || 0);
}

function entryTotal(entry) {
  return toNumber(entry.quantity) * toNumber(entry.priceSnapshot);
}

module.exports = { toNumber, entryTotal };
