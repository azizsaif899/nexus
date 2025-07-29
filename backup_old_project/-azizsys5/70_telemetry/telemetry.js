// *************************************************************************************************
// --- START OF FILE: 70_telemetry/telemetry.gs ---
// *************************************************************************************************

var GAssistant = GAssistant || {};
GAssistant.System = GAssistant.System || {};

defineModule(
  'System.Telemetry',
  ['GAssistant.Utils'],         // قائمة التبعيات
  // أزلنا "use strict" من هنا لتجنّب الخطأ
  ({ Utils }) => {

    const EVENT_LOG_SHEET  = 'Telemetry_Events';
    const METRIC_LOG_SHEET = 'Telemetry_Metrics';

    function trackEvent(source, eventName, details) {
      // استبدل default parameter ببدء قيمة يدوياً
      details = details || {};
      Utils.executeSafely(() => {
        const sheet = Utils.getSheet(EVENT_LOG_SHEET, [
          "Timestamp", "Source", "Event", "Duration (ms)", "Details"
        ]);
        if (!sheet) return;
        sheet.appendRow([
          new Date(),
          source,
          eventName,
          details.durationMs || null,
          JSON.stringify(details)
        ]);
      }, [], `Telemetry.trackEvent[${source}]`);
    }

    function trackMetric(metricName, value, tags) {
      tags = tags || {};
      Utils.executeSafely(() => {
        const sheet = Utils.getSheet(METRIC_LOG_SHEET, [
          "Timestamp", "Metric", "Value", "Tags"
        ]);
        if (!sheet) return;
        sheet.appendRow([
          new Date(),
          metricName,
          value,
          JSON.stringify(tags)
        ]);
      }, [], `Telemetry.trackMetric[${metricName}]`);
    }

    function getRecentEvents(limit) {
      limit = limit || 20;
      return Utils.executeSafely(() => {
        const sheet = Utils.getSheet(EVENT_LOG_SHEET);
        if (!sheet || sheet.getLastRow() < 2) return [];
        const rows = sheet
          .getRange(2, 1, Math.min(limit, sheet.getLastRow() - 1), 5)
          .getValues();
        return rows.map(([ts, src, ev, dur, json]) => ({
          timestamp: ts,
          source: src,
          event: ev,
          durationMs: dur,
          details: Utils.safeParse(json)
        }));
      }, [], 'Telemetry.getRecentEvents');
    }

    function getRecentMetrics(limit) {
      limit = limit || 20;
      return Utils.executeSafely(() => {
        const sheet = Utils.getSheet(METRIC_LOG_SHEET);
        if (!sheet || sheet.getLastRow() < 2) return [];
        const rows = sheet
          .getRange(2, 1, Math.min(limit, sheet.getLastRow() - 1), 4)
          .getValues();
        return rows.map(([ts, name, value, json]) => ({
          timestamp: ts,
          metric: name,
          value: value,
          tags: Utils.safeParse(json)
        }));
      }, [], 'Telemetry.getRecentMetrics');
    }

    return {
      trackEvent,
      trackMetric,
      getRecentEvents,
      getRecentMetrics
    };
  }
);

// *************************************************************************************************
// --- END OF FILE: 70_telemetry/telemetry.gs ---
// *************************************************************************************************
