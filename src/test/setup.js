import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom doesn't implement ResizeObserver, which Recharts' ResponsiveContainer
// relies on to measure its container.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = global.ResizeObserver || ResizeObserverStub;

// jsdom doesn't implement matchMedia.
if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  });
}

// jsdom's canvas support is minimal; canvas-confetti and Web Audio are
// user-triggered visual/audio effects that work fine in real browsers, but
// need a stub context here so tests exercising them (e.g. completing a
// habit) don't throw on jsdom's incomplete canvas implementation.
const fakeCtx = {
  clearRect: () => {},
  fillRect: () => {},
  save: () => {},
  restore: () => {},
  translate: () => {},
  rotate: () => {},
  scale: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  closePath: () => {},
  fill: () => {},
  stroke: () => {},
  arc: () => {},
  drawImage: () => {},
  createLinearGradient: () => ({ addColorStop: () => {} }),
  measureText: () => ({ width: 0 }),
  setTransform: () => {},
  getImageData: () => ({ data: [] }),
};
HTMLCanvasElement.prototype.getContext = () => fakeCtx;
window.AudioContext = window.AudioContext || class {
  createOscillator() {
    return { connect: () => {}, start: () => {}, stop: () => {}, frequency: {} };
  }
  createGain() {
    return { connect: () => {}, gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} } };
  }
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
