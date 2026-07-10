# Feature Comparison — What You Built vs What I Scaffolded

## Features

| Built by you | Scaffolded by me |
|---|---|
| Players | Standings |
| Teams | Venues |
| Matches | Groups |
| | Stages |

---

## Structural Similarities (Identical Across All 7 Features)

### File Layout

Every feature follows the same 5-file structure:

```
types/{feature}.ts          — TypeScript interfaces
api/{feature}.ts            — Axios API functions
components/{feature}/       — Card component
pages/{Feature}/            — List page
pages/{Feature}Detail/      — Detail page
```

This pattern is **100% consistent** across all 7 features. No exceptions.

### API Layer

Every API file does the same 3 things:

```ts
const API = axios.create({ baseURL: "http://127.0.0.1:8000" });

export async function getX(): Promise<XCard[]> { ... }      // list
export async function getX(id: string): Promise<XDetail> { ... }  // detail
export async function searchX(query: string): Promise<XCard[]> { ... }  // search (if available)
```

Each file creates its own axios instance. No shared instance, no abstraction. This is consistent across all features.

### Card Component Pattern

Every card component follows this exact shape:

```tsx
import type { XCard } from "../../types/x";
import { useNavigate } from "react-router-dom";

interface XCardProps { x: XCard; }

export default function XCard({ x }: XCardProps) {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/x/${x.id}`)}>
            <h3>{x.name}</h3>
            {/* additional fields */}
        </div>
    );
}
```

- Props interface named `{Feature}CardProps`
- `useNavigate` for client-side routing
- Clickable wrapper `div` navigates to detail page
- `key={item.id}` on every `.map()` call

### List Page Pattern

Every list page does the same thing:

```tsx
export default function Feature() {
    const [items, setItems] = useState<ItemType[]>([]);
    const [query, setQuery] = useState("");  // if search available

    useEffect(() => {
        async function fetchItems() {
            if (query.trim() === "") {
                const data = await getItems();
                setItems(data);
            } else {
                const data = await searchItems(query);
                setItems(data);
            }
        }
        fetchItems();
    }, [query]);

    return (
        <>
            {/* search input if available */}
            <h1>Feature</h1>
            {items.map((item) => <Card key={item.id} item={item} />)}
        </>
    );
}
```

- `useState` for item list + query string
- `useEffect` with `[query]` dependency
- Conditional fetch: empty query → `getX()`, non-empty → `searchX(query)`
- Render: `<h1>` heading + `.map()` of card components

### Detail Page Pattern

Every detail page follows this:

```tsx
export default function FeatureDetailPage() {
    const { id } = useParams();
    const [item, setItem] = useState<DetailType | null>(null);

    useEffect(() => {
        async function fetchItem() {
            if (!id) return;
            const data = await getX(id);
            setItem(data);
        }
        fetchItem();
    }, [id]);

    if (!item) return <h2>Loading...</h2>;

    return (
        <>
            <h1>{item.name}</h1>
            {/* fields */}
        </>
    );
}
```

- `useParams()` → `{ id }`
- `useState<DetailType | null>(null)`
- `useEffect([id])` with `if (!id) return` guard
- Loading guard: `if (!item) return <h2>Loading...</h2>`
- Render all detail fields as `<p>` tags

### Type Definition Pattern

Every types file defines:

```ts
export interface FeatureCard { id: number; ... }   // list-level fields
export interface FeatureDetail { id: number; ... }  // full detail fields
```

- Card: minimal fields for list display
- Detail: all fields from backend response
- Nullable fields use `| null` (e.g., `string | null`)
- No `any` types anywhere

---

## Differences Between Your Features and Mine

### 1. Search

| Feature | Has Search | Backend Endpoint |
|---|---|---|
| Players (you) | ✅ | `GET /players/search?q=...` |
| Teams (you) | ✅ | `GET /teams/search?q=...` |
| Matches (you) | ✅ | `GET /matches/search?q=...` |
| Standings (me) | ❌ | No search endpoint |
| Venues (me) | ✅ | `GET /venues/search?q=...` |
| Groups (me) | ❌ | No search endpoint |
| Stages (me) | ❌ | No search endpoint |

**Your pattern**: All 3 features have search. List page includes `<input>` + conditional fetch.
**My pattern**: Only Venues has search (because backend has it). Groups/Stages/Standings list pages have no search bar.

### 2. Card Content

| Feature | Card Fields | Has Image |
|---|---|---|
| Players (you) | name, position, jersey_number | ✅ `picture_url` |
| Teams (you) | name, code | ❌ |
| Matches (you) | home vs away, score, date, stage | ❌ |
| Standings (me) | group name | ❌ |
| Venues (me) | stadium, city, capacity | ❌ |
| Groups (me) | name only | ❌ |
| Stages (me) | name, type | ❌ |

**Your cards**: Players is the richest (image + 3 fields). Teams is minimal (2 fields). Matches shows 4 fields.
**My cards**: All minimal — just name + 1-2 supplementary fields. No images anywhere.

### 3. Detail Page Complexity

| Feature | Detail Fields | Sub-components |
|---|---|---|
| Players (you) | 8 fields + image | SimilarPlayerRow (ML similarity list) |
| Teams (you) | 6 fields + image | None |
| Matches (you) | 8 fields + team stats (12 each) + player stats (list) | None (inline) |
| Standings (me) | Full table (10 columns × N rows) | None (inline `<table>`) |
| Venues (me) | 7 fields + image | None |
| Groups (me) | 2 fields + standings table + matches list | None (inline) |
| Stages (me) | 5 fields + matches list | None (inline) |

**Your detail pages**: Players has the only sub-component (`SimilarPlayerRow`). Matches is the most complex with 3 sections (home stats, away stats, player stats).
**My detail pages**: Groups and Stages are composite — they fetch from multiple endpoints and render combined views. Standings renders a full HTML table.

### 4. Number of API Calls on Detail Page

| Feature | API Calls | Pattern |
|---|---|---|
| Players (you) | 2 | `getPlayer()` + `getSimilarPlayers()` in same `useEffect` |
| Teams (you) | 1 | `getTeam()` only |
| Matches (you) | 1 | `getMatch()` only |
| Standings (me) | 1 | `getStanding()` only |
| Venues (me) | 1 | `getVenue()` only |
| Groups (me) | 3 | Separate `useEffect` for group, standings, matches |
| Stages (me) | 2 | Separate `useEffect` for stage, matches |

**Your pattern**: Players is the only one with 2 calls, but both are in the same `useEffect`.
**My pattern**: Groups makes 3 separate `useEffect` calls (one per endpoint). Stages makes 2. This is a structural difference — your features keep everything in one effect, mine split into multiple effects.

### 5. Data Types Reused Across Features

| Type | Defined In | Used By |
|---|---|---|
| `MatchCard` | `types/matches.ts` (you) | Groups (me), Stages (me) |
| `Standing` | `types/standings.ts` (me) | Groups (me) |

**Your types**: Standalone — only used within their own feature.
**My types**: Groups and Stages import `MatchCard` and `Standing` from other feature types. This is the only cross-feature dependency in the entire codebase.

### 6. Route Parameter Type

| Feature | Route Param | Type |
|---|---|---|
| Players (you) | `/players/:id` | numeric |
| Teams (you) | `/teams/:id` | numeric |
| Matches (you) | `/matches/:id` | numeric |
| Standings (me) | `/standings/:groupName` | **string** (e.g., "Group A") |
| Venues (me) | `/venues/:id` | numeric |
| Groups (me) | `/groups/:id` | numeric |
| Stages (me) | `/stages/:id` | numeric |

**Your pattern**: All use numeric `:id`.
**My pattern**: Standings uses `:groupName` (string) — the only non-numeric route param. This required `encodeURIComponent`/`decodeURIComponent` in navigation and API calls.

---

## Summary Table

| Aspect | Your Features (3) | My Features (4) |
|---|---|---|
| Search | All 3 have it | Only Venues (1 of 4) |
| Images | Players, Teams (2 of 3) | Venues only (1 of 4) |
| Cross-type imports | None | Groups imports MatchCard + Standing |
| Multiple useEffect per detail | 0 (Players puts 2 calls in 1 effect) | 2 (Groups, Stages) |
| Non-numeric route param | 0 | 1 (Standings :groupName) |
| Composite detail pages | 0 | 2 (Groups: standings+matches, Stages: matches) |
| Table rendering | 0 | 2 (Standings, Groups) |
| Sub-components | 1 (SimilarPlayerRow) | 0 |

**Bottom line**: Your 3 features establish the core pattern. My 4 features follow that pattern exactly, with structural differences only where the backend demands it (no search endpoint, composite detail pages, string route params).
