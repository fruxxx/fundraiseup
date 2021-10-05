<template>
  <div class="donation_wrapper">
    <form @submit.prevent="submit" v-if="currencies">
      <div class="suggestions">
        <button
          type="button"
          v-for="(preset, i) in presets"
          :key="preset.value"
          :disabled="suggestion === preset.value"
          @click="setPreset(preset, i)"
        >
          {{ preset.text }} {{ choosedCurrency.symbol }}
        </button>
      </div>
      <br />
      <div class="input_donation">
        <div class="prefix">{{ choosedCurrency.symbol }}</div>
        <input
          :value="donationAmountInput"
          @keypress="isNumber"
          @input="setCustomAmount"
          @paste="onPaste"
          inputmode="numeric"
          type="text"
          pattern="[\d,]*"
        />
        <div class="postfix">
          <select @change="currency = $event.target.value">
            <option
              :key="curr.symbol || ''"
              :value="curr.code"
              v-for="curr in currencies"
              >{{ curr.code }} | {{ curr.name }}</option
            >
          </select>
        </div>
      </div>
      <br />
      <button class="donate_button" type="submit">Donate</button>
    </form>
  </div>
</template>

<script>
const axios = require("axios")
const { getCurrencyList, FROM } = require("../../../general/currency")

function beautyAmount(num) {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function findPriceLevel(num) {
  const priceSteps = [
    { max: 50, step: 10 },
    { max: 100, step: 30 },
    { max: 1000, step: 50 },
    { max: 1500, step: 500 },
    { max: 3000, step: 2500 },
    { max: 10000, step: 1000 },
    { max: 15000, step: 5000 },
    { max: 15000, step: 5000 },
    { max: 100000, step: 10000 },
    { max: 1000000, step: 50000 },
  ]

  for (const item of priceSteps) {
    if (num <= item.max) {
      return item
    }
  }
  return priceSteps[priceSteps.length - 1]
}

function optimalAmount(amount) {
  const item = findPriceLevel(amount)
  const diff = amount - item.step

  if (diff < 0) return { value: item.step, text: beautyAmount(item.step) }

  const priceByStep = Math.ceil(amount / item.step) * item.step
  return { value: priceByStep, text: beautyAmount(priceByStep) }
}

export default {
  data() {
    return {
      presetsUSD: [40, 100, 200, 1000, 2500, 5000],
      suggestion: 40,
      currencies: getCurrencyList(FROM.FRONTEND),
      currency: "USD",
      donationValue: 0,
      customAmount: 0,
      presetIndex: 0,
    }
  },
  watch: {
    currency(curr, prevCurr) {
      if (this.presetIndex >= 0) {
        this.suggestion = this.presets[this.presetIndex].value
        this.donationValue = this.presets[this.presetIndex].value
        return
      }

      const prevCurrencyObject = this.currencies.find(
        (c) => c.code === prevCurr
      )
      const currencyObject = this.currencies.find((c) => c.code === curr)

      const amount = Math.round(
        currencyObject.rate * (this.customAmount / prevCurrencyObject.rate)
      )

      this.customAmount = amount
      this.suggestion = amount
      this.donationValue = amount
    },
  },
  computed: {
    choosedCurrency() {
      return this.currencies.find((c) => c.code === this.currency)
    },
    presets() {
      return this.choosedCurrency.rate
        ? this.presetsUSD.map((p) => {
            if (this.choosedCurrency.code === "USD")
              return { value: p, text: beautyAmount(p) }
            const convertedValue = this.choosedCurrency.rate * p
            return optimalAmount(convertedValue)
          })
        : []
    },
    donationAmountInput() {
      return beautyAmount(this.donationValue)
    },
  },
  methods: {
    onPaste(event) {
      const data = event.clipboardData.getData("text")
      if (/[^0-9,]+/gi.test(data)) return event.preventDefault()
    },
    isNumber(event) {
      if (event.key == 0 && this.donationValue === 0) {
        return event.preventDefault()
      }
      if (/[^0-9]+/gi.test(event.key)) return event.preventDefault()
    },
    setCustomAmount(event) {
      const cleaned = parseInt(
        event.target.value ? event.target.value.replace(/[^0-9]+/gi, "") : 0
      )

      if (Number.isNaN(cleaned)) event.preventDefault()

      this.suggestion = cleaned
      this.donationValue = cleaned
      this.customAmount = cleaned
      this.presetIndex = this.presets.findIndex((p) => p.value === cleaned)
    },

    setPreset(preset, idx) {
      this.presetIndex = idx
      this.suggestion = Number.parseInt(preset.value)
      this.donationValue = Number.parseInt(preset.value)
      this.customAmount = 0
    },
    async submit() {
      try {
        const result = await axios({
          method: "post",
          url: `${process.env.VUE_APP_API_ENDPOINT}/donate`,
          data: {
            amount: this.donationValue,
            currency: this.currency,
          },
        })

        if (result.data.ok) {
          window.alert("Thank you for your donation!")
        }
      } catch (error) {
        window.alert(error.message)
      }
    },
  },
  mounted() {
    this.donationValue = this.suggestion
  },
}
</script>

<style scoped>
.donation_wrapper {
  max-width: 480px;
  margin: 0 auto;
}

.suggestions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  background-color: #fff;
  color: #444;
}

.input_donation {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-self: space-between;
  align-items: center;
}

.donate_button {
  font-size: 18px;
  text-align: center;
  padding: 0.5rem 2rem;
}
</style>
