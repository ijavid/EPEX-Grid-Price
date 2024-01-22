export function getDay(delta, endofday) {
    let date = new Date();
    date.setDate(date.getDate() + delta + (endofday ? 1 : 0));
    date.setHours(0, 0, 0, 0);
    return date;
}

export function getMonday(delta, endofday) {
    const dayOfWeek = new Date().getDay();
    return getDay( delta - dayOfWeek, endofday);
}

export function getYesterdaySOD() {
    return getDay(-1);
}

export function getTomorrowEOD() {
    return getDay(+1, true);
}
