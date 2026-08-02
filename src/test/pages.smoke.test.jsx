import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';

// Capture pristine store state once, before any test mutates it, so every
// test starts from a clean slate despite Zustand stores being module-level
// singletons that would otherwise leak state between tests.
const initialAuthState = useAuthStore.getState();
const initialGameState = useGameStore.getState();

async function renderAuthenticatedAt(route) {
  useAuthStore.setState(initialAuthState, true);
  useGameStore.setState(initialGameState, true);

  const email = `test-${Math.random().toString(36).slice(2)}@example.com`;
  await useAuthStore.getState().signUp(email, 'password123!');

  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

  // Let auth init + game store loadForUser (both async) settle.
  await waitFor(() => {
    expect(useGameStore.getState().loaded).toBe(true);
  });
}

describe('LifeQuest — page smoke tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the Dashboard without crashing', async () => {
    await renderAuthenticatedAt('/app');
    expect(await screen.findByText(/Today[’']s Habits/i)).toBeInTheDocument();
  });

  it('renders the Habits page without crashing (regression: infinite loop)', async () => {
    await renderAuthenticatedAt('/app/habits');
    expect(await screen.findByText(/Your Habits/i)).toBeInTheDocument();
  });

  it('renders the Quests page without crashing (regression: LifeQuestForm infinite loop)', async () => {
    // This is the exact regression case: LifeQuestForm is mounted
    // unconditionally by the Quests page (the Modal only hides it visually),
    // so its selector runs the instant this page mounts. Before the fix,
    // `useGameStore((s) => s.habits.filter(...))` created a new array
    // reference every render, which Zustand's reference-equality check saw
    // as "changed" every time, causing React to throw
    // "Maximum update depth exceeded" here.
    await renderAuthenticatedAt('/app/quests');
    expect(await screen.findByText(/Long-term missions and rotating challenges/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New Life Quest/i })).toBeInTheDocument();
  });

  it('renders the Analytics page without crashing', async () => {
    await renderAuthenticatedAt('/app/analytics');
    expect(await screen.findByText(/Your growth, quantified/i)).toBeInTheDocument();
  });

  it('renders the Achievements page without crashing', async () => {
    await renderAuthenticatedAt('/app/achievements');
    expect(await screen.findByText(/unlocked — some are hidden until discovered/i)).toBeInTheDocument();
  });

  it('renders the Profile page without crashing', async () => {
    await renderAuthenticatedAt('/app/profile');
    expect(await screen.findByText(/Life Attributes/i)).toBeInTheDocument();
  });

  it('renders the Settings page without crashing', async () => {
    await renderAuthenticatedAt('/app/settings');
    expect(await screen.findByText(/Signed in as/i)).toBeInTheDocument();
  });

  it('renders the Guild Master page without crashing', async () => {
    await renderAuthenticatedAt('/app/guild-master');
    // A brand-new user has no habits yet, so the page correctly shows its
    // empty state rather than a full report.
    expect(await screen.findByText(/Guild Master awaits your first habit/i)).toBeInTheDocument();
  });

  it('opens the New Life Quest modal, links a habit, and submits without crashing', async () => {
    const user = userEvent.setup();
    await renderAuthenticatedAt('/app/quests');

    // Seed a habit after the store has settled so the "link habits" section
    // of the form (the part that reads from the store) has something to
    // render — seeding before renderAuthenticatedAt would be wiped out by
    // its store reset.
    useGameStore.getState().addHabit({ name: 'Read', attribute: 'wisdom' });

    await user.click(screen.getByRole('button', { name: /New Life Quest/i }));

    const titleInput = await screen.findByPlaceholderText(/Become a Biochemist/i);
    await user.type(titleInput, 'Learn Machine Learning');

    // Link the seeded habit — this exercises LifeQuestForm's habit list
    // rendering and its toggle interaction, the exact area the reported
    // crash pointed to.
    const habitToggle = await screen.findByRole('button', { name: 'Read' });
    await user.click(habitToggle);

    await user.click(screen.getByRole('button', { name: /Create Quest/i }));

    // Modal should close and the new quest should appear in the list.
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Become a Biochemist/i)).not.toBeInTheDocument();
    });
    expect(await screen.findByText('Learn Machine Learning')).toBeInTheDocument();
  });

  it('opens the habit form, creates a habit, and completes it without crashing', async () => {
    const user = userEvent.setup();
    await renderAuthenticatedAt('/app/habits');

    await user.click(screen.getByRole('button', { name: /New Habit/i }));
    const nameInput = await screen.findByPlaceholderText(/Read for 30 minutes/i);
    await user.type(nameInput, 'Drink water');

    // Both the empty-state action and the form's submit button read "Create
    // Habit" while the form is open (the empty state doesn't unmount behind
    // the modal), so scope this query to the actual <form>.
    const form = nameInput.closest('form');
    const { getByRole } = within(form);
    await user.click(getByRole('button', { name: /Create Habit/i }));

    const habitName = await screen.findByText('Drink water');
    expect(habitName).toBeInTheDocument();

    // Complete it — exercises the streak/achievement/completion pipeline end to end.
    await user.click(screen.getByRole('button', { name: /Mark Drink water as done/i }));

    await waitFor(() => {
      expect(useGameStore.getState().completions.length).toBe(1);
    });

    // Regression: this is the binary streak system's core promise — a fully
    // completed day (only one habit exists here, and it's now done) should
    // register today as complete and put the streak at 1.
    await waitFor(() => {
      expect(useGameStore.getState().player.streak).toBe(1);
    });
  });

  it('has no XP, levels, or coins anywhere in player state', async () => {
    await renderAuthenticatedAt('/app');
    const { player } = useGameStore.getState();
    expect(player.totalXp).toBeUndefined();
    expect(player.coins).toBeUndefined();
    expect(player.streak).toBeDefined();
  });
});
