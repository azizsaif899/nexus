// This line executes the module loader, populating the global GAssistant object
const GAssistant = require('./load-modules.js');

// We need to access jest.fn, which is on the global scope thanks to Jest
const { jest } = require('@jest/globals');

describe('System.Accounting.Ledger', () => {
    // Before each test, we mock the getSheet utility to isolate our test
    beforeEach(() => {
        GAssistant.System.Utils.getSheet = jest.fn(() => ({
            appendRow: jest.fn(),
        }));
    });

    it('should correctly post a balanced journal entry', () => {
        const { Ledger } = GAssistant.System.Accounting;
        
        // The mock is already set up in beforeEach, but we can grab a reference to it
        const mockSheet = { appendRow: jest.fn() };
        GAssistant.System.Utils.getSheet.mockReturnValue(mockSheet);

        const entryData = {
            date: new Date(),
            description: 'Test Sale',
            entries: [
                { accountId: '110', type: 'debit', amount: 100 },
                { accountId: '400', type: 'credit', amount: 100 },
            ],
        };

        const result = Ledger.postJournalEntry(entryData);

        // Assertions
        expect(result.success).toBe(true);
        expect(GAssistant.System.Utils.getSheet).toHaveBeenCalledWith('GeneralLedger', ['Date', 'Description', 'AccountID', 'Debit', 'Credit']);
        expect(mockSheet.appendRow).toHaveBeenCalledTimes(2);
        expect(mockSheet.appendRow).toHaveBeenCalledWith([entryData.date, 'Test Sale', '110', 100, '']);
        expect(mockSheet.appendRow).toHaveBeenCalledWith([entryData.date, 'Test Sale', '400', '', 100]);
    });

    it('should return undefined for an unbalanced journal entry', () => {
        const { Ledger } = GAssistant.System.Accounting;

        const entryData = {
            date: new Date(),
            description: 'Unbalanced Test',
            entries: [{ accountId: '110', type: 'debit', amount: 100 }, { accountId: '400', type: 'credit', amount: 99 }],
        };
        
        const result = Ledger.postJournalEntry(entryData);
        
        // Assuming Utils.executeSafely catches the error and returns nothing.
        expect(result).toBeUndefined();
    });
});