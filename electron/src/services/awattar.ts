import {PriceModel} from "./price.model";

const API_URL = 'https://api.awattar.at/v1/marketdata'


const {request} = (window as any).bridge as { request: (args: any) => Promise<any> }

export async function fetchData(from: Date, to: Date) {
    // const { request } = (window as any).bridge;

    const url = new URL(API_URL)
    if (from) url.searchParams.set('start', from.getTime().toString())
    if (to) url.searchParams.set('end', to.getTime().toString())

    const {status, data} = await request({
        method: 'GET', url: url.toString()
    })

    if (status === 200 && data?.data) {
        return data.data.map((item: any) => PriceModel.fromAwattar(item))
    }
    throw new Error('Error Response ' + status + ' ');
}
