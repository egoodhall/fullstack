// Make sure the variables don't spill out of scope
(() => {

  // Describe if an animation is currently happening
  var animating = false;


  /**
   * Wrapper around the Font Awesome image icon
   */
  function photoIcon() {
    var i = document.createElement('i');
    i.className = 'fa fa-image';
    return i;
  }


  /**
   * Prepare a string for being the breed title
   */
  function titleify(text) {
    return '    ' + text.charAt(0).toUpperCase() + text.slice(1);
  }


  /**
   * Waits for the trigger to be true, polling every 5 ms, then runs cb
   */
  function waitUntil(trigger, cb) {
    var waitUntil = setInterval(() => {
      if (trigger()) {
        clearInterval(waitUntil);
        cb();
      }
    }, 5);
  }


  /**
   * Fades the image out or in. When the image is faded out, fades in the
   * animated loader
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
   */
  function retrieveImage(breed) {
    return () => {
    // Find elements to modify
      var loader = document.getElementById('loader');
      var img = document.getElementById('img-root');

      // Set opacities
      var lOpacity = 0;
      var iOpacity = 1;

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
   * Build a "link" for a given breed or sub-breed
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
   * Build the element list of sub-breeds
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
   * Builds the entire list of breeds
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
      var allBreeds = Object.keys(breeds).map(breed => {
        root.appendChild(buildBreedList(breed, breeds[breed]));
      });
    })
    .catch((err) => {
      console.error(err.message);
    });
})();
