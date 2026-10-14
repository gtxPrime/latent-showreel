# Upload checklist - read this first

You need all of these before the contact form can send:
- A GoViral hosting account, a domain pointed at its document root, and File Manager or FTP access.
- HTTPS enabled on the domain.
- PHP 7.4+ (PHP 8.2+ recommended).
- PHP mail() enabled and outbound mail permitted by the host.
- A sender mailbox on your hosted domain. Configure its SPF/DKIM records as the host directs.
- A domain sender mailbox (the recipient is already configured as palashsharmayt9@gmail.com).
- Permission to upload Palash's work and testimonials publicly.

This bundle is prepared for https://thebestfuckingportfolio.site. Canonical, Open Graph, Twitter card, JSON-LD, robots.txt and sitemap.xml use that domain. Inbox delivery is not verified until you test it on your hosting. The static demo is published on GitHub Pages. No GoViral deployment or enquiry has been performed during preparation.

## Upload
1. Back up any existing website in the domain's document root.
2. Extract this ZIP. Upload the CONTENTS of the site folder into that domain's document root (often public_html, but use the root shown for your specific domain). index.html, contact.php and contact-config.php should sit alongside each other. Keep the assets and vendor folders intact. No npm install or build step is needed.
3. Edit contact-config.php on the server:
   - recipient: already set to palashsharmayt9@gmail.com, confirmed by Garvit.
   - sender: a real address on the hosted domain, for example portfolio@your-domain.com. Never use the visitor's email as From.
   - site_origin: already set to https://thebestfuckingportfolio.site. Keep that as the canonical host and redirect www to non-www in the hosting panel.
4. Use your host's PHP selector to choose PHP 8.2+ if available. Confirm mail() is enabled with host support. The PHP user needs a writable system temporary directory for rate limiting.
5. Open the actual site URL on desktop and phone. Check the loader, tunnel, all-projects button, filters, video player, testimonials and footer.
6. Submit ONE real test enquiry to Palash with his permission. Check both the form status and his inbox/spam folder. A mail-server acceptance message does not prove inbox delivery. Reply-To should be the visitor email.
7. If mail fails, ask GoViral whether mail() and outbound mail are enabled. If the host requires authenticated SMTP instead, this bundle needs an SMTP mailer and private server configuration. Do not put SMTP passwords in public files or a repository.
8. Remove this DEPLOY.md and CONTENT-AUDIT.md from the public root after reading, or keep them outside that root.

## Contact safeguards and limits

The endpoint checks input sizes, email syntax, project type, exact browser Origin, a hidden honeypot, and a per-IP limit of three accepted enquiries per ten minutes. It uses Reply-To rather than trusting visitor input for From. IPs are hashed for temporary rate-limit filenames. These are basic protections, not a spam-proof guarantee. Add host-level filtering if needed. The endpoint deliberately refuses to send while configuration is blank.

## Known content gaps

- Project #32, AI & Blender: Creative Synergy, had an unrelated stand-up video link on the original site. The poster remains in its same position; playback is disabled pending the correct link. Replace url in data.js and remove unavailable: true when the correct video is verified.
- Project #23 has only the source upload title June 18, 2025. It remains playable but is in Unverified until Palash supplies its name/type.
- The original site has 35 projects. The year 2026 labels this portfolio edition, not the production year of every film.

Keep contact-config.php server-side and make sure PHP executes on the host. Never serve the folder through a non-PHP server in production. The social links and click-to-copy email still work if server mail is unavailable.

## SEO and server details

The bundle includes local Inter fonts with font-display:swap, a 1200x630 social card, SVG/PNG favicons, Apple touch icon, real page title/description, canonical, Person JSON-LD, robots.txt and sitemap.xml. Keep historic upload years intact. There are no ranking guarantees.

The .htaccess file supplies a real server 404 handler and blocks directory listing/config/document downloads on Apache-compatible hosting. If your host rejects Options -Indexes or Require directives, ask its support for equivalent directory-listing and file-access protection before removing them. On a non-Apache server, configure the 404 and access restrictions in the host panel.

The form was syntax-parsed and frontend states were tested locally. PHP execution and actual mail delivery still require the hosted test.

## Latest interface update
The large Quick scan launcher immediately after the tunnel and work CTAs reuse the same 35-thumbnail filtered grid. Tools now shows six tools (Blender and Nano Banana removed from the toolkit only; historical project descriptions are preserved). Testimonials slide with arrows or swipe, with reduced-motion support. Click the email address itself to copy it. The 404 is a lost-frame edit-suite scene with links that work on Pages and the custom domain. Tunnel poster base dimensions are 12% larger than the previous 2026 bundle on desktop and mobile; coordinates, order and flight timing are unchanged.
