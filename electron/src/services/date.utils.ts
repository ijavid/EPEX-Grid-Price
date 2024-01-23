import {ConfigProvider} from "antd";

export function getDay(delta: number, endofday?: boolean) {
    let date = new Date();
    date.setDate(date.getDate() + delta + (endofday ? 1 : 0));
    date.setHours(0, 0, 0, 0);
    return date;
}

export function getMonday(delta: number, endofday?: boolean) {
    const dayOfWeek = new Date().getDay();
    return getDay( delta - dayOfWeek, endofday);
}

export function getYesterdaySOD() {
    return getDay(-1);
}

export function getTomorrowEOD() {
    return getDay(+1, true);
}


// export const formatDate = new Intl.DateTimeFormat(undefined, {dateStyle: 'full'}).format;
// export const formatTime = new Intl.DateTimeFormat(undefined, {timeStyle: 'short'}).format;
// export const formatFull = new Intl.DateTimeFormat(undefined, {timeStyle: 'short', dateStyle: 'short'}).format;
//
