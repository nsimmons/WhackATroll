
define(['util/QuickSort'], function(QuickSort) {

    TestCase('QuickSortTest', {

        testSort: function() {
            var unsortedArray = [{a:5},{a:3},{a:1},{a:4}];
            var sortedArray = QuickSort(unsortedArray, 'a');
            assertEquals('Array is not sorted', 1, sortedArray[0].a);
            assertEquals('Array is not sorted', 3, sortedArray[1].a);
            assertEquals('Array is not sorted', 4, sortedArray[2].a);
            assertEquals('Array is not sorted', 5, sortedArray[3].a);
        },

        testEmptyArray: function() {
            var unsortedArray = [];
            var sortedArray = QuickSort(unsortedArray, 'a');
            assertEquals('Array is not empty', 0, sortedArray.length);
        }

    });

});
