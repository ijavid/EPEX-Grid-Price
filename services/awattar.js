import axios from "axios";
import {PriceModel} from "./price.model.js";

const API_URL = 'https://api.awattar.at/v1/marketdata'

/**
 * Fetches data from the server within a specified time range.
 *
 * @param {Date} from - The start date (inclusive) of the time range.
 * @param {Date} to - The end date (inclusive) of the time range.
 * @returns {Promise<Array<PriceModel>>} - A promise that resolves to an array of PriceModel instances representing the fetched data.
 * @throws {Error} - If the response status is not 200 or if the response data is not valid.
 */
export async function fetchData(from, to) {
    const start = from?.getTime();
    const end = to?.getTime();
    const response = await axios.get(`${API_URL}`, {params: {start, end}})

    if (response.status === 200 && response.data && response.data.data) {
        return response.data.data.map(item => PriceModel.fromAwattar(item))
    }

    console.error(response);
    throw new Error('Error Response ' + response.status + ' ');
}
