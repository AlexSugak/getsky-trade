// Taken from http://www.jacklmoore.com/notes/rounding-in-javascript/
export const round = (value, decimals) => {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
