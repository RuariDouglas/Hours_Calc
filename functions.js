const totalHours = (start, finish, lunch) => {
    const startTime = convertToDecimal(start);
    const finishTime = convertToDecimal(finish);
    const lunchTime = convertToDecimal(lunch);
    const total = finishTime - startTime - lunchTime;
    return total.toString();
}
const convertToTime = time => {
    let [h, m] = time.split(/[.:]/);
    h = h || 0;
    m = m || 0;
    if (m.length > 2) {
        m = m.slice(0, 2);
    }
    m = `.${m}`;
    m = Math.round(+m * 60).toString();
    return m.length === 1 ? `${h}.0${m}` : `${h}.${m}`
};

const convertToDecimal = time => {
    let [h, m] = time.split(/[.:]/);
    h = h || 0;
    m = m || 0;
    return (+h + +m / 60);
}

const timeFormatter = unformattedTime => {
    let [h, m] = unformattedTime.split(/[.:]/);
    h = h || 0;
    m = m || 0;
    if (m[0] === '0') {
        m = m.substring(1);
    }
    if (h[0] === '0') {
        h = h.substring(1);
    }
    if (h === '0' && m === '0') return `0`;
    else if (m === '0' || m === '') return `${h} hrs`;
    else if (h === '0' || h === '') return `${m} mins`;
    else return `${h} hours ${m} mins`;
}




// ----------- Middleware ------------- //
// Logged in?
const isLoggedIn = (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }
    // Ignore favicon
function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({ nope: true });
    } else {
        next();
    }
}

// ----------- Export ------------- //
module.exports = {
    totalHours: totalHours,
    convertToDecimal: convertToDecimal,
    convertToTime: convertToTime,
    timeFormatter: timeFormatter,
    ignoreFavicon: ignoreFavicon,
    isLoggedIn: isLoggedIn
}