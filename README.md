# Muhammet Mert Erdoğan · personal site and portfolio

Mechanical engineering site: design, structural analysis (FEA) and manufacturing projects.

```
index.html                           single page: hero, case studies, about, experience, skills, contact
                                     (also the source of the portfolio PDF, print styles in site.css)
portfolio.html                       redirect to index.html#work (old links)
assets/site.css                      shared styles (screen + A4 landscape print)
assets/img/<project>/                figures
Muhammet_Mert_Erdogan_CV.pdf         CV (public copy, no references)
Muhammet_Mert_Erdogan_Portfolio.pdf  portfolio PDF
```

Regenerate the PDF after editing `index.html` (serve the folder, then print with Chrome):

```
python -m http.server 8790
chrome --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=Muhammet_Mert_Erdogan_Portfolio.pdf "http://localhost:8790/index.html?print"
```

Published with GitHub Pages: every push to `main` goes live.
