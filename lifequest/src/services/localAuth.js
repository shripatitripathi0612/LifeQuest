// A minimal local "auth" system so the app is fully playable without a
// Supabase project configured. It intentionally mirrors the shape of
// Supabase's auth responses ({ data, error }) so the calling code
// (store/authStore.js) doesn't need to branch heavily between the two.
//
// NOTE: This is a demo convenience, not secure authentication. Passwords are
// stored locally only for demo login purposes. Real deployments should
// configure Supabase (see .env.example) which is used automatically once set.

const USERS_KEY = 'lifequest.local.users';
const SESSION_KEY = 'lifequest.local.session';

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

function makeUser(email) {
  return {
    id: `local-${simpleHash(email.toLowerCase())}`,
    email,
    created_at: new Date().toISOString(),
  };
}

export const localAuth = {
  async signUp(email, password) {
    const users = readUsers();
    if (users[email.toLowerCase()]) {
      return { data: null, error: { message: 'An account with this email already exists.' } };
    }
    const user = makeUser(email);
    users[email.toLowerCase()] = { user, passwordHash: simpleHash(password) };
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return { data: { user }, error: null };
  },

  async signIn(email, password) {
    const users = readUsers();
    const record = users[email.toLowerCase()];
    if (!record || record.passwordHash !== simpleHash(password)) {
      return { data: null, error: { message: 'Invalid email or password.' } };
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(record.user));
    return { data: { user: record.user }, error: null };
  },

  async signOut() {
    localStorage.removeItem(SESSION_KEY);
    return { error: null };
  },

  async resetPassword(email) {
    const users = readUsers();
    const record = users[email.toLowerCase()];
    if (!record) {
      return { data: null, error: { message: 'No account found with this email.' } };
    }
    // Demo mode: we can't send real emails, so we just confirm the flow.
    return { data: { message: 'Password reset instructions sent (demo mode: no email is actually sent).' }, error: null };
  },

  getSession() {
    try {
      const user = JSON.parse(localStorage.getItem(SESSION_KEY));
      return user ? { user } : null;
    } catch {
      return null;
    }
  },
};
