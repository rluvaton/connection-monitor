const terminal = require('./terminal-print');

const TYPES = {
    TERMINAL: 'terminal'
};

module.exports = {
    TYPES,
    /**
     * Get print from name
     * @param {string} name One of the types
     * @return
     */
    factory: (name) => {
        switch (name) {
            case TYPES.TERMINAL:
                return terminal;
            default:
                throw new Error(`No print dest with that name (${name})`)
        }
    }
}
