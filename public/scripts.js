window.onload = (function() {
    const time = document.querySelectorAll('.time');
    const lunchTime = document.querySelector('.lunchTime');

    function checkValue(str, max, check) {
        if (check === 'hour') {
            return str[0] > 2 ? `0${str} : ` : str;
        };
        if (check === 'lunch') {
            return str[0] > 0 ? `0${str} : ` : str;
        };
        if (str.length > 2) {
            str = str.substring(0, 2);
            return +str < max ? `${str} : ` : `${max} : `;
        } else return str;
    };

    function validator(input) {
        if (input.value.length < 7) {
            input.style.border = '1px solid red';
        } else {
            input.style.border = '1px solid #91E3CE';
        };
    };

    function handler(input, test) {
        if (/[\D:]$/.test(input)) {
            input = input.substr(0, input.length - 3);
        };
        let splitTime = input.split(' : ').map(function(v) {
            return v.replace(/\D/g, '');
        });
        let output = splitTime.map(function(v, i) {
            return v.length == 2 && i < 2 ? `${v} : ` : v;
        });
        if (output[0]) output[0] = checkValue(output[0], 23, test);
        if (output[1]) output[1] = checkValue(output[1], 59, false);
        return output.join('').substr(0, 7);
    };

    for (timeInput of time) {
        timeInput.addEventListener('input', function(e) {
            this.value = handler(this.value, 'hour');
            validator(this);
        });
    };
    lunchTime.addEventListener('input', function(e) {
        this.value = handler(this.value, 'lunch');
        validator(this);
    });
})();