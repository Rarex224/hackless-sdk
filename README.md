# Hackless SDK
A TypeScript SDK for the Hackless Public API.

## Features

- TypeScript-first client
- API key bearer authentication
- Challenge, leaderboard, and profile helpers
- Health check support
- Thin wrapper over the public REST API

## Stack

- TypeScript
- Fetch API
- Public REST endpoints
- API key auth

## Installation

```bash
npm install hackless-sdk
# or
yarn add hackless-sdk
# or
pnpm add hackless-sdk
```

## Usage

### Basic Setup

```ts
import { createHacklessClient } from "hackless-sdk";

const client = createHacklessClient({
  baseURL: "https://hackless.dev",
  apiKey: "your-api-key",
  timeout: 10000,
});
```

### Challenges

```ts
// Get all challenges
const challenges = await client.listChallenges();
console.log(challenges);

// Get a specific challenge
const challenge = await client.getChallenge("cryptovault");
console.log(challenge);
```

### Leaderboard

```ts
// Get the leaderboard
const leaderboard = await client.getLeaderboard();
console.log(leaderboard);
```

### Profiles

```ts
// Get your own progress
const me = await client.getMyProgress();
console.log(me);

// Get a public profile
const profile = await client.getPublicProfile("user_id_here");
console.log(profile);
```

### Writeups

```ts
// List writeups for a solved challenge
const writeups = await client.listWriteupsForChallenge("cryptovault");
console.log(writeups.challenge);
console.log(writeups.writeups);
```

### Submissions

```ts
// Submit a flag
const result = await client.submitFlag("cryptovault", "hackless{example_flag}");
console.log(result);
```

### Health Check

```ts
// Check API health
const health = await client.health();
console.log(health);
```

## Error Handling

```ts
try {
  const challenge = await client.getChallenge("cryptovault");
  console.log(challenge);
} catch (error) {
  if (error.status === 404) {
    console.log("Challenge not found");
  } else if (error.status === 401) {
    console.log("Unauthorized");
  } else {
    console.log("Error:", error.message);
  }
}
```

## Authentication

```ts
// Set authentication token
client.setApiKey("your-new-token");

// Remove authentication token
client.removeApiKey();

// Set request timeout
client.setTimeout(15000);
```

## API Reference

### HacklessClient

The main client class for interacting with the Hackless public API.

### Constructor Options

- `baseURL` or `baseUrl` (string, optional): API base URL. Default: `https://hackless.dev`
- `apiKey` (string, optional): API authentication key
- `timeout` (number, optional): Request timeout in milliseconds. Default: `10000`
- `headers` (object, optional): Additional headers to include in requests
- `fetchImpl` (function, optional): Custom fetch implementation

### Methods

#### Challenges

- `listChallenges()`: Get all public challenges
- `getChallenge(slug)`: Get a specific challenge
- `submitFlag(slug, flag)`: Submit a flag for a challenge

#### Leaderboard

- `getLeaderboard()`: Get the public leaderboard

#### Profiles

- `getMyProgress()`: Get the authenticated user's profile and progress
- `getPublicProfile(userId)`: Get a public profile by user ID

#### Writeups

- `listWriteupsForChallenge(slug)`: Get the writeups visible for a solved challenge

#### Health

- `health()`: Check API health status

#### Utility

- `setApiKey(token)`: Set authentication token
- `removeApiKey()`: Remove authentication token
- `setTimeout(timeout)`: Set request timeout

## Types

The SDK includes TypeScript types for all API entities:

- `ChallengeSummary`
- `ChallengeDetail`
- `LeaderboardEntry`
- `PublicProfile`
- `MyProfile`
- `SubmitFlagResult`
- `WriteupListChallenge`
- `WriteupListItem`
- `WriteupListResponse`
- `ChallengeDifficulty`
- `HacklessClientOptions`
- `HacklessApiError`

## Development

```bash
cd hackless-sdk
pnpm install
pnpm run build
pnpm run check
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Readme

This package is intentionally thin. It mirrors the Hackless public REST API rather than the internal tRPC router.

## Keywords

- hackless
- ctf
- sdk
- api
- mcp
- claude
