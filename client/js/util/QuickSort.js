// STABLE implementation of quick sort to replace unstable Array.sort method in Firefox
// if sorting an array of objects, key = name of object property to compare
// otherwise leave key undefined
// Original source from http://acatalept.com/blog/2008/10/28/stable-quicksort-in-javascript/

define([], function() {

    function QuickSort(arr, key) {

        // return if array is unsortable
        if (arr.length <= 1){
            return arr;
        }

        var less = Array(), greater = Array();

        // select and remove a pivot value pivot from array
        // a pivot value closer to median of the dataset may result in better performance
        var pivotIndex = Math.floor(arr.length / 2);
        var pivot = arr.splice(pivotIndex, 1)[0];

        // step through all array elements
        for (var x = 0; x < arr.length; x++){

            // if (current value is less than pivot),
            // OR if (current value is the same as pivot AND this index is less than the index of the pivot in the original array)
            // then push onto end of less array
            if (
                (
                    !key  // no object property name passed
                        &&
                        (
                            (arr[x] < pivot)
                                ||
                                (arr[x] == pivot && x < pivotIndex)  // this maintains the original order of values equal to the pivot
                            )
                    )
                    ||
                    (
                        key  // object property name passed
                            &&
                            (
                                (arr[x][key] < pivot[key])
                                    ||
                                    (arr[x][key] == pivot[key] && x < pivotIndex)  // this maintains the original order of values equal to the pivot
                                )
                        )
                ){
                less.push(arr[x]);
            }

            // if (current value is greater than pivot),
            // OR if (current value is the same as pivot AND this index is greater than or equal to the index of the pivot in the original array)
            // then push onto end of greater array
            else {
                greater.push(arr[x]);
            }
        }

        // concatenate less+pivot+greater arrays
        return QuickSort(less, key).concat([pivot], QuickSort(greater, key));
    }

    return QuickSort;
});
