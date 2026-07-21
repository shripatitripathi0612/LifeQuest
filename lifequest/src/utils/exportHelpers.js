export function downloadFile(filename, content, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function habitsAndCompletionsToCSV(habits, completions) {
  const header = ['Date', 'Habit', 'Category', 'Attribute'];
  const rows = completions
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((c) => {
      const habit = habits.find((h) => h.id === c.habitId);
      return [c.date, habit?.name || 'Deleted habit', habit?.category || '', habit?.attribute || ''];
    });
  const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  return csv;
}

/** Opens a print dialog with a formatted summary — the standard dependency-free way to let users "export to PDF" from the browser. */
export function exportSummaryAsPDF({ player, habits, completions, standing }) {
  const win = window.open('', '_blank');
  if (!win) return;
  const rows = habits
    .map(
      (h) =>
        `<tr><td>${h.name}</td><td>${h.category}</td><td>${h.streak}</td><td>${h.longestStreak}</td><td>${h.totalCompletions}</td></tr>`
    )
    .join('');

  win.document.write(`
    <html>
      <head>
        <title>LifeQuest Summary</title>
        <style>
          body { font-family: -apple-system, Segoe UI, sans-serif; padding: 40px; color: #111; }
          h1 { margin-bottom: 0; }
          p.sub { color: #666; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #ddd; font-size: 13px; }
          th { background: #f4f4f5; }
          .stats { display: flex; gap: 24px; margin-top: 20px; }
          .stat { border: 1px solid #ddd; border-radius: 8px; padding: 12px 18px; }
          .stat b { display: block; font-size: 20px; }
        </style>
      </head>
      <body>
        <h1>LifeQuest — Progress Summary</h1>
        <p class="sub">Generated ${new Date().toLocaleDateString()}</p>
        <div class="stats">
          <div class="stat"><b>${standing}</b>Standing</div>
          <div class="stat"><b>${player.streak}</b>Current Streak</div>
          <div class="stat"><b>${player.longestStreak}</b>Longest Streak</div>
          <div class="stat"><b>${completions.length}</b>Total Completions</div>
        </div>
        <table>
          <thead><tr><th>Habit</th><th>Category</th><th>Current Streak</th><th>Longest Streak</th><th>Total Completions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);
  win.document.close();
}
