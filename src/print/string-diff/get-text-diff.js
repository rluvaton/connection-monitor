const TextDiffResult = require('./text-diff-result');


module.exports = {
    /**
    * Get Diff Text
    * @param {string} oldText
    * @param {string} newText
    * @returns {TextDiffResult}
    */
    getTextDiff: (oldText, newText) => {
        const result = new TextDiffResult();

        const oldTextLines = oldText.split('\n');
        const newTextLines = newText.split('\n');

        // newTextLines.length is .length without -1 because -1 is the last line we only want the line after that
        for (let i = newTextLines.length; i < oldTextLines.length - 1; i++) {
            result.addToRemove(i, true);
        }

        // oldTextLines.length is .length without -1 because -1 is the last line we only want the line after that
        for (let i = oldTextLines.length; i < newTextLines.length - 1; i++) {
            result.addToAdd(i, newTextLines[i], true);
        }

        const minRowsLength = Math.min(oldTextLines.length, newTextLines.length);

        let minColsLength;
        let oldTextRow;
        let newTextRow;

        let startIndex = -1;
        let endIndex = -1;

        // We loop until the minium of the rows because we already took care of other lines before
        for (let row = 0; row < minRowsLength; row++) {
            oldTextRow = oldTextLines[row];
            newTextRow = newTextLines[row];

            if (newTextRow.length < oldTextRow.length) {
                // If the NEW line have LESS character that the OLD line we need to REMOVE the remain characters
                result.addToRemove(row, false, newTextRow.length, oldTextRow.length);
            } else if (newTextRow.length > oldTextRow.length) {
                // If the NEW line have MORE character that the OLD line we need to ADD the remain characters
                result.addToAdd(row, newTextRow.substring(oldTextRow.length), false, oldTextRow.length, newTextRow.length)
            }

            // We loop until the minium of the columns because we already took care of the rest of the line
            minColsLength = Math.min(oldTextRow.length, newTextRow.length);
            for (let col = 0; col < minColsLength; col++) {
                if (oldTextRow[col] !== newTextRow[col]) {
                    if (startIndex === -1) {
                        startIndex = col;
                    }

                    endIndex = col + 1;
                } else if (startIndex === -1) {
                    // No previous difference 
                } else {
                    // Finish the difference
                    result.addToReplace(row, newTextRow.substring(startIndex, endIndex), startIndex, endIndex);

                    // Clean for next time
                    startIndex = endIndex = -1;
                }
            }

            // The row finished and the different is until the end of the minimum length
            if (startIndex !== -1) {
                // Finish the difference
                result.addToReplace(row, newTextRow.substring(startIndex, endIndex), startIndex, endIndex);

                // Clean for next time
                startIndex = endIndex = -1;
            }
        }

        return result;
    }
};
