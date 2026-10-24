# Muhammet Mert Erdoğan · personal site and portfolio

Mechanical engineering site: design, structural analysis (FEA) and manufacturing projects.

```
index.html                           home page (about, projects, experience, skills)
portfolio.html                       case studies; printed to the PDF below
assets/site.css                      shared styles (screen + A4 landscape print)
assets/img/<project>/                figures
Muhammet_Mert_Erdogan_CV.pdf         CV (public copy, no references)
Muhammet_Mert_Erdogan_Portfolio.pdf  portfolio PDF
```

Regenerate the PDF after editing `portfolio.html` (serve the folder, then print with Chrome):

```
python -m http.server 8790
chrome --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=Muhammet_Mert_Erdogan_Portfolio.pdf http://localhost:8790/portfolio.html
```

Published with GitHub Pages: every push to `main` goes live.
