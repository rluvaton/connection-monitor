const Table = require('cli-table3');
const {getTextDiff} = require('./string-diff/');
const {removeAnsiColor} = require('../utils');
const {TYPES, factory} = require('./print-dest/');

const defaultOptions = {
    withHeaders: false,
    printDestType: TYPES.TERMINAL,
    withColors: true,
    useAsciiChars: false,
    useWindowsCMDColors: false
};

/**
 *
 * @param {(string | number | boolean)[][]} matrix
 * @param {{withHeaders, rowLength, printDestType, withColors, useAsciiChars, useWindowsCMDColors}} options
 * @constructor
 * @class
 */
function TablePrint(matrix, options) {
    // Set missing options to be the default ones
    options = {...defaultOptions, ...options}
    const {withHeaders, rowLength, printDestType, withColors, useAsciiChars, useWindowsCMDColors} = options;

    this._printDest = factory(printDestType);

    // Duplicating the matrix
    this._matrix = matrix.map((row) => row.slice(0));

    this._table = this._createTable({withHeaders, rowLength, withColors, useAsciiChars, useWindowsCMDColors});

    this._table.push(...this._matrix);

    this._updateTable();
}

TablePrint.prototype._createTable = function ({withHeaders, rowLength, withColors, useAsciiChars, useWindowsCMDColors}) {
    const tableOptions = {};

    if (withHeaders) {
        tableOptions.head = this._matrix.length >= 1
            // Remove the first row and return it
            ? this._matrix.splice(0, 1)[0]
            : new Array(rowLength).fill('');
    }

    if (useWindowsCMDColors) {
        // colors.red('hello')
        tableOptions.style = {
            ...tableOptions.style,
            head: ['cyan', 'bold']
        }
    } else if (!withColors) {
        tableOptions.style = {
            ...tableOptions.style,
            head: [],  // Disable colors in header cells
            border: [] // Disable colors for the border
        };
    }

    if (useAsciiChars) {
        tableOptions.chars = {
            top: '-',
            'top-mid': '+',
            'top-left': '+',
            'top-right': '+',
            bottom: '-',
            'bottom-mid': '+',
            'bottom-left': '+',
            'bottom-right': '+',
            left: '|',
            'left-mid': '+',
            right: '|',
            'right-mid': '+',
            mid: '-',
            'mid-mid': '+',
            middle: '|',
        };
    }

    return new Table(tableOptions);
}

/**
 * Update table
 * @return {[string, string]} Return array that contain the previous table string:
 *                            1st item is the table string and the 2nd is the formatted one
 * @private
 */
TablePrint.prototype._updateTable = function () {
    const prevTableStr = this._currTableString;
    const prevTableFormattedStr = this._currTableFormattedString;

    this._currTableFormattedString = this._table.toString();

    /**
     * The `process.stdout.write` format the ansi colors into colors
     * and when we testing the difference between the previous version and the new version it calculate with the ansi character make the position wrong in the terminal
     */
    this._currTableString = removeAnsiColor(this._currTableFormattedString);

    return [prevTableStr, prevTableFormattedStr];
}

TablePrint.prototype.print = function () {
    this._printDest.clearAll();

    this._printDest.write(this._currTableFormattedString);
}

TablePrint.prototype.refresh = function () {
    const [prevTableStr] = this._updateTable();

    const diff = getTextDiff(prevTableStr, this._currTableString);

    diff.add.forEach(({line, text, isNewLine, start}) => {
        this._printDest.seek(isNewLine ? 0 : start, line);
        this._printDest.write(text);
    });

    diff.remove.forEach(({line, fullLine, start}) => {
        this._printDest.seek(fullLine ? 0 : start, line);
        this._printDest.clearLine(fullLine ? 0 : 1);
    });

    diff.replace.forEach(({line, text, start}) => {
        this._printDest.seek(start, line);
        this._printDest.write(text);
    });
}


TablePrint.prototype.update = function (row, col, value, refresh = true) {
    if (this._table[row][col] === value) {
        // Don't refresh for nothing
        return false;
    }
    this._table[row][col] = value;
    if (refresh) {
        this.refresh();
    }
    return true;
}

module.exports = TablePrint;
