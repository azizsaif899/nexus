import { PulseGrid } from './components/pulse/PulseGrid';
import { CommandBar } from './components/ui/CommandBar';
import { AdvancedCommandBar } from './components/ui/AdvancedCommandBar';
import { HotkeyHelper } from './components/ui/HotkeyHelper';
import { DashboardShell } from './components/layout/DashboardShell';

export default function HomePage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🚀 قمرة القيادة التفاعلية
            </h1>
            <p className="text-gray-600">
              لوحة تحكم ذكية لإدارة علاقات العملاء
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">
              Ctrl + K
            </kbd>
            <span className="text-sm text-gray-500">للأوامر السريعة</span>
          </div>
        </div>
        
        <PulseGrid />
      </div>
      
      <CommandBar />
      <AdvancedCommandBar />
      <HotkeyHelper />
    </DashboardShell>
  );
}