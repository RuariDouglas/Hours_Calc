window.onload = (function () {
  const time = document.querySelectorAll(".time");
  const lunchTime = document.querySelector(".lunchTime");
  const dateInput = document.querySelector(".date");

  function checkValue(str, max, check) {
    if (str.length > 2) {
      str = str.substring(0, 2);

      return +str < max ? `${str} : ` : `${max} : `;
    } else return str;
  }
  function checkDate(date, max) {
    let strDate = date.toString();
    if (strDate.length > 2) {
      strDate = strDate.substring(0, 2);
      return +strDate;
    }
    if (date < 1 || isNaN(date)) {
      return "";
    }
    if (date > max) {
      return 31;
    }
    return date;
  }

  function validator(input) {
    if (input.value.length < 7) {
      input.style.border = "1px solid red";
    } else {
      input.style.border = "1px solid #91E3CE";
    }
  }

  function handler(input, test) {
    if (/[\D:]$/.test(input)) {
      input = input.substr(0, input.length - 3);
    }
    let splitTime = input.split(" : ").map(function (v) {
      return v.replace(/\D/g, "");
    });
    let output = splitTime.map(function (v, i) {
      return v.length == 2 && i < 2 ? `${v} : ` : v;
    });
    if (output[0]) output[0] = checkValue(output[0], 23);
    if (output[1]) output[1] = checkValue(output[1], 59);
    return output.join("").substr(0, 7);
  }

  for (timeInput of time) {
    timeInput.addEventListener("input", function (e) {
      this.value = handler(this.value, "hour");
      validator(this);
    });
  }
  lunchTime.addEventListener("input", function (e) {
    this.value = handler(this.value, "lunch");
    validator(this);
  });
  dateInput.addEventListener("input", function () {
    this.value = checkDate(this.value, 31);
  });
})();
