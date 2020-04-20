module.exports = {
    /**
     * Remove ansi color from string
     * @param text the text to remove from
     * @return {string} The text without the ansi color
     */
    removeAnsiColor: (text) => {
        return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    }
}
