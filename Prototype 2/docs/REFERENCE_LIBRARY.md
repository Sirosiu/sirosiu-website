# Reference Library

Record user-provided websites, repositories, interactions, and visual references. Separate observed behavior from interpretation. A reference is a learning source, not permission to reuse its design, code, text, or assets.

## Research method

Review one reference site at a time. Observe the live interface and interactions, then search GitHub for an official or clearly associated source repository where available. Keep live-site observations separate from repository evidence. Treat lookalike or inspiration projects as secondary examples, never as the original site's source. Do not copy code or assets; verify provenance and license separately before any reuse.

## HOLMCHROME — Portrait Photography

- **Source:** [holmchrome.byholm.co](https://holmchrome.byholm.co) — concept by HOLM.
- **Inspected:** Initial review on 2026-10-25 at a narrow phone-sized viewport (about 375 × 667), followed by a responsive review on 2026-10-25 at phone (390 × 844) and tablet (768 × 1024) sizes. Used the live UI and accessibility tree. No source code or assets were downloaded.
- **Status:** Researched; no technique or asset approved for implementation.

### Component map — observed

| Component | What it does |
|---|---|
| Persistent brand/menu header | Keeps the HOLMCHROME wordmark and round menu control visible across pages. |
| Portrait viewer / frame counter | Leads with one large portrait framed like a film negative, with a shot number and title/location label. The work view exposes 13 named portrait frames. |
| Menu overlay | Opens a dark panel over a blurred page; links to Work, Index, Journal, Info, Privacy, Imprint, and the HOLM studio. |
| Work index | Shows portraits as a dense contact-sheet grid inside repeated film-strip frames. Selecting a portrait opens its project view. |
| Project detail | Shows project title, photographer, location, year, credits, and a vertical sequence of photos; round Previous/Next controls move between projects, and Back to Works returns to the collection. |
| Info page | Combines a full portrait with camera/focus markings and exposure metadata, then studio description, services, selected recognition/clients, contact links, and footer. |
| Journal issue | Frames the Journal as an annual print issue, with a photographic cover, issue metadata, a contents spread, and scroll-driven turns through story previews. |
| Journal story preview | Shows one large print on the left page and a numbered, dated/location-tagged headline, short synopsis, and “Read the full entry” link on the right. |
| Journal article | Turns a selected preview into a long-form photo essay: large prints alternate with short editorial passages, print numbering, and persistent entry/date/location context; the end links to the next entry and all entries. |

### Interactions verified

- Opened the navigation and selected Index, Info, and Journal; choosing a destination dismissed the overlay. The overlay visually blurs the page behind it.
- Opened Index from the menu, selected a project, used Next to switch projects, and returned to Works. The selected-project view updated in place while the address remained on `/index`.
- Opened Info and Journal from navigation.
- Scrolled the Journal from its cover to an inside spread, opened an entry, and scrolled through its image-and-text story.

### Journal — detailed re-review, 2026-10-25

- Revisited the live [Journal](https://holmchrome.byholm.co/journal) and the [“One roll, one light” entry](https://holmchrome.byholm.co/journal/one-roll-one-light) directly. The desktop sequence is an issue cover → contents spread → scroll-through story previews → full article. The transitions are controlled by scrolling and presented as opening/turning pages; the issue asks the reader to “Scroll to open” and later “Scroll to turn the page.”
- The cover identifies **Issue 06**, **Autumn 2026**, and “Notes from the darkroom”; its cover story is “One roll, one light,” Istanbul, page 04. A small contents list previews the other stories.
- The warm paper-colored contents spread uses a visible center fold and subtle cyan/red fringing against a nearly black field. It lists six dated/location-tagged pieces: “One roll, one light” (Istanbul, 18.09.2026), “Contact sheet mornings” (Berlin, 02.09.2026), “Pushed to 1600” (Milan, 21.08.2026), “Between takes” (Athens, 30.07.2026), “Printing in winter” (Glasgow, 14.01.2026), and “What the edge keeps” (Lisbon, 05.12.2025). Facing-page copy describes six darkroom notes and hand-printed fibre-paper portraits.
- Each preview gives the image a full page and keeps the story number, date, place, title, short excerpt, and “Read the full entry” action together on the facing page. The scroll sequence makes the magazine itself the navigation structure.
- In the full first entry, the header repeats entry number/date/place; a small “Developer” elapsed counter is visible, but its purpose is not explained. Three prints are numbered. Short text passages are interleaved with large photographs and generous dark negative space. The story opens with one roll, one light, and the sitter’s thirty-six chances; later text describes the sitter settling into the portrait and the photographer reviewing the contact sheet. The end offers “Next entry” and “All entries.”
- **Responsive re-check:** the tablet viewport (768 × 1024) showed the paper spread spanning almost the full viewport width. At phone size (390 × 844), the browser capture showed only the left portion of the spread beside a blank area; this may be a device-emulation/rendering artifact, so it is recorded as inconclusive rather than a confirmed mobile layout defect. The site was returned to the desktop viewport afterward.
- **GitHub/source check:** a focused GitHub search for the exact domain and HOLMCHROME did not find a verified official site repository. This is not proof that no private or unindexed source exists. No source code or assets were downloaded.

### User preference — provisional, needs confirmation

The user says they like the Journal section. My working interpretation is that the appeal is its editorial annual-magazine experience: an issue cover and contents page lead into scroll-driven page turns, then intimate photo essays pair large prints with concise writing and date/place details. This is only an interpretation of the user's preference, not an approved SIROSIU design decision. Confirm which parts they mean before treating any as requirements.

### Phone and tablet review — 2026-10-25

| Viewport | Observed layout and behavior |
|---|---|
| Phone — 390 × 844 | The settled Home view keeps the wordmark at upper left and a round hamburger at upper right. A curved film strip spans the middle, with one larger selected portrait and neighboring frames partly cropped at the screen edges. The current frame number/title sits near the bottom left. The wide desktop-like exposure label is not visible in this phone view. Opening Menu blurs the photo scene and displays a black rounded panel almost the full phone width; Work, Index, Journal, and Info stack vertically, with Privacy and Imprint links below a divider. An early screenshot during page settling showed only a circular portrait against black; a later capture showed the loaded film-strip composition, so the earlier state was treated as a transient load state. |
| Tablet — 768 × 1024 | The same white canvas and fixed header remain. The film strip is much wider, with the selected portrait larger and adjacent frames clipped at both sides. The frame counter/title sits at the bottom left and the ISO/aperture/shutter readout appears at the bottom right. Opening Menu blurs the scene and positions the rounded black navigation panel in the upper-right area, leaving more of the scene visible than on phone. |

At these tested widths, the main site changes its framing and menu placement while preserving the film-strip metaphor and navigation. The Journal received a separate desktop re-review and a tablet check; its phone capture was inconclusive. These observations do not establish full breakpoint coverage or accessibility quality.

### Lessons to consider for SIROSIU

- Give each portfolio project a clear browsing state: collection → selected project → previous/next → collection.
- Pair visuals with concise metadata so visitors can orient themselves while exploring.
- A custom interface metaphor can make navigation feel part of the subject matter; it should still keep labels and controls understandable.
- An editorial journal can give process notes their own format, if SIROSIU has real material to support it.

These are options for discussion, not approved design decisions. Do not copy HOLMCHROME's film-stock concept, exact layout, typography, copy, or photography. Any third-party visual assets would need their own provenance and permission review in `ASSET_REGISTER.md`.

### Coverage limits

The initial review was phone-sized; the responsive follow-up covered only 390 × 844 and 768 × 1024. A route-specific desktop re-review covered the Journal only; the rest of the site's desktop behavior, other breakpoints, landscape phone, performance, keyboard-only use, reduced motion, and formal accessibility were not audited. The accessible tree exposed named links, buttons, and a skip-to-content link, but that alone does not establish accessibility conformance.

## RIY3.0 Hive — Cinematic product story

- **Source:** [riy3.com](https://riy3.com/) — credited on the site as a fictional creative project by UITOP.
- **Inspected:** 2026-10-25 in the visible in-app browser at an approximately 800 × 800 viewport, then revisited at phone (390 × 844) and tablet (768 × 1024) sizes. Reviewed the loading/entry experience, all nine chapter labels and their narrative content, the chapter menu and keyboard hints, the Intercept sequence, the briefing form without submitting it, and the active visual states. No site source code or assets were copied or reused.
- **Status:** Researched; no technique, copy, claim, visual design, or asset approved for implementation.

### Experience structure — observed

This is a single-page, full-screen scrollytelling experience rather than a conventional multi-page site. It opens with a staged "hive boot" preloader and then follows a nine-chapter product narrative. The chapter menu exposes direct hash links (`#prologue` through `#briefing`) and the displayed keyboard hints say `1–9` jump, arrow keys step, and `m` toggles sound.

| Component | What it does |
|---|---|
| Boot preloader | Shows a wireframe aircraft/carrier drawing, a progress indicator, and a fictional systems checklist (lift fans, sensor turret, mesh link, swarm, night sky). A gated “Enter Hive” action introduces the main experience. Sound is called out at entry. |
| Persistent HUD | Places the chapter number/menu at upper left, the RIY3.0 wordmark at top center, and a sound toggle at upper right. A location/time readout, crosshair/scan details, award label, cursor reticle, and studio credit reinforce the simulated mission-console framing. |
| Chapter navigator | Opens a dark overlay with nine numbered chapter links and keyboard guidance. Selecting a chapter changes the active scene while the page remains on the same route. |
| Cinematic scene canvas | Uses a large 3D carrier/interceptor visualization with atmospheric lighting, cloud-like backgrounds, grid/radar markings, scan beams, orbit paths, and restrained overlays. The object, camera framing, and background treatment change as the story advances. |
| Chapter copy and metrics | Combines a short chapter tag or number, one oversized headline, and a brief supporting line. Key figures are isolated as large visual anchors rather than embedded in dense paragraphs. |
| Intercept sequence | Breaks “how it works” into four numbered states: Detect, Release, Close in, Return. Each state pairs one operational point with a related vehicle animation/scene. The menu advertises arrow-key stepping. |
| Swarm visualization | Shows a central carrier with a ring of twelve interceptors over a tactical grid, visually explaining the one-operator/multiple-vehicle premise. |
| Economics comparison | Contrasts one Patriot missile with 7,291 Osa sorties, then gives a short cost/sortie claim. The figures are part of the site's explicitly fictional concept and are not verified facts. |
| Deployment chapter | Uses the carrier and a prominent time figure to explain a compact deployment story, supported by a single short line. |
| Briefing CTA and modal | The last chapter ends with “Request a briefing.” The modal asks for full name, organization, work email, country, and protection need, then offers a send action. The modal was inspected and closed without entering or sending data. |
| Footer/legal links | Credits UITOP and links to export compliance and privacy pages; the site itself discloses that it is a fictional creative project. |

### Chapter sequence — observed

| No. | Chapter | Narrative role and visible content |
|---|---|---|
| 01 | Prologue | Establishes a nighttime threat setting with a Kharkiv/time HUD and a short line about attack drones and warning time. |
| 02 | Threat | Frames the speed problem with a `550 km/h` headline and launch-count comparison. |
| 03 | Hive | Introduces the carrier and its twelve interceptors. |
| 04 | Anatomy | Focuses on the “Matka” carrier as an industrial design study and labels a 3.8 m wingspan. |
| 05 | Intercept | Explains detection, release, closing speed, and return as four consecutive substeps. |
| 06 | Swarm | Explains the one-operator/twelve-hunter relationship and mentions a mesh link with no GPS. |
| 07 | Economics | Makes a scale/cost comparison using a missile, sorties, and per-unit figures. |
| 08 | Deployment | Pitches a pickup-to-sky setup time and two-person/one-truck operation. |
| 09 | Briefing | Restates the protection promise and presents the briefing request form. |

**Claim caveat:** the footer explicitly says the whole site is fictional. Treat all scenario details and numbers (including speed, launch counts, cost, sorties, and deployment time) as concept copy, not reliable real-world information.

### Interactions verified

- Waited for the staged loading progress to finish; “Enter Hive” became available and opened the main experience.
- Opened the chapter menu and confirmed all nine labels and the keyboard shortcut guidance in the visible interface and accessibility tree.
- Jumped between chapters using the chapter controls; the chapter indicator and scene content updated without a conventional page navigation.
- Replayed the story at an 800 × 800 desktop viewport: scrolling advanced the visible chapter and changed the 3D scene in place. Captured chapter states 03/09, 05/09, 06/09, 08/09, and 09/09; the aircraft/carrier changed scale and framing as the environment and chapter content shifted around it. The visual transitions appeared smooth during this pass, but animation frame rate/performance was not measured.
- Viewed Intercept's Detect state and observed its scan-beam/carrier pairing; its four named substeps are exposed in the page structure.
- Pressed the right-arrow key while on Intercept; the experience advanced through its animated transition and landed on Swarm. This verifies progression by arrow key, though the exact per-press timing between substeps was not measured.
- Opened and closed the briefing modal without submitting the form.

### User preference — provisional, needs confirmation

The user says they like “how smoothly the jet moved when we scrool throughout the website.” My interpretation is that they especially like the scroll-linked 3D vehicle choreography: as the narrative advances, the aircraft changes position/scale/framing and remains a moving visual thread through the chapter scenes. The appeal is the continuity between scrolling, scene transitions, and vehicle motion, rather than simply having a 3D model on the page. Smoothness is the user's impression; I did not measure frame rate. This interpretation is not yet confirmed and is not an approved SIROSIU design decision.

### Lessons to consider for SIROSIU

- A chaptered story can make a complex project easy to understand: establish a need, introduce the system, show its anatomy and operating sequence, explain scale/cost/deployment, then provide a clear next action.
- Give each chapter a single job, one memorable headline, and supporting evidence. Use a sequence diagram or restrained 3D object movement only where it clarifies a real process.
- A persistent chapter indicator, direct chapter navigation, and keyboard hints can help people orient themselves inside a long immersive page.
- Tie motion to the information being explained; the visuals here change from a product reveal to a scan beam, a swarm/radar diagram, and an economic comparison.
- A closing contact action feels connected to the story. Any real SIROSIU form would need accurate copy, a clear privacy explanation, and a tested submission path.

These are options for discussion, not approved design decisions. Do not copy RIY3.0's military product premise, exact chapter copy or figures, HUD styling, vehicle concept, 3D models, sound, layouts, or branding. The reference demonstrates presentation patterns only; its disclosure makes it especially important not to repeat its figures as factual content. Any third-party visual or code asset would need independent provenance and license review in `ASSET_REGISTER.md` before consideration.

### Coverage limits

This was an observational UI pass at one approximately square/desktop-like viewport, followed by phone and tablet checks at the sizes listed above. Other breakpoints, landscape phone, performance, source implementation, keyboard-only operation beyond the advertised arrow progression, reduced-motion behavior, and formal accessibility conformance were not audited. The accessibility tree exposed headings, chapter links, a named sound checkbox, and the request button, but this does not establish accessibility conformance. No assets were downloaded or reused.

### Phone and tablet review — 2026-10-25

| Viewport | Observed behavior |
|---|---|
| Phone — 390 × 844 | The experience keeps a full-height, portrait scene. The carrier and atmospheric background fill the screen and are cropped to the tall frame; the active chapter heading and short supporting copy sit near the lower left. The HUD stays along the top (chapter/menu at left, wordmark centered, sound control at right), while the fixed award ribbon occupies the right edge. Opening Chapters places a compact dark panel over the upper-left scene with all nine numbered links and the shortcut hint. Choosing 05 Intercept updates the chapter counter and begins at the Detect substep. |
| Tablet — 768 × 1024 | The same portrait, full-height story composition and fixed HUD remain. The scene has more horizontal room, and chapter copy stays low and left. The chapter overlay remains at the upper left but grows wider, giving its labels and keyboard hint more breathing room; it still overlays rather than replaces the 3D scene. Choosing 05 Intercept opens the same Detect substep. |

Across both sizes the large scene remains the visual focus, and chapter copy stays separate from it as an overlay. The phone menu is noticeably denser; the tablet menu is easier to scan. The chapter indicator, wordmark, sound control, and award ribbon persist across the checked states. These observations cover two portrait viewport sizes only; they do not establish behavior on other devices or accessibility compliance.

### GitHub source search — checked separately

Searched GitHub repositories for `riy3.com`, `RIY3.0 Hive`, `riy3`, `UITOP`, and `uitop.design`, plus code search for the domain and brand. No repository could be verified as the original RIY3.0 site or an official UITOP source repository. Search results for the domain included unrelated domain lists and third-party projects that cite the site as inspiration; those are not source evidence.

One secondary example was inspected read-only: [Snowflake2007/Rosevera](https://github.com/Snowflake2007/Rosevera). Its [README](https://github.com/Snowflake2007/Rosevera/blob/main/README.md) describes a separate botanical-skincare showcase. Its [App.tsx](https://github.com/Snowflake2007/Rosevera/blob/main/src/App.tsx), [HeroSection.tsx](https://github.com/Snowflake2007/Rosevera/blob/main/src/components/HeroSection.tsx), and [Navbar.tsx](https://github.com/Snowflake2007/Rosevera/blob/main/src/components/Navbar.tsx) explicitly label some areas as inspired by riy3.com. This is a derivative/inspiration example, not RIY3.0's implementation.

### Secondary code example — component responsibilities observed in Rosevera

| Component/file | Responsibility visible in the inspected source |
|---|---|
| `src/App.tsx` | Acts as the experience coordinator: tracks scroll progress, active 3D ingredient/finish/camera state, manual explosion, reduced motion, and sound; maps that state to the story sections, a fixed Three.js canvas, and a bottom control dock. |
| `src/components/HeroSection.tsx` | Combines the opening headline and calls to action with a video reveal that scales and changes corner radius as scroll progress advances; supplies play and mute controls. Its comments cite riy3.com as inspiration for the video-portal treatment. |
| `src/components/Navbar.tsx` | Provides section navigation, a dedicated exploded-3D action, a fixed header that changes appearance on scroll, and a compact mobile drawer. A comment cites riy3.com for chapter-link inspiration. |
| `JarCanvas` and section components (listed in `App.tsx`/README) | Separate the persistent 3D product render from content sections such as ingredients, exploded view, formulation, research, gallery, and reassembly. The orchestration passes scroll-derived state and interaction callbacks between them. |
| `BottomControlDock` and `ambientSoundscape` (listed in `App.tsx`/README) | Group scene controls (explosion, finish, rotation, camera, reduced motion, audio) in a dock and isolate ambient audio behavior in a utility. |

These are findings about the secondary Rosevera repository, not claims about RIY3.0's internals. The repository's license was not checked because nothing will be imported or reused; no dependency was installed and no code was run. Use this only as an example of one way to structure a related scroll-driven 3D experience, not as an authoritative technical reconstruction of RIY3.0.

## Daniel Ingrassia — Creative frontend portfolio

- **Source:** [ingrassiadaniel.it](https://ingrassiadaniel.it/) — titled “Daniel Ingrassia | Creative Frontend Developer”.
- **Inspected:** 2026-10-25 in the visible in-app browser at an approximately 800 × 800 viewport, then revisited the home page and Lea Winery case study at phone (390 × 844) and tablet (768 × 1024) sizes. Reviewed the home scroll sequence and all four linked case-study routes. Used visible UI and accessibility-tree content; no project source or assets were copied or reused.
- **Status:** Live interface and source research are complete. On 2026-10-26, the user asked to adapt the particle portrait/cursor/scroll/map/projects/contact experience for SIROSIU Portfolio 01. The local prototype uses original Canvas 2D behavior and user-specific placeholder content; it does not use the reference site's source, image, or media. The user supplied their own portrait on 2026-10-26 for the local star field.

### Experience structure — observed

The home page is a long, scroll-led portfolio with no conventional top navigation visible in the inspected state. A persistent-looking particle scene transforms as the viewer scrolls; short text sections and the selected-work list are layered into that visual journey. Project links open dedicated `/projects/...` case-study pages.

| Component | What it does |
|---|---|
| Particle loading screen | Opens on a dark star-like particle field with a percentage indicator, then reveals the portfolio when assets load. |
| Identity hero | Forms a large human bust from points, with the name at the left and “Creative Frontend Developer” at the right. The composition leaves most of the screen dark and uses small, restrained type. |
| Scroll-reactive particle scene | The point cloud changes from a portrait to broad flowing bands, a sphere, and an Italy-shaped map as the viewer scrolls. A bright pointer-associated point/trail moves across the scene; in the live re-review the bust appeared to subtly turn toward the pointer. The exact renderer and interaction implementation remain unverified. |
| Positioning copy | Identifies the developer as based in Italy and explains the service: frontend development, motion, performance, and creative partnership for agencies/designers/creative teams. A second paragraph emphasizes adding creative judgment rather than only implementing a supplied design. |
| Selected-work list | Shows four project links with years over the animated scene: Lea Winery (2025), Stephen Young (2024), Fratelli Simonetti (2025), and Michael London (2026). |
| Project case-study template | Each route opens with a Back to work control, project name/year, a large visual or media preview, a concise project thesis, collaborator credit, project context, a clearly attributed development role, a stated technical stack, and a Visit site link. |
| Collaboration/role disclosure | The case studies distinguish Daniel's website development work from the agencies' brand identity, creative direction, and website design. AWD Agency is credited for Lea Winery and Fratelli Simonetti; Studio Krista for Stephen Young and Michael London. These are claims made by the portfolio. |
| Technical-stack block | Presents the site's stated stack as short prose plus individual technology labels, making the development contribution easy to scan. The stack statements were not independently verified against the client sites or source code. |
| Contact panel and footer | Ends with a large email address (`hello@ingrassiadaniel.it`) and LinkedIn link. The footer also shows the name, a business/VAT identifier, and a cookie-policy link; it states that the website does not use cookies. |

### Case-study details — site-stated

| Project | Description and collaborator | Stack listed on the case study |
|---|---|---|
| [Lea Winery](https://ingrassiadaniel.it/projects/lea-winery), 2025 | Winery in Friuli; AWD Agency is credited. The portfolio describes a 132-hectare estate and frames the challenge around patient pacing and texture. Daniel says he led website development; brand, creative direction, and website design are attributed to AWD Agency. | Custom WordPress theme, SCSS, Webpack, GSAP, Lenis, Barba.js, Rellax, Glide.js, Google Maps API, Vanilla Marquee. |
| [Stephen Young](https://ingrassiadaniel.it/projects/stephen-young), 2024 | Luxury interior design studio; Studio Krista is credited. The challenge is described as communicating calm confidence without competing with the interiors. Daniel's development role and Studio Krista's design/identity role are separated. | Custom WordPress theme, SCSS, Webpack, GSAP, Lenis, Barba.js, parallax scrolling, custom audio/video player. |
| [Fratelli Simonetti](https://ingrassiadaniel.it/projects/fratelli-simonetti), 2025 | Multi-brand furniture, bathroom, wellness, and building-material showroom; AWD Agency is credited. The stated design challenge is keeping a broad catalog coherent across departments. | Custom WordPress theme, SCSS, Webpack, GSAP, Lenis, Barba.js, Rellax, Glide.js, Isotope, Vanilla Marquee. |
| [Michael London](https://ingrassiadaniel.it/projects/michael-london), 2026 | Interior design studio; Studio Krista is credited. The page emphasizes letting project work lead and keeping the site restrained. | Custom WordPress theme, ACF, custom post types, SCSS, Webpack, GSAP, Lenis, Barba.js, Glide.js. |

Treat the businesses, dates, technologies, and role breakdowns above as portfolio-published information, not independently audited facts.

### Interactions verified

- Scrolling advanced the portfolio composition through the point-cloud portrait, broad particle forms, selected work, and a large email/contact panel.
- The selected-work region exposed the four project routes and their years in the accessibility tree.
- Opened the Lea Winery project and reviewed its case-study layout and content. Returned to the home route, then opened the Stephen Young, Fratelli Simonetti, and Michael London routes directly using the observed project URLs.
- Each case-study route exposed a Back to work control, a project visit link, collaborator credit, development-role explanation, and stack information.
- The case-study visual preview for Lea Winery showed changing website imagery; the Stephen Young page showed a layered composition of interior/project captures. These appeared to be media previews, but their playback controls and interaction were not separately tested.

### Detailed live re-review and user preference — 2026-10-26

- Revisited the live home page at 800 × 800. The loading sequence displayed a percentage counter from 0% to 100% before revealing the point-cloud portrait. The portrait resolves from many small, star-like points against a charcoal background, with the developer name and role placed at opposite sides of the composition.
- Moved the pointer across the portrait. A bright point with a short luminous trail followed the pointer over the particle face; the bust appeared to subtly reorient toward the cursor. This is a live visual observation, not a source-level explanation of how the response is made.
- Scrolled through the home sequence again: the portrait slides toward the right as positioning copy comes in; later the particle form becomes a sphere with curved surrounding copy, then an Italy-shaped particle map alongside the exact location label “Based in Italy,” then flowing particle bands behind the selected-work cards, and a larger particle sphere near the end. The scroll-linked particle scene gives the page a visual thread from identity to location, work, and contact.
- In the work region, the moving particle band appears as a twisting, DNA-like strand behind/around the project cards. The user describes it as a DNA strand; the sampled live states verify the flowing strand-like shape, but not a technical or creator-assigned name for it.
- **User's stated likes:** the star-particle portrait reveal; its glow and subtle lean toward the cursor; the custom cursor; the portrait moving aside during scroll; the animated percentage counter; the “Based in Italy” wording with the particle map; and the later DNA-like particle strand.
- **User's proposed SIROSIU adaptation:** make the portrait dissolve back into stars in a later transition, echoing its appearance from stars. This is a requested design idea, not a behavior I observed on Daniel's site; its timing and role in the SIROSIU story are still to be discussed.
- “The counter” is recorded as the loading percentage (0% → 100%), which is the counter verified during this pass. If the user meant a different counter, update this note after clarification.
- **GitHub/source status:** the earlier focused search found no verified repository for the original portfolio. The interaction description remains based on the live UI; do not attribute a specific particle library or animation implementation to the site.

### User preference — confirmed by user, 2026-10-26

The user confirmed this interpretation: carry over the particle portrait's personality and interaction—a person formed from stars, a glowing cursor that subtly influences its pose, and a scroll transition that moves the portrait aside before developing the same particle world into a location graphic, strand, and work visuals. They also like the entry counter (verified here as the 0% → 100% loading percentage) and concise “Based in Italy” location statement. For SIROSIU, they want a matching particle dissolve as an exit, so the portrait appears and later disappears through the same star field. This is a confirmed user preference and implementation direction. Its first local SIROSIU adaptation is in `site-next/`; the user has now supplied the portrait, while project/contact content remains open.

### Local particle comparison and refinement — 2026-10-26

- The user said the first SIROSIU render had too few stars and lacked smoothness. The prior scene generated 1,800 desktop / 1,250 phone points and sampled the full image rectangle, which did not match the dense, fine-point silhouette documented above.
- For the local refinement, a neutral-background matte was derived from the user's photo without sending it to an external service. The source image remains outside the project; a 768 px transparent derivative is sampled by Canvas and is not shown directly as a photo.
- Point count increased to 16,500 desktop / 10,500 phone, with less clustered sampling, luminance-varied points, subtle glow, a 60 fps cap, and time-based easing.
- **Comparison limit:** Work browser controls were disabled during this refinement, and the web access tool could not open the site. The comparison uses the previously observed live reference and saved visual notes; this is not a new live-site inspection. The original site still has no verified public source repository, and no reference code or media was copied.

### Lessons to consider for SIROSIU

- Show project work alongside the atmospheric identity: the point-cloud scene is memorable, while the case-study pages provide titles, years, outcomes/context, credits, and implementation details.
- State the user's exact contribution and collaborator roles in each project. This makes a portfolio more credible and prevents design work from being attributed to the wrong person.
- Use a reusable case-study structure, but let the challenge and implementation details differ by project rather than repeating generic copy.
- A scroll-reactive visual can provide a visual through-line, but essential identity, project links, and contact information should remain available without relying on that animation.
- A large, direct email contact can make the next step clear; pair it with any other verified contact path the user wants to offer.

The user later directed a SIROSIU-specific adaptation of the high-level interaction ideas. Keep its layout, point treatment, copy, typography, colors, and project presentation original. Do not reproduce the exact reference composition or copy any project previews/client-site visuals.

### GitHub source search — checked separately

Searched GitHub repositories for `ingrassiadaniel.it`, Daniel Ingrassia's name, and portfolio/role wording; searched code for the exact domain and name. No public repository could be verified as the source for this portfolio. Exact-domain code search returned no results. A name-only match was an unrelated 2015 Fab Academy class page and was excluded. The visible portfolio links reviewed exposed email, LinkedIn, client/collaborator links, and the cookie policy, but no GitHub source link.

Because no associated source repository was identified, there is no code-based reconstruction of this site's components. All component behavior above comes from the live interface; the stack lists are the portfolio's own claims.

### Coverage limits

This was an observational UI pass at one approximately 800 × 800 viewport, followed by phone and tablet checks at the sizes listed below. Other breakpoints, keyboard-only use, reduced-motion support, performance, the particle renderer's implementation, the case-study media controls, and formal accessibility conformance were not audited. The accessibility tree exposed the project links, years, titles, case-study descriptions, contact links, and a Back to work button; that does not establish accessibility conformance. No source code or assets were downloaded, copied, or reused.

### Phone and tablet review — 2026-10-25

| Viewport | Observed layout and behavior |
|---|---|
| Phone — 390 × 844 | No conventional navigation menu is visible in the checked home states. The name sits at the upper left; the point-cloud portrait fills the tall hero, with the role near the bottom. Scrolling changes the portrait into broad particle forms and a sphere, while large positioning copy wraps into several lines. Selected projects appear one at a time in a vertical sequence: a wide preview, title at the left, and year at the right. The Lea Winery case page stacks its Back to work control, title/year, wide preview, thesis, body copy, collaboration/role disclosure, and technical-stack list in one column. The footer contact panel fits the email and LinkedIn path inside a large outlined frame, followed by the identity/legal links. |
| Tablet — 768 × 1024 | The same dark, full-height particle hero remains, with the portrait using more of the width and the role placed toward the lower right. The large particle forms and wide positioning copy have more room across the canvas. In the Lea Winery case page, the title and year sit above a wide project preview; the thesis and longer copy continue below in a single column. The technical-stack labels wrap across two rows. |

The checked home hero and representative case study preserve the same broad sequence and hierarchy at both sizes. On phone, the work preview is presented one at a time in the scroll flow; the tablet work-card composition was not separately captured. The initial blank/blurred states were transient loading or transition frames; settled captures showed the content. These checks cover two portrait sizes and one representative case study only, not every breakpoint or every case route.

## Anime.js — JavaScript animation engine

- **Source:** [animejs.com](https://animejs.com/) and the official [juliangarnier/anime](https://github.com/juliangarnier/anime) repository, linked by the site.
- **Inspected:** 2026-10-25. Revisited the landing page in the live in-app browser at about 787 × 760, scrolled through its major animated sections, opened the Getting Started docs and toggled the docs sidebar. Also reviewed official docs pages and read-only source in the repository README, package manifest, license, public entry point, scroll implementation, and draggable implementation. Completed a responsive live UI pass at phone (390 × 844) and tablet (768 × 1024). Revisited the home scroll rail and central camera/lens illustration on 2026-10-26.
- **Status:** Researched as a possible implementation library; not approved, installed, or imported.

Anime.js is a technical reference rather than a visual portfolio reference. Its public site presents it as an all-in-one JavaScript animation engine, with documentation and examples for property animation, transforms, scroll-linked animation, stagger, SVG, springs, dragging, timelines, responsive scopes, and browser Web Animations API support.

### Public product and documentation map

| Area | Role described by the official site/docs |
|---|---|
| Landing navigation | Provides entry points for Docs, Easings, Learn, examples on CodePen, GitHub, and sponsorship. |
| Quick-start code | Shows installation with `npm i animejs` and a small `animate()` example for a looping transform. |
| Property animation and transforms | Supports per-property animation parameters, keyframes, built-in easing, individual CSS transforms, function values, and blend composition. |
| Scroll Observer | Connects an animation's playback to scroll position or threshold events, with container, target, axis, enter/leave, synchronization, and callback options. |
| Timeline and stagger | Sequences animations and distributes values, delays, or timeline positions across a collection or grid. |
| SVG tools | Covers shape morphing, path drawing, and motion-path movement. |
| Draggable and springs | Supplies draggable targets, snapping, release behavior, and spring or easing-based motion. |
| Scope and responsive animation | Groups animations and supports media-query-dependent behavior and cleanup. |
| Modular delivery | The site lists feature-level bundle sizes and the package exports modular entry points, allowing a future build to import only a needed capability. |

The published examples include a scroll-synchronized square, a staggered grid/timeline, an SVG path-driven animation, and a draggable square with spring release behavior. These examples document the API's intended usage; the homepage's separate scroll-led animation sequence is described below from direct browser observation.

### Live interface — observed

| Component | What it does in the site |
|---|---|
| Global header | Shows the Anime.js v4 identity and links to Docs, Easings, Learn, Examples, GitHub, and Sponsor. The docs header additionally displays the selected release version (4.5.0 during this inspection). |
| Opening hero | Uses an oversized, compact headline and a short library description, followed by a Learn More action and sponsor attribution. The page starts on a dark field with a vivid circular animation illustration. |
| Animated feature gallery | Presents the engine's capabilities as successive scroll-led sections. The headline color and central demonstration change by section: a rotating/transforming square, small transform examples, a path/arrow for SVG, a green responsive layout example, and other visual states accompany the corresponding feature title and one-sentence explanation. |
| Scroll progress rail | A thin, persistent-looking strip along the bottom of the viewport has many ticks and a colored position marker. As scrolling advances the page, the marker moves and the illustration updates. |
| Exploded module illustration | A camera/lens-shaped 3D assembly changes angle and scale as the page scrolls. It shifts from a shaded, compact model on the dark field into a light, technical line drawing with separated lens-like components and labels for engine features, then leads into the bundle-size visualization. This is the site's visual metaphor for the modular engine. |
| Code examples | Pair code snippets with animated visual examples and individual Copy buttons. The snippets demonstrate transforms, random/function values, SVG path/morph/draw, scroll sync, grid staggering, draggable spring release, timelines, and responsive scopes. The Copy buttons were not activated. |
| Bundle-size visualization | Shows module labels, size figures, and a colored stacked bar alongside the exploded assembly. The readout changed while scrolling, so the displayed number is a stateful illustration rather than one fixed package-size claim. |
| Documentation shell | Provides a version selector, a documentation heading/sidebar toggle, search control, and previous/next demo controls. Opening the sidebar reveals grouped API sections and subtopics. The main docs page has an introduction, section links, previous/next navigation, and a small floating demo panel that can be minimized. |
| Docs content organization | Groups detailed API pages by Getting Started, Timer, Animation, Timeline, Animatable, Draggable, Layout, Scope, Events, SVG, Text, Utilities, Easings, WAAPI, Engine, and Adapters. The inspected v4 sidebar marks Text and Adapters as new and exposes a Three.js adapter section. |
| Footer | Repeats links to docs, easing editor, learning material, social channels, CodePen, GitHub, and sponsorship; includes a newsletter email field. No email was entered or submitted. |

### Interactions verified

- Scrolled from the hero through the toolbox and feature sections. The page advanced its bottom position marker, changed the central animation to match the active feature, and transitioned between dark and warm-gray backgrounds.
- Observed the modular engine illustration move between assembled and exploded views, with module labels and changing size values.
- On a 2026-10-26 re-review, followed the bottom rail and central 3D camera/lens illustration through several scroll states. The narrow, fixed-looking rail contains many ticks and a red position marker that advances horizontally; the central object changes framing and orientation, then separates into an exploded technical view with labels.
- Opened the Getting Started documentation and toggled its sidebar open. The sidebar exposed grouped API categories and nested entries; clicking Getting Started opened its own documentation route and displayed installation/import usage links.
- The version selector showed 4.5.0 as selected, with 3.2.2 and 2.1.0 also listed. The selector itself was not changed.
- Did not activate code-copy, external sponsor, subscription, or demo controls; no form data was sent.

### User preference — provisional, needs confirmation

The user likes the bottom scroll indicator and the central 3D camera as it changes through the page. My interpretation is that the ticked rail makes scroll progress easy to see, while the camera/lens changes angle, scale, and assembly state in step with the page, so the long page feels like one coordinated visual sequence. I have not confirmed whether they mean only the dark bottom progress rail or also the browser scrollbar. The official Anime.js repository documents the animation library's Scroll Observer, but it is not the homepage source; the camera and rail behavior above comes from the live site. This is a recorded preference, not an approved SIROSIU design decision.

### Phone and tablet review — 2026-10-25

| Viewport | Observed layout and behavior |
|---|---|
| Phone — 390 × 844 | The home headline wraps to two lines above a circular, multicolor engine illustration that nearly spans the viewport width; the short description also wraps, with Learn More at the lower left and sponsor attribution at the lower right. The global menu opens as a dark panel from the right over the dimmed page, with icon-led links. Docs use a compact two-row header: brand/version and global menu above the current topic/sidebar toggle, search, and previous/next demo controls. Documentation content becomes one column. The topic tree opens in a full-height left drawer over the dimmed page; Getting Started expands to four vertically stacked subtopic links. The in-page section links are full-width stacked rows, followed by previous/next navigation, and a small demo preview floats near the lower-right corner. |
| Tablet — 768 × 1024 | The home headline fits on one line, with the short description beneath it and the circular engine illustration centered below; Learn More and sponsor attribution remain anchored near opposite lower corners of the hero. The global navigation still collapses behind a hamburger. Getting Started documentation remains a single reading column with full-width section rows and previous/next navigation. Its topic tree opens as a left drawer roughly 220 px wide, overlaying and dimming the page. The sponsor area follows the documentation navigation, while the small demo preview remains near the lower-right corner. |

These checks cover the home hero, global menu at phone size, and Getting Started documentation/sidebar at both portrait sizes. Other breakpoints, landscape phone, keyboard-only interaction, reduced-motion behavior, performance, and formal accessibility conformance were not audited.

### Official source map — read-only

| Source area | Responsibility supported by the inspected source |
|---|---|
| `src/index.js` | The public barrel exports timer, animation, timeline, animatable, draggable, scope, events, engine, easings, layout, utilities, SVG, text, WAAPI, type helpers, and globals. |
| `src/events/scroll.js` | Maintains scroll containers and their observers. The inspected `ScrollContainer` tracks scroll positions, dimensions, velocity, and direction; it uses timers plus `ResizeObserver` and a scroll listener to update child observers. |
| `src/draggable/draggable.js` | Builds a draggable interaction around a target, trigger, optional container, axes, padding/friction/snap settings, scroll state, callbacks, and release behavior using a spring or parsed ease. |
| `package.json` | Declares package version `4.5.0` at inspection, ESM/CJS/type entry points, a modular exports map, and build/test scripts. |
| Distribution layout | The repository contains source, tests, examples, distribution files, and assets, which supports reviewing a capability before adding it to an application. |

This is source evidence for Anime.js itself, not a reconstruction of a different website. No source was copied, run, modified, or added to the SIROSIU repository.

### Potential SIROSIU use — subject to later approval

- Use small, content-led transitions for headings, cards, and project details if the approved design needs them.
- Use a scroll-linked sequence only when it explains an actual process or changes the meaning of a section.
- Consider SVG drawing or a short stagger for a real diagram or collection, provided the content remains understandable with motion reduced or disabled.
- Avoid adding draggable behavior, 3D-like effects, or a broad animation dependency merely for decoration. Choose the smallest capability that supports an approved interaction.
- Before any adoption, define reduced-motion behavior, a loading/performance budget, target browsers, and the exact import needed.

### License and reuse record

The official repository is licensed under MIT (copyright notice in the repository: Julian Garnier, 2025). MIT permits use, modification, and distribution when the required copyright and license notice accompany applicable copies or substantial portions. This is an initial licensing record only; adding the dependency or reusing code requires a later user-approved technical decision and a final package/license check at the selected version.

### Coverage limits

The landing-page sequence was reviewed at one desktop-like viewport; phone and tablet checks covered the home hero and a representative documentation page at 390 × 844 and 768 × 1024. Other breakpoints, landscape phone, pointer-specific behavior of the demonstrations, keyboard navigation beyond ordinary links, reduced-motion behavior, runtime performance, and formal accessibility conformance were not tested. The source review covered selected public modules only, not a full security or implementation audit. The bundle-size figures varied with scroll state and should not be read as a single measured production bundle for SIROSIU.

## Oryzo — satirical cork-coaster campaign

- **Live site:** [oryzo.ai](https://oryzo.ai/)
- **Official project record:** [Lusion project page](https://lusion.co/projects/oryzo_ai/)
- **Inspected:** 2026-10-25 in the visible in-app browser at approximately 803 × 760. Reviewed the scroll-led campaign, its major visual states, section anchors, review panels, product selector, and message-flip interaction. Completed a responsive live UI pass at phone (390 × 844) and tablet (768 × 1024), checking the opening scene, menu, feature panels, reviews, and footer. Revisited the scroll-led coaster and hand scene in Brave at a 1366 × 900 desktop viewport on 2026-10-26. This is a fictional campaign for a cork coaster; the AI/model claims and reviews are jokes, not product facts.
- **Status:** Research only. No code, imagery, models, or site assets were copied, downloaded, or reused; no design decision is approved by this entry.

Lusion describes Oryzo as a year-long internal experiment that uses an ordinary cork coaster to parody AI product launches while letting the studio explore physical-product storytelling. Its project page lists concept, web design/development, 3D design, WebGL, and animation among its services. The website discloses in its footer that Oryzo does not exist and no product is for sale. Treat its AI, performance, customer review, environmental, and product metrics as satire, never as factual product evidence.

### Live interface — observed

| Component | Role in the experience |
|---|---|
| Persistent header and progress rail | Keeps the Oryzo wordmark and INTRO, FEATURES, PRODUCT, and CONTACT anchors available over the long-form story. A thin vertical indicator gives a compact sense of progress. The PRODUCT link targets `#testimonies`, matching the order where reviews and later product comparison unfold. |
| Desk-scene hero | Opens with the coaster in a warm, believable creative-work desk scene. Product identity and “Made for mugs. Built for tables.” copy sit within the scene rather than on a detached generic hero. Small Lusion and “unnecessarily sophisticated” cues establish the playful studio tone. A video play affordance is visible; it was not activated. |
| Product reveal and AI hand gag | The camera moves from the desk into close product views and rotates the coaster through edge-on, top, and flipped orientations. “Isn't just a coaster” and “Powered by AI” elevate a mundane object with startup-launch language. A lifelike hand appears holding/presenting the coaster, alongside “We said high five. It heard six.” The page advertises a hand-hover interaction; its separate finger response was not independently confirmed in this review. |
| Wearable and social gags | A product wrapper and lifestyle framing push the coaster into an absurd wearable product category; mock social content continues the AI-launch parody. The sequence first borrows the visual grammar of premium hardware marketing, then makes its fiction obvious. |
| Feature 1: lift | A mug rises by roughly one coaster thickness. The left feature rail labels this “Rise above mediocrity”; the lower caption and equation make the physical effect legible as the visual changes. |
| Feature 2: thermal control | The desk switches to a purple/red/yellow heat-map view with steam and a vertical temperature control marked Creative T=10, Balanced T=1, and Deterministic T=0.1. The benefit copy, right-side control, and lower equation change as a coordinated state. A “visualization, not a warranty” disclaimer reinforces the joke. |
| Feature 3: circularity | The view shifts from a cutting mat to a dark engineering canvas, with a centered circle, edit handles, grid/ruler marks, and sketch annotations. “37.9% more circular” and “RoPE: Roundness Optimization & Perimeter Engineering” parody technical optimization language. |
| Flip-encryption module | A message field sits beside Encode/Decode controls and a coaster presented as the “smart flip encryption” device. The physical flip is the interaction; it is a visual pun, not cryptography. The second-pass test is recorded below. |
| Grip panel | A dramatic macro cork view includes a microscope-like measurement overlay, dotted marks, and “FRICTION COEFFICIENT (EST): 0.80.” This reads as a mock lab readout, not a verified material measurement. |
| Sustainability panel | Large editorial type and animated harvesting/material scenes state claims such as “100% plant-based,” 25-year first harvest, and nine-year bark regrowth. These are campaign statements and have not been independently fact-checked. The panel moves from product-like language into a satirical material-origin story. |
| Reviews and horizontal campaign gallery | A central angled coaster render, portrait/product imagery, star rows, quotes, and implausible personas create fake social proof. Later wide, horizontally composed panels include claims such as edge/cloud operation, 24/7 operation without power, RTX deployment, and a deliberately impossible drop-test date. These are jokes, not genuine testimonials or technical claims. |
| Product selector and comparison | ORYZO, ORYZO Pro, and ORYZO Pro Max controls change the hero stack from one to two to three coasters and swap descriptions, feature notes, and supporting diagrams. The comparison table makes stack/lift, cork material, no connectivity/pairing, never-updating behavior, and intended use comparable across variants. The selector was tested in the earlier pass and restored to base ORYZO. |
| “Open weight” and footer | The open-weight section links to a paper and OBJ model checkpoints while continuing the mock AI-research framing. The footer plainly says the project is fictional and nothing is for sale, then pivots into a Lusion studio pitch. Newsletter and share controls were not used. |

### Interactions verified

- Scrolled through the hero, AI, wearable, feature, review, gallery, and product-story states. The camera/artwork and copy change in coordinated beats; feature scenes transition through lift, thermal, and circularity visualizations.
- Opened the observed `#features` and `#testimonies` anchors. Inside `#features`, continued scrolling through the three staged feature scenes, grip, sustainability, reviews, and horizontal editorial panels.
- Selected ORYZO Pro and Pro Max; the 3D stack and associated product copy updated. Restored the base ORYZO option.
- In the encryption gag, changed the field to the non-sensitive test string `HELLO` and pressed the control. The lettering appeared on the coaster, the control changed between ENCODE and DECODE, and the coaster physically flipped; the displayed string remained `HELLO`. Restored the field to ORYZO. This directly confirms a visual gag, not encryption.
- In the 2026-10-26 Brave revisit, followed the coaster as it turned through face-on, tilted, and edge/underside views, then revealed the hand holding it. Moved the pointer across the hand and away while the scene was held at the same scroll position; no distinct finger-pose change could be separated from the scroll-driven animation in this pass.
- Did not activate video playback, submit the newsletter, use the share/clipboard action, or open external links. No personal information was submitted.

### User preference — provisional (2026-10-26)

The user likes the full disc/coaster animation as it flips, the hyperrealistic hand reveal, and the fingers reacting when the cursor hovers over the hand. This preference is saved from the user's description. The Brave revisit confirmed the scroll-linked coaster turn and lifelike hand scene, but did not clearly isolate a hover-specific finger response; leave that interaction detail provisional until the user confirms the interpretation.

### Phone and tablet review — 2026-10-25

| Viewport | Observed layout and behavior |
|---|---|
| Phone — 390 × 844 | The opening scene keeps the coaster centered beneath an oversized Oryzo wordmark and a compact tagline. Intro copy is right-aligned; the Lusion/designer card and small video card sit side by side near the bottom, above a scroll cue. The Menu button opens a dark drawer from the right over dimmed content, with Intro, Features, Product, and Contact stacked vertically and an inquiry email at the bottom. Feature storytelling becomes a vertical sequence: the wearable image is followed by the lift scene and its explanatory copy card below the desk image. The later sustainability and review content also flows vertically. Reviews become large stacked quote rows with stars, score, portrait, quote, author and role; the active quote brightens while surrounding quotes dim, and the 3D coaster moves across the text. Later campaign/gallery content appears in tall panels. |
| Tablet — 768 × 1024 | The opening scene scales up: the wordmark fits across one line, with the coaster centered, description to the right, and larger design/video cards along the lower edge. The same Menu control opens a dark right-side overlay; all four large links fit vertically after the transition. Feature scenes have more room: the wearable frame is large, and the lift explanation sits on a translucent card overlapping the lower part of the desk scene rather than beneath it. The reviews use the same single-column, scroll-led quote sequence, with oversized text, ratings and coaster art moving across the active quote. The footer is a single vertical flow of business/general contact, social links, legal links and the visible fictional-project disclaimer. |

In captures of the feature and review panels at both sizes, the main story area ended before the right edge and left a dark gutter. Verify that framing on a physical device before treating it as intentional; the opening phone scene filled the viewport. These checks cover portrait phone/tablet only, not landscape or intermediate widths.

### GitHub and implementation evidence — kept separate

**Official model repository:** Lusion links to [`lusionltd/ORYZO-1`](https://github.com/lusionltd/ORYZO-1). It contains a paper, license, thumbnail, and six OBJ files under `checkpoints/`: `oryzo-1-26b-a0b.obj`, `oryzo-1-40b-a0b.obj`, `oryzo-1-108b-a0b.obj`, `oryzo-1-145b-a0b.obj`, `oryzo-1-168b-instruct-a0b.obj`, and `oryzo-1-344b-a0b.obj`. “Checkpoints,” parameter-like names, benchmark, and model claims are part of the parody: the files are coaster geometry, not AI weights. The repository is MIT licensed, but that does not make it the site source. No official Oryzo website source repository was identified.

**Official production notes (studio account, not source-code audit):** [Part 1: concept and creative direction](https://blog.lusion.co/oryzo-bts-part-1-7-concept-and-creative-direction) frames Oryzo as a year-long internal experiment in storytelling for a physical product and satire of AI/VC product launches. [Part 2: 3D and motion](https://blog.lusion.co/oryzo-bts-part-2-7-3d-design-and-motion-graphics) reports Houdini scene building and Redshift rendering. Lusion says a full-scene Gaussian-splat test reached about 900,000 splats but showed fidelity problems; its reported hybrid uses splats for selected props and desk reflections (78,233 on desktop and 44,683 on mobile), with texture-mapped surfaces elsewhere and extra detail concentrated near the camera's center. [Part 3: UX/UI and illustrations](https://blog.lusion.co/oryzo-bts-part-3-7-website-ux-ui-and-illustrations) names four principles (realistic image, product at center, seamless transitions, humor), says roughly 99% of the site typography is one family with a four-color core palette, and lists Figma, Rive, Midjourney, Google Flow, and Procreate in distinct roles. Lusion says its illustrations were hand-drawn in Procreate. These are the studio's published production claims; no Oryzo app source was available to verify them independently.

The published series still marks Parts 4–7 (WebGL/Three.js technical articles) as forthcoming. They are not available as public implementation evidence in this review.

**Related, separate Lusion GitHub example:** [`lusionltd/WebGL-Scroll-Sync`](https://github.com/lusionltd/WebGL-Scroll-Sync) is a standalone MIT demo, not the Oryzo site repository. Its README explains a single-canvas approach for tying WebGL visuals to DOM positions without scroll-jacking: let the canvas scroll with the document, offset it during animation frames, and mitigate clipping with canvas padding or a fullscreen framebuffer. Selected source files use Three.js and map DOM image regions to textured planes. This is useful general WebGL/DOM synchronization evidence, but there is no proof that Oryzo uses this repo or the same code.

**Unofficial study:** [`Yrzhe/site-motion-studies`](https://github.com/Yrzhe/site-motion-studies/tree/main/studies/oryzo) contains an Oryzo motion-study folder with original-code interaction notes/demos. It is secondary interpretation, not affiliated source. Its described patterns (scroll beats, product/camera state, lift evidence, semantic color change, measurement labels) broadly match the live observations. It does not establish how Lusion implemented the site. Its reuse license was not established; do not import or copy its code without a separate license/provenance review.

### Potential SIROSIU lessons — options only

- Keep a recognizable product or visual subject present while the surrounding scene and meaning evolve.
- Connect each motion state to a specific piece of content so animation explains the story instead of interrupting it.
- Let one continuous environment make successive sections feel related, while keeping navigation, labels, and key information legible.
- Use diagrams and measurement-style overlays only where they help explain a real interaction or verified project detail.
- Oryzo's fictional claims work because the project is explicitly satirical; SIROSIU should use accurate project facts and clearly label estimates or demonstrations.

These ideas are not approved design decisions. Do not reproduce Oryzo's scene, copy, exact scroll sequence, visual assets, models, or layout.

### Coverage limits

Direct UI observation covered one desktop-like viewport and phone/tablet portrait at 390 × 844 and 768 × 1024. Landscape, intermediate widths, keyboard-only interaction, reduced-motion support, loading/performance, full accessibility, and Oryzo's WebGL implementation were not audited. Cursor movement over and away from the hand was attempted, but a hover-specific finger change could not be separated from the scroll animation. The encryption control was tested only as the satire interaction described above; it was not evaluated for security. Production details are attributed to Lusion's published account, and the separate scroll-sync repository is not evidence about Oryzo's implementation. The unofficial study is not a substitute for original source.

## Skiper UI #1 — Anime.js-inspired scroll indicator

- **Live component:** [Anime js scrollbar — Skiper UI](https://skiper-ui.com/v1/skiper1)
- **Standalone preview:** [Full-page component preview](https://skiper-ui.com/v1/preview/skiper1)
- **Inspected:** 2026-10-25 in the visible in-app browser at approximately 803 × 760. Reviewed its component info panel, gallery and full-page preview, scroll states, draggable progress control, source-access panel, and official quick-start instructions. Completed a responsive live UI pass at phone (390 × 844) and tablet (768 × 1024), checking the gallery sidebar and standalone preview.
- **Status:** Research only. The implementation source is marked as an exclusive/premium component and was not accessed. No code or assets were copied, downloaded, or reused.

This URL is a component-gallery entry, not the Skiper UI marketing site. Skiper describes the demo as a recreation of the Anime.js landing page scrollbar using Framer Motion, and credits Anime.js. Its job is to connect the visitor's current position in a long page to a compact interactive progress rail: numbered/ticked sections, an active handle, and a floating context card with the current section label and code-like text. This is a behavioral description of the demo; the component's premium source was not opened.

### Live interface — observed

| Component | Role in the experience |
|---|---|
| Component catalog sidebar | A numbered catalog with over 100 routes, sorted by ID; the first route is “Anime js scrollbar.” The sidebar provides navigation between independent component demos. |
| Demo content | A tall, dark page with 20 numbered sections (“Who we are,” “What we do,” “How we do it,” through “Footer”) and repeated Lorem Ipsum. It provides enough vertical distance to demonstrate section tracking; it is not finished editorial content. |
| Scroll progress rail | A fixed, compact dark rail near the viewport bottom with many section ticks and a bright red active handle. It reflects the current position as the visitor scrolls. |
| Active-section context card | Appears above/near the rail while the current section is active, showing its label plus a short code-style example. The demo exposes visibility state for this card separately from the active section index. |
| Drag control | Dragging the red handle seeks to a different point/section in the long page. The rail therefore acts as both a progress display and a direct navigation control. |
| Component information panel | Explains the intended behavior, dependencies (`framer-motion`, `react-use-measure`), interaction hints, Pro CLI command, two component exports, props, Anime.js attribution, and licensing statement. |
| Gallery and preview chrome | Sidebar toggle, full-page preview, source-code icon, command-palette button, and Pro indicator frame the demo. The standalone preview removes most gallery information while keeping the content and progress rail. The source control opens a paid-access panel. |

### Interactions verified

- Page scrolling advanced from section 1 (“Who we are”) into section 2 (“What we do”), moving the active rail marker and changing the floating label/snippet.
- In the fresh second pass, another scroll again moved from the end of section 1 into section 2 while the red rail marker advanced. This confirms ordinary document scrolling drives the component state.
- Dragging the rail marker from near the beginning toward the right jumped the page to later sections; the active card/marker changed accordingly.
- Opened the full-page preview, which removes most gallery chrome and leaves the scrolling content and bottom rail visible.
- Clicked the source-code control in the gallery's top-right toolbar. It showed an “Exclusive Component” panel with a one-time-payment prompt, “Get instant access” pricing link, and login route. No purchase or login was attempted.
- Hovering the rail was not tested. Keyboard-only behavior, touch behavior, and screen-reader announcements were not tested.

### Phone and tablet review — 2026-10-25

| Viewport | Observed layout and behavior |
|---|---|
| Phone — 390 × 844 | The gallery opens on a tall, narrow preview with top toolbar controls and long, single-column placeholder copy. The component catalog is tucked behind a sidebar toggle; opening it overlays most of the preview with a scrollable, ID-sorted list of components. In the standalone preview, the gallery chrome is removed and the bottom progress rail remains visible. Scrolling the long page moved the red marker along the ticked rail. The active-section context card was not visible in the phone capture. |
| Tablet — 768 × 1024 | The gallery preview expands to use most of the available panel width, while the component catalog remains behind the sidebar toggle. The standalone preview retains the same long-page layout and rail; the wider content makes the placeholder text less cramped. After scrolling into the next section, a floating context card appeared above the rail with the active section label and a short code-style sample. |

The responsive demo still uses repeated Lorem Ipsum rather than finished content. The observed phone/tablet checks used browser scrolling; touch dragging, keyboard navigation, landscape orientation, and intermediate widths were not tested.

### GitHub and source access — checked separately

The component page says it is inspired by Anime.js's landing page and recreated with Framer Motion. It lists `framer-motion` and `react-use-measure` as dependencies, then publishes an integration example with two cooperating components:

- `Content` receives `setActiveSection` and `setShowScrollCard`, so the content side can report which section is active and whether the context card should be shown.
- `ScrollBar` receives `activeSection` and `showScrollCard`, so the display side can render the active position and card visibility.
- The documented props describe section index and card visibility. This is the public integration contract, not proof of the private implementation details used to measure each section or animate the handle.

The official [Skiper quick-start guide](https://www.skiper-ui.com/docs/quick-start) describes a shadcn registry and a CLI install path for components. Skiper 1 is marked Pro, the command explicitly requires a Pro license key, and clicking its source control opens the paid-access panel. The guide's general license statement allows personal and commercial use under either tier, requiring attribution for the free tier; that general statement does not provide access to this component's gated source.

The linked creator account, [Gurvinder-Singh02/Gxuri](https://github.com/Gurvinder-Singh02), has a public [`ui` repository](https://github.com/Gurvinder-Singh02/ui), but GitHub identifies it as a fork of `shadcn-ui/ui`; it is the registry/platform scaffold, not Skiper 1's implementation. A second public repository, `next-inspect-ui`, is a component browser/inspection tool, not the paid component source. No public GitHub source for this exact component was identified. The live demo and published component API support behavioral understanding, but they do not reveal the premium source internals.

### Potential SIROSIU lessons — options only

- A small persistent progress control can connect long sections and make the current position visible; it should remain subordinate to page content.
- A section label or compact context preview can make a progress marker more informative, provided it does not obscure reading or controls.
- The two-part API suggests a useful separation between measuring/identifying the current content section and rendering the visual progress control. This is a description of the published interface, not evidence about internal source implementation.
- For SIROSIU, progress UI should reflect meaningful project/story sections, work with touch and keyboard, and remain understandable without animation.

These are options, not approved design decisions. Do not copy the exact Anime.js/Skiper visual treatment or code.

### User preference — provisional (2026-10-26)

The user likes only the scrollbar. Working interpretation: the slim horizontal rail at the bottom, with section ticks and an active handle that tracks reading progress and can be dragged to move through the page. Do not include the floating section/context card in the preference. This describes the component behavior the user selected; it does not approve implementation or source reuse. The current web-access recheck confirms the public page identifies scrolling, hovering, and dragging as interaction modes, while the earlier live browser pass directly observed the handle tracking page scroll and responding to a drag. Brave could not be controlled in this turn because local browser use is disabled in Work settings.

### Coverage limits

The demo was inspected at one desktop-like viewport and phone/tablet portrait at 390 × 844 and 768 × 1024. It uses repeated placeholder text, so it does not establish how the component reads with real content. The source is premium-gated and was not accessed. Landscape and intermediate widths, keyboard and touch drag, hover feedback, reduced motion, accessibility announcements, and implementation/performance were not evaluated. The context card appeared in the tablet capture but was not visible in the phone capture; its exact responsive visibility rule was not established.

## Avi Vashishta — “Avi, explained” portfolio story

- **Live page:** [Avi, explained](https://www.avivashishta.com/lab/explained)
- **Creator's build write-up:** [The Prompt Behind My Vox-Style Portfolio Page](https://www.avivashishta.com/blog/prompt-vox-style-explainer-page-codex-paper-assets)
- **GitHub account checked:** [AVIVASHISHTA29](https://github.com/AVIVASHISHTA29)
- **Inspected:** 2026-10-25 in the visible in-app browser at approximately 1265 × 720. Scrolled through the title card, all four story chapters, and the end card. Also read the creator's linked write-up and checked the public GitHub profile and likely portfolio repository. Completed a responsive live UI pass at phone (390 × 844) and tablet (768 × 1024), following all four chapters through the closing card. Revisited the live page in Brave at approximately 744 × 903 on 2026-10-26, scrolling through the opening, Numbers, Build, Brand, and Learn scenes. Opened the linked “How this page was made” article in a second Brave tab and inspected its asset-generation and motion-system sections.
- **Status:** Research only. No source code or assets were copied, downloaded, or reused; no design decision is approved by this entry.

This page turns Avi's portfolio into a four-part, scroll-driven editorial explainer: Numbers, Build, Brand, and Learn. It combines data and work history with analog collage graphics, and ends by directing visitors to the portfolio's product work, brand/media-kit page, and free learning material. The creator links a detailed build article from the live page, but that article publishes a reusable prompt and production explanation, not the exact project source.

### Live interface — observed

| Component | What it does |
|---|---|
| Wordmark and title card | A small “Avi.” home link anchors the top. The opening card pairs a large editorial headline (“How one engineer ended up running three worlds”) with a black-and-white halftone portrait, tape, and torn blue/red/yellow paper strips. A “How this page was made” link points to the accompanying article. |
| Paper-collage visual system | Warm off-white paper texture, oversized serif headlines, sans-serif body copy, monospaced labels, rough-edged color bands, taped screenshots, marker/highlighter marks, pins, and cut-out illustrations make the page resemble an explainer assembled from printed artifacts. The palette and props remain consistent across chapters. |
| Chapter title cards | Each numbered chapter opens with a full-viewport color card (yellow for Numbers, blue for Build, red for Brand, yellow for Learn) and a large title. The card tears/slides away into the chapter's pinned paper stage. |
| Chapter 01 — Numbers | A paper “Instagram Professional Dashboard” document presents six-month Reels figures, with selected numbers highlighted and the view moving close to emphasized phrases. The page labels the figures as sourced from Meta Business Suite and manually refreshed into `data/stats.json`; the numbers are creator-attributed and were not independently verified. |
| Chapter 02 — Build | A three-stop timeline lays out AccioJob (2022–2024), Turgon AI (2024–2025), and Dock (2025–now). Each stop combines a website screenshot, company/role card, pin/tape embellishments, date, and shipped-work statement. Scrolling moves the camera across the timeline and changes the active company panel. |
| Chapter 03 — Brand | A ranked horizontal bar chart compares six Reels by all-time views. Taped partner cards for Tripo AI, Huggle AI, Replit, and Higgsfield AI appear over the chart with campaign descriptions and paid-partnership labels. The chart establishes creator reach; the cards connect it to brand-campaign services. |
| Chapter 04 — Learn | A printed map centers India, then adds a pin and paper callouts for audience location, age, and mobile viewing. A stack of resource/article links follows under “Everything they need is free,” directing visitors to learning material. |
| Closing card and route links | “One person. Three worlds.” resolves the story into three torn-paper links: Build (products for founders), Brand (campaigns for brands), and Learn (free roadmaps for students). A colophon credits Claude Code and Codex asset generation and links back to the build article. |

### Interactions verified

- Normal page scrolling advances through pinned, viewport-sized chapter stages. Chapter title cards slide/tear out; the camera then zooms and pans through paper, screenshots, chart bars, and map callouts.
- In Numbers, highlighter strokes reveal key metrics as the camera moves across the document. In Build, scrolling moves across the company timeline; in Brand, partnership cards layer over the ranking chart; in Learn, the map pin and callout cards appear before resource links.
- The end card's three route labels link to the real Build, Brand, and Learn areas of the portfolio. The creator's build-article link is also present. No forms, purchases, or external social actions were used.
- Hover states and keyboard-only use were not tested.

### GitHub and implementation evidence — kept separate

**Creator's published technical account:** The linked [build article](https://www.avivashishta.com/blog/prompt-vox-style-explainer-page-codex-paper-assets) says the page was built as React plus plain CSS, without an animation library or canvas. It describes tall chapter sections with a sticky stage, one eased `--p` progress value per chapter written by a shared animation-frame loop, and CSS-derived `--t` windows for each highlight, card, callout, and camera move. It further describes smooth motion with textures updated at 12 fps, camera interpolation from data keyframes, mask-based hand-drawn assets, and a reduced-motion mode that removes sticky motion and stacks the timeline. These details come from the author's write-up, not from an independent source-code audit.

The article distinguishes its copyable build prompt from the author's implementation: it says the prompt describes the system, not the author's files. It also documents an asset workflow where Codex generated paper/tape/marker/map/halftone graphics, with black-on-white assets converted into masks and solid-color backdrops removed for cut-outs. The prompt is useful as a technical explanation but is not a license to use the creator's exact assets or code.

The article says the Numbers document reads `data/stats.json`, Build uses the same project list as the Build page, Brand clippings come from media-kit Markdown, and Learn uses current posts. That makes the explainer an entry point into maintained portfolio content rather than a disconnected campaign page. These are claims from the creator's own technical account.

### How this page was made — focused re-review, 2026-10-26

The live page links to the creator's article, which describes the paper-like look as a system of generated, reusable analog assets rather than a single decorative background. The article specifies seamless off-white paper with subtle fibers and grain; torn-paper strips; masking tape; highlighted text; hand-drawn marker circles and arrows; pins; maps; and halftone cut-outs. Some monochrome assets are converted into CSS masks so color can be applied in code, while objects rendered on solid magenta/green backgrounds are chroma-keyed into cut-outs. The chapter palette and these repeated paper/ink treatments carry the tactile collage language across Numbers, Build, Brand, and Learn.

The write-up describes a tall scroll section for each chapter with a viewport-sized sticky stage. A shared animation-frame loop eases one chapter progress value (`--p`); CSS maps that into smaller timing windows (`--t`) for highlights, cut-outs, labels, pins, and other pieces. Camera zooms and pans are driven by keyframes using that same progress value, so the page can scrub forward and backward with scrolling. Motion remains smooth each frame while grain and ink wobble update at 12 fps. The author says the page uses React and plain CSS without an animation library or canvas, and describes a reduced-motion mode that removes the sticky animation and stacks the timeline panels. These are details from the author's account and public prompt, not a deployed-code audit.

**GitHub search:** The [creator's GitHub profile](https://github.com/AVIVASHISHTA29) links to avivashishta.com and lists many public repositories, including older portfolio projects. The public [`my-portfolio-sept` repository](https://github.com/AVIVASHISHTA29/my-portfolio-sept) contains only `index.html`, `myImg.png`, and `styles.css` in a single-commit history; no `/lab/explained` page or matching chapter system was identified there. Searches for the exact live-page route and domain did not surface an official repository for this explainer. The site-linked write-up is the strongest public implementation evidence found, but it is documentation/prompt material rather than the deployed page source.

### Potential SIROSIU lessons — options only

- Let each chapter answer one question, then use one visual proof artifact: a source-labeled metric sheet, a project timeline, a ranked chart, or a map.
- Build the story from maintained content/data and give every chapter a useful route to deeper detail; keep displayed claims tied to an identifiable source.
- A shared progress value can make scroll choreography scrubbable and reversible. The author's `--p`/`--t` split is a useful pattern to study, while animation and reduced-motion behavior would still need direct implementation and accessibility review.
- Generate or create a small set of reusable surface assets (paper, torn edges, tape, marks) to support a coherent editorial treatment. Treat generated or reference assets as separate from reusable source code and verify their provenance before use.
- Use an end card to route visitors into distinct work, brand, and learning areas only if those destinations map to real SIROSIU content.

These are options, not approved design decisions. Do not reproduce the Vox-inspired collage, exact chapter order, page copy, artwork, or motion timings.

### User preference — provisional (2026-10-26)

The user likes the paper-like feel across the whole page. Direct preference: the paper surface/texture is present throughout, not only in one section. Possible contributing details include the subtle grain, torn paper, tape, and ink/cut-paper collage; confirm whether those details are part of what they mean. They also asked to inspect the “How this page was made” section; the creator's linked write-up has now been inspected in Brave and its asset and motion account is summarized above. This preference is awaiting confirmation and is not approval to reuse the site's assets, exact visuals, or code.

### Phone and tablet review — 2026-10-25

| Viewport | Observed layout and behavior |
|---|---|
| Phone — 390 × 844 | The title, portrait, and supporting copy form a narrow editorial opening, with the headline wrapping across several lines and the torn blue/red/yellow paper band near the lower edge. Number highlights sit in a nearly full-width paper card. Build projects become a vertical sequence of screenshot and role/copy cards. The Brand chart becomes a vertical list of labeled horizontal bars; partner notes overlap in a loose paper collage. Learn places audience callouts over a large India map, then stacks wide article strips. The closing card stacks its three colored Build/Brand/Learn strips vertically. No chapter navigation was visible during the pass. |
| Tablet — 768 × 1024 | The hero headline spans substantially wider and wraps less, while the portrait and copy remain integrated into the paper composition. Chapter cards and project screenshots use the wider canvas; the Brand chart and partner notes occupy broader overlapping compositions. In Learn, several wide resource strips layer across the map. The closing card keeps the three torn-paper links as horizontal full-width bands stacked vertically, with the portrait below. |

The page retains the same paper texture, serif typography, chapter-color panels, torn-paper edges, and scroll-led narrative at both sizes. Phone constrains each artifact into a single-column story; tablet gives charts, map, and collaged partner cards more horizontal room. Scrolling was observed, but touch dragging and link activation were not part of this pass.

### Coverage limits

The live page was inspected at one desktop-like viewport, phone portrait (390 × 844), and tablet portrait (768 × 1024). Other widths and landscape orientation, performance, formal accessibility, reduced-motion output, and keyboard-only interactions were not audited. The displayed analytics, follower, view, project, and partnership claims were not independently verified. The creator's implementation notes are self-reported; no exact public GitHub source for the live page was identified. The build prompt is not the page's source code.

## Bajkamal Singh — “Baaz fvrv | Structured Arts”

- **Live page:** [bajkamalsingh.me](https://bajkamalsingh.me/)
- **Creator's usage terms:** [Terms of Use](https://bajkamalsingh.me/terms)
- **Creator's technical disclosures:** [Privacy Policy](https://bajkamalsingh.me/privacy)
- **Inspected:** 2026-10-25 in the live browser at approximately 1280 × 720, then at phone (390 × 844) and tablet (768 × 1024). Reviewed the hero, Origin, Projects, Best Work, one full case study, Visuals, and Contact at responsive sizes. Tested hero/gallery pointer behavior, the metro selector, case-study entry/return, and section navigation. Revisited the Origin section in Brave at approximately 759 × 903 on 2026-10-26, following the open notebook scene through multiple scroll states.
- **Status:** Research only. No site code, copy, illustrations, sound, or assets were copied, downloaded, or reused; no implementation is approved by this entry.

The portfolio presents a creative director and artist-manager through a handmade, intentionally misaligned visual language. It uses a numbered, chapter-like home journey, then turns the featured work into a Delhi Metro metaphor. The site itself says its visual identity, code, text, illustrations, animations, sound, and creative content belong to Bajkamal Singh, and expressly prohibits copying/cloning and scraping. This review therefore records manually observed behavior and publicly disclosed technology only; it does not inspect or reproduce the site's code or assets.

### Live interface — observed

| Component | What it does |
|---|---|
| Persistent top ribbon and progress | Keeps the creator's name at left, rotating short positioning lines in the center, a “You've seen” meter and percentage at right. The value follows section progress and offers orientation during the long page. |
| Intro/loading sequence | Opens with a staged, animated introduction and a “SKIP ANIMATION” action. The hero invites visitors to expand and move the cursor. |
| 3D identity hero | Uses a cobalt/blue scene with a large sculptural “baaz” wordmark, a dark extruded silhouette, floating credentials, a 20:00–00:00 night-work chart, role labels, and a Delhi location tag. Dragging the pointer shifts the scene and its cursor reticle. |
| Origin chapter | Tells the creator's origin story using notebook pages, a sticky note, Polaroid, orbit marks, handwritten annotations, animated work-history text, and metric stamps. It connects early freelance design work with later strategy and artist-management work. |
| Projects archive | Shows four offset, stacked project cards: Grimbyte, Blue Tea, Dr. Water, and Frost & Sullivan. Each pairs a role and duration with a compact work summary and metrics. The page copy gives more detail about dashboards and customer journeys, B2B/influencer activation, hydration-market research, and mobility-technology analysis. |
| Best Work / Delhi Metro entrance | Places a Hindi/English Delhi Metro title and an “ENTER METRO” control between the archive and selected case studies. It functions as a themed gateway, not a separate site route. |
| Interactive metro project selector | Presents six stops on a route map with previous/next controls, progress path, a train-carriage visual, a scrolling bilingual station marquee, project summaries, and “STEP OUT FOR DISSECTION” actions. The stations cover a welcome/manual, creator growth, sustainable-fashion acquisition, retention email, sponsorship/scale, and a Jio Hotstar campus launch. The manual advertises arrow-key navigation; keyboard operation was not independently tested. |
| Project case-study view | “Step out” opens a long editorial breakdown with a visible return-to-platform control. The Krishna Shukla case labels the role “Freelance · Brand & Business Manager,” states the creator's problem, groups work into identity-based content, a virality engine, and touring IP, then shows analytics imagery and impact metrics. The figures and results are portfolio claims, not independently verified. |
| Visuals gallery | Uses a large handwritten “insomniac Work” heading and asks visitors to hover. Moving the pointer reveals a layered stack of design work; visible examples included a “Debunking Myths” poster and “Safar Nama” artwork. Category labels such as brand design, typography, colour grading, poster design, and motion graphics float around the field. |
| Contact and footer | Closes on a dark panel with a pre-addressed email link plus Instagram, LinkedIn, and mail links; no contact form is used. A light footer carries the signature, copyright, privacy, and terms links. |

### Interactions verified

- Dragging across the hero shifted its foreground/background composition and moved the visible reticle; the rotating copy and progress ribbon remained visible.
- The Origin and Projects sections are reachable through the bottom navigation; the Projects archive lays out four entries before the Best Work gateway.
- Entered the metro exhibit, advanced the selector to the Krishna Shukla growth stop, and opened its “STEP OUT FOR DISSECTION” page. The case-study view was a long editorial page; its “RETURN TO PLATFORM” control restored the metro selector.
- Pointer movement across the Visuals section revealed overlapping artwork cards, including poster and creator-promotion designs. This is a cursor-driven reveal, not just a static image grid.
- Contact navigation reached the email/social block and footer. No email link or external social destination was opened.
- The sound control was not activated. No form, login, purchase, or other data-submission action was present or used.

### Origin notebook — Brave re-review, 2026-10-26

After selecting Origin, the scene settles on an open two-page notebook. Scrolling changes the view across the spread while origin copy, emphasized words, a Polaroid, small floating/stuck-on artifacts, and a handwritten summary appear in stages. A thin blue hand-drawn path progressively traces a broad curve around and between the story text and Polaroid, then continues toward the lower handwritten summary. The notebook acts as the visual stage for the story, and the path gives the scroll sequence a drawn-through-the-page quality. This is a live visual observation; the site's implementation source was not inspected.

### User preference — provisional (2026-10-26)

The user likes how the content moves through the appearing notebook in Origin and how the line travels through that section. Working interpretation: keep the open notebook as a continuous story surface; let text and small paper artifacts reveal and shift as the visitor scrolls, while a thin hand-drawn line progressively curves around and links the Origin copy and Polaroid. Confirm that this describes the notebook movement and line they mean. This records a reference preference, not approval to reuse the creator's artwork, exact layout, code, or motion.

### Public implementation and GitHub evidence — kept separate

GitHub was searched for the exact domain, creator name/handle, and the site's “Structured Arts” identity. No repository could be verified as this portfolio's source. The live site's own [Terms of Use](https://bajkamalsingh.me/terms) says it uses Tailwind CSS, GSAP, Lucide, Lenis, and Tone.js; its [Privacy Policy](https://bajkamalsingh.me/privacy) describes Cloudflare Pages hosting and third-party delivery of fonts and libraries. These are first-party disclosures, not a source-code audit. The terms also state that public visibility of source code would not grant reuse rights, and prohibit copying the site's design/code/content, cloning its design or interactions, and scraping or bulk-downloading it. No source files or assets were accessed for this review.

### Potential SIROSIU lessons — options only

- Give a featured project area its own coherent navigation metaphor when that metaphor clarifies how work is organized; keep direct labels and simple previous/next controls visible alongside it.
- Let each case study explain a real problem, the creator's role, the sequence of work, evidence, and outcome, with a direct way back to the index.
- A persistent progress meter and concise rotating context can help visitors navigate a long portfolio, while a handmade visual vocabulary can carry personality across sections.
- Cursor-revealed artwork can turn a gallery into an exploratory field. Essential project names and descriptions should also be available without hover so the work remains usable with touch, keyboard, and assistive technology.
- The animation-heavy approach should be weighed against loading, responsive behavior, reduced motion, and content clarity before choosing a comparable technique.

These are options, not approved design decisions. Do not copy the exact blue notebook/metro art direction, wordmark, illustrations, project assets, text, sound, interface layout, or motion. The creator's terms explicitly reserve the site's design and materials and prohibit cloning/scraping; any SIROSIU adaptation must be independently designed and use properly licensed assets.

### Responsive review — live browser

| Area | Phone — 390 × 844 | Tablet — 768 × 1024 |
|---|---|---|
| Header and navigation | The creator name remains in a fixed top-left nameplate. The six destination links form a fixed bottom strip, but the strip extends beyond the phone width and its end labels are clipped. | The top nameplate shares a row with a rotating short positioning line. All six destination labels fit in the fixed, centered bottom bar. |
| Hero and Origin | The blue-lit figure and hand-drawn wordmark form a tall hero; the tagline, role timeline, and scroll cue are arranged around it. Origin turns into a tall notebook spread that fills most of the stage as its pages change with scrolling. | The hero gives more room to the figure and separates the role labels and location. Origin becomes a wide, centered two-page notebook scene. |
| Projects | Graph-paper backdrop with large, vertically stacked project cards that overlap each other. | The same layered-card treatment spans wider horizontal panels, with the section heading and helper note beside the stack. |
| Best Work | The metro entry and station card are composed vertically. Left/right arrows move between stops; the station card remains the central focus. | The route map stretches across the top of the stage, with the active case card and train occupying the lower area. Opening a case study shows a broad paper dossier that continues vertically; its metric cards stack down the page. |
| Visuals | Oversized “insomniac Work” lettering is cropped at the sides, with “HOVER AROUND TO SEE THE MAGIC” still shown. Touch/tap behavior was not verified. | The same hover prompt remains, and the large wordmark is still clipped at the stage edges. The fixed section bar remains visible. |
| Contact | Single-column dark panel with a large handwritten heading, short copy, email call to action, and social links. | The same single-column treatment uses the wider stage; the light footer follows directly below. |

The metro arrows and case-study return control worked at both sizes. The phone gallery continues to advertise hover, so its touch alternative remains unknown; keyboard navigation, landscape, intermediate widths, reduced motion, performance, and formal accessibility were not tested.

### Coverage limits

Responsive behavior was observed at the two portrait sizes listed above and desktop behavior at approximately 1280 × 720. Other breakpoints, landscape phone, keyboard-only use, screen-reader operation, reduced motion, performance, and formal accessibility were not audited. The portfolio's career history, results, and metrics were not independently verified. No public GitHub source repository was identified, and source code was not inspected in light of the site's terms.

## Mara Voss — SoloFoundry Framer portfolio template

- **Live preview:** [Mara Voss portfolio demo](https://diligent-tetragon-837366.framer.app/)
- **Official template listing:** [Mara Voss — Designer & developer portfolio Framer Template](https://solofoundryhq.com/templates/mara-voss/)
- **Inspected:** 2026-10-25 at a desktop viewport of approximately 1250 × 710; responsive home-page behavior at phone (390 × 844) and tablet (768 × 1024) portrait sizes. Reviewed the home page, work archive, Sole case study, About timeline, résumé, Services and Product Design detail, Writing index and one article, Lab index and two project pages, and Contact page. Tested visible controls as recorded below; no source files or assets were downloaded.
- **Status:** Research only. This is a SoloFoundry demo template, not verified evidence of a real designer named Mara Voss or of the career, client, project, testimonial, or outcome claims shown in the copy. No technique, text, design, code, or asset is approved for use.

The provider's listing identifies Mara Voss as a **free, no-code Framer template**. It advertises 36 pages, seven CMS collections, eight site-wide color styles, and desktop/tablet/phone layouts. It names the collections as Site, Projects, Services, Experience, Reviews, Lab, and Posts, and lists project, service, lab, and post detail pages. These are vendor-published template specifications, not results of inspecting the editable Framer project. The listing also advertises a cursor-lit portrait, contact-sheet work selector, colored service gels, résumé credits, printable résumé, client quotes, and lab/writing collections.

### Component map — observed live

| Component | What it does |
|---|---|
| Persistent header | A compact centered pill nav links Work, About, Résumé, Writing, and Contact. A green availability light and orange Hire me action keep the status and main CTA visible. A skip-to-content link is present in the accessibility tree. |
| Portrait / name hero | Uses a large portrait with oversized “Mara Voss” typography and a short product-designer/developer introduction. The live controls offer Bone, Tangerine, and Ink backdrops. Choosing Tangerine changed the scene to a bright orange/coral treatment; returning to the home page restored Bone. Rechecked in Brave on 2026-10-26: moving the pointer around the wordmark visibly shifts the portrait's offset shadow and the light balance around her; the user also likes the letters' hover response. A per-letter deformation or independent glyph animation was not isolated, so treat that detail as the user's visual preference rather than a verified implementation finding. |
| Safelight print and frame transition | Below the hero, a warm, darkroom-colored tray presents a large white-bordered photo under the SAFELIGHT label. A narrow print strip carries exposure-style metadata and a fixed-scale marker; the following pale sheet introduces “FRAME 01 — About” with a large headline, an orange highlighted phrase, separated facts, and links. Scrolling then changes to “FRAME 02 — Selected work,” where a film contact strip selects a large print and its project details. The user likes the paper-like way this content switches between frames. |
| About teaser | Introduces the portfolio persona with large figures for years, products shipped, and location, plus a portrait and links to About and Résumé. The figures are unverified template copy. |
| Selected-work contact sheet | Shows eight named projects as selectable frames, with one project image enlarged beside its role, category, year, and an outcome claim. Selecting Rouge changed the image and its Maison Rouge packaging description. Each project opens its own case-study route. |
| Work archive | Organizes the eight examples under All, Brand, Web, Editorial, and Product filters, and has Sheet and List views. Brand filtering showed the four brand entries. List view changed the archive to a table-like row layout with project, client, category, year, and arrow link. The archive examples are Sole, Nord, Chroma, Loop, Rouge, Atlas, Violet, and Pulse. |
| Case-study page | The Sole case starts with a call-sheet-style summary (client, year, role, and team), then frames the brief, process, design-to-code implementation, claimed results, further imagery, quote, and next project. It provides a reusable editorial case-study structure; its reported sales and delivery metrics remain unverified template claims. |
| Services index and details | Four service chapters cover Product Design, Design Systems, Front-end Development, and Brand & Web. Colored “gel” labels and deliverable lists give each category a visual marker. A service detail page expands the deliverables, links related projects, provides an FAQ with scope/price/timing, and returns to the project-contact CTA. The displayed prices and promises are template copy, not verified offers. |
| Process / call sheet | A four-step timeline—Brief, Explore, Build, Ship—pairs each stage with a time window, activities, and a recurring Friday review. A small set/scene marker shows the current step. |
| Tools | Divides the toolkit into Design and Code lists, with tool names presented as equipment tags. The page copy advertises throwing tags with the mouse; that interaction was not tested. |
| Résumé credits | The home page turns work history, education, and awards into rolling production credits. The résumé route lays out an A4-style document with Print and Download PDF controls; neither control was activated. All listed employers, dates, awards, and metrics are unverified demo content. |
| Testimonials | Displays five quote cards with project/client labels, names, and roles, styled like clipped press notes. These are sample testimonials and were not verified. |
| Lab / project details | The Lab index filters six projects by Experiment, Side Project, Open Source, Concept, and Resource. A project detail includes a type/year/tools metadata block, an image, “The idea,” “How it's built,” a short code example, “What I learned,” and related projects. The “Token sync plugin” page describes a proposed Figma-to-code pull-request flow; its Source and Live demo links resolve to generic `github.com/` and `codepen.io/` roots, so neither is usable evidence of a real project. |
| Writing / article detail | A six-note index filters Process, Systems, Notes, and Craft. An article route uses a dated headline, estimated reading time, sectioned copy, share/copy links, and links to other notes. The visible articles and author voice are template copy, not verified writing by the person represented. |
| Contact and footer | The repeated contact band shows an availability message, next-start-date links, a copy-email button, and a Start a project CTA. The contact route has a form with name, email, company, website, budget, timing, service checkboxes, and a brief field. No values were entered and the form was not submitted. Footer routes cover Work, About, Résumé, Lab, Writing, Contact, Privacy, and Terms; the social destinations point to generic roots. |
| Framer template controls | The preview includes Framer attribution, edit-content affordance, and a floating SoloFoundry offer bar. These belong to the template demo/publisher presentation, not the portfolio's core information architecture. No template/remix, paid offer, or customization action was opened. |

### Interactions verified

- Switched the hero backdrop to Tangerine and confirmed the visible color treatment changed; the home route loaded back in Bone mode.
- Revisited the hero at multiple pointer positions: the portrait's offset shadow and surrounding illumination visibly shift with the cursor. The separate per-letter response described by the user was not isolated from the layered wordmark and portrait interaction.
- Scrolled from the SAFELIGHT photograph and print metadata into its paper-like About sheet, then into the next numbered work frame and selectable film contact strip.
- Selected the Rouge frame from the home contact sheet; the enlarged image, frame identity, metadata, and copy updated.
- Applied the Brand filter in Work and changed from Sheet to List view; the visible projects and layout changed accordingly.
- Selected a year in the About timeline; the active date, description, and six-step progress marker updated.
- Filtered Writing to Process and Lab to Open Source; both indexes reduced to matching items.
- Inspected the Product Design service detail, the Sole case, one article, and two Lab detail pages. These pages expose distinct templates for services, case studies, posts, and experiments.
- Did not submit the contact form or newsletter, copy/send an email, download/print the résumé, use external links, buy/remix the template, or activate the template controls.

### Responsive review — live browser

| Area | Phone — 390 × 844 | Tablet — 768 × 1024 |
|---|---|---|
| Home and header | The sticky compact header keeps the orange M mark/name, green availability indicator, and Menu button visible. The hero title and intro stack; primary and résumé actions become full-width rows. Availability, Berlin/local time, experience, and Bone/Tangerine/Ink backdrop controls stack beneath. | The same compact header remains. The hero uses a much larger two-line Mara Voss wordmark layered over a centered portrait; role, intro, two full-width actions, and availability metadata continue below. The backdrop selector sits in a horizontal control group. |
| Menu | Opens a full-height dark overlay with a call-sheet marker, vertically stacked numbered links, Hire me action, email, local time, and social links. | Menu button is visible; opening the tablet menu was not tested. |
| About and work | About becomes a single-column sequence: framed desk photo, oversized intro statement, three separated metric rows, and full-width About/Résumé links. Work keeps a selectable eight-frame contact strip; choosing Rouge updates its image, project name, metadata, outcome, and case link. | About retains the wide framed-photo/large statement/metric-row sequence. The work selector becomes a broad horizontal strip of image frames, with the active project image and project details arranged beneath it. |
| Services and process | The service still and its index/label sit above four vertically stacked service rows; each row includes a short summary and five deliverable chips. The process call sheet and Brief/Explore/Build/Ship phases stack as distinct rows/cards. | The service still expands to a wide landscape panel while the four complete service rows remain below. The process call sheet fills a broad card; phases still stack vertically rather than becoming a horizontal timeline. |
| Tools and résumé | Design and Code are separate tool groups with compact two-column cards. Résumé credits become centered, one-column experience/education/award entries. | The Design and Code groups each use a roomy two-column card grid. Résumé credits remain vertically sequenced in a centered production-board treatment. |
| Testimonials, lab, writing | Five torn/taped quote cards stack vertically. The lab uses a filmstrip-style project reel. Writing becomes a vertical editorial list with a colored timeline rule, compact pinned images, and readable title/summary metadata. | The same section order and card language persist on the broader canvas; the final footer was observed with Work links in a single column and Pages/Elsewhere in two columns. Other tablet-specific changes in these lower sections were not inspected closely. |
| Contact and footer | Contact is a full-bleed orange block with a large stacked heading, full-width CTA and copy-email row, an ON AIR panel, and three ticket-like start-date links. The dark footer stacks the production slate and Work links, then places Pages and Elsewhere side by side. | At tablet width, the footer’s production slate spans the content width, with Pages and Elsewhere visibly side by side. Contact was not separately inspected at tablet size. |

Phone review covered the full home-page sequence, including the menu, selectable project frame, résumé, testimonials, Lab, Writing, Contact, and footer. The featured service image/label changed while scrolling; this pass did not establish whether its cycling is time-based or scroll-triggered. Framer preview attribution and floating editor/template controls were visible in the browser capture and are not part of the portfolio’s core content layout.

### GitHub and implementation evidence — kept separate

**No associated website source repository was found.** GitHub searches for the exact preview hostname, “Mara Voss” with SoloFoundry, and the advertised token-sync project did not surface a repository associated with this page. The live demo's GitHub and CodePen anchors lead only to the generic site roots. The official listing says the site is edited and published in Framer and describes the model as no-code, with no repository or deploy pipeline. Therefore this pass is a visual and interaction study of a live Framer project, not GitHub-backed source-code reverse engineering; internal Framer layers, CMS configuration, and original component code were not inspected.

### Potential SIROSIU lessons — options only

- Let one cohesive art direction carry across work, services, process, résumé, writing, and experiments, while giving each content type a useful page structure.
- Consider a pointer-responsive portrait shadow/wordmark treatment, followed by a darkroom print and paper-sheet sequence in which numbered frames lead into a filmstrip-selected story. These are research options, not approved SIROSIU design decisions.
- A selectable contact sheet can make an archive feel tangible; retain the direct project names and filter/list controls so browsing remains clear.
- A strong case-study template can move from problem and role to process, implementation evidence, and verified outcomes. Use SIROSIU's real facts and show evidence for any numbers.
- Connect each service to relevant work and clear deliverables so a prospective client can understand the relationship between the offer and past projects.
- Keep contact action and availability easy to find, and use consistent structured content for projects, services, articles, and experiments.

These ideas are options, not approved design decisions. Do not copy the Mara Voss identity, template photography, project names, text, testimonial claims, precise layout, or motion. The provider's free-template license is about remixing that Framer project; it should not be treated as permission to republish the demo's identity or media in SIROSIU. Any independently selected asset or package needs a separate provenance and license review.

### Coverage limits

The desktop review used one viewport; the responsive review used portrait phone (390 × 844) and tablet (768 × 1024) sizes. Other widths, landscape orientation, tablet menu behavior, keyboard-only operation, reduced motion, performance, and formal accessibility were not audited. The cursor-light and draggable tool-tag behavior were advertised but not tested. No template internals or code were available in GitHub. Every personal biography, project, client, testimonial, performance result, and availability claim remains unverified sample content.

### User preference pass — 2026-10-26 (provisional)

The user likes the shadow around the portrait, how the oversized “Mara Voss” lettering reacts while hovered, and the paper-like way content changes below the SAFELIGHT area. I interpret this as pointer-responsive lighting/shadow around the layered portrait and wordmark, followed by framed photographic prints, metadata strips, and paper-like numbered content frames. The cursor-driven shadow/lighting was visible in Brave; the exact per-letter response remains unisolated. Confirm this interpretation with the user before treating it as a design decision.

## Asher Vale — Framer portfolio template by Asad Khaleel

- **Live preview:** [Asher Vale](https://ashervale.framer.website/)
- **Official listing:** [Asher Vale — Free Website Template for Framer](https://www.framer.com/marketplace/templates/asher-vale/)
- **Inspected:** 2026-10-25 at a desktop viewport of approximately 1250 × 710. Reviewed Home, About, Projects, Contact, and the FlowPay project detail. Opened the navigation overlay and tested the Web Design and UI/UX filters. No form data was entered; no CV, template, code, or assets were downloaded.
- **Responsive review:** 2026-10-25 at portrait phone (390 × 844) and tablet (768 × 1024) sizes. Rechecked Home, the Projects archive, the About section on Home, the phone navigation overlay, and the FlowPay case detail. Desktop filters were verified earlier; the responsive archive controls were visible but their tap behavior was not re-tested. The tablet navigation overlay was not tested.
- **Status:** Research only. The official Framer Marketplace identifies this as a free portfolio template by Asad Khaleel (published and updated July 29, 2026; marketplace license marked “Limited”). “Asher Vale,” the biography, work history, clients, awards, project outcomes, metrics, availability, and contact promises are demo/template content and were not verified as real claims. No design, code, text, or asset is approved for reuse.

### Component map — observed live

| Component | What it does |
|---|---|
| Fixed status header | A sparse top row keeps the Asher Vale wordmark, green “Available now” indicator, London location/local time, and two-line hamburger in view. The status/time repeat in navigation/footer areas. |
| Name-and-portrait hero | A light, subtly textured canvas puts an oversized “Asher Vale” wordmark behind a centered portrait. Role labels sit near the lower left and a short design/development statement aligns lower right. The hero uses typography and portrait scale as its main visual instead of a 3D scene. |
| Selected work | Four large image cards appear in a two-column grid: Lumen Collective (Web Design), Arc & Co. (Web Design), FlowPay (UI/UX), and Kindred Coffee (Branding). A year span and “See all works” link orient the section. Rechecked in Brave on 2026-10-26: hovering a work image reveals a small, rounded, translucent “View Project” control that reads like frosted glass. This is the only Asher Vale feature the user has selected so far. |
| Capability strip and About teaser | A list of eight disciplines (UI/UX, Product, Mobile App, Brand Identity, Design Systems, Brand Strategy, Creative Direction, Framer Development) precedes a short “Who am I” statement. A trio of counters appeared as 0 for years, projects, and clients in the inspected state, followed by a Download CV link that points to the template creator's generic Framer link. Treat those as unconfigured or sample data. |
| Expanded menu | Clicking the top-right control opens a large white panel over roughly half the viewport while the home scene becomes darkened/blurred. It exposes Home, About, Projects, and Contact, plus an email CTA, social icons, “Available now,” and London time. The visible social links resolve to generic platform roots. |
| Projects archive and filters | Uses the same two-column image grid and four categories: All, Web Design, UI/UX, and Branding. Selecting Web Design left Lumen Collective and Arc & Co.; selecting UI/UX left FlowPay. The category controls update the visible set without a separate page route. |
| Project detail | The FlowPay page starts with a concise project statement and four metadata fields: Company, Timeline, Role, and Project. It continues with Project Overview, Challenge, an image gallery, Results, and More Projects, plus a direct Back to projects link. The animated result counters began at 0 while loading/entering view and settled at 10% Higher Engagement and 44% Reduced Friction during responsive inspection. Some gallery imagery/alt descriptions looked unrelated to the fintech brief (including retro devices in a flowered landscape), so verify every project image/caption pair when adapting this type of structure. The performance/outcome text and numbers are template sample content, not measured project evidence. |
| About page | Combines an introductory biography and portrait with an experience timeline and awards. Demo history lists North Studio, Pixel Foundry, Lumen Creative, and Studio Nova; awards include Awwwards, Framer Marketplace, CSS Design Awards, and Behance. These biographical and award entries are unverified sample copy. |
| Contact page | A short conversation-oriented intro leads into Name, Email, Budget, and Message fields, with four budget choices ($5,000+, $10,000+, $15,000+, $20,000+) and a “Let's get in touch” submit button. It promises a reply within two hours. The form was inspected but left blank and unsubmitted. |
| Footer and template promotion | Footer repeats the home/about/projects/contact navigation, generic social roots, availability/location, and explicit Framer/Asad Khaleel template attribution. A floating Framer badge and a “Get Template Remix For Free” link frame the live preview; a separate promo links to another marketplace template. These are demo chrome, not core portfolio components. |

### Interactions verified

- Opened the hamburger menu; the half-screen panel appeared over the blurred/darkened page. Selecting About navigated to `/about` and closed the overlay.
- Selected Web Design and UI/UX in the Projects archive. Each filter updated the visible cards in place; their target project links remained available.
- Hovered a Selected Works image on Home; a rounded translucent “View Project” pill appeared over the photo. The user identified this glass-like hover effect as the sole feature they want noted from Asher Vale.
- Opened the FlowPay project detail and used the visible content structure to inspect its overview, challenge, gallery, and results. The page provides a return link and related-work links.
- Inspected About and Contact routes. Did not submit the form, follow social or template links, or activate the CV download.

### Responsive review — live browser

| Viewport | Observed behavior |
|---|---|
| Phone, 390 × 844 | The fixed header keeps a small wordmark and hamburger. The oversized name marquee and portrait lead the home page; selected-work and archive cards become a single vertical column. Archive category controls remain in a horizontal row. The About teaser stacks its text and uses two columns for the first metrics, with the remaining client metric and CV link below. FlowPay metadata becomes a 2 × 2 grid; its lead image and gallery images span the page and stack vertically, followed by the Results copy and two side-by-side counters. The footer navigation becomes a vertical list. The phone menu opens as a full-height white overlay with vertical route links, email/social links, and availability/location details. |
| Tablet, 768 × 1024 | The portrait and oversized wordmark remain the home-page focus. Selected work and the Projects archive still use one wide card per row, with category controls in a horizontal strip. FlowPay uses a broad text measure and 2-column metadata; its lead image and gallery remain full-width, single-column panels rather than switching to a desktop-style gallery grid. The Results counters settle at 10% and 44%. |

The Framer “Get Template” badge can overlap content near the lower-right corner, and a separate marketplace New Release promo sometimes appears during navigation; these are preview chrome. The responsive review did not verify archive-filter taps, tablet menu behavior, or layouts beyond the two portrait sizes.

### GitHub and implementation evidence — kept separate

**No associated GitHub repository surfaced.** GitHub searches for the exact preview hostname, “Asher Vale” with creator Asad Khaleel, and the template did not identify a source repository. The live site has no working GitHub/code link; its social anchors resolve to generic platform roots. The [official Framer Marketplace listing](https://www.framer.com/marketplace/templates/asher-vale/) names Asad Khaleel as author and identifies the page as a free Framer portfolio template with a Limited marketplace license. Thus this is a live visual/behavioral study, not GitHub-backed source-code reverse engineering. Framer layers, project CMS, interactions' implementation, and source files were not inspected.

### Potential SIROSIU lessons — options only

- A quiet fixed status row can keep availability and location visible while leaving the content canvas open.
- Large type, a portrait, and two short role labels can establish identity quickly when the photography and biography are genuine and properly licensed.
- Category filters are useful when their labels and visible result sets make the archive easy to scan; keep the project name and category available on every card.
- A case-study page should connect the claim, challenge, work, visuals, and results. Use visuals that actually match the project, and show sourced, nonzero outcome data only when it is verified.
- A large navigation panel can make a small portfolio's routes easy to find; keep keyboard, focus, touch, and close behavior usable when implementing a similar pattern.

These are options, not approved design decisions. Do not copy the Asher Vale identity, portrait, media, project names, claims, precise layout, or animation. The Marketplace listing's Limited license applies to its template terms; it does not grant blanket permission to reuse the demo persona or media in SIROSIU. Independently selected assets require their own provenance and license review.

### Coverage limits

The review covered one desktop viewport plus portrait phone (390 × 844) and tablet (768 × 1024); other widths and landscape orientation were not tested. Keyboard-only use, focus management, reduced motion, performance, and formal accessibility were not audited. The responsive archive filter behavior and tablet menu were not tested. The exact GitHub source is unavailable. Counters animate from 0 to 10% and 44% in the responsive pass, but the claims are unverified template copy. Do not treat the demo's biography, clients, awards, project imagery, results, budget/pricing cues, or reply-time promise as real-world evidence.

### User preference pass — 2026-10-26

The user likes only the glass-like hover effect on the work cards: a small, rounded, translucent “View Project” control appears over a project image when hovered. No other Asher Vale feature has been selected as an SIROSIU inspiration in this pass.

## Cedar — Framer studio portfolio template by Khusanjon Jurabaev

- **Live preview:** [Cedar Studio](https://cedarstudio.framer.ai/)
- **Official listing:** [Cedar — Free Website Template for Framer](https://www.framer.com/marketplace/templates/cedar/)
- **Inspected:** 2026-10-25 at a desktop viewport of approximately 1250 × 710. Reviewed Home, Work, Kiln case study, Northlight case study, About, and Contact. Tested the Work grid toggle, Branding filter, scroll-triggered case-study metrics, and next-project navigation. No form data was entered or submitted; no template, source, or assets were downloaded.
- **Responsive review:** 2026-10-25 at portrait phone (390 × 844) and tablet (768 × 1024) sizes. Rechecked Home, Work, the Kiln case, About, and Contact. On phone, the Branding filter and Stack/Grid toggle both worked; the filter results differed from the earlier desktop observation (see below). The contact form remained blank and unsubmitted.
- **Status:** Research only. Framer's Marketplace lists Cedar as a free template by Khusanjon Jurabaev (`@astrodsgnr`), published October 1 and updated October 6, 2026, with a “Limited” license. All studio, client, project, award, team, contact, and outcome details are template demonstration content and were not independently verified. No design, code, text, or asset is approved for reuse.

### Component map — observed live

| Component | What it does |
|---|---|
| Persistent header | Places the CEDAR® wordmark at the left, short social links in the middle, and a location/local-time display at the right. The displayed accounts and studio identity are template content. |
| Layered hero | Combines a very large CEDAR STUDIO wordmark, a one-sentence studio description, and overlapping full-bleed project photographs on a near-black canvas. The imagery shifts as the page scrolls, creating a layered/parallax opening rather than a single static banner. Headline and labels reveal character by character. Rechecked in Brave on 2026-10-26: the central project-image stack slides and overlaps through the scroll, changing which image is sharp and prominent while surrounding images blur or recede. This is the “projects scroll” effect the user likes. |
| Floating pill navigation | Keeps Index, Works, About, Services, and Contact reachable in a compact bottom-centered pill. Services targets the Services section on About. The persistent placement maintains navigation while scrolling. Rechecked in Brave on 2026-10-26: the pill stays fixed at the bottom with a translucent, softly blurred glass-like surface and a brighter white capsule marking the active link. The user likes this bottom-bar treatment. |
| Work archive | Presents 16 sample projects in a large-type Stack view or a three-column image Grid. All, Branding, Editorial, and Digital filters update the set. View and category state are reflected in query parameters, so the selected archive presentation can be linked. Cards connect to individual project pages. |
| Project detail template | Leads with a project title and metadata (category, client, role, year), then a large cover image, an About narrative, impact metrics, and previous/next project links. The Kiln example uses a split headline and scroll-triggered count-up figures; selecting Next navigated to Northlight and changed its title, project metadata, narrative, and metrics. |
| Impact counters | Three compact metric blocks animate when they enter the viewport. Kiln visibly counted to 3× morning queue length, 180 new regulars, and 1 neighborhood-favorite award. These are unverified demo outcomes and must not be treated as evidence. |
| About / philosophy | Uses a large statement over a full-bleed warm red/orange portrait image, followed by a philosophy paragraph. This establishes the template's editorial tone before service and credentials information. |
| Services and awards | About contains five numbered service rows (Branding, Art Direction, Editorial, Digital, Packaging) and a year/award/project/category table. They are structured to scan quickly; the advertised row-inversion hover state was not exercised. All awards and service examples are template content. |
| Team | Four portrait/name/role cards follow a short team introduction. Names and roles are fictional or otherwise unverified sample copy, not facts about the user's studio. |
| Contact form | Includes First name, Last name, Email, Company, message, and a required privacy-policy checkbox, plus Submit. The contact page also lists a sample Oslo address, phone number, and weekday hours. The form and contact details were not used or verified. |
| Footer / template controls | Repeats navigation and contact information. A Framer attribution and a floating “Remix project” control appear on the demo. These are template-preview chrome and were not activated. |

### Interactions verified

- Scrolled the Home hero and observed the overlapping photographic layers slide and trade focus while surrounding images blur/recede; the glass-like bottom nav stayed fixed and its active Index capsule remained visible.
- Opened Work in Stack mode, switched to Grid, and confirmed the URL changed to `/work?view=Grid` and the projects became a three-column card grid.
- Applied Branding while in Grid mode; the URL gained `category-filter=Branding`, and the visible results narrowed to Kiln, Saltmarsh, and Marlow & Finch Law.
- Rechecked the Branding filter at phone width: the URL gained `category-filter=Branding`, and the visible list contained Halvorn Travel House, Kiln, Marlow & Finch Law, and Saltmarsh. This differs from the three results recorded during the desktop pass; the responsive result is recorded here without assuming which state is correct.
- Opened the Kiln case and scrolled through its About and Impact sections. The counters animated from zero to their displayed values as they entered view.
- Used the Next project link to open Northlight and confirmed the case-study content changed.
- Reviewed About and Contact. Left every contact field blank and did not check the privacy box or submit.

### Responsive review — live browser

| Viewport | Observed behavior |
|---|---|
| Phone, 390 × 844 | Home keeps the layered photographic project stack centered on a black canvas, with the five-link pill fixed at the bottom. Work presents the Stack mode as a typographic list and Grid mode as large single-column cards; Filter becomes a dropdown, and the view/category controls remain usable. The Kiln page places its title above a 2 × 2 metadata group, then uses full-width imagery and vertically stacked impact cards; the images also stack. About uses a large red portrait hero, followed by a single-column philosophy/awards list, numbered service rows, and full-width team portraits. Contact details and all form fields stack vertically. The bottom navigation stays fixed while scrolling and can sit over the lower edge of content; at the end of the Kiln page, Previous/Next project names are crowded and overlap at this width. |
| Tablet, 768 × 1024 | Home retains a narrow centered image stack with much more black space at the sides; the bottom pill widens but remains centered. In Work, Stack remains a text list and Grid still shows one wide image card per row rather than the desktop three-column arrangement. The Kiln page keeps its 2-column metadata, wide cover image, and full-width impact cards. About's award list and services remain single-column rows; Contact details and fields also remain stacked. |

The Kiln metrics settled at 3×, 180, and 1 after their scroll-triggered animations (unverified template claims). The floating Framer badge can cover part of the fixed navigation or page content. The filter discrepancy between the desktop and phone passes should be checked again before relying on the count or category mapping.

### GitHub and implementation evidence — kept separate

**No associated website source repository surfaced.** GitHub search for the exact `cedarstudio.framer.ai` hostname did not return a matching source repo. The preview is a published Framer project, and its visible social links go to platform roots; no site source link was found. The [official Framer Marketplace listing](https://www.framer.com/marketplace/templates/cedar/) describes a CMS-driven template with collections for Projects, Categories, Tags, Awards, and Team; it also advertises shared layout, parallax covers, archive filters, count-up metrics, and seven pages. Those are publisher descriptions, not inspection of the internal Framer layers or source. This was live visual/behavioral research, not GitHub-backed code reverse engineering; no source files, CMS configuration, or asset files were accessed.

### Potential SIROSIU lessons — options only

- A compact persistent navigation pill can keep a long portfolio easy to traverse; its links should remain legible and usable on small screens and with keyboard focus.
- A translucent fixed bottom pill with a clear active-section capsule, paired with a scroll-driven stack of overlapping project images that changes focus, matches the Cedar effects the user selected. Keep this as a candidate direction pending confirmation of which “projects scroll” they meant.
- A project archive can expose both a quick-scanning image grid and a typographic list, with the selected view and category encoded in the URL for shareable state.
- A project case can pair a plain-language summary and role metadata with deeper process and visuals. Only include outcomes that have a source and clear measurement context.
- Scroll-triggered counters can add emphasis, but should not imply measured performance when the values are decorative or unsupported.
- Reusable project, service, award, and team records may make a content-heavy portfolio easier to maintain. Confirm SIROSIU's actual content and technical needs before choosing a CMS model.

These are options, not approved design decisions. Do not copy Cedar's wordmark, identity, demo project names, text, photography, metrics, precise composition, or motion. A free Framer Marketplace listing does not provide blanket permission to reuse its demo content or media in SIROSIU. Review the source and license for any independently selected asset or package.

### Coverage limits

The review covered one desktop viewport plus portrait phone (390 × 844) and tablet (768 × 1024); other widths and landscape orientation were not tested. Keyboard navigation, focus behavior, reduced motion, performance, and formal accessibility were not audited. The award/service hover state was advertised but not tested. The site's own Framer source and CMS were unavailable, and no matching GitHub repository was found. The Branding filter produced a different visible result set on phone than in the earlier desktop pass. All Cedar identities, project claims, people, awards, contact details, and results remain unverified template content.

### User preference pass — 2026-10-26 (interpretation to confirm)

The user likes the glass-like bottom navigation bar and the project scroll. Brave recheck: the bottom pill remains fixed, with a translucent/blurred surface and a white active-link capsule; the Home hero scroll moves the overlapping project-image stack and changes which image is in focus. I interpret “projects scroll” as this Home image-stack choreography, not the separate Work archive. Confirm that interpretation before treating it as a settled design direction.

## Kai Marlow — Framer portfolio template by Lazar Filipović

- **Live preview:** [Kai Marlow](https://kaimarlow.framer.website/)
- **Official listing:** [Kai Marlow — Free Website Template for Framer](https://www.framer.com/marketplace/templates/kai-marlow/)
- **Inspected:** 2026-10-25 at a desktop viewport of approximately 1250 × 710. Reviewed Home, the Projects archive, the About section, and Ostro Coffee and Ovenbird Bakery project pages. Opened the full-screen navigation, observed the 3D image ring across multiple idle captures, and attempted the Visual Identity archive filter. No remix, download, external social link, or email action was activated.
- **Responsive review:** 2026-10-25 at portrait phone (390 × 844) and tablet (768 × 1024) sizes. Rechecked Home, Projects, About, and the Ostro Coffee and Ovenbird Bakery cases. Opened and closed the full-screen menu on phone, rechecked the Visual Identity filter, and inspected the About anchor layout. The filter did not visibly change the active All state or results on phone either.
- **Status:** Research only. The official Framer Marketplace lists a free template by Lazar Filipović (`@filipoviclazar`), published August 4 and updated September 7, 2026, with a “Limited” license. The Kai Marlow identity, Brooklyn biography, projects, client details, contact information, and portfolio content are template demonstration material, not independently verified claims. No design, code, text, or asset is approved for reuse.

### Component map — observed live

| Component | What it does |
|---|---|
| Fixed masthead | Keeps the Kai Marlow wordmark, “Brand Designer” role label, GMT−4 local-time label, and Menu control across the top while scrolling. The displayed name, role, and location are demo content. |
| Editorial hero | Uses a nearly white, lightly textured background and an oversized black serif “Kai Marlow” wordmark that fills the viewport. A one-line uppercase positioning statement and a mailto “Let’s talk” action sit below. A live-looking “Kai Marlow 100%” loading/progress label appears during page load; its purpose beyond the load transition was not tested. |
| 3D project image ring | A horizontal cylindrical ring of photographic/project panels overlaps the giant name. Different panels appeared across idle captures, suggesting an automatic rotation; no visible previous/next controls were found, and drag/pointer control was not tested. The official listing also advertises a 3D project carousel. |
| Home selected work | Shows six linked samples: Ostro Coffee, Ovenbird Bakery, Contrada, Solene, Plump Soda, and Dusk Chocolate, with concise categories such as Visual Identity, Packaging, Brand Strategy, Digital, and Art Direction. The links lead to individual case pages. |
| Projects archive | A separate `/projects` route uses a huge “Selected projects” heading, category pills for All, Brand Strategy, Visual Identity, Art Direction, Packaging, and Digital, then a two-column image grid. All six sample project links remain listed in the accessibility tree. Clicking Visual Identity during this pass did not visibly change the selected All state or the cards, so the filter behavior is inconclusive in this browser session. |
| Project detail template | Begins with a large serif project title and wide cover image, then a compact metadata column (Role, Client, Project Type) beside a single Project Overview narrative. Further large image panels lead to Other projects and a contact footer. The inspected templates do not expose process steps or measured outcomes in their accessible text. |
| Project-content consistency | The Ostro Coffee title and seafront-café story are paired with a cover showing a “Kora Coffee” package. The Ovenbird Bakery page's cover shows “The Rocha” café/bakery packaging. A lower image reads “Business card mockup” and carries a `creatoom.com` mockup mark. These visible pairings appear mismatched to the written project names and illustrate why project images, branding, and captions need a consistency check before using a template structure. |
| About section | A large editorial statement introduces “Kai Marlow” as a Brooklyn brand designer, followed by a grayscale portrait and two short text blocks about design philosophy and personal interests. A second “Let’s talk” mailto CTA follows. These identity and biography details are unverified demo copy. |
| Full-screen menu | Menu opens a near-black overlay with oversized white serif rows for numbered Home, Projects, and About links, separated by thin rules. A Close control sits in the top-right; selecting About navigated to the `#about-me` anchor and closed the panel. |
| Contact/footer | A final “Let’s Talk” image/heading links to `hello@kaimarlow.com`; Instagram, X, and LinkedIn links point to generic platform roots. There is no visible contact form on the inspected routes. Framer attribution and a “Use for free” link are preview/template chrome and were not activated. |

### Interactions verified

- Observed the header remain fixed while scrolling and the hero progress label settle at 100% after the initial load transition.
- Captured different image panels in the 3D ring at different times without interacting with it; this suggests automatic motion, but no timing or pointer-driven behavior was measured.
- Opened Menu, confirmed its Home/Projects/About navigation, selected About, and landed at the About anchor.
- Opened Projects and confirmed the six project links and six category labels. Attempting Visual Identity did not show a visible selected-filter or card-set change during this pass; the interaction remains inconclusive.
- Repeated the Visual Identity filter attempt at phone width; the All control remained selected and all six project links stayed in the accessibility tree. No result change was visible.
- Opened Ostro Coffee and Ovenbird Bakery details. Their written summaries and visual covers did not consistently match the displayed brand names; no content was submitted or edited.

### Responsive review — live browser

| Viewport | Observed behavior |
|---|---|
| Phone, 390 × 844 | The fixed masthead remains compact. The two-line serif name fills the hero, with the image ring appearing as a shallow horizontal oval that overlaps the name. The projects archive title is large and its six filter pills wrap into two rows; project cards and case-page galleries use one full-width column. Case pages place the title and cover first, then stack Role, Client, Project Type, and overview content vertically. The About statement and grayscale portrait also stack in one column. The full-screen menu opens as a dark overlay with three oversized Home/Projects/About links. |
| Tablet, 768 × 1024 | The oversized name spans most of the hero width and the image ring widens across it. The archive filter pills fit on one row, but its image cards remain a single wide column. Case-page covers remain nearly full-width, with project metadata and overview stacked beneath rather than moving into desktop columns. The About statement spans a broad line above a full-width portrait. |

The Ostro gallery stacks vertically and includes a generic business-card mockup image with a visible `creatoom.com` mark, in addition to the cover branding mismatch recorded above. The Ovenbird cover also visibly shows a different bakery brand. The floating “Use for free” and Framer preview controls can overlap content. These responsive observations do not resolve whether the template's assets are intentionally sample placeholders or misassigned.

### GitHub and implementation evidence — kept separate

**No associated GitHub source repository surfaced.** Searches for the exact `kaimarlow.framer.website` hostname, the template name with Lazar Filipović, and the creator/template source did not identify a matching website repository. The [official Framer Marketplace listing](https://www.framer.com/marketplace/templates/kai-marlow/) describes an editorial Framer template with a 3D project carousel, CMS-fed projects, image/video galleries, and category filters. That listing and the live preview do not expose the template's internal Framer layers or original code. This pass is a visual/behavioral review, not GitHub-backed source-code reverse engineering. The Marketplace marks the template license “Limited”; a free remix listing is not blanket permission to reuse the demo identity, project copy, or photography outside the template's terms.

### Potential SIROSIU lessons — options only

- A very large wordmark can make a portfolio's opening recognizable before the visitor reads detailed copy; pair it with a clear role and a direct contact action.
- A 3D image carousel can give a static portfolio an active focal point. Keep project identities legible, provide an accessible direct path to every project, and make motion controllable or respectful of reduced-motion preferences.
- A small fixed masthead and a simple full-screen menu can support a sparse editorial layout while preserving direct route access.
- Keep case-study metadata and a concise overview visible near the opening, then use project-specific images that clearly match the client, identity, and written story. Check every image for leftover mockup branding or watermarks.
- Category filters are useful only when they visibly update results and communicate the active choice. Verify their keyboard and touch behavior as well as pointer behavior.

These are options, not approved design decisions. Do not copy Kai Marlow's wordmark, identity, portrait, project names, sample copy, photography, exact layout, or motion. Do not treat the Marketplace template license as permission to reuse its demo persona or images in SIROSIU. Review provenance and license for any independently selected asset or package.

### Coverage limits

The review covered one desktop viewport plus portrait phone (390 × 844) and tablet (768 × 1024); other widths and landscape orientation were not tested. The Visual Identity filter did not visibly change the selected All state or project set on desktop or phone. The image/video behavior claimed by the listing, manual carousel interaction, keyboard-only use, focus management, reduced motion, performance, and formal accessibility were not audited. GitHub-backed website source was not found, and the Framer internals were unavailable. All Kai Marlow identity, location, project, client, and contact details are template content; the mismatched project visuals should not be treated as reliable evidence of real client work.

## 🍆🥵.ws — Wiggle Physics experiment by Max van Leeuwen

- **Live site:** [🍆🥵.ws](https://xn--gi8h42h.ws/) (punycode: `xn--gi8h42h.ws`)
- **Creator's project page:** [Wiggle Physics – Three.js](https://maxvanleeuwen.com/project/threejs-eggplant/)
- **Inspected:** 2026-10-25 in the ChatGPT in-app browser at approximately 426 × 846; observed pointer drags and wheel/scroll input. Rechecked 2026-10-26 in Brave at approximately 759 × 903: moved the pointer to the scene center, upper-left, and lower-right; followed the visible Wiggle link; and reviewed its official Getting Started guide and public GitHub README. The linked CodeSandbox example showed a Cloudflare security-verification page and was not pursued. No code or model was downloaded.
- **Status:** Research only. Max van Leeuwen's own project page describes this as a Three.js test of jiggle physics using Xavier (Jack)'s Wiggle library. The website credits the 3D model to Sketchfab creator `animatezach`. No site design, source, model, or technique is approved for SIROSIU.

### Component map — live observation and first-party credits

| Component | What it does |
|---|---|
| Full-screen scene | Uses a near-black plum background with a saturated purple radial glow as a quiet stage for one floating 3D object. There is almost no surrounding interface. |
| Pointer-responsive model | A glossy purple eggplant with a green calyx appears in the center area. Brave recheck: the whole model tracks pointer position across the canvas and changes its 3D orientation; at the lower-right edge it moved partly out of frame. Earlier drag observations also showed soft, springy deformation as it settled. The purple light field remains centered while the model moves. |
| Wiggle/jiggle motion | The project's author credits Wiggle for Three.js. Its official docs describe spring/jiggle bones that add soft, delayed movement to rigged models. The public README example animates a root bone and updates secondary `WiggleBone` instances each frame. This explains the library's intended secondary motion, but does not prove how the reference maps the cursor or which model parts use Wiggle; the website source was not found. |
| Minimal title/credits | The browser title is an eggplant emoji. The site's small visible/crawled label is `???`. Credits identify Max van Leeuwen, the Sketchfab model creator `animatezach`, and Xavier (Jack)'s Wiggle library. The Wiggle link opens the library's Three.js guide. There is no visible conventional navigation or portfolio content on this page. |

### Interactions verified

- Opened the live site in Brave. Its accessibility tree did not expose the WebGL canvas as a control, but the full-screen scene was visible in screenshots.
- Moved the pointer to the center, upper-left, and lower-right of the scene. The eggplant followed the pointer's position and changed angle; at the lower-right, part of the model left the viewport while the purple glow stayed centered.
- Followed the page's Wiggle link to the official guide and read the Getting Started explanation and linked public GitHub README. The homepage's embedded demo showed a loading spinner in this browser; the official guide's CodeSandbox link presented a security-verification page and was not opened further.
- Earlier drag and wheel observations are retained as pointer-driven scene behavior, not a verified scroll narrative. No keyboard, touch, reduced-motion, or custom cursor treatment was verified.
- No keyboard control, touch gesture, reduced-motion behavior, loading fallback, or offscreen content was verified.

### GitHub and implementation evidence — kept separate

**No public GitHub repository for this exact website surfaced.** The linked [Max van Leeuwen project page](https://maxvanleeuwen.com/project/threejs-eggplant/) says this January 2025 experiment uses Three.js and the [Wiggle library](https://wiggle.three.tools/). The associated [public `dkpfm/wiggle` repository](https://github.com/dkpfm/wiggle) is the library's source, not this site's source. Its README shows the general setup: load a skinned GLTF model, find its skeleton/root bone, wrap secondary bones in `WiggleBone`, move the root bone, then call each wiggle bone's `.update()` in a `requestAnimationFrame` loop. This supports the general mechanism, but does not prove how the reference maps pointer input to the model's pose. The library docs describe rigging and the npm package lists version 0.0.17 under MIT. The earlier crowdfunding page's statement that the library was not planned to be open source predates the later public GitHub/npm release. The live browser was usable only at a narrow viewport, and its accessibility tree did not expose the canvas content. No code was copied or downloaded.

The official [Wiggle Getting Started guide](https://wiggle.three.tools/docs/manual/getting-started) describes Wiggle Bones as rigging that lets models move softly. The GitHub example separates root movement from bone-level spring motion: it animates the root and calls each `WiggleBone.update()` on every animation frame. This suggests a useful two-part mental model for SIROSIU: pointer input sets the 3D object's target pose; a rigging library can add delayed secondary motion. That separation is an interpretation based on the library docs and author's attribution, not a source audit of the eggplant website.

The model's [Sketchfab page](https://sketchfab.com/3d-models/eggplant-emoji-531e2c549ae54b9189b460c2ff7e0e44) identifies “Eggplant Emoji” by `animatezach`, but its 3D viewer was unavailable to the research browser, so the asset-specific license and rig details remain unverified. Do not reuse the model based solely on seeing it embedded on the reference site.

### Potential SIROSIU lessons — options only

- A single expressive 3D object can carry a tiny playful page when the rest of the layout gives it space and a restrained light field.
- Let pointer movement set a target pose and use spring-like secondary motion to make a model feel tactile; keep the control subtle enough that the scene remains readable and does not fight the user.
- Treat this as a focused interaction or small accent, not a substitute for clear SIROSIU identity, project content, navigation, or contact paths.
- Keep the scene optional, provide a static alternative and reduced-motion behavior, and avoid loading a continuous WebGL renderer on phones unless it earns its performance cost.
- A reused rigged model needs a clear, verified license and attribution trail. This particular Sketchfab asset has not been cleared for reuse.

These are options, not approved decisions. Do not copy the reference site's exact joke, eggplant model, gradient, composition, or motion implementation. Any independently chosen model or code must be reviewed in `ASSET_REGISTER.md` before import.

### Coverage limits

Only the narrow in-app-browser viewport was directly observed; desktop/tablet composition, landscape, keyboard/touch support, screen-reader semantics, reduced motion, loading/performance, and the underlying site source were not audited. No exact GitHub repo was found. The model license could not be confirmed because Sketchfab's model viewer was unavailable. The small `???` label may reflect the page's visible design or the text extraction/rendering path; its intended copy is unresolved.

### User preference pass — 2026-10-26 (interpretation to confirm)

The user likes how the eggplant reacts to the cursor and wants this kind of cursor-driven interaction kept in mind for SIROSIU. The live scene follows pointer position and changes the model's orientation; the Wiggle library adds spring-bone secondary motion to rigged models, according to its official docs and source example. I interpret “this kind of cursor” as the pointer driving a responsive 3D object, not necessarily a custom cursor graphic—the site's CSS cursor remains `auto`, and no custom cursor art was verified. Confirm whether the user also means the cursor's visible design.

## The Symphony of Vines — Chateau Oublié immersive wine-story experience

- **Live site:** [The Symphony of Vines](https://symphonyofvines.unseen.co/)
- **Creator:** Unseen Studio (identified by the site's About panel and closing credits)
- **Inspected:** 2026-10-25 in the ChatGPT in-app browser at approximately 426 × 846. Entered the experience, accepted its cookie notice, opened and closed About, tested the sound control, interacted with all four chapter scenes, used Skip Chapter to advance, and viewed the ending. Rechecked 2026-10-26 in Brave at approximately 1559 × 903, focusing on cursor-driven scene behavior. Did not follow contact/social links or activate Restart Experience.
- **Status:** Research only. The site presents a fictionalized Chateau Oublié wine brand story about terroir; the identity, product claims, and wine details are not verified as a real winery. No layout, copy, code, or media is approved for SIROSIU.

### Component map — observed live

| Component | What it does |
|---|---|
| Intro title screen | Opens on a near-black canvas with a centered white serif title, “The Symphony of Vines,” and an Enter Experience control. A faint landscape outline sits low in the frame. |
| Persistent experience header | Keeps “CHATEAU OUBLIÉ” centered at the top, with a circular About/info button at left and a circular sound control at right. The small bronze outlines and subtle framing keep controls visible over the scene. |
| Chapter One — March of Glaciers | Introduces the geological story through a dark, cold-toned textured landscape. The prompt asks the visitor to carve a glacial path; dragging the pointer changes the real-time scene, with prose about glaciers carving valleys and bedrock. In the Brave recheck, pointer movement also shifted the full scene composition. |
| Chapter Two — Rhythm of Rivers | Reframes the scene with flowing contour-like lines and an earthy dark palette. The prompt asks the visitor to conduct tidal rivers; the displayed story describes tectonic forces, river channels, and the land's formation. Cursor movement visibly changes the large-scale framing and texture across the scene. |
| Chapter Three — Crescendo of Tides | Uses an eroded, ridged terrain filled with moving bright particles. The visitor is asked to wield the ocean's force; the accompanying prose connects changing sea levels and tides to the soil. The wider cursor response remains a scene/camera effect rather than a button-only state. |
| Chapter Four — Harmony of Soil | Shifts to warm ochre and brown particles, then reveals branching root-like lines. The visitor can alter the soil composition; the copy describes clay, gravel, and sand shaping vine roots and the wine's signature. Pointer position can reframe the scene from a wide vineyard/castle view to a closer, foliage-framed composition. |
| Chapter titles and narrative captions | Each chapter pairs a short title with a direct interaction verb and brief environmental copy. Text appears over the full-screen scene, then recedes as the visual continues. A Skip Chapter control can move past a chapter sequence. |
| About overlay | Opens a dark text panel over the scene. It explains the terroir story and Unseen Studio's purpose, then shows the studio contact email and Instagram, X, and LinkedIn links. A close control returns to the running scene. |
| Sound control | The circular header button changes its visible indicator when toggled. I could verify the visual state change, but did not verify audible playback or judge the soundscape. |
| Closing screen | Ends with a warm, vintage-engraving-style vineyard landscape behind “The End,” a short project/agency summary, a projects email link, and Restart Experience. The full page text ties glaciers, rivers, and tides to the final terroir story. |

### Interactions verified

- Selected Enter Experience; after the cookie notice, the first chapter title and “Use your cursor to carve a glacial path” instruction appeared.
- Dragged through the scene. The page responded with changing geological imagery and chapter text rather than behaving like a conventional scroll page. Mouse drag was used; actual touch input was not tested.
- Opened About and verified that the long project description and studio contact/social links appear in an overlay. Closed it and returned to the active chapter.
- Used Skip Chapter to move from Chapter Two to Chapter Three and then Chapter Four. All four chapter titles and their interaction prompts were observed.
- The end screen and Restart Experience link appeared at the end. The restart and outbound email/social links were not activated.
- Toggled the circular sound control and saw its icon change. Audio playback itself was not verified.
- Rechecked in Brave at 1559 × 903. Moving the pointer from the scene center to corner controls and across the canvas visibly reframed the environment—from close, abstract terrain to a wide vineyard/castle view and a tighter view through foreground leaves. The chapter labels and controls remain layered over the changing scene.
- The active chapter advanced from One through Four during this cursor pass, but the exact trigger was not isolated from the experience's running sequence. Do not claim that hovering alone advances chapters. Separate hover animations on the About and sound buttons were not established.

### Story sequence — site-stated

The first three chapters explain glaciers shaping valleys, rivers changing the terrain, and tides layering sediments. The fourth connects clay, gravel, and sand to root growth and the character of the wine. The conclusion says the land's history “speaks through every bottle,” then describes terroir through color, texture, aroma, and flavor. These are part of the reference's brand narrative, not verified claims about a real Chateau Oublié wine producer.

### GitHub and implementation evidence — kept separate

**No public GitHub repository for this exact site surfaced.** Searches for the hostname, project title, Chateau Oublié, and Unseen Studio did not locate a matching source repository. GitHub search surfaced an `UnseenStudios` account, but its profile describes a separate Unseen Acoustics/bot project and is unrelated; it was excluded. The site's own About text calls this an “interactive cinematic journey” and a real-time brand-story experiment; that is first-party description, not source code or a disclosure of a specific rendering library. The live browser exposed the interaction and visible chapter copy, but no exact source, model, shader, dependency, or build configuration was available. No code or assets were copied or downloaded.

### Potential SIROSIU lessons — options only

- Make a story sequence feel purposeful by assigning each chapter a distinct visual state, a clear interaction verb, and a short piece of relevant copy.
- Let the visitor manipulate the environment so the gesture embodies the story: carve, conduct, wield, and alter are more specific than a generic “move your mouse” prompt.
- Keep global controls available over the immersive scene; place studio/about detail in an optional overlay and leave a clear way to skip or restart.
- End with a compact conclusion and a direct contact action so the immersive story resolves into a next step.
- Use this kind of multi-chapter real-time experience only when genuine SIROSIU project content supports it. Keep essential facts, project links, and contact information readable without relying on the visual scene; avoid turning every site section into a long, high-cost cinematic.

These are options, not approved design decisions. Do not copy the Chateau Oublié identity, exact chapter sequence or wording, scenes, textures, composition, or interactions. The wine-terroir narrative is not SIROSIU content.

### Coverage limits

The original inspection used the narrow in-app-browser viewport; the Brave recheck at 1559 × 903 focused on cursor response and did not fully audit responsive layouts. I did not test keyboard navigation, actual touch/press-and-hold input, focus management, reduced motion, performance, loading failure, or formal accessibility. Page text includes “Press and hold” variants for its chapter prompts, but touch behavior was not confirmed. The sound control's icon changed, but audible behavior was not checked. No matching website GitHub source was found, so the rendering stack and implementation details remain unknown.

### User preference pass — 2026-10-26 (interpretation to confirm)

The user likes how the experience reacts to hovering across the page. I interpret this as the cursor changing the composition of the whole real-time scene—its framing, visible landscape, and foreground—not just a hover style on individual controls. The Brave recheck showed scene-wide reframing as the pointer moved, while chapter labels and persistent controls stayed layered over it. The chapter sequence advanced during the check, but I did not establish that hovering caused the chapter changes. Confirm that this captures what the user means; do not treat every button or chapter transition as a verified hover effect.


## Holtsetio — Aurelia, procedural jellyfish WebGPU experiment

- **Live site:** [Aurelia](https://holtsetio.com/lab/aurelia/)
- **Exact public source:** [holtsetio/aurelia on GitHub](https://github.com/holtsetio/aurelia) (repository links back to this live page). The README identifies the creator as Niklas Niehus / `holtsetio`.
- **Inspected:** 2026-10-25 in Brave at the available viewport of approximately 900 × 900. Waited for the real-time scene, toggled the Info and Stats panels, dragged through the canvas, and read the linked repository README, MIT license, package manifest, scene controller, jellyfish entity/material, information-panel code, and GPU Verlet solver. Rechecked 2026-10-26 in Brave at approximately 1559 × 903, expanded the Stats panel, observed the live animation, and revisited the official app, jellyfish, geometry, and physics source files.
- **Status:** Research only. No code, package, model, texture, or layout has been copied, run, or approved for SIROSIU.

### Component map — observed live

| Component | What it does |
|---|---|
| Full-viewport WebGPU canvas | Fills the window with a deep blue underwater-like field, soft haze, tiny drifting specks, and glowing amber/orange jellyfish. The scene is continuously animated; there is no conventional hero copy or page-scroll structure in the experiment. |
| Procedural jellyfish group | Multiple jellyfish of varying apparent size and distance drift vertically. Their translucent, ribbed bells pulse; warm internal structures and long, fine trailing tentacles move independently. The source creates ten instances, so the visible count changes with framing and overlap. |
| Camera controls | Dragging changed the viewpoint and composition. The source uses damped Three.js OrbitControls with panning disabled and bounded zoom distance and polar angle. |
| Cursor-ray response | Moving the pointer through the scene affects jellyfish near the ray. In the source, proximity increases a charge value that changes swimming/pulsing speed and shader glow; it does not simply pin the model to the cursor. |
| Info panel | A compact, collapsible panel sits at bottom left. It explains the procedural build, credits the technique inspirations, and links to the source and the creator's other experiments. The source caps it at 512 px wide and uses Tweakpane's markdown plugin. |
| Stats panel | A compact, collapsible panel at top right exposes an FPS readout. It showed around 54–60 FPS in the 2026-10-25 900 × 900 session. During the 2026-10-26 1559 × 903 Brave recheck it briefly showed 2, 5, and later 61 FPS. These readings varied sharply and are session-specific snapshots, not a general site benchmark.

### Interactions verified

- The initial Info panel is open with implementation notes and direct source links; its control collapses and restores the panel.
- The Stats control expands to an FPS panel and collapses again. The visible counter varied during observation.
- On 2026-10-26, the live Stats panel briefly showed 2 FPS, 5 FPS, and later 61 FPS during the Brave recheck at approximately 1559 × 903 while the jellyfish continued animating. The volatile readings are snapshots from the current browser/device, differ from the 54–60 FPS seen in the earlier 900 × 900 session, and do not establish how smoothly the site runs on the user's device.
- Dragging across the 3D area changed the camera framing and revealed different angles and sizes. The scene kept animating while idle.
- No route navigation, sound control, loading/error fallback, or instruction/tutorial sequence appeared in the lab itself. A link leads back to Holtsetio's other experiments.
- Touch, keyboard camera control, scroll zoom, and mobile/tablet behavior were not tested.

### GitHub source breakdown — exact site implementation

The repository is a standalone JavaScript/Vite experiment using Three.js WebGPURenderer and Three Shading Language (TSL), not a React/React Three Fiber component library. Its MIT license is copyright 2025 Holtsetio; copies or substantial portions must retain the copyright and permission notice. Repository dependencies have their own licenses and must be checked separately.

- [`src/app.js`](https://github.com/holtsetio/aurelia/blob/master/src/app.js) builds the scene and perspective camera, adds damped OrbitControls, initializes the physics system, then creates ten jellyfish plus the environment, plankton, and godray modules. It wires mouse movement to a camera ray and assembles a TSL post-processing pass with selective bloom.
- [`src/medusa.js`](https://github.com/holtsetio/aurelia/blob/master/src/medusa.js) gives each jellyfish a randomized position, rotation seed, and phase. They drift upward and recycle below the scene; cursor-ray proximity adds a decaying charge that changes animation speed.
- [`src/medusaBellGeometry.js`](https://github.com/holtsetio/aurelia/blob/master/src/medusaBellGeometry.js) calculates procedural bell positions in TSL, combines the live physics buffers for tentacle/arm structures, and builds translucent inner/outer physical materials with an emissive contribution for glow.
- [`src/physics/verletPhysics.js`](https://github.com/holtsetio/aurelia/blob/master/src/physics/verletPhysics.js) packs vertices and springs into GPU-backed instanced arrays, then computes spring forces and vertex positions with TSL compute kernels. Its physics accumulator targets 1/360-second substeps, clamps each incoming frame interval to at most 1/60 second, damps forces, and applies a soft pointer-ray force. The 360 value is the physics step target, not the rendered frame rate.
- [`src/info.js`](https://github.com/holtsetio/aurelia/blob/master/src/info.js) adds the bottom-left Tweakpane info folder and markdown credits/links. The app's source also imports dedicated `Background`, `Lights`, `Plankton`, and `Godrays` modules; their code is separate from the UI panel.
- [`package.json`](https://github.com/holtsetio/aurelia/blob/master/package.json) lists Vite 6, Three.js 0.175, `vite-plugin-tsl-operator`, Tweakpane, `simplex-noise`, and Babel parser tools. The README's local run steps are `npm install` and `npm run dev`; the project was not cloned or run for this review.
- The README describes the bell as a sinusoidally contracting hemisphere and the bell seam, oral arms, and tentacles as GPU Verlet systems. It says textures and fake volumetric lighting are generated procedurally in shaders. It credits Dave Hoskins' Shadertoy caustics and Aki Rodić's WebGL Jellyfish; the README also lists Particulate Medusae by Ash Weeks and Luminescence by BigWings as inspirations.

### Potential SIROSIU lessons — options only

- Give one genuinely relevant 3D artifact most of the visual space, then keep technical context in a small, optional panel instead of covering the scene with marketing copy.
- Make pointer feedback legible and indirect: proximity charges a moving subject, so the cursor feels connected to the scene without making it look like a draggable sticker.
- The repository shows how a detailed organic form can be assembled from procedural geometry, GPU-computed spring motion, shader materials, fog, lighting, and a restrained bloom pass; it is a reference for a specific technical experiment, not a ready-made website section.
- For a SIROSIU portfolio, a real work sample and project explanation must remain easy to find outside the canvas. Any WebGPU scene needs a useful static fallback, mobile/performance testing, keyboard and touch alternatives, and a reduced-motion path before adoption.

These are options, not decisions. MIT makes code reuse legally possible under its notice condition, but the repo is a specialized continuously-rendered WebGPU app with a different build setup from the still-undecided SIROSIU stack. Do not import the repo or copy its scene as a design choice without a specific project need and approval. Keep its original attribution and the licenses of all dependencies if any later reuse is approved.

### Coverage limits

Direct layout review is limited to desktop Brave viewports of approximately 900 × 900 and 1559 × 903. Phone/tablet/landscape layouts, WebGPU fallback, mobile GPU and battery use, accessibility, keyboard/touch interaction, reduced motion, and loading failure were not audited. FPS varied sharply between the two sessions, so neither reading should be treated as representative device performance. No external model or image files were downloaded; code review was read-only.

### User preference pass — 2026-10-26 (interpretation to confirm)

The user likes how smoothly the jellyfish are rendered and move through the page. I interpret this as the continuous, organic motion and the way the animated forms feel integrated into the glowing underwater scene. The official source combines separately drifting jellyfish, noise-driven turns, pulsing procedural bells, GPU-computed spring motion for the bells/arms/tentacles, shader materials, fog, plankton, godrays, and selective bloom. The Verlet solver's 1/360-second target is its physics substep, not the displayed frame rate. In today's Brave recheck, the Stats panel briefly showed 2, 5, and later 61 FPS at approximately 1559 × 903; the previous 900 × 900 session showed 54–60 FPS. Keep the user's preference focused on the visual motion quality and do not promise uniformly high runtime frame rates. Confirm that this captures what the user means by “rendering so smoothly.”

## Igloo Inc — scroll-driven ice and particle company site

- **Live site:** [igloo.inc](https://www.igloo.inc/)
- **Creators and official record:** Awwwards credits [abeto](https://www.awwwards.com/abeto/) and [Bureaux](https://www.awwwards.com/sites/igloo-inc); its listing records Site of the Day on 2024-07-23 (7.92/10) and tags the work as interactive, animation, infinite scroll, transitions, and 3D. Awwwards later announced Igloo Inc as its 2024 Site of the Year and Developer Site of the Year ([official announcement](https://www.linkedin.com/posts/awwwards_we-are-thrilled-to-announce-that-the-winners-activity-7307431367728861187-ED07)).
- **Inspected:** 2026-10-25 in Brave. Reviewed the live experience at the available 900 × 900 desktop viewport, then emulated 390 × 844 phone and 768 × 1024 tablet sizes. Tested desktop scrolling, social-selector arrows, and mobile/tablet touch swipes. The accessibility snapshot exposed only the webpage container, so the visible WebGL interface was assessed from screenshots. Rechecked 2026-10-26 in Brave at approximately 1559 × 900. Moved the pointer across upper-left, lower-right, and left-side positions in the opening scene to inspect cursor response; did not repeat the scroll sequence or control tests.
- **Status:** Inspiration/research only. No code, assets, media, or models were copied, downloaded, cloned, run, or approved for SIROSIU.

### Component map — observed live

| Component | What it does |
|---|---|
| Persistent brand and manifesto | The IGLOO wordmark stays at the upper left. Small copyright/company copy sits beneath it, with a right-aligned manifesto at the upper right. The copy is rendered with a technical, monospaced visual style. |
| Snowfield and igloo opening | A cold, nearly monochrome mountain field centers a glowing, ice-brick igloo. Thin connecting lines and small readouts turn the bricks into a scan-like interface. The initial prompt invites visitors to scroll down. |
| Camera-led scroll narrative | Scrolling on desktop and swiping on emulated touch view move the visitor through a connected 3D sequence. Glitch, frost, haze, and chromatic-fringe transitions connect scenes rather than dividing them into ordinary page sections. |
| Pointer response | In the 2026-10-26 desktop recheck, moving the pointer between screen positions coincided with changes in the 3D framing and igloo presentation; the logo and manifesto stayed anchored. The scene continued easing between captures, so not every changing brick or texture was isolated as a direct hover effect. |
| Ice portfolio objects | Company portfolio items appear as distinct forms encased in ice, with leader lines, `PORTFOLIO_CO_02 / OVERPASS`-style labels, temperature/date readouts, and a `CLICK TO EXPLORE` prompt. A phone swipe revealed a frozen Pudgy Penguins object; tablet and desktop views showed the Overpass object. I did not activate the outbound project links. |
| Particle footer and social selector | The ending uses a large particle-built penguin-like sculpture on a circular plinth. Left/right arrows change the highlighted Medium, LinkedIn, and X/Twitter options; a desktop selection change was observed, but no social link was opened. |
| Sound control | A fixed bottom-left label shows `Sound: Off` at the opening state. During emulated touch interaction it changed to `On`; I set it back to `Off`. I did not confirm audible playback. |

### Responsive behavior and interactions

- At 390 × 844, the same scene fills the narrow portrait viewport. The logo/copyright remains upper left, the manifesto remains upper right, and the igloo sits in the central field; the scroll prompt and sound label stay near the lower-left edge. A longer emulated swipe transitioned from the igloo into the frozen Pudgy Penguins object and its `CLICK TO EXPLORE` label.
- At 768 × 1024, the composition remains a portrait, full-scene experience: the igloo or portfolio object occupies the center while the brand copy stays at the top and sound control stays near the bottom-left. Touch swipes advanced to the Overpass portfolio object.
- The transition and text effects look intentionally unstable and granular, so short captures can show scrambled or partially resolved lettering. I waited for stable frames before reading labels. The phone and tablet runs used browser emulation, not physical devices.
- Rechecked the opening scene in Brave on 2026-10-26 by moving the pointer across several parts of the viewport. The scene's framing/igloo presentation changed between pointer positions, while the brand and manifesto stayed fixed; some motion continued after the pointer stopped, so cursor response and scene animation were not fully separated.
- Sound remained off after each test sequence. The interface's visible sound state changed after simulated touch began; no actual audio output was assessed.

### GitHub and implementation evidence — kept separate from live observations

The official [`The-Igloo-Company` GitHub organization](https://github.com/The-Igloo-Company) has no public repositories, so no exact original website source was available. The official Awwwards listing verifies the creators, award, and broad technology categories, but does not expose the site's repository or a complete dependency list.

The public [`LAYTAT/igloo-reverse-engineering` repository](https://github.com/LAYTAT/igloo-reverse-engineering) describes itself as a reverse-engineering study and includes analysis, shaders, assets, and recreation code. Its [`TECH_STACK.md`](https://github.com/LAYTAT/igloo-reverse-engineering/blob/main/analysis/TECH_STACK.md) claims the original used Svelte, Vite, Three.js, three-mesh-bvh, custom GLSL, GSAP ScrollTrigger, Houdini, Blender, Substance 3D Painter, Figma, Photoshop, Affinity Photo, and DaVinci Resolve. These are the repository author's findings, not verified original source disclosures. I also read its [`src/main.js`](https://github.com/LAYTAT/igloo-reverse-engineering/blob/main/src/main.js): the repo's runnable “Flow Skeleton” is a much simpler Three.js prototype with three groups (an icosphere/cylinder igloo stand-in, six rotating cubes, and 3,000 basic particles), scroll-progress interpolation, pointer-driven camera parallax, and CSS glitch/fog transition variables. It is not the original implementation or a faithful recreation of its detailed ice objects and particle footer; the README labels it a set of recreation experiments/prototypes. No declared license or root `LICENSE` file was visible in the repository. Treat it as a reading lead only: do not copy, run, or import its code or assets. I viewed the public files only; I did not clone or execute the repo.

### Potential SIROSIU lessons — options only

- Turn one real work item into a clear visual object and let concise callouts explain its role; this can make portfolio browsing feel more tactile than a grid.
- Keep branding and a small set of global controls in consistent screen positions as the scene changes.
- Use scene transitions to express a real narrative, then resolve the journey into simple social/contact choices.
- If 3D is ever approved, keep essential copy and controls in semantic HTML, preserve keyboard and reduced-motion paths, and provide a useful static fallback. The live accessibility tree exposed no visible controls or copy during this review, so that is a concrete issue to investigate before borrowing a canvas-heavy approach.

These are options, not design decisions. Do not copy Igloo's snow/ice identity, penguin imagery, portfolio labels, compositions, brand copy, or exact animation sequence. Any real SIROSIU project explanation and contact path should remain available without WebGL.

### Coverage limits

Only Brave's emulated desktop, phone, and tablet viewports were inspected. The touch swipes were browser-emulated; keyboard navigation, screen-reader behavior, reduced motion, physical-device performance, loading/error fallback, and actual audio output were not audited. The accessibility snapshot contained only a webpage container, which warrants a proper accessibility review if a similar canvas-led pattern is ever considered. No external project/social link was followed, and no source or assets were copied.

### User preference pass — 2026-10-26 (broad preference confirmed)

The user emphasized that they like the page-wide hover response—“everything” reacting across the whole page. Record this as a preference for a holistic cursor-responsive experience. In the Brave recheck, cursor movement coincided with the 3D scene's framing and igloo presentation changing, then easing between positions. The main logo, manifesto, and bottom-left controls stayed anchored to the viewport; some text appeared granular between captures, but a specific hover animation on each text/control was not isolated. The original site has no public GitHub source, so its exact pointer implementation is unknown; the third-party reverse-engineering repo contains a simplified pointer-parallax prototype, not the original code. For SIROSIU, treat page-wide environmental/camera response as selected while keeping per-control hover behavior open for later design.

## Sébastien Lempens — immersive 3D creative portfolio

- **Live site:** [sebastien-lempens.com](https://sebastien-lempens.com/)
- **Creator and project write-up:** [Sébastien Lempens on GitHub](https://github.com/sebastien-lempens?tab=repositories); [Pixila project page](https://pixila.net/projets/sebastien-lempens-portfolio). The GitHub profile links back to the portfolio. The studio write-up says the scene and camera were modeled/animated in Blender, synchronized to browser scroll, and built with React Three Fiber; it lists 2D/3D design, frontend/WebGL development, and technical optimization among the work delivered.
- **Inspected:** 2026-10-25 in Brave. Reviewed the live desktop experience (approximately 744 × 903), then emulated 390 × 844 phone and 768 × 1024 tablet viewports. Started the scene with sound off, used scroll/touch navigation, opened the section menu, and viewed the Projects scene. Did not follow outbound portfolio, contact, social, or award links. Rechecked 2026-10-26 in Brave at approximately 1559 × 903; rejected optional analytics, started the experience with sound off, and revisited the Paris hero. Did not repeat the scroll sequence in this brief revisit.
- **Status:** Inspiration research only. No site code, models, images, or media were copied, cloned, downloaded, run, or approved for SIROSIU.

### Component map — observed live

| Component | What it does |
|---|---|
| Intro and loading screen | A short progress counter runs from `000` to `100` alongside a 3D scooter rider and a row of award marks. A `START` control enters the experience. The intro recommends sound and desktop for the best experience. |
| Paris hero | A sunset Paris scene frames the Eiffel Tower, river/canal, bridge and Ferris wheel. A small avatar faces the scene beside a yellow scooter. The centered name and role, `Sébastien Lempens` and `creative web engineer`, sit above a `SCROLL` prompt. |
| Fixed global controls | A menu and sound control stay in the upper-right area as the 3D scene changes. Opening the menu dims the current scene and shows four icon-led destinations: HOME, ABOUT, PROJECTS and CONTACT. Sound remained off in this review. |
| Scroll-led scene journey | Scrolling moves the camera through a continuous 3D environment. Text and visual forms animate and distort between moments; an architectural arch introduces the skills sequence. The transitions make scrolling the primary way to reveal the story, rather than dividing it into conventional page sections. |
| About and skills | An avatar and scooter appear under the Eiffel Tower beside a first-person introduction. Lempens describes himself as a self-taught French web engineer with more than 20 years' experience across project management, design, frontend and backend work. A skills sequence names project management, web design, UX/UI, frontend development and backend development. |
| Project showcase | Tall, image-led project panels rise through a cloud layer in a horizontal 3D arrangement. Selecting or scrolling through them reveals each project's type, role and displayed technologies; a square rocket icon is the outbound project action. The accessibility tree listed 11 projects: DuPont Corian exterior cladding; Tyvek and AirGuard energy efficiency; Sanrita; Pixila; Railight; lab77; Corian's official site; the Corian Colors application; De la Terre à l'Assiette; Arboretsens; and a Telkea Christmas WebGL game. |
| Contact and ending | The final city scene uses an Atomium-like landmark, buildings, a crossing, toy cars, a large pink X form and floating `@`/`©` shapes. The exposed options include `Contact me`, `Join me on X` and `Credits & Thanks`; the journey ends with a `Thank You For Visiting` moment and a standing avatar. |
| Credits | A dedicated credits view names the tools, contributors, inspiration accounts and model sources. It makes some project provenance unusually easy to audit. |

### First-party stack and source research — kept separate from live observations

The site's own Credits section names Blender, Adobe Photoshop, React Three Fiber, drei, Zustand, Blockade Labs Skybox, Ready Player Me, Pixabay for music/effects, Adobe Mixamo, a Virtual Scroll Handler hosted on GitLab, and `joystick-controller` on GitHub. The Pixila project page independently attributes the animated Blender scene/camera and scroll synchronization to React Three Fiber. These disclosures support the visible 3D construction; they do not expose a complete dependency manifest or prove the implementation details of every effect.

I checked the creator's public [GitHub repository list](https://github.com/sebastien-lempens?tab=repositories), which showed 13 public repositories, and inspected [`sebastien-lempens/react-three-vite`](https://github.com/sebastien-lempens/react-three-vite). No repository matching this portfolio or domain appeared in the reviewed public list, so this is not the site's source. The repo describes itself as an MIT-licensed React Three Fiber + Vite starter. Its inspected [`src/App.jsx`](https://github.com/sebastien-lempens/react-three-vite/blob/main/src/App.jsx) is a compact shader experiment: one R3F `Canvas`, `OrbitControls`, a Drei `Box`, a Leva position control, GLSL vertex/fragment shaders, and a time uniform updated through `useFrame`. That is a useful learning example for scene setup and shader timing, but it does not reproduce the portfolio's multi-scene camera path, content system, or visual assets. The MIT license applies to that repo's code under its notice condition; it does not grant rights to this portfolio's site, 3D work, or third-party assets.

The site's credit list attributes the Eiffel Tower model to Scott Marshall via Poly Pizza under CC-BY 3.0, Gëlle Fra to 3Dprint.lu / AMSOL via Printables under CC-BY-NC-ND 4.0, and a car to Poly by Google via Poly Pizza under CC-BY 3.0. Those are item-specific attributions and licenses, not a blanket license for the site. In particular, the credited non-commercial/no-derivatives model is not an SIROSIU reuse candidate without a separate rights review. No credited asset was opened or downloaded.

### Responsive behavior and interactions

- At the emulated 390 × 844 phone size, the scene entered in portrait and touch scrolling moved the 3D camera. In this pass, the visible page/scene occupied only about 205 px of the 391 px CSS viewport, with a dark empty strip taking the other half; the name and controls were correspondingly small. The menu icon was visible, but tapping it did not open the menu in this phone emulation. Treat this as a phone-view concern to verify on a physical device; the intro itself recommends desktop.
- At the emulated 768 × 1024 tablet size, the hero filled the portrait viewport. Touch scrolling moved the camera, the menu opened, and its PROJECTS destination navigated into the showcase. About two full-width project cards and part of a third could be seen across the scene, with clouds partly masking their lower edges.
- The desktop menu and contact/project story were also reviewed. The sound control was left off; actual audio output, device performance, reduced motion, keyboard navigation and screen-reader usability were not audited. No physical phone or tablet was used.

### Potential SIROSIU lessons — options only

- Tie an original camera path to a clear narrative and let the scene change meaning as the visitor scrolls. This works best when each camera move reveals useful, real project information.
- Keep the section menu and sound state in a consistent position, and make project title, role and technology labels available as readable content independent of the 3D rendering.
- Use a small number of memorable project objects or panels to create a sense of place. Keep a standard list/grid path available so people can scan and compare work quickly.
- Treat mobile canvas sizing as a first-class requirement: the phone emulation exposed a large blank area, while the tablet scene and menu worked. Provide a static or reduced-motion path and preserve keyboard/touch accessibility before choosing a similarly immersive approach.

These are research options, not design decisions. Do not copy the Paris scene, scooter/avatar, project-card artwork, colors, writing, model assets, or exact animation sequence. Build any future story around SIROSIU's own verified work and identity.

### Coverage limits

The phone and tablet review used browser emulation rather than physical devices, and the narrow phone rendering may depend on device/emulation behavior. Only the tablet menu path was successfully tested. No performance profile, accessibility audit, reduced-motion mode, fallback/loading failure, keyboard-only use, project outbound links, actual sound, or individual asset downloads were tested. The website's credits and Pixila's case page are creator/agency disclosures; the public starter repository is not the portfolio's exact source.

### User preference pass — 2026-10-26 (whole experience selected)

The user likes the whole Sébastien Lempens website, rather than one isolated component. Record the complete experience as an inspiration preference: the loading counter and intro, Paris 3D hero and avatar, persistent menu/sound controls, scroll-led camera/story, About and skills sequence, project showcase, contact/ending scenes, and credits. The full live review across home, About, Projects, Contact, and credits is documented above; the 2026-10-26 Brave revisit is on the Paris hero with sound off. This selects the overall composition and narrative experience for inspiration; it does not approve copying the site's identity, assets, content, or exact camera path.
