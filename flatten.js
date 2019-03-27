/*
 *
 * Array.prototype.flatten()
 *
 * Flatten an array of arbitrarily nested arrays into a flat array
 * e.g. [[1,2,[3]],4].flatten(); will return [1,2,3,4]
 *
 * This method tries to create a unique key for each array that it
 * finds so that it can quickly find circular references and throw
 * an error to prevent infinite recursion.
 *
 * This method first counts all of the values in the source array
 * before initializing a new array of said size. This is purely for
 * better efficiency since it's always more efficient to initialize
 * an array with a predetermined size than repeatedly resize an array.
 *
 * 
 *
 */

Array.prototype.flatten = function() {
	var parents, size, count, flat, copy;// initialize variables.
	if (this && this.constructor===Array) {// Source is an array
		if (this.length) {// length > 0
			parents = {};// This object will be used to help look for circular references.
			size = 0;
			count = function(array) {// This function counts the number of elements by incrementing size
				var key, i;
				// Create hash key for this array to compare to other keys to check for circular references.
				key = array.length+(array[0] && array[0].constructor===Array?
					'-'+array[0].length:
					':'+String(array[0])
				)+(array[array.length-1] && array[array.length-1].constructor===Array?
					'-'+array[array.length-1].length:
					':'+String(array[array.length-1])
				);
				if (parents[key]) {// key collision
					i = parents[key].length;// Start at end of array.
					while (i--) {// Check for circular reference by looping through parent arrays with same key.
						if (array===parents[key][i]) {// circular reference found!
							throw "This array cannot be flattened because it contains a circular reference.";
						}
					}
					parents[key].push(array);// This array is a parent while we're looping through it.
				}
				else {
					parents[key] = [array];// This array is a parent while we're looping through it.		
				}
				i = array.length;// Get the length of the array.
				size+= i;// And increment size.
				while (i--) {// Loop backwards to 0 and search for nested arrays.
					if (array[i]!=null && array[i].constructor===Array) {// Nested array found
						size--;// Since an array itself isn't counted as an element, decrement size.
						if (array[i].length) {// This array contains values so it cannot be ignored.
							count(array[i]);// Recursively call count() on the nested array.
						}
					}
				}
				parents[key].pop();// Done with loop. Remove this array from parents array.
			};
			count(this);// Begin counting source array.
			flat = new Array(size);// Initialize a new array of length size.
			copy = function(array) {// This function copies the source values to the newly created array.
				var i = array.length;
				while (i--) {// loop backwards to 0
					if (array[i]==null || array[i].constructor!==Array) {// Item is not an array
						// Decrement index pointer and copy value.
						flat[--size] = array[i];// The size variable is acting as the index in the new array.
					}
					else if (array[i].length) {// Item is an array with length > 0 so it cannot be ignored.
						if (i) {
							copy(array[i]);// recursively call copy() on the nested array.
						}
						else {// Eliminate tail recursion. This is the last element so we don't need a function call.
							array = array[0];// Replace the current array with the nested array.
							i = array.length;// Reset index pointer.
						}
					}
				}
			};
			copy(this);// Begin copying source array.
		}
		return flat || [];// Return the new array with all values now flattened.
	}
};
