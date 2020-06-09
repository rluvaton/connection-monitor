const {table} = require('table');
const chalk  = require('chalk');
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

    this._createReadyTableFn = this._createReadyTableFn({withHeaders, rowLength, withColors, useAsciiChars, useWindowsCMDColors});
    this._setTableWithMatrix();

    this._updateTable();
}

TablePrint.prototype._setTableWithMatrix = function () {
    this._table = this._createReadyTableFn(this._matrix);
}

TablePrint.prototype._createReadyTableFn = function ({withHeaders, rowLength, withColors, useAsciiChars, useWindowsCMDColors}) {
    const tableOptions = {};
    let headerStyleFn = header => chalk.bold(chalk.cyan(header));

    if (useWindowsCMDColors) {
        // By default is Windows CMD color
    } else if (!withColors) {
        headerStyleFn = header => header;
    }

    if (useAsciiChars) {
        tableOptions.border = {
            topBody: '-',
            topJoin: '+',
            topLeft: '+',
            topRight: '+',

            bottomBody: '-',
            bottomJoin: '+',
            bottomLeft: '+',
            bottomRight: '+',

            bodyLeft: '|',
            bodyJoin: '|',
            bodyRight: '|',

            joinRight: '+',
            joinBody: '-',
            joinJoin: '+',
            joinLeft: '+',
        };
    }

    return (matrix) => {
        if (withHeaders) {
            matrix = [
                matrix[0].map(headerCell => headerStyleFn(headerCell)),
                ...(matrix.slice(1))
            ];
        }
        return table(matrix, tableOptions);
    };
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

    this._currTableFormattedString = this._table;

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
    if (this._matrix[row + 1][col] === value) {
        // Don't refresh for nothing
        return false;
    }
    this._matrix[row + 1][col] = value;
    this._table = this._createReadyTableFn(this._matrix);
    if (refresh) {
        this.refresh();
    }
    return true;
}

module.exports = TablePrint;
