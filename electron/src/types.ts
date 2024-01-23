import {PriceModel} from "./services";

export type DataByDays = {
    title: string, date: Date, data: PriceModel[]
}

export type PriceState = DataByDays[];
export type PriceStats = { min: number, minData?: any, max: number, maxData?: any };
