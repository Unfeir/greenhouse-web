# greenhouse-web

The client half of a two-repository scenario used to exercise the orchestration
platform. Fictional client, fictional greenhouse, real TypeScript.

The point of it: this repository's agent never sees `greenhouse-api`. Everything
it knows about the shapes on the wire has to arrive as context — from the project
scope of the store, put there when the backend's own ticket merged. A ticket here
that calls a new endpoint is therefore a direct test of whether that context
crossed the boundary, and it fails in a *legible* way when it did not, because
the client is typed.

`src/types.ts` restates the API's contracts by hand rather than generating them,
for the same reason.

The test suite covers the API layer only — no DOM, no rendering. A wrong contract
should be the interesting way to be red here; a rendering harness would add
several uninteresting ones.

The lock file is committed. Without it `npm install` generates one on first
use, and an agent asked to touch `src` alone reaches for `.gitignore` to keep it
out of the diff — which is a sensible instinct and an out-of-scope edit, and it
failed a verdict here before the lock file was added.

```
npm ci
npm run typecheck
npm test
```
