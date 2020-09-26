window.onload = (function() {
    const time = document.querySelectorAll('.time');

    function checkValue(str, max, check) {
        if (check) {
            if (str[0] > 2) {
                return `0${str} : `;
            }
        }
        if (str.length > 2) {
            str = str.substring(0, 2);
            return +str < max ? `${str} : ` : `${max} : `;
        } else return str;
    };

    for (timeInput of time) {
        timeInput.addEventListener('input', function(e) {
            let input = this.value;
            if (/[D:]$/.test(input)) {
                input = input.substr(0, input.length - 3)
            };
            let splitTime = input.split(' : ').map(function(v) {
                return v.replace(/\D/g, '')
            });
            let output = splitTime.map(function(v, i) {
                return v.length == 2 && i < 2 ? `${v} : ` : v;
            });
            if (output[0]) output[0] = checkValue(output[0], 23, true);
            if (output[1]) output[1] = checkValue(output[1], 59, false);
            this.value = output.join('').substr(0, 7);
            console.log(output)
        });
    }
})();