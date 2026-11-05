const SESSION_KEY = 'khoj_session_id';
const SCORE_KEY = 'khoj_score';
const BADGES_KEY = 'khoj_badges';

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'exp_' + Math.random().toString(36).substring(2, 8) + '_' + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getKhojScore(): number {
  const score = localStorage.getItem(SCORE_KEY);
  return score ? parseInt(score, 10) : 0;
}

export function addKhojScore(points: number, eventName?: string): number {
  const current = getKhojScore();
  const next = current + points;
  localStorage.setItem(SCORE_KEY, next.toString());
  checkBadges(next);
  return next;
}

export function getUnlockedBadges(): string[] {
  const b = localStorage.getItem(BADGES_KEY);
  return b ? JSON.parse(b) : ['Curious Explorer'];
}

function checkBadges(score: number): void {
  const badges = new Set(getUnlockedBadges());
  badges.add('Curious Explorer');
  if (score >= 30) badges.add('Story Seeker');
  if (score >= 70) badges.add('Heritage Hunter');
  if (score >= 120) badges.add('Hidden Gem Hunter');
  if (score >= 180) badges.add('Local Foodie');
  localStorage.setItem(BADGES_KEY, JSON.stringify(Array.from(badges)));
}

