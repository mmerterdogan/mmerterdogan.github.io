# Muhammet Mert Erdoğan: personal site and portfolio

Mechanical engineering site: design, structural analysis (FEA) and manufacturing projects.

```
index.html                           single page: 3D tour, case studies, about, experience, skills, contact
                                     (also the source of the portfolio PDF, print styles in site.css)
assets/scene3d.js                    3D tour (three.js from jsDelivr): simplified models, scroll-driven camera
assets/motion.css, motion.js         layout and screen effects (off in print and with reduced motion)
assets/analytics.js                  GoatCounter events (project views, case opens, PDF downloads)
dashboard.html                       visitor dashboard, reads mmerterdogan.goatcounter.com (not linked, noindex)
assets/i18n.js                       Turkish version (?lang=tr): English text -> Turkish dictionary, runs before motion.js
assets/img/logos/                    employer and university logos (masks in the site colour)
favicon.svg, robots.txt, sitemap.xml, 404.html, mert-erdogan.vcf
portfolio.html                       redirect to index.html#work (old links)
assets/site.css                      palette, base styles and A4 landscape print
assets/img/<project>/                figures
Muhammet_Mert_Erdogan_CV.pdf         CV (public copy, no references)
Muhammet_Mert_Erdogan_Portfolio.pdf  portfolio PDF (index.html?print)
Muhammet_Mert_Erdogan_Portfolio_Design.pdf  same, UAV case first (index.html?print&focus=design)
```

Regenerate the PDF after editing `index.html` (serve the folder, then print with Chrome):

```
python -m http.server 8790
chrome --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=Muhammet_Mert_Erdogan_Portfolio.pdf "http://localhost:8790/index.html?print"
```

When you change English text in `index.html`, add the Turkish line to `assets/i18n.js` (key = the English innerHTML).
Links shared elsewhere can carry `?ref=<source>` (linkedin, cv, basvuru ...), the dashboard counts them.

Published with GitHub Pages: every push to `main` goes live.
