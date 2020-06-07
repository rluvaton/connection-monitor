module.exports = {
    /**
     * Remove ansi color from string
     * @param text the text to remove from
     * @return {string} The text without the ansi color
     */
    removeAnsiColor: (text) => {
        return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    },

    /**
     * Convert Array to object
     * @param {[]} arr Array to convert
     * @param {function(item): (string | number)} getKey Get key from item fn (default key will be the index)
     * @return {object} the object
     */
    arrToObj: (arr, getKey) => {
        return arr.reduce(function(obj, item, i) {
            obj[getKey ? getKey(item) : i] = item;
            return obj;
        }, {});
    },
}
