/**
 * Case studies in English. Same blocks, in the same order, as es.js: a test
 * fails if the structure drifts between languages.
 */
export default {
  portfolio: {
    role: "Design and development",
    blocks: [
      {
        type: "text",
        title: "Where it started",
        paragraphs: [
          "It was a single page with nine stacked sections: about, web, motion, 3D, flyers, logos, architecture, lab and contact, each with its own giant heading. On top of that, a full-screen Three.js shader, film grain, a custom cursor, a HUD and two menus all ran at once. The scroll never ended and the work got buried.",
          "I went the other way: one animated Three.js hero and, from there, a direct way into each discipline.",
        ],
      },
      {
        type: "figure",
        figures: [
          {
            key: "hero",
            alt: "Portfolio home page: the name on the left and, on the right, a sculpture drawn with ASCII characters.",
          },
        ],
        caption: "The hero: the Three.js scene rewritten as a grid of characters.",
      },
      {
        type: "decisions",
        title: "Decisions",
        items: [
          {
            title: "Four routes instead of nine sections",
            text: "The home page became a hero plus a four-row index, and each discipline got its own URL: `/motion`, `/3d`, `/grafica` and `/web`. About and Contact open in a side panel from any category.",
            discarded:
              "A full-screen overlay: smoother, but with no links of its own, and in a portfolio you want to be able to send someone straight to `/3d`. Also grouping the work into three conceptual “worlds”: someone looking for flyers wouldn't know where to look.",
          },
          {
            title: "One WebGL context for the whole site",
            text: "The background lives in the app shell, outside the routes. Switching categories doesn't destroy it: the render loop pauses and the scene dims through CSS. And if someone lands directly on a category, three.js isn't even downloaded until they visit the home page.",
            discarded:
              "Recreating the scene on every route. Simpler to write, but the sculpture is about 46,000 triangles and the hitch when coming back home was noticeable.",
          },
          {
            title: "A hand-written ASCII filter",
            text: "The scene renders to a render target, and a full-screen quad rewrites it as characters: each cell averages its luminance from nine samples and picks a glyph from an atlas generated in the browser. The characters are layered over the dimmed scene, so the shape still reads underneath.",
          },
          {
            title: "Levels measured for each scene",
            text: "The three hero scenes look nothing alike: the sculpture sits between 0.27 and 0.60 luminance, and the organic strands barely pass 0.28. Each one has its own black and white points, taken from reading back the render target and counting which glyphs came out. The order mattered too: clipping after the response curve squeezed the inside of the sculpture into the last four glyphs of the ramp, and it read as a blob.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "ascii", alt: "Detail of the hero: the characters that make up the sculpture." },
          { key: "mobile", alt: "The hero on a phone, with the particle swarm in characters." },
        ],
        caption: "Up close, each character is a cell averaging the scene's luminance. On phones the swarm drops from 16,000 to 6,000 particles.",
      },
      {
        type: "list",
        title: "What testing turned up",
        intro: "Most of what mattered showed up by using the page:",
        items: [
          "Opening any piece gave a black screen. The page's entrance animation kept a transform applied, which made the page the containing block for the modal: it was centered on a 1,871-pixel-tall box, off screen. The modal moved to a portal on the body.",
          "The `/motion` grid used each original video as its cover: 17.2\u00a0MB on load, including a 28.7\u00a0MB file. Each cover is now an 8-second cut with a poster, and the original only downloads when the piece is opened.",
          "Switching categories left you at the previous page's scroll position. The smooth-scroll library was swallowing the native `scrollTo`, and it only happened on the deployed site.",
          "On the home page, 24 elements failed AA contrast, with ratios from 2.1 to 2.5. On this black background, 45% opacity gives exactly 4.5:1, and that became the floor for small text.",
          "On high-density screens like Retina displays, the hero canvas showed up at twice its size and the scene came out cropped. On a regular monitor it didn't show; it turned up while capturing the page at 2x.",
        ],
      },
      {
        type: "stats",
        title: "By the numbers",
        items: [
          { value: "17.2 → 0.6\u00a0MB", label: "downloaded when /motion opens" },
          { value: "28.7 → 1.1\u00a0MB", label: "heaviest file in the grid" },
          { value: "24 → 0", label: "home page elements below AA contrast" },
          { value: "0\u00a0px", label: "error between the cursor and the center of the swarm" },
        ],
      },
      {
        type: "decisions",
        title: "Also inside",
        items: [
          {
            title: "A generative lab",
            text: "Eight canvas pieces, each from a different family of algorithms, with four live controls. At their defaults, the controls show exactly the piece the seed defines. In the Gray-Scott reaction-diffusion piece, a raw parameter slider was a trap: most of the parameter space is dead, and with diffusion below 0.90x the simulation diverges to NaN and the grid stays black until the next seed. That control became a render gain, which can't break the equation, and even that gain needed a ceiling: at its maximum it burned out 37.9% of the pixels; with the new ceiling, 3.1%.",
          },
          {
            title: "An admin panel with no database",
            text: "Text and work are edited at `/admin`. On save, a serverless function commits the content to the repository through the GitHub API and Vercel redeploys. The password is hashed with scrypt, the session cookie is signed with HMAC, and only a closed list of files can be written.",
          },
          {
            title: "Tests and CI",
            text: "Vitest checks that the three languages say the same thing and that no piece points to a missing file, and it tests the panel's authentication. One of those tests caught a real bug: image compression could drop below its quality floor. Every push runs lint, tests and a build.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          {
            key: "lab",
            alt: "Comunión celular, one of the lab pieces: red reaction-diffusion blots on black.",
          },
          {
            key: "lab2",
            alt: "Salmo de arena: white grains tracing the nodal lines of a vibrating plate.",
          },
        ],
        caption: "Two of the eight lab pieces: Gray-Scott reaction-diffusion (Comunión celular) and Chladni figures (Salmo de arena).",
      },
      {
        type: "text",
        title: "What I took from it",
        paragraphs: [
          "The ASCII levels and the lab's ranges come from reading pixels, not from eyeballing. The flip side is that they don't last forever: if a scene's or a piece's material changes, it has to be measured again.",
        ],
      },
    ],
  },

  "tamara-gonzalez": {
    role: "Design and development",
    blocks: [
      {
        type: "text",
        title: "Where it started",
        paragraphs: [
          "The first brief was a digital marketing and community management portfolio, with case-style projects and a light look: dusty pink and glass. Halfway through, Tamara brought a handwritten note and two reference mockups, and the project changed at its core. What she needed was a visual artist's profile: tattoos up front, since that's what sells most and what she has the most work of, then illustration and painting.",
          "Marketing didn't disappear. It became one of her services.",
        ],
      },
      {
        type: "figure",
        figures: [{ key: "home", alt: "Tamara González's portfolio home page: a serif headline and a photo of her tattooing." }],
        caption: "The live site: a near-black burgundy base, dusty rose accents and the work up front.",
      },
      {
        type: "decisions",
        title: "Decisions",
        items: [
          {
            title: "Starting over halfway",
            text: "I changed both the structure and the skin. Marketing case studies became galleries of work, the pink stayed as an accent over the near-black burgundy her references called for, and the contact form was replaced by WhatsApp, which is how her clients actually reach her. Rabbit Studio, her branding studio, went to the footer with its rabbit logo.",
            discarded: "Keeping the marketing angle and the light look: her note made it clear the product was her art.",
          },
          {
            title: "Simple first, advanced one click away",
            text: "The person using the panel doesn't code. It opens in simple mode and keeps everything that could break the site behind “Show advanced options”, and it remembers the choice. I later carried that approach over to the panels of three other sites, this one included.",
          },
          {
            title: "Work organized by project",
            text: "The gallery started as a flat list of images. It became projects, each with its own modal, and the panel was rewritten in the same pass so she uploads each piece of work with all its photos and videos together. Images go up in batches and are converted to WebP in the browser before uploading.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          {
            key: "panel",
            alt: "The admin panel in simple mode: seven collapsed sections and the advanced options toggle.",
          },
        ],
        caption: "The panel in simple mode. Anything that could break the site waits behind a toggle.",
      },
      {
        type: "text",
        title: "How it works",
        paragraphs: [
          "The site reads everything from a `content.json`. On save, a serverless function commits to the repository through the GitHub API and Vercel publishes on its own, 30 to 60 seconds later. There's no database: every change is a commit with its history.",
          "Login is rate-limited, and uploads check a file's real type from its first bytes, with a 2\u00a0MB cap. For large batches there's also a local script with sharp and ffmpeg that processes whole folders: one subfolder per project, images to WebP up to 1600\u00a0px, 600\u00a0px thumbnails, and videos to MP4 without audio.",
        ],
      },
      {
        type: "list",
        title: "What testing turned up",
        items: [
          "The panel passed every test and loaded nothing in production. The API read `content.json` from the repository root, but the site serves it from `public/`. The tests mocked GitHub, so the path mismatch only showed up against the real repository.",
          "The gallery wouldn't close: with React 19 in StrictMode, AnimatePresence didn't unmount the component. Tests passed; in the app it stayed stuck. I replaced it with conditional rendering and lost the exit animation, which it didn't need.",
        ],
      },
      {
        type: "stats",
        title: "By the numbers",
        items: [
          { value: "41", label: "Vitest tests across the API, the panel and the components" },
          { value: "375\u00a0px", label: "with no horizontal scroll, on the site or in the panel" },
          { value: "30–60\u00a0s", label: "from saving in the panel to seeing the change live" },
          { value: "3", label: "sites that inherited this panel" },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "gallery", alt: "Tattoo gallery: a row of four projects." },
          { key: "mobile", alt: "Tamara González's site on a phone." },
        ],
        caption: "The tattoo gallery, and the home page on a phone.",
      },
      {
        type: "text",
        title: "What I took from it",
        paragraphs: [
          "A test that mocks GitHub doesn't test the real paths. That takes a run against the actual repository.",
        ],
      },
    ],
  },

  "andino-seguros": {
    role: "Design and development",
    blocks: [
      {
        type: "text",
        title: "Where it started",
        paragraphs: [
          "Federico Andino is an insurance broker in Mendoza, and he works over WhatsApp. The site didn't need to explain insurance: it needed someone arriving from Instagram or a search to end up writing to him, with the risk details already in the message instead of opening with “hi, what car do you have?”.",
          "That set the two rules for everything else: no lead gets lost, whether the visitor closes the tab or a service fails; and mobile first for real, because the traffic comes from Instagram, out on the street, on mobile data.",
        ],
      },
      {
        type: "figure",
        figures: [{ key: "home", alt: "Home of the Andino Seguros site: a white and orange headline on navy, with buttons to get a quote and to chat on WhatsApp." }],
        caption: "Blue carries the weight; orange is kept for what you're meant to tap: getting a quote and writing on WhatsApp.",
      },
      {
        type: "decisions",
        title: "Decisions",
        items: [
          {
            title: "The lead is saved before WhatsApp opens",
            text: "The form sends the data to the server, which validates it again, saves the lead and only then returns the WhatsApp link with the message composed. If the message were built in the browser, anyone who opened WhatsApp and never hit send would vanish without a trace, and that's exactly the person Federico would want to follow up. If the database fails, WhatsApp still opens: the record is lost, not the conversation.",
            discarded: "Building the message in the browser and opening WhatsApp directly: simpler, and it loses everyone who never hits send.",
          },
          {
            title: "One file per insurance type, one form",
            text: "Each insurance type is a file that declares its fields, its Zod schema and how it reads in the message. A single component renders them all without knowing anything about insurance. It started with five and now there are ten: adding one is a new file and a line in the registry, and if the line is missing, TypeScript won't compile.",
            discarded: "Four hand-written forms: easier to read at first, but the predictable growth of this project was exactly adding more insurance types.",
          },
          {
            title: "Two credentials that never mix",
            text: "The public site writes to the database with a key that can only insert: with RLS on, it can't read, edit or delete. I tested it against the real API: reading and deleting return 401, inserting returns 201. The panel uses the only credential that can read client data, locked inside a server-only module that is used only after the session is validated.",
          },
          {
            title: "A panel built for the person using it",
            text: "Federico isn't a programmer. Instead of giving him access to the database table, I built him a panel: he sees each lead with its details already translated, writes to them on WhatsApp, marks who he has contacted and takes notes. His client portfolio is imported from his spreadsheet and grouped by person, not by policy, because when a client calls he wants to see everything that person has with him.",
            discarded: "Inviting him to Supabase: zero work, but he would have faced a raw table with access to the whole project.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "formulario", alt: "Car insurance quote form on a phone: ID number, make, model, year and plate." },
          { key: "consulta", alt: "The same lead in the panel, with test data: the vehicle, the coverage wanted and the button to write on WhatsApp." },
        ],
        caption: "The car form on a phone, and the lead as it reaches Federico. The panel shows test data.",
      },
      {
        type: "text",
        title: "How it works",
        paragraphs: [
          "Next.js 16 with the App Router and TypeScript, Tailwind CSS 4, and Zod validating in the browser and again on the server. The insurance cards and the FAQ are edited in Sanity, with the Studio embedded in the same site; what never changes, like his license number or the legal pages, lives in the code. If Sanity doesn't respond, the site serves fallback content instead of going down.",
          "The panel is password-protected: the session is an HMAC-signed `httpOnly` cookie, and login allows five attempts every ten minutes per IP. Google Analytics and the Meta Pixel don't exist on the page until the visitor accepts cookies.",
        ],
      },
      {
        type: "list",
        title: "What testing turned up",
        items: [
          "The main button failed contrast: white on the brand orange is 3.0:1 and WCAG AA asks for 4.5:1. Darkening the orange only reached 4.02. Navy text on the same orange did it: 5.89:1, without touching the brand color.",
          "The floating WhatsApp button sat 2 px from the cookie notice: they didn't overlap by luck. Now both live in a column container and the spacing comes from the `gap`. I tested it by doubling the notice text: it grew from 162 to 231 px tall and the spacing stayed at 12 px.",
          "The honeypot didn't work: the schema rejected the field before the check, returned a 400 and told the bot it had been caught. Now it answers normally and drops the submission silently.",
          "The site kept serving fallback content after Sanity was loaded. It wasn't Sanity: it was Next's fetch cache, which lives on disk and survives a server restart.",
        ],
      },
      {
        type: "stats",
        title: "By the numbers",
        items: [
          { value: "10", label: "insurance forms, all rendered by a single component" },
          { value: "5.89:1", label: "contrast on the main button, up from 3.0:1" },
          { value: "9", label: "bugs in the first version found by verification, not during development" },
          { value: "401", label: "what the database returns when the public key tries to read or delete; inserting returns 201" },
        ],
      },
      {
        type: "figure",
        figures: [{ key: "panel", alt: "Panel home with test data: unanswered leads, unpaid commission, clients and policies expiring within 30 days." }],
        caption: "The panel home answers “what do I do today?”. Test data: real client data never leaves the panel.",
      },
      {
        type: "text",
        title: "What I took from it",
        paragraphs: [
          "On a conversion site, the technical decision that matters isn't the framework: it's the order of things. Save before redirecting, redirect even if saving fails, and don't animate the button everything depends on. None of the three is visible, and all three decide whether the lead arrives.",
        ],
      },
    ],
  },

  "press-kits": {
    role: "Design and development",
    blocks: [
      {
        type: "text",
        title: "Where it started",
        paragraphs: [
          "I started with my own: a web press kit to show my DJ sets, in three languages and with a panel to edit it without touching code. Then three artists followed: CTRL.Z, an urban music DJ from Mendoza; Gabi Raíz, a DJ and producer from Mendoza who goes from downtempo to psychedelic trance; and Martina Høbelar, a hard techno and schranz DJ and producer from Buenos Aires.",
          "A promoter opens a press kit to decide whether to book: who the artist is, what they play, what gear they need and where to write. All four answer exactly that, and none of them looks like another.",
        ],
      },
      {
        type: "figure",
        figures: [{ key: "portadas", alt: "The home screens of the four press kits: Kexxy, CTRL.Z, Gabi Raíz and Martina Høbelar." }],
        caption: "Kexxy, CTRL.Z, Gabi Raíz and Martina Høbelar: the same base, four looks.",
      },
      {
        type: "decisions",
        title: "Decisions",
        items: [
          {
            title: "An architecture base, not a site to clone",
            text: "My template assumes techno, three languages, SoundCloud sets and a personal section. CTRL.Z plays reggaeton, RKT, cumbia and trap, and all her material was a single-page PDF. Cloned, the page came out half empty or padded with made-up copy, so I rebuilt the structure around the material she actually had. Since then, every press kit starts with the same question: what does the artist have, and what structure does that material call for.",
            discarded: "Cloning and switching off the sections that didn't fit: what was left was a short page with another artist's look.",
          },
          {
            title: "The look comes from the material",
            text: "For CTRL.Z, the olive green and chrome titles of her PDF. For Gabi Raíz, the petrol blue of his studio photos, a red that shows up only once, and the stripes of his logo, which keep going and draw the mountain range behind him; at the end of the page it comes back upside down, as roots. For Martina Høbelar, a dark room, a single condensed typeface and her red kept for an LED that marks what's active.",
          },
          {
            title: "Not one made-up fact",
            text: "A promoter uses the press kit to decide. On CTRL.Z's, the rider and hospitality are verbatim from the PDF, and the figures I worked out from her bio were left for her to confirm. With Gabi Raíz the rule was explicit: whatever he didn't confirm comes out, even if it's on a public profile.",
          },
          {
            title: "A panel only if someone will use it",
            text: "Mine has a two-level panel that commits changes to the repo through the GitHub API. CTRL.Z's I built, tested and delivered switched off. Gabi Raíz and Martina Høbelar are a single static page, with no panel and no serverless functions.",
            discarded: "A panel on every site, just in case: an active panel is attack surface and one more password to lose.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "gabiMobile", alt: "Gabi Raíz's press kit on a phone: his logo, the mountain lines and buttons to ask for a date and listen to a set." },
          { key: "martinaMobile", alt: "Martina Høbelar's press kit on a phone: her name in a condensed typeface and the Sets and Booking buttons." },
        ],
        caption: "On a phone, every home screen leads to the same two things: listen, and ask for a date.",
      },
      {
        type: "text",
        title: "How they work",
        paragraphs: [
          "No framework and no build step: hand-written HTML, CSS and JavaScript on Vercel. The content lives in the HTML, which is what Google and WhatsApp read and what's left if the JavaScript fails. On the three client sites, the content security policy only lets the site's own scripts load.",
          "On the last two, booking goes through no server: from what's filled in, the page composes the inquiry and opens it in the sender's WhatsApp or email. On Martina's, the subject line carries the date and venue, so the booking inbox can be sorted.",
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "gabiBooking", alt: "Gabi Raíz's booking form: name, promoter, date, city, format and message, with buttons to send by WhatsApp or email." },
          { key: "martinaBooking", alt: "Martina Høbelar's booking form: name, date and venue, message, and a single button to send by email." },
        ],
        caption: "Two server-free booking forms: Gabi's opens WhatsApp or email; Martina's, only email, with a subject line that sorts.",
      },
      {
        type: "list",
        title: "What testing turned up",
        items: [
          "On CTRL.Z, the entrance animations left the page blank if the JavaScript didn't run: `.reveal { opacity: 0 }` in HTML written to work without it. The fix was `boot.js`, a single line in the head that flags JavaScript before the first paint; the CSS only hides under `.js`.",
          "On Gabi Raíz, the bio photo never showed up: with `clip-path` clipping the whole element, the browser treated it as invisible, so the lazy image never loaded and the entrance never fired. Now a curtain reveals it: a pseudo-element in the background color that slides away.",
          "On Martina Høbelar, with a phone connection dropping in and out, thumbnails that failed stayed broken: the browser doesn't request them again on its own. Each image now retries up to four times, and all of them again when the connection comes back.",
        ],
      },
      {
        type: "stats",
        title: "By the numbers",
        items: [
          { value: "4", label: "live press kits from the same base" },
          { value: "18", label: "images recovered at full resolution from CTRL.Z's PDF" },
          { value: "8", label: "flashes of Martina's LED, at the BPM of the chosen set" },
          { value: "44 px", label: "minimum height for buttons and links on Martina's" },
        ],
      },
      {
        type: "figure",
        figures: [{ key: "martinaSets", alt: "Martina Høbelar's sets section: the player and the list of sets with their BPM; a red LED marks the chosen one." }],
        caption: "Martina's sets with their BPM. Pick one and the LED flashes eight times at that tempo.",
      },
      {
        type: "text",
        title: "What I took from it",
        paragraphs: [
          "The template works as an architecture base, not a turnkey site. With every artist the question isn't what to change in the clone, but what material they have and what structure that material calls for.",
        ],
      },
    ],
  },
};
