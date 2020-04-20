
/**
 * An Add object
 * @typedef {Object} TextDiffResultAdd
 * @property {number} line - The line number that been added
 * @property {string} text - The text that been added
 * @property {boolean} isNewLine - If the addition is completely new line or in existing line
 * @property {number} start - The start index of the addition
 * @property {number} end - The ending index of the addition
 */

/**
 * An Remove object
 * @typedef {Object} TextDiffResultRemove
 * @property {number} line - The line number that been remove
 * @property {boolean} fullLine - If the remove is removing the whole line or part of the existing line
 * @property {number} start - The start index of the remove (if #fullLine is true than this will be -1)
 * @property {number} end - The text that been remove (if #fullLine is false than this will be -1)
 */

/**
 * An Replace object
 * @typedef {Object} TextDiffResultReplace
 * @property {number} line - The line number that the text is been replaced
 * @property {string} text - The text that been replaced to
 * @property {number} start - The start index of the replacement
 * @property {number} end - The end index of the replacement
 */

/**
 * Text diff result (the result of the getTextDiff function)
 * @class
 * @constructor
 * @param {{add: TextDiffResultAdd[], remove: TextDiffResultRemove[], replace: TextDiffResultReplace[]}} defaultValues Default values in the text diff result
 * @param {TextDiffResultAdd[]} defaultValues.add What should be added
 * @param {TextDiffResultRemove[]} defaultValues.remove What should be removed
 * @param {TextDiffResultReplace[]} defaultValues.replace What should be replaces
 */
function TextDiffResult({ add, remove, replace } = { add: [], remove: [], replace: [] }) {

    /**
     * All add objects
     * @name TextDiffResult#add
     * @type {TextDiffResultAdd[]}
     */
    this.add = add || [];

    /**
     * All remove objects
     * @name TextDiffResult#remove
     * @type {TextDiffResultRemove[]}
     */
    this.remove = remove || [];


    /**
     * All replace objects
     * @name TextDiffResult#replace
     * @type {TextDiffResultReplace[]}
     */
    this.replace = replace || [];
}

/**
 * Add to result new remove object
 * @param {number} line
 * @param {boolean} fullLine
 * @param {number} start
 * @param {number} end
 * @memberof TextDiffResult
 */
TextDiffResult.prototype.addToRemove = function (line, fullLine, start = -1, end = -1) {
    fullLine = fullLine || false;
    this.remove.push(Object.assign({ line, fullLine }, fullLine ? {} : { start, end }));
}

/**
 * Add to result new Add object
 * @param {number} line
 * @param {string} text
 * @param {boolean} isNewLine
 * @param {number} start
 * @param {number} end
 * @memberof TextDiffResult
 */
TextDiffResult.prototype.addToAdd = function (line, text, isNewLine, start = -1, end = -1) {
    isNewLine = isNewLine || false;
    this.add.push(Object.assign({ line, text, isNewLine }, isNewLine ? { start: 0, end: text.length } : { start, end }));
}

/**
 * Add to result new Replace object
 * @param {number} line
 * @param {string} text
 * @param {number} start
 * @param {number} end
 * @memberof TextDiffResult
 */
TextDiffResult.prototype.addToReplace = function (line, text, start, end) {
    this.replace.push({ line, text, start, end });
}

module.exports = TextDiffResult;
