const currency_value = document.querySelector('#currency-value');
const convert_form = document.querySelector('#convert-form');
const select_currency_of = document.querySelector('.select-currency-of');
const select_currency_to = document.querySelector('.select-currency-to');
const result = document.querySelector('.result');

const URL_API = "https://api.exchangerate-api.com/v4/latest/";

convert_form.addEventListener("submit", (event) =>
{
  event.preventDefault();

  const value_currency = currency_value.value;
  const from_currency = select_currency_of.value;
  const to_currency = select_currency_to.value;

  if (value_currency.trim() === "")
  {
    alert("Digite um valor!");
    return;
  }

  if (Number(value_currency) <= 0 || Number(value_currency) > 1000000000)
  {
    alert("Digite um valor válido!");
    return;
  }

  GetDataCurrency(from_currency, to_currency, value_currency);
});

async function GetDataCurrency(from_currency, to_currency, amount)
{
  try
  {
    const response = await fetch(URL_API + from_currency);
    const data = await response.json();

    const rate = data.rates[to_currency];
    const result_value = (amount * rate).toFixed(2);

    result.style.display = "flex";
    result.children[0].textContent = `${result_value} ${to_currency}`;
    result.children[1].textContent = `${from_currency} > ${to_currency}`;
  }
  catch (error)
  {
    alert("Erro ao converter moeda!");
  }
}