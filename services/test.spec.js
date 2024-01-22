import {printLines} from "./index.js";
import {getDay, getTomorrowEOD, getYesterdaySOD} from "./date.utils.js";
import {fetchData} from "./awattar.js";

const yesterday = getYesterdaySOD();
const tomorrow = getTomorrowEOD();
const lastweek = getDay(-7);
// const lastyear = getDay(-365);

fetchData(lastweek, tomorrow).then(data =>{
    // console.log(data);
    for (const item of data) {
        console.log(item.toString());
    }
} );
