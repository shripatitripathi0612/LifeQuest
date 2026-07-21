// Original lines written for LifeQuest's daily Gateway Screen. Kept short,
// quiet, and a little literary — the tone is "cinematic," not "gamer HUD."

export const GATEWAY_QUOTES = [
  "The version of you that you're chasing is built one ordinary day at a time.",
  'Discipline is just a promise you keep to yourself when no one is watching.',
  'Small, boring, repeated actions are how legends are actually made.',
  "You don't need more motivation. You need one small win, right now.",
  'Every hero was once someone who simply refused to stop.',
  'The story only moves forward on the days you choose to show up.',
  'Momentum is patient. It rewards the people who never break the chain.',
  'Growth is quiet. It rarely feels like anything, until it feels like everything.',
  'You are not behind. You are exactly where today asks you to begin.',
  'The hardest part of the quest is always the first ten minutes.',
  'Consistency is a quieter kind of courage.',
  "Today doesn't need to be perfect. It just needs to be one step further.",
  'The person you want to become is built in rooms no one else sees.',
  'Progress hides inside repetition — trust the process more than the mood.',
  'Every level up starts as a decision made on an unremarkable Tuesday.',
  'Discomfort today is just tuition for the person you are becoming.',
  'You already have permission to begin. No one is going to grant it for you.',
  'The best time to build the habit was months ago. The second best time is now.',
  'Small steps compound quietly until, one day, they become undeniable.',
  'Your future self is already grateful for what you are about to do today.',
  'Character is not decided in big moments — it is rehearsed in small ones.',
  'The comeback is always built in private, long before anyone notices.',
  'One honest rep today is worth more than a perfect plan you never start.',
  'The story of who you become is still being written — pick up the pen.',
];

export function getRandomGatewayQuote() {
  return GATEWAY_QUOTES[Math.floor(Math.random() * GATEWAY_QUOTES.length)];
}
