import {useState} from "react";
import {DataByDays, PriceState, PriceStats} from "../types";
import {fetchData} from "../services";
import {useFormat} from "./useFormat";

export const useData = () => {
    const {formatDate} = useFormat();
    const [lowPerc, setLowPerc] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<PriceState>([]);
    const [stats, setStats] = useState<PriceStats>({min: 0, max: 1});

    const lowLimit = (stats.max - stats.min) * lowPerc / 100 + stats.min;
    const itemsBelowLimit = data.flatMap(a => a.data.filter(item => item.marketprice <= lowLimit));

    const fetchPrices = async (from: Date, to: Date) => {
        setData([]);
        setIsLoading(true);
        const data = await fetchData(from, to);
        if (!data || !data.length) {
            setData([]);
            setIsLoading(false);
            return
        }

        const calc = {min: data[0].marketprice, minData: data[0], maxData: data[0], max: data[0].marketprice};
        const days = new Map<string, DataByDays>();
        for (const item of data) {
            const key = formatDate(item.start);
            if (!days.has(key)) {
                days.set(key, {title: key, date: item.start, data: [item]})
            } else {
                days.get(key)!.data.push(item);
            }
            if (calc.min > item.marketprice) {
                calc.min = item.marketprice;
                calc.minData = item;
            }
            if (calc.max < item.marketprice) {
                calc.max = item.marketprice;
                calc.maxData = item;
            }
        }
        setData(Array.from(days.values()));
        setIsLoading(false);
        setStats(calc);
    }

    return {
        fetchPrices, data, isLoading, // TODO separate
        stats, lowPerc, lowLimit, itemsBelowLimit, setLowPerc,
    }
}
