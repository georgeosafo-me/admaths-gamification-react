PROJECT NAME:
admath-gamification-react

GITHUB:
Create and connect the project to a GitHub repository called:
admath-gamification-react

TECH STACK:
- React (Vite)
- JavaScript (not TypeScript for now)
- Modern component-based architecture
- Tailwind CSS (preferred, but modular CSS acceptable)
- AI-assisted question generation (stub first, real integration later)

PROJECT GOAL:
Build a scalable gamified learning platform for SHS Additional Mathematics, structured exactly according to the **GES New Curriculum**, with topics grouped into **four strands**, each having **sub-strands**. Each sub-strand is implemented as an independent “Quest”.

AI will be used to generate questions dynamically, so the system must be modular and extensible.

--------------------------------------------------
FOLDER STRUCTURE (MANDATORY)
--------------------------------------------------

Inside `src/quests/`, create the following **strand-based structure**:

STRAND 1 — ALGEBRA
quests/algebra/
- indices-logs
- polynomials
- partial-fractions
- surds
- sequences-series
- binomial
- complex-numbers
- matrices
- determinants
- vectors
- linear-programming

STRAND 2 — GEOMETRY & TRIGONOMETRY
quests/geometry-trigonometry/
- trig-identities
- radian-measure
- trig-equations
- triangle-solutions
- coordinate-geometry   ← FIRST QUEST TO IMPLEMENT
- loci
- circles
- mensuration
- vectors-3d

STRAND 3 — CALCULUS
quests/calculus/
- functions
- limits
- differentiation
- diff-applications
- integration
- int-applications

STRAND 4 — STATISTICS & PROBABILITY
quests/statistics-probability/
- permutation-combination
- probability
- random-variables
- distributions
- measures

--------------------------------------------------
COORDINATE GEOMETRY QUEST (FIRST IMPLEMENTATION)
--------------------------------------------------

Inside:
src/quests/geometry-trigonometry/coordinate-geometry/

Create:

components/
- ChallengeCard.jsx

data/
- questions.js   (sample data only; AI will replace later)

pages/
- CoordinateGeometryQuest.jsx

utils/
- geometryLogic.js   (AI hook placeholder)

index.js   (export quest)

--------------------------------------------------
FUNCTIONAL REQUIREMENTS (PHASE 1)
--------------------------------------------------

1. The Coordinate Geometry Quest MUST:
- Render correctly via React Router
- Display a question card
- Allow option selection
- Show basic feedback (correct / incorrect)
- Move to next question

2. Use simple placeholder questions for now
3. Prepare clean extension points for:
- AI question generation
- Scoring
- Levels
- Timed challenges
- SVG diagrams

--------------------------------------------------
ROUTING
--------------------------------------------------

Register a route such as:

/coordinate-geometry-quest

The quest must load without errors.

--------------------------------------------------
ARCHITECTURAL PRINCIPLES
--------------------------------------------------

- Each sub-strand = independent quest module
- No hard-coding across quests
- All logic modular
- AI hooks isolated in utils or hooks
- Code must be readable and extendable by other contributors

--------------------------------------------------
DELIVERABLES
--------------------------------------------------

1. A working Vite React project
2. GitHub repository connected and pushed
3. Coordinate Geometry Quest loading successfully
4. Clean commit history
5. README explaining:
   - Project purpose
   - Folder structure
   - How to add a new quest
   - Where AI plugs in

--------------------------------------------------
IMPORTANT
--------------------------------------------------

Do NOT:
- Collapse all geometry into one folder
- Hard-code curriculum logic
- Skip routing
- Use System32 paths or OS-specific hacks

This project is intended to scale to **hundreds of quests**.

Begin by scaffolding the project correctly, then implement Coordinate Geometry Quest as the reference model for all others.
