describe('Get Text Diff', () => {
    describe('#getTextDiff', () => {
        const { getTextDiff } = require('./get-text-diff');
        const TextDiffResult = require('./text-diff-result');

        it('should be defined', () => {
            expect(getTextDiff).toBeDefined();
        });

        describe('One line', () => {
            describe('only one type of change (either add / remove / replace)', () => {
                it('should get the right indexes for the add', () => {
                    const oldText = 'hello how are you';

                    // The added text is ' mate?'
                    const newText = 'hello how are you mate?';

                    const correctTextDiffResult = new TextDiffResult({
                        add: [{
                            line: 0,
                            text: ' mate?',
                            isNewLine: false,
                            start: oldText.length,
                            end: newText.length
                        }],
                        remove: [],
                        replace: []
                    });

                    const diff = getTextDiff(oldText, newText);
                    expect(diff).toEqual(correctTextDiffResult);
                });

                it('should get the right indexes for the remove', () => {
                    const oldText = 'I am good, how are you';

                    // The remove text is ', how are you'
                    const newText = 'I am good';

                    const correctTextDiffResult = new TextDiffResult({
                        add: [],
                        remove: [{
                            line: 0,
                            fullLine: false,
                            start: newText.length,
                            end: oldText.length
                        }],
                        replace: []
                    });

                    const diff = getTextDiff(oldText, newText);
                    expect(diff).toEqual(correctTextDiffResult);
                });

                it('should get the right indexes for the replace', () => {
                    const oldText = 'I am fine!';

                    // The remove text is ', how are you'
                    const newText = 'I am great';

                    const correctTextDiffResult = new TextDiffResult({
                        add: [],
                        remove: [],
                        replace: [{
                            line: 0,
                            text: 'great',
                            start: newText.indexOf('great'),
                            end: newText.length,
                        }]
                    });

                    const diff = getTextDiff(oldText, newText);
                    expect(diff).toEqual(correctTextDiffResult);
                });
            });

            describe('Multiple changes at once', () => {
                it('should get the right indexes for adding and replacing', () => {
                    const oldText = 'What is your name';

                    const newText = 'What is my name mister?';

                    const correctTextDiffResult = new TextDiffResult({
                        add: [{
                            line: 0,
                            text: 'ister?',
                            isNewLine: false,
                            start: oldText.length,
                            end: newText.length
                        }],
                        remove: [],
                        replace: [{
                            line: 0,
                            text: 'my name m',
                            start: newText.indexOf('my'),
                            end: newText.indexOf('my') + 'my name m'.length
                        }]
                    });

                    const diff = getTextDiff(oldText, newText);
                    expect(diff).toEqual(correctTextDiffResult);
                });
            });
        });

        describe('Multiple lines', () => {
            describe('only one type of change (either add / remove / replace)', () => {
                it('should get the right indexes for the add', () => {
                    const oldText = `┌─────────────┬──────────────┬──────────┬────────────┐
│ Name        │ IP           │ Is Alive │ Comment    │
├─────────────┼──────────────┼──────────┼────────────┤
│ Router      │ 192.168.1.1  │ false    │            │
├─────────────┼──────────────┼──────────┼────────────┤
│ Home Server │ 192.168.1.16 │ false    │ Ubuntu     │
├─────────────┼──────────────┼──────────┼────────────┤
│ Local       │ 127.0.0.1    │ false    │ Local Host │
└─────────────┴──────────────┴──────────┴────────────┘`;

                    const newText = `┌─────────────┬──────────────┬──────────┬────────────┐
│ Name        │ IP           │ Is Alive │ Comment    │
├─────────────┼──────────────┼──────────┼────────────┤
│ Router      │ 192.168.1.1  │ true     │            │
├─────────────┼──────────────┼──────────┼────────────┤
│ Home Server │ 192.168.1.16 │ false    │ Ubuntu     │
├─────────────┼──────────────┼──────────┼────────────┤
│ Local       │ 127.0.0.1    │ false    │ Local Host │
└─────────────┴──────────────┴──────────┴────────────┘`;

                    const correctTextDiffResult = new TextDiffResult({
                        add: [],
                        remove: [],
                        replace: [{
                            line: oldText.split('\n').findIndex((line) => line.includes('false')),
                            text: 'true ',
                            start: oldText.split('\n').find((line) => line.includes('false')).indexOf('false'),
                            end: oldText.split('\n').find((line) => line.includes('false')).indexOf('false') + 'false'.length
                        }]
                    });

                    const diff = getTextDiff(oldText, newText);
                    expect(diff).toEqual(correctTextDiffResult);
                });
            });
        });
    });
});
