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

  "ctrl-z": {
    role: "Design and development",
    blocks: [
      {
        type: "text",
        title: "Where it started",
        paragraphs: [
          "CTRL.Z is Brenda Hetcer, an urban music DJ from Mendoza. All her material was in a single-page PDF, 1290\u00a0×\u00a05230\u00a0px, almost entirely images and outlined text: extracting the text returned 467 bytes, just the links.",
          "I rendered it in slices to read it and pulled out the 18 images embedded in it, at their original resolution. Those are the site's photos, and the rider diagram came from the same PDF rendered at three times the scale.",
        ],
      },
      {
        type: "figure",
        figures: [{ key: "cover", alt: "CTRL.Z press kit cover: the chrome logo over an olive-toned photo." }],
        caption: "The cover: olive and moss green, chrome titles, and photos with the same color grade as her PDF.",
      },
      {
        type: "decisions",
        title: "Decisions",
        items: [
          {
            title: "Redesign instead of clone",
            text: "My press kit template assumes techno, three languages, SoundCloud sets, YouTube videos and a personal section. Brenda plays reggaeton, RKT, cumbia and trap and performs in Argentina; her SoundCloud doesn't expose track IDs, and the PDF says nothing personal. Cloned, the page was half empty or padded with made-up text. I built the structure around the material that did exist: cover, genres, bio, artists she's shared a stage with, venues, press photos, rider, hospitality and booking, in one language.",
            discarded: "Cloning and switching off the sections that didn't apply: it left a short page with another artist's look.",
          },
          {
            title: "Not one made-up fact",
            text: "A promoter uses a press kit to decide whether to book her. The rider and hospitality are taken word for word from the PDF. Of the four highlighted figures, 2017 comes from the PDF; the 9+ years, 8+ cities and 18+ venues I counted from her bio. There's no number of shows, because there was nowhere to get it from.",
          },
          {
            title: "A panel that exists but isn't visible",
            text: "I built it in full and tested it, but delivered it switched off, in case it's needed later: adding it afterwards costs more than leaving it ready, and this way the content was editable from day one. Two independent barriers keep it from the public: no link anywhere on the site, and without the environment variables the password login doesn't exist: the only way in left asks for a GitHub token, which only I have. Plus noindex and robots.txt.",
            discarded: "Leaving it live with a password: she wasn't going to use it, and a live panel is attack surface and one more password to lose.",
          },
        ],
      },
      {
        type: "figure",
        figures: [
          { key: "rider", alt: "Technical rider section: two booth options and a diagram of the gear." },
          { key: "mobile", alt: "The press kit cover on a phone." },
        ],
        caption: "The rider, with both booth options as they appear in her PDF, and the cover on a phone.",
      },
      {
        type: "text",
        title: "How it works",
        paragraphs: [
          "No framework: HTML, CSS and JavaScript, plus Vercel serverless functions for the panel. The content exists twice on purpose: written into the HTML, for search engines and for anyone without JavaScript, and repeated in a `content.json` the panel can rewrite.",
          "In the text, `*this*` renders as bold and HTML isn't accepted: everything goes in as plain text, so nothing typed into the panel can inject tags. The Content Security Policy only allows the site's own scripts (`script-src 'self'`), no inline code.",
        ],
      },
      {
        type: "list",
        title: "What testing turned up",
        items: [
          "While checking the site, the entrance animations weren't firing. The cause was the test environment, but it exposed a real problem: `.reveal { opacity: 0 }` left the page blank if JavaScript didn't run, on HTML written precisely to work without it. The fix is `boot.js`, a single statement in the head that flags JavaScript before the first paint; the CSS only hides content under `.js`. It's a separate file because the CSP doesn't allow inline scripts.",
          "The project carried a `.htaccess` inherited from the template. It's for Apache, Vercel ignores it, and its CSP still listed SoundCloud, EmailJS and jsdelivr, none of which this site uses. I deleted it: the real configuration lives in `vercel.json`.",
          "I tested the panel end to end against a mock API with the same HTTP contract: login with a right and a wrong password, all five tabs, editing, reordering and deleting, image uploads, publishing, and a 401 on all three routes without a session.",
        ],
      },
      {
        type: "stats",
        title: "By the numbers",
        items: [
          { value: "1290\u00a0×\u00a05230", label: "pixels in the source PDF, on a single page" },
          { value: "18", label: "images recovered from the PDF at original resolution" },
          { value: "5", label: "panel tabs: artist, text, lists, images and sections" },
          { value: "2", label: "barriers between the panel and the public" },
        ],
      },
      {
        type: "figure",
        figures: [{ key: "photos", alt: "Strip of CTRL.Z press photos, performing." }],
        caption: "Press photos open in a viewer, and the full pack is right below for download.",
      },
      {
        type: "text",
        title: "What I took from it",
        paragraphs: [
          "The template works as an architectural base, not as a turnkey site. With the next artist, the question won't be what to change in the clone, but what material they have and what structure that material calls for.",
        ],
      },
    ],
  },
};
