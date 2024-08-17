require('dotenv').config()
const app_helper = require('../helpers/app')


exports.getCurrencyRate = async (data) => {
    const base_currency = data.base_currency;
    const target_currency = data.target_currency;
    const date = app_helper.formateDate(data.date)
    const access_key = process.env.CURRENCY_API_KEY
    const api_url = process.env.CURRENCY_API_URL;

    const currency_res = await app_helper.makeRequest(api_url, { access_key, source: base_currency, currencies: target_currency, date })

    return currency_res;
}