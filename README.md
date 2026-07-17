--------------------------------------------------------------------------------
 WINNERS CHAPEL INT'L MONTREAL — WEBSITE
--------------------------------------------------------------------------------

This is the source code for the official website of Winners Chapel Int'l
Montreal, a church located at 9730 Boulevard Gouin O, Pierrefonds, QC.

The site is a static, multi-page website built with plain HTML, CSS, and
JavaScript — no build step, no framework, and no server-side code required.
It can be opened directly in a browser or hosted on any static file host
(e.g. GitHub Pages, Netlify, a basic web server).


--------------------------------------------------------------------------------
 1. WHAT THE SITE DOES
--------------------------------------------------------------------------------

The website gives visitors everything they need to learn about the church,
find a service, and get in touch:

  - A home page introducing the church, its ministries, and upcoming events.
  - An About page explaining the church's mission, story, foundation, and
    the "12 Pillars of Faith" that guide its teaching.
  - A Visit Us page with service times, location, and ways to get connected
    (special events, transportation help).
  - A Live page for watching/joining services online.
  - A Contact section with a working contact form, address, phone, and email.
  - Full bilingual support — every page can be toggled between English and
    French with a single click, and the choice is remembered on return visits.


--------------------------------------------------------------------------------
 2. FILE STRUCTURE
--------------------------------------------------------------------------------

  index.html        Home page shell. Loads header.html, body.html, and
                     footer.html into itself at runtime via JavaScript.
  body.html          The actual content of the home page (hero, events,
                     ministries, services, "new here" cards, messages,
                     contact form). Kept separate so it can be fetched
                     and injected into index.html.
  header.html        The shared site navigation bar (logo, menu links,
                     language toggle, "Be Our Guest" button). Reused on
                     every page.
  footer.html        The shared site footer (about blurb, newsletter
                     signup, menu links, location, social icons). Reused
                     on every page.
  about.html         Full standalone "About Us" page.
  visit-us.html      Full standalone "Visit Us" page.
  live.html          Full standalone "Live" streaming page.
  style.css          All styling for every page (colors, layout, fonts,
                     animations, responsive rules).
  script.js          All interactive behaviour (see section 4 below).
  images/            Photos used throughout the site (hero slideshow,
                     ministry cards, service photos, etc.).

Note: about.html, visit-us.html, and live.html only fetch header.html and
footer.html (their own main content is written directly in the page,
since it doesn't need to be reused anywhere else). Only index.html also
fetches body.html, because the home page content is the largest and most
distinct section of the site.


--------------------------------------------------------------------------------
 3. HOW THE PAGES ARE ASSEMBLED
--------------------------------------------------------------------------------

To avoid copy-pasting the same navigation bar and footer into every HTML
file, each page loads them at runtime with a small snippet of JavaScript:

    fetch('header.html') -> injects into <div id="header">
    fetch('footer.html') -> injects into <div id="footer">

Only after the header and footer have finished loading does the page load
script.js — this guarantees that script.js can always find the elements it
needs to attach behaviour to (language toggle button, nav bar, forms, etc.),
since those elements come from the fetched partials.

This keeps the navigation and footer consistent across the whole site: to
change a menu link or the footer's contact info, you only need to edit
header.html or footer.html once, and every page picks up the change.


--------------------------------------------------------------------------------
 4. INTERACTIVE FEATURES (script.js)
--------------------------------------------------------------------------------

  Language switching
      Every translatable piece of text carries a data-en="..." and
      data-fr="..." attribute. Clicking the FR/EN button in the nav swaps
      all visible text, form placeholders, and phone number links between
      English and French. The chosen language is saved in the browser's
      local storage, so it persists across page visits.

  Hero slideshow
      The home page hero rotates through a set of background photos
      automatically every 4 seconds.

  Sticky nav
      The navigation bar's background darkens slightly once the visitor
      scrolls down the page, for better readability over page content.

  Contact form & newsletter signup
      Both the contact form and the footer newsletter form submit directly
      to Web3Forms (a third-party form backend) via JavaScript's fetch API,
      with success/error messages shown inline — no page reload, and no
      custom backend server needed.

  Footer year
      The copyright year in the footer updates automatically, so it never
      needs to be changed by hand.


--------------------------------------------------------------------------------
 5. DESIGN SYSTEM
--------------------------------------------------------------------------------

The site uses a consistent visual language across every page, defined at
the top of style.css as reusable variables:

  --gold        the church's brand accent color, used for highlights,
                buttons, links, and small decorative touches
  --dark        near-black, used for dark sections, text, and buttons
  --white / --light-bg   backgrounds and light sections
  --text / --mid-gray    body text and secondary text colors

Typography is set in 'Poppins' throughout (loaded from Google Fonts).

Recurring design patterns used across pages:
  - Dark gradient "hero" sections with a faint animated grid texture and a
    thin gold top border, used to open the About and Visit Us pages.
  - A full-page "watermark" effect: giant, almost-invisible scrolling text
    ("FAITH • FAMILY • FUTURE • HOME...") drifting behind the content on
    every page, for subtle brand texture without distracting from content.
  - Rounded white cards with soft shadows for content like service times,
    the contact form, and location details.
  - Gold-accented hover effects (lifting cards, sliding arrows on buttons)
    for a polished, interactive feel.

The site is fully responsive, with layout adjustments for tablet
(900px) and mobile (600px) screen widths.


--------------------------------------------------------------------------------
 6. RUNNING THE SITE LOCALLY
--------------------------------------------------------------------------------

Because pages load header.html/body.html/footer.html via fetch(), opening
index.html directly as a local file (file://) will not work in most
browsers — fetch requests to local files are blocked for security reasons.

Instead, serve the folder with any simple local web server, for example:

    python -m http.server 8000

...then visit http://localhost:8000 in a browser.


================================================================================
