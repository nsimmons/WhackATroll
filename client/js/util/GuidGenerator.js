// Generates an rfc4122 version 4 compliant GUID.
// Original source from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript

define([], function() {

    function GuidGenerator() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    return GuidGenerator;
});