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

const splitAndConvert = time => {
    // Split
    let [hh, mm] = time.split(/[.:]/);
    hh = hh || 0;
    mm = mm || 0;
    // Convert to minutes
    return +mm + (60 * hh);
};

const pad = num => {
    return ("0" + num).slice(-2)
};

const convertToTime = (timeInMins) => {
    let hours = Math.floor(timeInMins / 60);
    let minutes = timeInMins % 60;
    // To get time, return here
    return pad(hours) + ":" + pad(minutes);
}

const totalHours = (s, f, l) => {
    const smin = splitAndConvert(s);
    const fmin = splitAndConvert(f);
    const lmin = splitAndConvert(l);
    let totalInMinutes = s > f ? Math.abs(smin - (24 * 60) - fmin) - lmin : fmin - smin - lmin;
    return totalInMinutes.toString();
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
    splitAndConvert: splitAndConvert,
    pad: pad,
    convertToTime: convertToTime,
    timeFormatter: timeFormatter,
    ignoreFavicon: ignoreFavicon,
    isLoggedIn: isLoggedIn
}