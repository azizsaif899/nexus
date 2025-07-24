/**
 * @file 10_ui/1_ui_entry.js
 * @description
 * Defines global functions that act as entry points for UI actions,
 * such as menu items. This is a best practice for the Apps Script environment
 * to ensure functions are accessible from the UI.
 */

/**
 * Global function to be called by the menu item to show the developer sidebar.
 */
function showDeveloperSidebar() {
    GAssistant.Utils.executeSafely(() => {
        const { DeveloperSidebar } = GAssistant.Utils.Injector.get('System.UI.DeveloperSidebar');
        DeveloperSidebar.showDeveloperSidebar();
    }, 'showDeveloperSidebar');
}