// Make sure the variables don't spill out of scope
(() => {

  // Describe if an animation is currently happening
  var animating = false;


  /**
   * Wrapper around the Font Awesome image icon
   * @returns {element} The element with the icon
   */
  function photoIcon() {
    var i = document.createElement('i');
    i.className = 'fa fa-image';
    return i;
  }


  /**
   * Capitalize the first
   * @param {string} text The text to capitalize the first letter of
   * @param {string} prefix The text to prepend
   * @param {string} postfix The text to append
   * @returns {string} The text result
   */
  function titleify(text, prefix = '    ', postfix = '') {
    return prefix + text.charAt(0).toUpperCase() + text.slice(1) + postfix;
  }


  /**
   * Waits for the trigger to be true, polling every 5 ms, then runs cb
   * @param {function} trigger A function that returns true when a task is
                               complete - used to test an updating boolean
   * @param {function} cb A callback to be run when the trigger is released
   * @returns {any} null or the result of the callback
   */
  function waitUntil(trigger, cb) {
    var waitTimer = setInterval(() => {
      if (trigger()) {
        clearInterval(waitTimer);
        return cb();
      }
      return null;
    }, 5);
  }


  /**
   * Fades the image out or in. When the image is faded out, fades in the
   * animated loader
   * @param {string} inOut A string defining whether the image is fading in or
   *                       out
   * @returns {null} Null
   */
  function fadeImg(inOut = 'in') {
    animating = true;

    // Find elements to modify
    var ldr = document.getElementById('loader');
    var img = document.getElementById('img-root');

    // Modifiers for direction
    var mod = inOut === 'in' ? 1 : -1;
    var imgOpacity = inOut === 'in' ? 0 : 1;
    var ldrOpacity = inOut === 'in' ? 1 : 0;

    // Loop with timing until complete
    var timer = setInterval(() => {

      // Update opacities
      imgOpacity += 0.02 * mod;
      ldrOpacity -= 0.02 * mod;
      img.style.opacity = imgOpacity;
      ldr.style.opacity = ldrOpacity;

      // When finished, stop
      if ((inOut === 'in') ? imgOpacity >= 1 : ldrOpacity >= 1) {
        animating = false;
        clearInterval(timer);
      }
    }, 5);
  }


  /**
   * Return a function to pull an image from the backend (with animation!)
   * @param {string} breed The breed of dog
   * @returns {function} A function to be used in an onclick
   */
  function retrieveImage(breed) {
    return () => {
    // Find elements to modify
      var img = document.getElementById('img-root');

      // Wait for any running animations to finish
      waitUntil(
        () => !animating,
        () => fadeImg('out')
      );

      // begin retrieving image
      fetch('https://dog.ceo/api/breed/' + breed + '/images/random')
        .then(response => response.json()) // Unwrap response json
        .then(json => {
          // Handle any errors received
          if (json.status !== 'success') {
            throw new Error('Error status returned: ' + json.status);
          }
          // Pull out the message
          return json.message;
        })
        .then(link => {
          // Wait for any running animations to finish
          waitUntil(
            () => !animating,
            () => {
              img.src = link;
              img.onload = () => fadeImg('in');
            }
          );
        })
        .catch((err) => {
          console.error(err.message);
        });
    };
  }

  /**
   * Toggles whether or not the children of a breed are shown. Used as an
   * accordion
   * @param {element} elem The element whose children should hide/show
   * @param {string} newDisplay The display type for the child elements
   * @returns {Null} Null
   */
  function toggleChildDisplay(elem, newDisplay = 'inline') {
    return () => {
      elem.childNodes[0].childNodes[0].data = (elem.childNodes[0].childNodes[0].data === '▸') ? '▾' : '▸';
      const child = elem.childNodes[1];
      if (child.style) {
        child.style.display = (child.style.display === 'none') ? newDisplay : 'none';
      }
    };
  }

  /**
   * Builds the link or sublist for each breed
   * @param {string} breed The primary breed
   * @param {string} subBreed The sub-breed
   * @returns {element} An HTML element which will request an image when clicked
   */
  function breedLink(breed, subBreed = '') {
    var div = document.createElement('div');
    div.appendChild(photoIcon());
    if (subBreed !== '') {
      div.appendChild(document.createTextNode(titleify(subBreed)));
    } else {
      div.appendChild(document.createTextNode(titleify(breed)));
    }
    div.onclick = retrieveImage(breed + ((subBreed === '') ? '' : '/') + subBreed);
    return div;
  }


  /**
   * Sublist of a each breed
   * @param {string} breed The primary breed
   * @param {string} subBreeds The list of sub-breeds
   * @returns {element} An HTML element that represents the structure of the
   *                    sub-breeds
   */
  function listSubBreeds(breed, subBreeds) {
    var ul = document.createElement('ul');
    subBreeds.forEach(subBreed => {
      var li = document.createElement('li');
      li.appendChild(breedLink(breed, subBreed));
      ul.appendChild(li);
    });
    ul.style.display = 'none';
    return ul;
  }


  /**
   * Builds the accordion of a single breed and its sub-breeds
   * @param {string} breed The primary breed
   * @param {string} subBreeds The list of sub-breeds
   * @returns {element} An HTML element that represents the structure of the
   *                    breed/sub-breeds
   */
  function subBreedDropdown(breed, subBreeds) {
    var div = document.createElement('div');

    // Build super-breed dropdown
    var subDiv = document.createElement('div');
    subDiv.appendChild(document.createTextNode('▸'));
    subDiv.appendChild(document.createTextNode(' ' + breed.charAt(0).toUpperCase() + breed.slice(1)));
    subDiv.onclick = toggleChildDisplay(div, 'block');

    // Add title node and sublist
    div.appendChild(subDiv);
    div.appendChild(listSubBreeds(breed, subBreeds));
    return div;
  }

  /**
   * Builds the link or sublist for each breed
   * @param {string} breed The primary breed
   * @param {string} subBreeds The list of sub-breeds
   * @returns {element} An HTML element that represents the structure of the
   *                    breed (and sub-breeds if applicable)
   */
  function buildBreedList(breed, subBreeds) {
    var div = document.createElement('div');
    if (subBreeds.length === 0) {
      div.appendChild(breedLink(breed));
    } else {
      div.appendChild(subBreedDropdown(breed, subBreeds));
    }
    return div;
  }


  // Retrieve all breeds
  fetch('https://dog.ceo/api/breeds/list/all')
    .then(response => response.json())
    .then(json => {
      // Handle any errors received
      if (json.status !== 'success') {
        throw new Error('Error status returned: ' + json.status);
      }
      // Pull out the message
      return json.message;
    })
    .then(breeds => {
      // Put everything into the root for the list
      var root = document.getElementById('list-root');

      // Map all breeds into the correct structure
      Object.keys(breeds).forEach(breed => {
        root.appendChild(buildBreedList(breed, breeds[breed]));
      });
    })
    .catch((err) => {
      console.error(err.message);
    });
})();
