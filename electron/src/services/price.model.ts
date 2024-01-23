export class PriceModel {
    start: Date;
    end: Date;
    marketprice: number;
    unit: string;

    /**
     * Creates a PriceModel object from the properties provided by the Awattar API.
     *
     * @param  props - The properties object provided by the Awattar API.
     * @param  props.start_timestamp - The start timestamp of the price period.
     * @param  props.end_timestamp - The end timestamp of the price period.
     * @param  props.marketprice - The market price for the given period.
     * @param  props.unit - The unit of measurement for the market price.
     *
     * @return {PriceModel} - The created PriceModel object with the provided properties.
     */
    static fromAwattar(props: {
        start_timestamp: number; end_timestamp: number; marketprice: number; unit: string;
    }): PriceModel {
        const obj = new PriceModel();
        obj.start = new Date(props.start_timestamp);
        obj.end = new Date(props.end_timestamp);
        obj.marketprice = props.marketprice;
        obj.unit = props.unit;
        return obj;
    }

    constructor(props?: PriceModel) {
        if (props) {
            this.start = new Date(props.start);
            this.end = new Date(props.end);
            this.marketprice = props.marketprice;
            this.unit = props.unit;
        }
    }

    toString(): string {
        return `${this.start}\t${this.end}\t${this.marketprice}\t${this.unit}`
    }

}
