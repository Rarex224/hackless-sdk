export type ChallengeDifficulty = "Easy" | "Medium" | "Hard" | "Insane";

export interface ChallengeSummary {
  id: string;
  slug: string;
  categories: string[];
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  points: number;
  fileUrl: string | null;
  fileName: string | null;
  hasInstance: boolean;
  dockerPort: number | null;
  type: string;
  attemptsCount: number;
  createdAt: string;
  solved: boolean;
  solvesCount: number;
  avgStars: number | null;
}

export interface ChallengeDetail extends ChallengeSummary {
  unlocked: boolean;
  submittedFlag: string | null;
  avgDifficulty: number | null;
  totalReviews: number;
  myReview: { stars: number; difficulty: number } | null;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  username: string | null;
  image: string | null;
  totalPoints: number;
  totalSolves: number;
  lastSolvedAt: string | null;
  solves: Array<{ solvedAt: string; points: number }>;
}

export interface PublicProfile {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  createdAt: string;
  solvedChallenges: Array<{
    solvedAt: string;
    challenge: {
      id: string;
      title: string;
      points: number;
      categories: string[];
      difficulty: ChallengeDifficulty;
      slug: string;
    };
  }>;
  createdChallenges: Array<{
    id: string;
    slug: string;
    title: string;
    points: number;
    categories: string[];
    difficulty: ChallengeDifficulty;
    createdAt: string;
  }>;
  badges: Array<{ badgeId: string; awardedAt: string }>;
  twoFactorEnabled?: boolean;
  rank?: number;
  totalPoints?: number;
  firstBloodCount?: number;
  top3Count?: number;
}

export interface MyProfile extends PublicProfile {
  email: string | null;
  twoFactorEnabled: boolean;
  rank: number;
  totalPoints: number;
  firstBloodCount: number;
  top3Count: number;
}

export interface SubmitFlagResult {
  success: boolean;
  points: number;
  newBadges: Array<{ id: string; title: string; icon: string; image: string | null }>;
}

export interface WriteupListChallenge {
  id: string;
  title: string;
  categories: string[];
  difficulty: ChallengeDifficulty;
  points: number;
}

export interface WriteupListItem {
  id: string;
  title: string;
  content: string;
  images: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    username: string | null;
    name: string | null;
  } | null;
}

export interface WriteupListResponse {
  challenge: WriteupListChallenge;
  writeups: WriteupListItem[];
}
