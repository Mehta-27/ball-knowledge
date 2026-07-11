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

### API Layer

Every API file does the same 3 things:

```ts
const API = axios.create({ baseURL: "http://127.0.0.1:8000" });

export async function getX(): Promise<XCard[]> { ... }      // list
export async function getX(id: string): Promise<XDetail> { ... }  // detail
export async function searchX(query: string): Promise<XCard[]> { ... }  // search (if available)
```

Each file creates its own axios instance. No shared instance, no abstraction.

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
            <h1>Feature</h1>
            {items.map((item) => <Card key={item.id} item={item} />)}
        </>
    );
}
```

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
        </>
    );
}
```

### Type Definition Pattern

Every types file defines:

```ts
export interface FeatureCard { id: number; ... }   // list-level fields
export interface FeatureDetail { id: number; ... }  // full detail fields
```

Nullable fields use `| null`. No `any` types anywhere.

---

## Differences Between Your Features and Mine

### 1. Search

| Feature | Has Search |
|---|---|
| Players (you) | ✅ |
| Teams (you) | ✅ |
| Matches (you) | ✅ |
| Standings (me) | ❌ |
| Venues (me) | ✅ |
| Groups (me) | ❌ |
| Stages (me) | ❌ |

Your pattern: All 3 have search. My pattern: Only Venues has it (backend has no search for Standings/Groups/Stages).

### 2. Card Content

| Feature | Card Fields | Has Image |
|---|---|---|
| Players (you) | name, position, jersey_number | ✅ |
| Teams (you) | name, code | ❌ |
| Matches (you) | home vs away, score, date, stage | ❌ |
| Standings (me) | group name | ❌ |
| Venues (me) | stadium, city, capacity | ❌ |
| Groups (me) | name only | ❌ |
| Stages (me) | name, type | ❌ |

Your cards are richer. Players has image + 3 fields. My cards are minimal.

### 3. Detail Page Complexity

| Feature | Detail Fields | Sub-components |
|---|---|---|
| Players (you) | 8 fields + image | SimilarPlayerRow |
| Teams (you) | 6 fields + image | None |
| Matches (you) | 8 fields + team stats + player stats | None (inline) |
| Standings (me) | Full table (10 cols × N rows) | None (inline table) |
| Venues (me) | 7 fields + image | None |
| Groups (me) | 2 fields + standings table + matches list | None (inline) |
| Stages (me) | 5 fields + matches list | None (inline) |

Groups and Stages are composite — they fetch from multiple endpoints. Standings renders a full HTML table.

### 4. Number of API Calls on Detail Page

| Feature | API Calls | Pattern |
|---|---|---|
| Players (you) | 2 | Both in same useEffect |
| Teams (you) | 1 | Single useEffect |
| Matches (you) | 1 | Single useEffect |
| Standings (me) | 1 | Single useEffect |
| Venues (me) | 1 | Single useEffect |
| Groups (me) | 3 | Separate useEffect per endpoint |
| Stages (me) | 2 | Separate useEffect per endpoint |

Your pattern: Everything in one useEffect. My pattern: Groups/Stages split into multiple effects.

### 5. Cross-Type Imports

| Type | Defined In | Used By |
|---|---|---|
| MatchCard | types/matches.ts (you) | Groups (me), Stages (me) |
| Standing | types/standings.ts (me) | Groups (me) |

Your types are standalone. My types have cross-feature dependencies (Groups imports MatchCard + Standing).

### 6. Route Parameter Type

| Feature | Route Param | Type |
|---|---|---|
| Players (you) | /players/:id | numeric |
| Teams (you) | /teams/:id | numeric |
| Matches (you) | /matches/:id | numeric |
| Standings (me) | /standings/:groupName | string |
| Venues (me) | /venues/:id | numeric |
| Groups (me) | /groups/:id | numeric |
| Stages (me) | /stages/:id | numeric |

Standings is the only non-numeric route param — uses string groupName instead of numeric id.

---

## Summary

| Aspect | Your Features (3) | My Features (4) |
|---|---|---|
| Search | All 3 have it | Only Venues (1 of 4) |
| Images | Players, Teams (2 of 3) | Venues only (1 of 4) |
| Cross-type imports | None | Groups imports MatchCard + Standing |
| Multiple useEffect per detail | 0 | 2 (Groups, Stages) |
| Non-numeric route param | 0 | 1 (Standings) |
| Composite detail pages | 0 | 2 (Groups, Stages) |
| Table rendering | 0 | 2 (Standings, Groups) |
| Sub-components | 1 (SimilarPlayerRow) | 0 |

Your 3 features establish the core pattern. My 4 features follow that pattern exactly, with structural differences only where the backend demands it.
