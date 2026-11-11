# Willmar Solutions — website

Static site for Willmar Solutions Pte. Ltd. (Singapore marine consultancy), hosted on GitHub Pages.

## Structure (three tabs)
- `index.html` — Home
- `services.html` — Services overview; each service links to its detail page
  (`cargo-assurance.html`, `navigational-risk-assurance.html`, `marine-audits.html`,
  `compass-adjustment.html`, `marine-consultancy.html`, `maritime-training.html`)
- `about.html` — About: who we are, how we work, team, why Willmar, experience
- `contact.html` — enquiry form, reached from "Get in touch"
- `why-willmar.html`, `team.html`, `projects.html` — redirects into `about.html` (old links keep working)

## Shared files
- `site.css`, `site.js` — styles and behaviour for every page
- `img/` — photography, team portraits, logo assets

The enquiry form posts to FormSubmit, which emails services@willmarsolutions.com.
