
export class PriceModel {
    start;
    end;
    marketprice;
    unit;

    /**
     * Creates a PriceModel object from the properties provided by the Awattar API.
     *
     * @param {Object} props - The properties object provided by the Awattar API.
     * @param {number} props.start_timestamp - The start timestamp of the price period.
     * @param {number} props.end_timestamp - The end timestamp of the price period.
     * @param {number} props.marketprice - The market price for the given period.
     * @param {string} props.unit - The unit of measurement for the market price.
     *
     * @return {PriceModel} - The created PriceModel object with the provided properties.
     */
    static fromAwattar(props) {
        const obj = new PriceModel();
        obj.start = new Date(props.start_timestamp);
        obj.end = new Date(props.end_timestamp);
        obj.marketprice = props.marketprice;
        obj.unit = props.unit;
        return obj;
    }

    constructor(props) {
        if(props) {
            this.start = new Date(props.start);
            this.end = new Date(props.end);
            this.marketprice = props.marketprice;
            this.unit = props.unit;
        }
    }

    /**
     * Converts the current object to a string representation, single line tab separated
     *
     * @returns {string} The string representation of the object.
     */
    toString() {
        return `${this.start}\t${this.end}\t${this.marketprice}\t${this.unit}`
    }

}
