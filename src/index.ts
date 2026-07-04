import type {
  ChallengeDetail,
  ChallengeSummary,
  LeaderboardEntry,
  MyProfile,
  PublicProfile,
  SubmitFlagResult,
  WriteupListResponse,
} from "./types.js";

export type HacklessClientOptions = {
  baseURL?: string;
  baseUrl?: string;
  apiKey?: string;
  timeout?: number;
  fetchImpl?: typeof fetch;
  headers?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
};

export class HacklessApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "HacklessApiError";
    this.status = status;
    this.body = body;
  }
}

export class HacklessClient {
  private baseUrl: string;
  private apiKey: string | undefined;
  private timeoutMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly headers?: HacklessClientOptions["headers"];

  constructor(options: HacklessClientOptions) {
    this.baseUrl = (options.baseURL ?? options.baseUrl ?? "https://hackless.dev").replace(/\/+$/, "");
    this.apiKey = options.apiKey?.trim() || undefined;
    this.timeoutMs = options.timeout ?? 10_000;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.headers = options.headers;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey.trim() || undefined;
  }

  removeApiKey() {
    this.apiKey = undefined;
  }

  setTimeout(timeout: number) {
    this.timeoutMs = timeout;
  }

  async listChallenges(): Promise<ChallengeSummary[]> {
    const res = await this.request<{ challenges: ChallengeSummary[] }>("/api/public/challenges");
    return res.challenges;
  }

  async getChallenge(slug: string): Promise<ChallengeDetail> {
    const res = await this.request<{ challenge: ChallengeDetail }>(`/api/public/challenges/${encodeURIComponent(slug)}`);
    return res.challenge;
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const res = await this.request<{ leaderboard: LeaderboardEntry[] }>("/api/public/leaderboard");
    return res.leaderboard;
  }

  async health(): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>("/api/public/health");
  }

  async listWriteupsForChallenge(slug: string): Promise<WriteupListResponse> {
    const res = await this.request<{ challenge: WriteupListResponse["challenge"]; writeups: WriteupListResponse["writeups"] }>(
      `/api/public/challenges/${encodeURIComponent(slug)}/writeups`,
    );
    return res;
  }

  async getMyProgress(): Promise<MyProfile> {
    const res = await this.request<{ profile: MyProfile }>("/api/public/me");
    return res.profile;
  }

  async getPublicProfile(userId: string): Promise<PublicProfile | null> {
    const res = await this.request<{ profile: PublicProfile | null }>(`/api/public/profiles/${encodeURIComponent(userId)}`);
    return res.profile;
  }

  async submitFlag(slug: string, flag: string): Promise<SubmitFlagResult> {
    const res = await this.request<{ result: SubmitFlagResult }>(
      `/api/public/challenges/${encodeURIComponent(slug)}/submit`,
      {
        method: "POST",
        body: JSON.stringify({ flag }),
      },
    );
    return res.result;
  }

  private async resolveHeaders() {
    if (!this.headers) return undefined;
    return typeof this.headers === "function" ? await this.headers() : this.headers;
  }

  private async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = new Headers(await this.resolveHeaders());

    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    headers.set("Accept", "application/json");
    if (this.apiKey && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${this.apiKey}`);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await this.fetchImpl(url, {
        ...init,
        headers,
        signal: init.signal ?? controller.signal,
      });

      const text = await res.text();
      const body = text ? tryParseJson(text) : null;

      if (!res.ok) {
        const message =
          (body && typeof body === "object" && "error" in body && typeof body.error === "string"
            ? body.error
            : `Hackless API request failed (${res.status})`);
        throw new HacklessApiError(message, res.status, body);
      }

      return (body ?? {}) as T;
    } finally {
      clearTimeout(timeout);
    }
  }
}

export function createHacklessClient(options: HacklessClientOptions) {
  return new HacklessClient(options);
}

function tryParseJson(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export type {
  ChallengeDetail,
  ChallengeSummary,
  LeaderboardEntry,
  MyProfile,
  PublicProfile,
  SubmitFlagResult,
  WriteupListChallenge,
  WriteupListItem,
  WriteupListResponse,
} from "./types.js";
