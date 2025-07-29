# تقرير التبعيات البرمجية لمشروع G-Assistant

تم بناء هذا التقرير تلقائيًا من جدول التبعيات `module_manifest.json` بتاريخ 2025-07-20.


## قائمة الموديولات وتبعياتها

---

## ملاحظات تحسينية ذكية

| الملاحظة | الاقتراح |
|-----------|-----------|
| هناك وحدات مثل System.ProjectContextTracker و System.Dispatcher تظهر في التبعيات ولكن غير مذكورة في الجدول | تأكد من إدراجها كوحدات Placeholder أو Modules فعلية في module_manifest.json |
| الموديول GAssistant.Analytics لا يتبع نفس الـ namespace | فكر في توحيده ضمن System.Analytics لتكون كل الوحدات تحت مظلة واحدة—إلا إذا كان intentionally معزولًا كمجال مختلف |
| تم حل تكرار System.AgentDispatcher بفصل المنطق إلى موديولين فرعيين: System.AgentDispatcher.Core (المنطق الأساسي) و System.AgentDispatcher.Legacy (المنطق القديم/التوافقي). |

| اسم الموديول                | الملف                              | التبعيات الرئيسية                                                                 |
|-----------------------------|-------------------------------------|----------------------------------------------------------------------------------|
| System.Utils                | 00_utils.js                         | -                                                                                |
| System.AI                   | 20_ai/_ai_namespace.js               | System.Utils                                                                     |
| System.Tools                | 30_tools/_tools_namespace.js         | -                                                                                |
| System.Memory               | 40_memory/_memory_namespace.js       | -                                                                                |
| System.Agents               | 25_ai_agents/_agents_namespace.js    | -                                                                                |
| System.Tests                | 85_tests/_tests_namespace.js         | -                                                                                |
| System.AgentTriggers        | 25_ai_agents/0_agent_triggers.js     | System.Utils, System.Config                                                      |
| System.ToolsProjectInsights | 30_tools/5_tools_project_insights.js | System.Utils, System.UI, System.AI, System.Config, System.DocsManager            |
| System.DocsManager          | 30_tools/DocsManager.js              | System.Utils, System.Config, System.Telemetry                                    |
| System.Telemetry            | 70_telemetry/telemetry.js            | System.Utils                                                                     |
| System.Config               | 01_config.js                        | System.Utils, System.AI, System.Telemetry                                        |
| System.Intro                | 02_intro.js                         | System.Utils                                                                     |
| System.AI.Core              | 20_ai/5_ai_core.js                   | System.Utils, System.Dialogue, System.Config, System.AI, System.Tools, System.DocsManager, System.Telemetry |
| System.API.Endpoints        | 80_api/api_endpoints.js              | System.Utils, System.AI, System.Tools, System.Telemetry                          |
| System.Code                 | 99_Code.js                          | System.Config, System.UI, System.AI, System.Tools, System.Tests, System.Utils, System.Dispatcher, System.Memory |
| System.UI.Dialogue          | 10_ui/0_ui_dialogue.js               | System.Utils, System.Config, System.DocsManager, System.AI, System.Telemetry     |
| System.UI                   | 10_ui/1_ui.gs.js                     | System.Utils, System.UI.Dialogue, System.Config, System.API, System.Tools, System.AI, System.Telemetry, System.DocsManager |
| System.UI.DeveloperSidebar  | 10_ui/2_ui_developerSidebar.js       | System.Utils, System.Config, System.DocsManager, System.AI, System.Telemetry, System.UI |
| System.AI.Constitution      | 20_ai/0_ai_constitution.js           | System.Config, System.DocsManager, System.AI.LongTermMemory, System.Telemetry, System.Utils |
| System.AI.Memory            | 20_ai/1_ai_memory.js                 | System.Utils, System.Config, System.DocsManager, System.AI, System.Telemetry     |
| System.AI.LongTermMemory    | 20_ai/2_ai_longTermMemory.g.js       | System.Utils, System.Config, System.DocsManager, System.Telemetry                |
| System.AgentDispatcher.Core      | 20_ai/3_ai_dispatcher.js             | System.Utils, System.Config, System.DocsManager, System.AI, System.Telemetry, System.AgentsCatalog, System.UI |
| System.AI.Context           | 20_ai/4_ai_context.js                | System.Utils, System.Config, System.DocsManager, System.AI, System.Telemetry, System.Tools |
| System.AI.ToolExecutor      | 20_ai/5_ai_toolExecutor.js           | System.Utils, System.Config, System.DocsManager, System.AI, System.Telemetry, System.Tools |
| System.ToolsAccounting      | 30_tools/2_tools_accounting.js        | System.Utils, System.UI, System.Config, System.AI, System.DocsManager            |
| System.ToolsDeveloper       | 30_tools/4_tools_developer.js         | System.Utils, System.Agents, System.Tools, System.Config, System.UI, System.AI, System.DocsManager |
| System.AgentDeveloper       | 25_ai_agents/agent_developer.gs.js    | System.Utils, System.Config, System.AI                                           |
| System.AI.IntentAnalyzer    | 20_ai/6_ai_intentAnalyzer.js          | System.Utils, System.Config, System.DocsManager, System.AI, System.Telemetry, System.Tools |
| System.ProjectExport        | 99_export_project.gs.js               | System.Utils, System.DocsManager, System.UI, System.Config                       |
| System.AgentGeneral         | 25_ai_agents/general_agent.js         | System.Utils, System.AI, System.DocsManager, System.Config                       |
| System.AgentDispatcher.Legacy    | 25_ai_agents/agent_dispatcher.gs.js   | System.Utils, System.Config, System.DocsManager, System.AI, System.Telemetry, System.AgentsCatalog |
| System.AgentCFO             | 25_ai_agents/agent_cfo.gs.js          | System.Utils, System.Tools, System.AI                                            |
| System.AgentsCatalog        | 25_ai_agents/agents_catalog.js         | System.AgentDeveloper, System.AgentCFO, System.AgentGeneral, System.Utils        |
| System.AgentTriggers        | 25_ai_agents/0_agent_triggers.js       | System.Utils, System.Config                                                      |
| System.Tools.Catalog        | 30_tools/0_tools_catalog.js            | System.Utils, System.DocsManager                                                 |
| System.ToolsSheets          | 30_tools/1_tools_sheets.js             | System.Utils, System.AI, System.UI                                               |
| System.ToolsCodeReview      | 30_tools/3_tools_code_review.js        | System.Utils, System.AI, System.UI, System.Config                                |
| System.ToolsImageProcessor  | 30_tools/6_image_processor.js          | System.Utils, System.AI, System.Config, System.Tools, System.DocsManager         |
| System.Security             | 40_security/Security.js                | System.Config, System.Utils, System.UI.Dialogue, System.ProjectContextTracker, System.Telemetry |
| GAssistant.Analytics        | 50_analytics/analytics_dashboard.js     | System.Utils, System.UI.Dialogue, System.Config, System.ToolsAccounting          |
| System.Tests                | 60_tests/tests.js                      | System.Utils, System.Config, System.AI, System.Tools, System.AgentDeveloper, System.AgentCFO, System.AgentGeneral, System.AgentDispatcher.Core, System.AgentDispatcher.Legacy, System.AgentsCatalog, System.DocsManager, System.Telemetry, System.Security, System.Memory, System.UI, System.ProjectExport |

---

## ملاحظات:
- جميع الموديولات المعرفة في المشروع ممثلة في الجدول.
- التبعيات مأخوذة من الكود الفعلي لكل وحدة.
- لا توجد موديولات رئيسية ناقصة أو غير ممثلة.

---

تم التوليد بواسطة GitHub Copilot.
