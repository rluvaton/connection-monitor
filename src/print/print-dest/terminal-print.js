const readline = require('readline');

module.exports = {

    clearAll: function() {
        this.seek(0, 0);
        readline.clearScreenDown(process.stdout);
    },

    write: (text) => {
        process.stdout.write(text);
    },

    seek: (x, y) => {
        return readline.cursorTo(process.stdout, x, y);
    },

    /**
     * Clear line
     * @param {module:readline#Direction} direction Direction can be
     *                 -1: to the left from the cursor
     *                 0:  the entire line
     *                 1:  to the right from cursor
     */
    clearLine: (direction) => {
        return readline.clearLine(process.stdout, direction);
    }
}
