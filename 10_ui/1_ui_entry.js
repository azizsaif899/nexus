/**
 * @file 10_ui/1_ui_entry.js
 * @description
 * Defines global functions that act as entry points for UI actions,
 * such as menu items. This is a best practice for the Apps Script environment
 * to ensure functions are accessible from the UI.
 */
/**
 * Global function to be called by the menu item to show the main assistant sidebar.
 */
function showAssistantSidebar() {
    GAssistant.Utils.executeSafely(() => {
        const { UI } = GAssistant.Utils.Injector.get('System.UI');
        UI.showAssistantSidebar();
    }, 'showAssistantSidebar');
}
/**
 * Global function to be called by the menu item to show the developer sidebar.
 */
function showDeveloperSidebar() {
    GAssistant.Utils.executeSafely(() => {
        const { DeveloperSidebar } = GAssistant.Utils.Injector.get('System.UI.DeveloperSidebar');
        DeveloperSidebar.showDeveloperSidebar();
    }, 'showDeveloperSidebar');
}
/**
 * Global function to be called by the menu item to show the enhanced sidebar v3.
 */
function showEnhancedSidebarV3() {
    GAssistant.Utils.executeSafely(() => {
        const { EnhancedSidebarV3 } = GAssistant.Utils.Injector.get('System.UI.EnhancedSidebarV3');
        EnhancedSidebarV3.showEnhancedSidebar();
    }, 'showEnhancedSidebarV3');
}

/**
 * Global function to be called by the menu item to show the system status sidebar.
 */
function showSystemStatus() {
    const html = HtmlService.createHtmlOutputFromFile('StatusSidebar')
        .setTitle('System Status')
        .setWidth(349);
    SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Global functions for enhanced message processing
 */
function initializeEmbeddingService() {
    return GAssistant.Utils.executeSafely(() => {
        const { MessageProcessor } = GAssistant.Utils.Injector.get('System.UI.MessageProcessor');
        return MessageProcessor.initializeEmbeddingService();
    }, 'initializeEmbeddingService');
}

function processEnhancedMessage(message, config) {
    return GAssistant.Utils.executeSafely(() => {
        const { MessageProcessor } = GAssistant.Utils.Injector.get('System.UI.MessageProcessor');
        return MessageProcessor.processEnhancedMessage(message, config);
    }, 'processEnhancedMessage');
}

function performSemanticSearch(query, chatHistory) {
    return GAssistant.Utils.executeSafely(() => {
        const { MessageProcessor } = GAssistant.Utils.Injector.get('System.UI.MessageProcessor');
        return MessageProcessor.performSemanticSearch(query, chatHistory);
    }, 'performSemanticSearch');
}

function updateChatEmbeddings(messages) {
    return GAssistant.Utils.executeSafely(() => {
        const { MessageProcessor } = GAssistant.Utils.Injector.get('System.UI.MessageProcessor');
        return MessageProcessor.updateChatEmbeddings(messages);
    }, 'updateChatEmbeddings');
}

function getEmbeddingStats() {
    return GAssistant.Utils.executeSafely(() => {
        const { MessageProcessor } = GAssistant.Utils.Injector.get('System.UI.MessageProcessor');
        return MessageProcessor.getEmbeddingStats();
    }, 'getEmbeddingStats');
}

function saveChatHistory(history) {
    return GAssistant.Utils.executeSafely(() => {
        const { MessageProcessor } = GAssistant.Utils.Injector.get('System.UI.MessageProcessor');
        return MessageProcessor.saveChatHistory(history);
    }, 'saveChatHistory');
}

function loadChatHistory() {
    return GAssistant.Utils.executeSafely(() => {
        const { MessageProcessor } = GAssistant.Utils.Injector.get('System.UI.MessageProcessor');
        return MessageProcessor.loadChatHistory();
    }, 'loadChatHistory');
}