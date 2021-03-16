const MONTHS = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
];

function toFormat(date, format) {
    return format
        .replace(/d/g, `${date.getDate()}`.padStart(2, '0'))
        .replace(/Y/g, date.getFullYear())
        .replace(/m/g, `${date.getMonth() + 1}`.padStart(2, '0'))
        .replace(/h/g, `${date.getHours()}`.padStart(2, '0'))
        .replace(/i/g, `${date.getMinutes()}`.padStart(2, '0'))
        .replace(/M/g, MONTHS[date.getMonth()]);
}

function tsToFormat(ts, format) {
    if (!ts) {
        return ts;
    }

    return toFormat(new Date(ts * 1000), format);
}

module.exports = {
    dateToFormat: toFormat,
    tsToFormat,
};
