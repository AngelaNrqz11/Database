// with .exports this current date.js module will export its equivalent value or function.
// in javascript objects, when adding parenthesis after a function name, you are executing the function
// getDate function has no parenthesis so we can allow app.js (parent module) to determine when to invoke the function.
// Anonymous Function bound to getDate object
exports.getDate = function () {
    // Sample: Wed Aug 04 2021 13:45:50 GMT+0800 (China Standard Time)
    const date = new Date();

    // object "options" is a time format for parameter options (line 19) using styles.
    const options = {
        month: "long",
        day: "2-digit",
        year: "numeric",
        weekday: "long",
    };
    return date.toLocaleDateString("en-US", options);
};

exports.getDay = function () {
    const date = new Date();
    const options = {
        weekday: "long",
    };

    return date.toLocaleDateString("en-US", options);
};
