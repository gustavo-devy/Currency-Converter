const currencyInput = document.querySelector('#currency-value');
const convertForm = document.querySelector('#convert-form');
const selectCurrencyFrom = document.querySelector('.select-currency-of');
const selectCurrencyTo = document.querySelector('.select-currency-to');
const result = document.querySelector('.result');

const API_URL = "https://api.exchangerate-api.com/v4/latest/";

// Map each currency to a suitable locale
const currencyToLocale =
{
  BRL: 'pt-BR',
  USD: 'en-US',
  EUR: 'de-DE',
  JPY: 'ja-JP',
  GBP: 'en-GB',
  AUD: 'en-AU',
  CHF: 'de-CH'
};

// Format the input dynamically when typing or changing currency
currencyInput.addEventListener('input', formatInput);
selectCurrencyFrom.addEventListener('change', formatInput);

function formatInput()
{
  let rawValue = currencyInput.value.replace(/\D/g, '');

  if (rawValue === '')
  {
    currencyInput.value = '';
    return;
  }

  const amount = parseFloat(rawValue) / 100;

  const currency = selectCurrencyFrom.value;
  const locale = currencyToLocale[currency] || 'en-US';

  currencyInput.value = new Intl.NumberFormat(locale,
  {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Form submission and conversion logic
convertForm.addEventListener("submit", (event) =>
{
  event.preventDefault();

  let value = currencyInput.value.replace(/\D/g, "");
  value = parseFloat(value / 100).toFixed(2);

  const fromCurrency = selectCurrencyFrom.value;
  const toCurrency = selectCurrencyTo.value;

  if (value.trim() === "") {
    alert("Please enter a value!");
    return;
  }

  if (Number(value) <= 0 || Number(value) > 1000000000) {
    alert("Please enter a valid amount!");
    return;
  }

  getExchangeRate(fromCurrency, toCurrency, value);
});

async function getExchangeRate(fromCurrency, toCurrency, amount)
{
  try
  {
    const response = await fetch(API_URL + fromCurrency);
    const data = await response.json();

    const rate = data.rates[toCurrency];
    const resultValue = (amount * rate).toFixed(2);

    const locale = currencyToLocale[toCurrency] || 'en-US';

    const formattedResult = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: toCurrency
    }).format(resultValue);

    result.style.display = "flex";
    result.children[0].textContent = formattedResult;
    result.children[1].textContent = `${fromCurrency} → ${toCurrency}`;
  }
  catch (error)
  {
    alert("Error converting currency: " + error.message);
  }
}