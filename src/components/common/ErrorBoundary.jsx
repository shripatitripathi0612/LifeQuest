import React from 'react';
import { RefreshCw, AlertOctagon } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Logged for local debugging; in production this is where you'd report to
    // an error-tracking service. We deliberately never let this crash silently
    // into a blank screen.
    console.error('LifeQuest crashed:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="glass-panel max-w-sm w-full p-8 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white mb-1">Something went sideways</h2>
              <p className="text-sm text-slate-400">
                LifeQuest hit an unexpected error. Your progress is saved — reloading should fix it.
              </p>
            </div>
            <button onClick={this.handleReload} className="btn-primary w-full">
              <RefreshCw className="w-4 h-4" />
              Reload LifeQuest
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
