const FROM = {
  BACKEND: "BACKEND",
  FRONTEND: "FRONTEND",
}

const currencies = [
  { name: "US Dollar", code: "USD", symbol: "$", rate: 1 },
  { name: "Euro", code: "EUR", symbol: "€", rate: 0.897597 },
  { name: "British Pound", code: "GBP", symbol: "£", rate: 0.81755 },
  { name: "Russian Ruble", code: "RUB", symbol: "₽", rate: 63.461993 },
]

const getCurrencyList = (from) => {
  // "from" can be used for different currency list
  //  depends on initiator
  return currencies
}

const getCurrencyListCodes = (from) => {
  // "from" can be used for different currency list
  //  depends on initiator
  return currencies.map((c) => c.code)
}

module.exports = {
  FROM,
  getCurrencyList,
  getCurrencyListCodes,
}
