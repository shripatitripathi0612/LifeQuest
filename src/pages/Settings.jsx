import React, { useRef, useState } from 'react';
import {
  Moon, Sun, Volume2, VolumeX, Sparkles, Download, Upload,
  FileSpreadsheet, FileText, AlertTriangle, Trash2,
} from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { getStanding } from '../utils/standing';
import { downloadFile, habitsAndCompletionsToCSV, exportSummaryAsPDF } from '../utils/exportHelpers';
import ConfirmDialog from '../components/common/ConfirmDialog';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${checked ? 'bg-electric-500' : 'bg-white/10'}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function Row({ icon: Icon, title, description, children }) {
  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-white/5 last:border-0">
      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);
  const habits = useGameStore((s) => s.habits);
  const completions = useGameStore((s) => s.completions);
  const player = useGameStore((s) => s.player);
  const exportSnapshot = useGameStore((s) => s.exportSnapshot);
  const importSnapshot = useGameStore((s) => s.importSnapshot);
  const resetAllProgress = useGameStore((s) => s.resetAllProgress);
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const { pushToast } = useUIStore();
  const fileInputRef = useRef(null);
  const [resetOpen, setResetOpen] = useState(false);
  const standing = getStanding(player.streak);

  const isDark = settings.theme !== 'light';

  const toggleDark = () => {
    const next = isDark ? 'light' : 'dark';
    updateSettings({ theme: next });
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.classList.toggle('light', next === 'light');
  };

  const handleExportJSON = () => {
    downloadFile(`lifequest-backup-${new Date().toISOString().slice(0, 10)}.json`, exportSnapshot(), 'application/json');
    pushToast({ type: 'success', title: 'Backup exported', message: 'Your full progress was saved to a JSON file.' });
  };

  const handleExportCSV = () => {
    downloadFile(`lifequest-habits-${new Date().toISOString().slice(0, 10)}.csv`, habitsAndCompletionsToCSV(habits, completions), 'text/csv');
    pushToast({ type: 'success', title: 'CSV exported' });
  };

  const handleExportPDF = () => {
    exportSummaryAsPDF({ player, habits, completions, standing: standing.name });
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importSnapshot(reader.result);
      if (result.success) {
        pushToast({ type: 'success', title: 'Backup restored', message: 'Your progress has been restored.' });
      } else {
        pushToast({ type: 'error', title: 'Restore failed', message: result.error });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Signed in as {user?.email}</p>
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-white mb-2">Appearance</h3>
        <Row icon={isDark ? Moon : Sun} title="Dark Mode" description="LifeQuest is designed dark-first for that cyber-RPG feel">
          <Toggle checked={isDark} onChange={toggleDark} />
        </Row>
        <Row icon={Sparkles} title="Animations" description="Confetti, transitions, and standing celebrations">
          <Toggle checked={settings.animations} onChange={(v) => updateSettings({ animations: v })} />
        </Row>
        <Row icon={settings.sound ? Volume2 : VolumeX} title="Sound Effects" description="Small audio cues for completions and new standings">
          <Toggle checked={settings.sound} onChange={(v) => updateSettings({ sound: v })} />
        </Row>
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-white mb-2">Export Data</h3>
        <Row icon={FileSpreadsheet} title="Export as CSV" description="Habit completion log, spreadsheet-ready">
          <button onClick={handleExportCSV} className="btn-secondary text-xs px-3 py-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </Row>
        <Row icon={FileText} title="Export as PDF" description="Printable progress summary">
          <button onClick={handleExportPDF} className="btn-secondary text-xs px-3 py-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </Row>
      </div>

      <div className="glass-panel p-5">
        <h3 className="font-semibold text-white mb-2">Backup & Restore</h3>
        <Row icon={Download} title="Download Backup" description="Save your full progress as a JSON file">
          <button onClick={handleExportJSON} className="btn-secondary text-xs px-3 py-1.5">
            <Download className="w-3.5 h-3.5" /> Backup
          </button>
        </Row>
        <Row icon={Upload} title="Restore Backup" description="Load progress from a previously exported file">
          <button onClick={handleImportClick} className="btn-secondary text-xs px-3 py-1.5">
            <Upload className="w-3.5 h-3.5" /> Restore
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
        </Row>
      </div>

      <div className="glass-panel p-5 border-red-500/20">
        <h3 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </h3>
        <Row icon={Trash2} title="Reset All Progress" description="Permanently erase habits, streaks, and achievements">
          <button onClick={() => setResetOpen(true)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-medium">
            Reset
          </button>
        </Row>
      </div>

      <button onClick={signOut} className="btn-secondary w-full">Sign Out</button>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          resetAllProgress();
          pushToast({ type: 'info', title: 'Progress reset', message: 'Your journey starts fresh.' });
        }}
        title="Reset all progress?"
        description="This deletes every habit, completion, quest, and achievement permanently. This cannot be undone — consider exporting a backup first."
        confirmLabel="Yes, reset everything"
      />
    </div>
  );
}
