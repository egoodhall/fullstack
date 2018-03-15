// 1 GET ELEMENTs
// console.log(document.getElementById("title"));

// console.log(document.querySelector(".clickable"))

// console.log(document.querySelectorAll(".clickable"))

// document
//   .getElementById("content")
//   .textContent = "Click the button!"

// 2 EVENTS
function handleButtonClick(event) {

  // console.log(event)

  // get the value of the input box
  var fname = document
    .getElementById('fname-input')
    .value;
  var lname = document
    .getElementById('lname-input')
    .value;

  if (name === '') {
    document
      .getElementById('content')
      .textContent = 'Click the button!';
  } else {
    var message = '<h2>Hello ' + fname + ' ' + lname + '!</h2>';

    document
      .getElementById('content')
      .textContent = message;

    document
      .getElementById('content')
      .innerHTML = message;
  }
}

// 3 Unobtrusive JS

function loaded() {
  console.log('DOM loaded, adding event listeners');
  document
    .getElementById('login-btn')
    .addEventListener('click', handleButtonClick);
}
document
  .getElementById('fname-input')
  .onkeyup = handleButtonClick;

// 4 watch my mouse
// document
//   .querySelector("body")
//   .addEventListener('mousemove', function (evt) {
//     console.log(evt.clientX, evt.clientY)
//   })

// 5 DOMContentLoaded

document.addEventListener('DOMContentLoaded', loaded);

function fadeIn(element, duration = 1000) {
  var opacity = 0;
  var timer = setInterval(() => {
    if (element.style.opacity < 1) {
      console.log('Fading in');
      opacity += 0.01;
      element.style.opacity = opacity;
    } else {
      console.log('Finished fading in');
      clearInterval(timer);
    }
  }, duration * 0.01);
}

window.onload = (evt) => {
  console.log('Document loaded');
  var body = document.body;
  fadeIn(document.body, 1000);
  var timer = setInterval(() => {
    clearInterval(timer);
    console.log('5s');
  }, 1000);
};

if (name === 'student') {
  // querySelector uses a CSS selector! returns the first matching element
  var title = document
    .querySelector('#title')
    .textContent;
  title += ' & query selector';
  document
    .querySelector('h1')
    .textContent = title;
}

// }

document
  .addEventListener('DOMContentLoaded', function(event) {
    console.log('DOM loaded!');
    document
      .querySelector('button')
      .onclick = handleButtonClick;

    document
      .querySelector('body')
      .onmousemove = function(evt) {
        if (evt.shiftKey) {
          console.log('(' + evt.clientX + ', ' + evt.clientY + ') ' + evt.buttons);
        }
      };
  });
