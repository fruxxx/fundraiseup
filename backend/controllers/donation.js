const { db } = require("../mongo")
const { getCurrencyListCodes, FROM } = require("../../general/currency")

const donate = async ({ amount, currency }) => {
  const result = { data: null, error: null }
  try {
    // validate amout (maybe better move it to model validation)
    if (Number.parseFloat(amount) < 0) {
      result.error = {
        description: "the amount less than zero",
      }
      return result
    }

    // check available currencies on the backend
    const currencyList = getCurrencyListCodes(FROM.BACKEND)
    if (!currencyList.includes(currency)) {
      result.error = {
        description: "unregistered currency " + currency,
      }
      return result
    }

    const donation = await db.Donation.create({
      currency,
      amount,
    })

    result.data = donation
  } catch (error) {
    console.error(error.stack || error)

    result.error = {
      description: "internal server error",
      stack: error.stack,
    }
  }

  return result
}

module.exports = {
  donate,
}
