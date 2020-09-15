const totalHours = (start, finish, lunch) => {
    let startTime = convertToDecimal(start);
    let finishTime = convertToDecimal(finish);
    let total = finishTime - startTime - lunch;
    return convertToTime(total.toString());
}
const convertToDecimal = time => {
    let newTime = time.replace(/(:)/g, '.').replace(/(\.\d+)/g, function(el) {
        let sum = (Number(el) / 60) * 100;
        let rounded = Math.round((sum + Number.EPSILON) * 100) / 100;
        return rounded.toString().slice(1)
    })
    return newTime;
}

const convertToTime = time => {
    let returnedTime = time.replace(/(\.\d+)/g, function(el) {
        let m = Math.round(Number(el) * 60);
        return `.${m}`
    });
    return returnedTime.length <= 2 ? Number(`${returnedTime}`) + .00 : returnedTime.split('.')[1].length < 2 ? Number(`${returnedTime}`) + 0 : Number(returnedTime);
};
const timeFormatter = time => {
    let timeStr = time.toString();
    let hrs = timeStr.split('.')[0];
    let mins = timeStr.split('.')[1];
    return timeStr.includes('.') ? `${hrs} hrs ${mins} mins` : `${hrs} hrs`
}

console.log(timeFormatter(7.5))

module.exports = {
    totalHours: totalHours,
    convertToDecimal: convertToDecimal,
    convertToTime: convertToTime,
    timeFormatter: timeFormatter
}