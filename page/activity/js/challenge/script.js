/*

  In this assignmenmt you are given a list of student names. The challenge
  is to pair students by how similar their names are in edit distance.
  The pairing algorithm  pseudocode is:

  sort the students by last name (A to Z)
  while there is > 1 unpaired student
    X = the first unpaired student
    if X's first name begins with a vowel
      compute the Hamming distance to all other unpaired students

    if X's first name begins with a consonant
      compute the Levenshtein distance to all other unpaired students

    pair X with the most similar name, Y (ie shortest edit distance). If there
    is a tie in edit distance, sort the results by last name (A...Z) and
    take the first.

    remove X and Y from the list of unpaired students.


  to help you, you are provided with the scripts:
    levenshtein.js and hamming.js

  **THERE IS CURRENTLY A NAMING CONFLICT, solve this by wrapping each
    provided distance funciton the JavaScirpt namespace-like construct of your choice.

    YOU CANNOT SIMPLY RENAME the distance functions!
    YOU CANNOT MODIFY THE distance functions IN ANY WAY other than
    to implement your namespace construct!

    I suggest putting each in it's own unique object so in your main
    code you can write:
     hamming.distance(a,b)
      or
     levenshtein.distance(a,b)
 */
window.onload = () => {
  var DEBUG = false;

  var names = ['Jordan Voves', 'Keller Chambers', 'Stefano Cobelli',
    'Jenna Slusar', 'Jason Corriveau', 'Cole Whitley', 'Dylan Zucker',
    'Danny Toback', 'Eric Marshall', 'Allan La', 'Natalie Altman',
    'Evan Harrington', 'Jack Napor', 'Jingya Wu', 'Christian Ouellette',
    'Junjie Jiang', 'Morgan Muller', 'Sarah Xu', 'Aleksandar Antonov',
    'Parker Watson', 'Haipu Sun', 'Ryan Pencak', 'Dan Kershner',
    'John Venditti', 'Jacob Mendelowitz', 'Dunni Adenuga', 'Jeff Lee',
    'Uttam Kumaran', 'Jack Hall-Tipping'];


  /* STEP 1: SORT NAMES by LAST NAME! */

  // Grab the last name
  function lastname(name) {
    var split = name.split(' ');
    return split[split.length - 1];
  }

  // Sort names in alphabetical order by last name
  var sortedNames = names.sort(function(a, b) {
    var lA = lastname(a);
    var lB = lastname(b);
    if (lA < lB) {
      return -1;
    } else if (lA > lB) {
      return 1;
    }
    return 0;
  });

  var pairList = document.getElementById('pair-root');
  console.log(pairList);

  /* WHILE > 1 students are UNPAIRED
     take 1st student, compute distance to all others,
      pair with lowest score.
      */

  // Declare instances of distance classes
  var levenshtein = new Levenshtein();
  var hamming = new Hamming();

  var studentPairs = {};

  while (sortedNames.length > 0) {

  // Grab first student
    var currentStudent = sortedNames[0];

    // Remove student from array
    sortedNames.splice(0, 1);

    // Set default value for lowest distance
    var lowestDistance = {
      name: '',
      distance: 0
    };

    if (DEBUG) {
      console.log('Checking ' + currentStudent + ' against ' + sortedNames.length + ' others');
    }

    // Iterate over all remaining items
    sortedNames.forEach((name, idx) => {
    // Set default value for cached distance
      var distance = {
        name: '',
        distance: 0
      };

      if (DEBUG) {
        console.log(' ' + (idx + 1) + '. Checking against ' + name);
      }

      // If the name starts with a vowel, use hamming distance, otherwise use levenshtein
      if (/^[AEIOU].+/.test(name)) {
        if (DEBUG) {
          console.log('    Starts with a vowel (Hamming distance)');
        }
        distance = {
          name,
          distance: hamming.distance(currentStudent, name)
        };
      } else {
        if (DEBUG) {
          console.log('    Starts with a consonant (Levenshtein distance)');
        }
        distance = {
          name,
          distance: levenshtein.distance(currentStudent, name)
        };
      }
      if (DEBUG) {
        console.log('    Distance is ' + distance.distance);
      }

      // If the new distance is less, replace the shortest one (greedy algorithm)
      if (distance.distance < lowestDistance.distance || lowestDistance.name === '') {
        lowestDistance = {
          name,
          distance: distance.distance
        };
      } else if (distance.distance === lowestDistance.distance) {
        lowestDistance.name = (lastname(lowestDistance.name) < lastname(distance.name)) ? lowestDistance.name : distance.name;
      }
    });

    // Remove the name
    sortedNames.splice(sortedNames.indexOf(lowestDistance.name), 1);
    if (DEBUG && lowestDistance.name !== '') {
      console.log(lowestDistance.name + ' removed ' + (sortedNames.indexOf(lowestDistance.name) === -1 ? 'successfully' : 'unsuccessfully'));
    }
    studentPairs[currentStudent] = lowestDistance;

    var div = document.createElement('div');
    // Log the pair and distance
    if (lowestDistance.name !== '') {
      div.appendChild(document.createTextNode(currentStudent + ' ←' + lowestDistance.distance + '→ ' + lowestDistance.name));
      // console.log(currentStudent + ' is paired with ' + lowestDistance.name + ' (Distance: ' + lowestDistance.distance + ')');
    } else {
      div.appendChild(document.createTextNode(currentStudent + ' is unpaired'));
    }
    pairList.appendChild(div);
  }
};
