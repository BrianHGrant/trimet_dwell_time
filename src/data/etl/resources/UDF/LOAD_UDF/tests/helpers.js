//helper function for array equality
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// helper function to check type of object
function type(x) { // does not work in general, but works on JSONable objects we care about... modify as you see fit
    // e.g.  type(/asdf/g) --> "[object RegExp]"
    return typeof x;
}

// exports included for mocha testing
if (typeof module !== 'undefined' && module.exports != null) {
    exports.arraysEqual = arraysEqual;
    exports.type = type;
}
