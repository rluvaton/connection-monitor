const {Ping, EVENTS} = require('./ping');
const TablePrint = require('./print');
const {arrToObj} = require('./utils');

const COLUMNS = {
    NAME: {text: 'Name', index: 0, key: 'name', defaultValue: ''},
    DESCRIPTION: {text: 'Description', index: 1, key: 'description', defaultValue: ''},
    IP: {text: 'IP', index: 2, key: 'ip', defaultValue: ''},
    IS_ALIVE: {text: 'Is Alive', index: 3, key: 'isAlive', defaultValue: false},
    ADDITIONAL_DATA: {text: 'Additional Data', index: 4, key: 'additionalData', defaultValue: ''},
    ERROR: {text: 'Error', index: 5, key: 'error', defaultValue: ''},
};

const columnsSorted = Object.values(COLUMNS).sort(({index: indexA}, {indexB: indexB}) => indexB - indexA);

/**
 * Parse Headers and rows
 * @param columnsToDisplay
 * @param targets
 * @return {{headers: [], columns: [], rows: []}}
 */
const parseHeadersAndRows = (columnsToDisplay, targets) => {
    // Recreate each column to avoid changing the `columnsSorted` variable
    const columns = columnsSorted.map(obj => ({...obj}))

        // Get only the columns that gonna be displayed
        .filter(({key}) => columnsToDisplay.includes(key));

    if (columns.length === 0) {
        return {columns, headers: [], rows: []};
    }

    let startIndex = 0;

    // Set the indexes to be one after another
    columns.forEach((col) => {
        col.index = startIndex++;
    });

    const headers = columns.map(({text}) => text);

    // Create sorted rows with the wanted columns
    const rows = targets.map((target) => columns.map(({key, defaultValue}) => target[key] || defaultValue));

    return {columns, headers, rows};
}

const startListen = (index, target, columnsObj, tablePrint) => {
    target.pingData.on(EVENTS.DATA, ({isAlive, time, error}) => {
        let changed = false;

        if (columnsObj[COLUMNS.IS_ALIVE.key]) {
            changed = tablePrint.update(index, columnsObj[COLUMNS.IS_ALIVE.key].index, isAlive, false) || changed;
        }

        if (columnsObj[COLUMNS.ADDITIONAL_DATA.key]) {
            changed = tablePrint.update(index, columnsObj[COLUMNS.ADDITIONAL_DATA.key].index, isAlive ? `took ${time}ms` : '', false) || changed;
        }

        if (columnsObj[COLUMNS.ERROR.key]) {
            const errorStr = !isAlive && error && typeof error === 'object' ? error.message || error.response : '';
            changed = tablePrint.update(index, columnsObj[COLUMNS.ERROR.key].index, errorStr, false) || changed;
        }

        if (changed) {
            tablePrint.refresh();
        }
    });

    target.pingData.on(EVENTS.ERROR, (err) => {
        console.error('error for ip', {ip: target.ip, err})
    });

    target.run();
}

const run = (targets, {columnsToDisplay} = {columnsToDisplay: columnsSorted.map(({key}) => key)}) => {
    const {columns, headers, rows} = parseHeadersAndRows(columnsToDisplay, targets);

    const columnsObj = arrToObj(columns, item => item.key);

    const tablePrint = new TablePrint([
        headers,
        ...rows
    ], {withHeaders: true, useAsciiChars: true, useWindowsCMDColors: true});

    tablePrint.print();

    // Redraw table on terminal resize
    process.on("SIGWINCH", () => {
        tablePrint.print();
    });

    const pingTarget = targets.map(({ip}) => new Ping(ip));

    pingTarget.forEach((target, index) => startListen(index, target, columnsObj, tablePrint));
}

module.exports = {run};
