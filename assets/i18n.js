// Turkish version of the page. English is the source: on ?lang=tr (or a saved choice) every element whose
// normalised innerHTML is a key below gets the Turkish text. Runs before motion.js splits headings into letters.
// To add a string: write it in index.html in English, then add "English": "Türkçe" here.
(() => {
  const params = new URLSearchParams(location.search);
  let lang = params.get('lang');
  try { if (lang) localStorage.setItem('lang', lang); else lang = localStorage.getItem('lang'); } catch (e) {}
  if (params.has('print')) lang = 'en';
  lang = lang === 'tr' ? 'tr' : 'en';
  window.SITE_LANG = lang;

  // language switch in the nav: links to the other language
  const sw = document.querySelector('.lang-switch');
  if (sw) { sw.textContent = lang === 'tr' ? 'EN' : 'TR'; sw.href = '?lang=' + (lang === 'tr' ? 'en' : 'tr');
    sw.setAttribute('aria-label', lang === 'tr' ? 'Switch to English' : 'Türkçeye geç'); sw.lang = lang === 'tr' ? 'en' : 'tr'; }
  if (lang !== 'tr') return;

  const T = {
 "Work": "Projeler",
 "About": "Hakkımda",
 "Experience": "Deneyim",
 "Contact": "İletişim",
 "Muhammet Mert Erdoğan, mechanical engineer in Istanbul": "Muhammet Mert Erdoğan, İstanbul'da makine mühendisi",
 "I design parts in SolidWorks, check them in ANSYS and follow them onto the shop floor. BSc Mechanical Engineering, thesis MSc in progress, Certified SOLIDWORKS Professional.": "Parçaları SolidWorks'te tasarlıyor, ANSYS'te doğruluyor ve atölyeye kadar takip ediyorum. Makine Mühendisliği lisans, tezli yüksek lisans devam ediyor, Certified SOLIDWORKS Professional.",
 "Walk through my work": "Çalışmalarımı gez",
 "Portfolio PDF": "Portfolyo PDF",
 "Scroll to enter": "Girmek için kaydır",
 "Structural analysis, 2025 - 2026": "Yapısal analiz, 2025 - 2026",
 "Pressure vessel": "Basınçlı kap",
 "Hand calculation and an ANSYS model of the vessel and its bolted head. The head-flange zone, not the shell, sets the safety margin.": "Kabın ve cıvatalı kapağın el hesabı ve ANSYS modeli. Emniyet payını gövde değil, kapak-flanş bölgesi belirliyor.",
 "minimum safety factor, at the head": "en düşük emniyet katsayısı, kapakta",
 "safety factor of the shell": "gövdenin emniyet katsayısı",
 "peak von Mises stress": "en yüksek von Mises gerilmesi",
 "Read the case": "Vaka çalışmasını oku",
 "Design and manufacturing, 2024 - 2025, team": "Tasarım ve üretim, 2024 - 2025, takım",
 "UAV landing gear": "İHA iniş takımı",
 "I designed the skid landing gear of a 7 kg TEKNOFEST quadcopter: carbon tubes, 3D-printed T-joints and rubber pads, checked with static FEA.": "7 kg'lık bir TEKNOFEST quadkopterinin kızaklı iniş takımını tasarladım: karbon borular, 3B baskı T-bağlantılar ve kauçuk takozlar, statik FEA ile doğrulandı.",
 "under the weight target": "ağırlık hedefinin altında",
 "take-off mass": "kalkış ağırlığı",
 "gear height": "iniş takımı yüksekliği",
 "Machine learning, 2025": "Makine öğrenmesi, 2025",
 "Steel plate defects": "Çelik levha hataları",
 "Seven classifiers on steel plate inspection data. The best three, combined by majority vote, name the fault type.": "Çelik levha muayene verisinde yedi sınıflandırıcı. En iyi üçü çoğunluk oylamasıyla birleşip hata türünü buluyor.",
 "ensemble accuracy": "birleşik model doğruluğu",
 "macro F1-score": "makro F1 skoru",
 "models compared": "karşılaştırılan model",
 "Formula Student, 2023 - 2026, team": "Formula Student, 2023 - 2026, takım",
 "Chain guard": "Zincir koruması",
 "For İÜC Racing's powertrain team I designed the chain guard in SolidWorks, checked it with static analysis in ANSYS and revised the bracket.": "İÜC Racing güç aktarma ekibinde zincir korumasını SolidWorks'te tasarladım, ANSYS statik analiziyle doğruladım ve braketi revize ettim.",
 "lighter bracket": "daha hafif braket",
 "Read more": "Devamını oku",
 "Simplified 3D models of my projects. Stress colours are illustrative.": "Projelerimin basitleştirilmiş 3B modelleri. Gerilme renkleri temsilidir.",
 "Skip the tour": "Turu atla",
 "Structural analysis": "Yapısal analiz",
 "Stress analysis of a pressure vessel": "Basınçlı kabın gerilme analizi",
 "Mechanical System Design project, İÜC, Oct 2025 - Jan 2026<br>Advisor: Dr. Murat Bozkurt. Individual work.": "Makine Sistem Tasarımı projesi, İÜC, Eki 2025 - Oca 2026<br>Danışman: Dr. Murat Bozkurt. Bireysel çalışma.",
 "I calculated the stresses of a pressure vessel by hand, built an ANSYS model of the vessel and its bolted head and showed that the head-flange region, not the shell, sets the safety margin.": "Basınçlı bir kabın gerilmelerini elle hesapladım, kabın ve cıvatalı kapağın ANSYS modelini kurdum ve emniyet payını gövdenin değil, kapak-flanş bölgesinin belirlediğini gösterdim.",
 "minimum safety factor (FEA, at the head)": "en düşük emniyet katsayısı (FEA, kapakta)",
 "safety factor of the shell membrane (theory)": "gövde membranının emniyet katsayısı (teori)",
 "worst-case blast safety distance": "en kötü senaryoda patlama güvenlik mesafesi",
 "Equivalent stress, ANSYS Mechanical 2022 R1": "Eşdeğer gerilme, ANSYS Mechanical 2022 R1",
 "Safety factor map": "Emniyet katsayısı haritası",
 "Shell theory against FEA peak values": "Kabuk teorisi ve FEA tepe değerleri",
 "Method and details": "Yöntem ve ayrıntılar",
 "Method": "Yöntem",
 "<b>1. Hand calculation</b>Hoop, axial and von Mises stress, radial growth": "<b>1. El hesabı</b>Çevresel, eksenel ve von Mises gerilmesi, radyal genleşme",
 "<b>2. FEA model</b>Vessel and bolted head, linear static, refined mesh": "<b>2. FEA modeli</b>Kap ve cıvatalı kapak, lineer statik, sıklaştırılmış mesh",
 "<b>3. Two-level check</b>Membrane vs theory, peaks at discontinuities": "<b>3. İki seviyeli kontrol</b>Membran ve teori, süreksizliklerdeki tepeler",
 "<b>4. Consequence</b>Stored energy, TNT equivalent, safety distance": "<b>4. Sonuç</b>Depolanmış enerji, TNT eşdeğeri, güvenlik mesafesi",
 "Shell r = 450 mm, t = 10 mm, head 12 mm, L = 1600 mm, SA-516 Gr.70 (yield 260 MPa), internal pressure 0.597 MPa.": "Gövde r = 450 mm, t = 10 mm, kapak 12 mm, L = 1600 mm, SA-516 Gr.70 (akma 260 MPa), iç basınç 0,597 MPa.",
 "What I did": "Ne yaptım",
 "<strong>Calculated</strong> the shell stresses with thin-wall theory: von Mises 23.3 MPa, radial growth 0.051 mm.": "Gövde gerilmelerini ince cidar teorisiyle <strong>hesapladım</strong>: von Mises 23,3 MPa, radyal genleşme 0,051 mm.",
 "<strong>Modelled</strong> the vessel and bolted head in ANSYS Mechanical with mesh refinement at the flange and head.": "Kabı ve cıvatalı kapağı flanşta ve kapakta mesh sıklaştırarak ANSYS Mechanical'da <strong>modelledim</strong>.",
 "<strong>Compared</strong> theory with the shell membrane and read the FEA peaks as bending at discontinuities, instead of forcing one number onto both.": "Teoriyi gövde membranıyla <strong>karşılaştırdım</strong> ve FEA tepe değerlerini ikisine tek bir sayı dayatmak yerine süreksizliklerdeki eğilme olarak yorumladım.",
 "<strong>Extended</strong> the study with stored energy (isentropic gas), TNT equivalent and Hopkinson-Cranz blast distances. Article in preparation.": "Çalışmayı depolanmış enerji (izentropik gaz), TNT eşdeğeri ve Hopkinson-Cranz patlama mesafeleriyle <strong>genişlettim</strong>. Makale olarak hazırlanıyor.",
 "What I would do next": "Bir sonraki adımda ne yapardım",
 "A mesh independence study at the peak and a minimum-constraint support instead of the fixed base.": "Tepe noktasında mesh bağımsızlık çalışması ve sabit taban yerine minimum kısıtlı mesnet.",
 "Blast safety distance by pressure scenario (V = 1.1 m³)": "Basınç senaryosuna göre patlama güvenlik mesafesi (V = 1,1 m³)",
 "Mesh, refined at the discontinuities": "Süreksizliklerde sıklaştırılmış mesh",
 "Design and manufacturing": "Tasarım ve üretim",
 "Landing gear for a TEKNOFEST quadcopter": "TEKNOFEST quadkopteri için iniş takımı",
 "TEKNOFEST International UAV Competition, Aug 2024 - Aug 2025<br>Team project. I designed the landing gear.": "TEKNOFEST Uluslararası İHA Yarışması, Ağu 2024 - Ağu 2025<br>Takım projesi. İniş takımını ben tasarladım.",
 "For a 7 kg quadcopter I designed a skid landing gear from carbon-fibre tubes and 3D-printed joints, checked it with static FEA and brought it in 50% below the specification weight target.": "7 kg'lık bir quadkopter için karbon fiber borulardan ve 3B baskı bağlantılardan kızaklı bir iniş takımı tasarladım, statik FEA ile doğruladım ve şartnamedeki ağırlık hedefinin %50 altına indirdim.",
 "below the specification weight target": "şartnamedeki ağırlık hedefinin altında",
 "take-off mass of the UAV": "İHA'nın kalkış ağırlığı",
 "landing gear height": "iniş takımı yüksekliği",
 "landing gear width": "iniş takımı genişliği",
 "The whole system: UAV assembly in SolidWorks": "Sistemin tamamı: SolidWorks'te İHA montajı",
 "My subsystem: skid legs, carbon tubes, printed T-joints": "Benim alt sistemim: kızak bacaklar, karbon borular, baskı T-bağlantılar",
 "Drawing sheet with gear dimensions": "İniş takımı ölçülü teknik resim paftası",
 "TEKNOFEST landing gear": "TEKNOFEST iniş takımı",
 "Design decisions": "Tasarım kararları",
 "<b>1. Requirements</b>7 kg take-off mass, camera clearance, hard landings": "<b>1. Gereksinimler</b>7 kg kalkış ağırlığı, kamera görüş alanı, sert inişler",
 "<b>2. Parametric CAD</b>Skid legs, T-joints and flanges in SolidWorks": "<b>2. Parametrik CAD</b>Kızak bacaklar, T-bağlantılar ve flanşlar SolidWorks'te",
 "<b>3. Static FEA</b>Landing loads on the gear in ANSYS": "<b>3. Statik FEA</b>İniş yükleri ANSYS'te",
 "<b>4. Build</b>Carbon tubes, FDM joints in PLA, ABS and ASA": "<b>4. Üretim</b>Karbon borular, PLA, ABS ve ASA'dan FDM bağlantılar",
 "<strong>Skid gear</strong> instead of arm-mounted legs: out of the camera's view and spreads the landing load over a larger area.": "Kola bağlı bacaklar yerine <strong>kızaklı iniş takımı</strong>: kameranın görüş alanından çıkıyor ve iniş yükünü daha geniş alana yayıyor.",
 "<strong>Carbon-fibre tubes</strong> with a 5 mm wall on the legs, thicker than the arms, from a local manufacturer.": "Bacaklarda kollardan kalın, 5 mm et kalınlıklı, yerel üreticiden <strong>karbon fiber borular</strong>.",
 "<strong>3D-printed T-joints and angled flanges</strong> in ABS for strength-to-weight and easy printing.": "Dayanım/ağırlık oranı ve kolay baskı için ABS'den <strong>3B baskı T-bağlantılar ve açılı flanşlar</strong>.",
 "<strong>Rubber pads</strong> on the skids to soften the landing shock.": "İniş darbesini yumuşatmak için kızaklarda <strong>kauçuk takozlar</strong>.",
 "<strong>Bolted to the frame</strong> like the other parts, for easy assembly.": "Kolay montaj için diğer parçalar gibi <strong>gövdeye cıvatalı</strong>.",
 "Skills": "Beceriler",
 "3D-printed joint detail": "3B baskı bağlantı detayı",
 "Assembly drawing with bill of materials": "Malzeme listeli montaj resmi",
 "Machine learning": "Makine öğrenmesi",
 "Steel plate defect classification": "Çelik levha hata sınıflandırması",
 "Machine learning course project, Feb 2025 - Jun 2025<br>Individual work in R.": "Makine öğrenmesi dersi projesi, Şub 2025 - Haz 2025<br>R ile bireysel çalışma.",
 "I compared seven classifiers on steel plate inspection data and combined the best three into a voting ensemble that identifies the fault type with 91.3% accuracy.": "Çelik levha muayene verisinde yedi sınıflandırıcıyı karşılaştırdım ve en iyi üçünü, hata türünü %91,3 doğrulukla bulan bir oylama modelinde birleştirdim.",
 "voting ensemble accuracy": "oylama modeli doğruluğu",
 "input features": "girdi özelliği",
 "Test accuracy of the seven models": "Yedi modelin test doğruluğu",
 "Confusion matrix (XGBoost, test set)": "Karışıklık matrisi (XGBoost, test verisi)",
 "Top 12 features (random forest)": "En önemli 12 özellik (random forest)",
 "<b>1. Data</b>UCI Steel Plates Faults, 27 features per plate": "<b>1. Veri</b>UCI Steel Plates Faults, levha başına 27 özellik",
 "<b>2. Preparation</b>80/20 split, scaling, oversampling, Boruta selection": "<b>2. Hazırlık</b>%80/20 ayırma, ölçekleme, aşırı örnekleme, Boruta seçimi",
 "<b>3. Seven models</b>From logistic regression to XGBoost": "<b>3. Yedi model</b>Lojistik regresyondan XGBoost'a",
 "<b>4. Ensemble</b>Majority vote of XGBoost, random forest and SVM": "<b>4. Birleşik model</b>XGBoost, random forest ve SVM'in çoğunluk oylaması",
 "<strong>Cleaned</strong> the data, left out the ambiguous \"other faults\" class and balanced the minority classes by oversampling.": "Veriyi <strong>temizledim</strong>, belirsiz \"diğer hatalar\" sınıfını çıkardım ve azınlık sınıflarını aşırı örneklemeyle dengeledim.",
 "<strong>Selected</strong> the informative features with Boruta.": "Bilgi taşıyan özellikleri Boruta ile <strong>seçtim</strong>.",
 "<strong>Compared</strong> logistic regression, decision tree, random forest, k-NN, naive Bayes, SVM (5-fold CV for C) and XGBoost.": "Lojistik regresyon, karar ağacı, random forest, k-NN, naive Bayes, SVM (C için 5 katlı CV) ve XGBoost'u <strong>karşılaştırdım</strong>.",
 "<strong>Combined</strong> XGBoost (91%), random forest (90%) and SVM (88%) by majority vote: 91.3%, precision 0.909, recall 0.891.": "XGBoost (%91), random forest (%90) ve SVM'i (%88) çoğunluk oylamasıyla <strong>birleştirdim</strong>: %91,3, kesinlik 0,909, duyarlılık 0,891.",
 "What it says about the process": "Süreç hakkında ne söylüyor",
 "K-scratch, Z-scratch and stains are recognised almost perfectly. The pair the model mixes up most is bumps and pastry. Conveyor length ranks highest, so the model leans on line and plate geometry measurements, and the fault mix differs clearly between the two steel grades.": "K-scratch, Z-scratch ve lekeler neredeyse kusursuz tanınıyor. Modelin en çok karıştırdığı çift bumps ve pastry. En önemli özellik konveyör uzunluğu, yani model hat ve levha geometrisi ölçümlerine dayanıyor ve hata dağılımı iki çelik türü arasında belirgin şekilde farklı.",
 "PCA view of the training data": "Eğitim verisinin PCA görünümü",
 "Fault types by steel grade: K-scratch appears almost only on A400": "Çelik türüne göre hata tipleri: K-scratch neredeyse yalnızca A400'de",
 "More work": "Diğer çalışmalar",
 "İÜC Racing Formula Student, powertrain team, 2023 - 2026": "İÜC Racing Formula Student, güç aktarma ekibi, 2023 - 2026",
 "<strong>Designed</strong> the chain guard in SolidWorks and verified its strength with static analysis in ANSYS. Revised the bracket design for a <strong>15% weight reduction</strong>.": "Zincir korumasını SolidWorks'te <strong>tasarladım</strong> ve dayanımını ANSYS statik analiziyle doğruladım. Braket tasarımını revize ederek <strong>%15 ağırlık azaltma</strong> sağladım.",
 "I trust a result once two different routes agree on it, and I want to understand why they disagree when they don't. A design is not finished for me until I know how it will be built.": "Bir sonuca ancak iki farklı yol aynı yere vardığında güvenirim, varmadığında da nedenini anlamak isterim. Bir tasarım, nasıl üretileceğini bilmeden benim için bitmiş sayılmaz.",
 "Four internships took me from a design office (Midas) to a machine shop (Yılmaz Redüktör), an assembly line (BEKO) and on-site troubleshooting (FESTO). I am now doing a <strong>thesis MSc</strong> in Mechanical Engineering and looking for a team where I can keep learning by building real things.": "Dört staj beni bir tasarım ofisinden (Midas) talaşlı imalat atölyesine (Yılmaz Redüktör), montaj hattına (BEKO) ve sahada arıza gidermeye (FESTO) götürdü. Şimdi Makine Mühendisliği'nde <strong>tezli yüksek lisans</strong> yapıyorum ve gerçek şeyler üreterek öğrenmeye devam edebileceğim bir ekip arıyorum.",
 "Now": "Şimdi",
 "<b>MSc (Thesis), İÜC, 2026 -</b>": "<b>Tezli YL, İÜC, 2026 -</b>",
 "MSc (Thesis), İÜC, 2026 -": "Tezli YL, İÜC, 2026 -",
 "Languages": "Diller",
 "Turkish, English (C1)": "Türkçe, İngilizce (C1)",
 "Based in": "Konum",
 "Istanbul, open to relocation": "İstanbul, taşınmaya açık",
 "Internships, projects and school on one line, newest first. Pick a skill to see where I used it.": "Stajlar, projeler ve okul tek çizgide, en yenisi üstte. Bir beceri seç, nerede kullandığımı gör.",
 "All": "Tümü",
 "Internships": "Stajlar",
 "Projects": "Projeler",
 "Education and leadership": "Eğitim ve liderlik",
 "MSc in Mechanical Engineering (Thesis)": "Makine Mühendisliği Tezli Yüksek Lisans",
 "Istanbul University-Cerrahpaşa": "İstanbul Üniversitesi-Cerrahpaşa",
 "Mechanical System Design project, İÜC <span>Individual</span>": "Makine Sistem Tasarımı projesi, İÜC <span>Bireysel</span>",
 "Hand calculation and an ANSYS model of the vessel and its bolted head. The head-flange zone sets the safety margin: 3.05 against 11.2 in the shell.": "Kabın ve cıvatalı kapağın el hesabı ve ANSYS modeli. Emniyet payını kapak-flanş bölgesi belirliyor: gövdedeki 11,2'ye karşı 3,05.",
 "Static FEA": "Statik FEA",
 "Hand calculation": "El hesabı",
 "Intern": "Stajyer",
 "FESTO <span>Industrial automation</span>": "FESTO <span>Endüstriyel otomasyon</span>",
 "Traced mechanical, pneumatic, electrical and software faults in an out-of-service robotic system through root cause analysis and recommissioned it.": "Devre dışı kalmış robotlu bir sistemin mekanik, pnömatik, elektrik ve yazılım arızalarını kök neden analiziyle teşhis edip yeniden devreye aldım.",
 "Root cause analysis": "Kök neden analizi",
 "Pneumatics": "Pnömatik",
 "Commissioning": "Devreye alma",
 "Manufacturing Intern": "Üretim Stajyeri",
 "BEKO <span>Home appliances</span>": "BEKO <span>Beyaz eşya</span>",
 "Found loss sources at 5 critical assembly line stations through waste and root cause analysis and proposed 2 improvements with R&amp;D and Production.": "Montaj hattında 5 kritik istasyonda israf ve kök neden analiziyle kayıp kaynaklarını tespit ettim ve Ar-Ge ile Üretim ekipleriyle 2 iyileştirme önerisi sundum.",
 "Lean manufacturing": "Yalın üretim",
 "Assembly lines": "Montaj hatları",
 "Machine learning course project <span>Individual</span>": "Makine öğrenmesi dersi projesi <span>Bireysel</span>",
 "Seven classifiers compared in R. A voting ensemble names the fault type with 91.3% accuracy.": "R ile yedi sınıflandırıcı karşılaştırıldı. Oylama modeli hata türünü %91,3 doğrulukla buluyor.",
 "TEKNOFEST International UAV Competition <span>Team project</span>": "TEKNOFEST Uluslararası İHA Yarışması <span>Takım projesi</span>",
 "I designed the skid landing gear: carbon tubes and 3D-printed joints, 50% under the weight target.": "Kızaklı iniş takımını tasarladım: karbon borular ve 3B baskı bağlantılar, ağırlık hedefinin %50 altında.",
 "3D printing": "3B baskı",
 "Chair of the Board": "Yönetim Kurulu Başkanı",
 "İÜC Career Club <span>300+ members</span>": "İÜC Kariyer Kulübü <span>300+ üye</span>",
 "Planned the year of the club and delivered 8+ events.": "Kulübün yıllık planını yaptım ve 8'den fazla etkinlik düzenledim.",
 "Leadership": "Liderlik",
 "Design Intern": "Tasarım Stajyeri",
 "Midas Makina Sanayi <span>Machinery</span>": "Midas Makina Sanayi <span>Makine</span>",
 "Revised 3D models of existing parts in SolidWorks and prepared manufacturing drawings to dimensioning and tolerancing standards.": "Mevcut parçaların 3B modellerini SolidWorks'te revize ettim ve imalat resimlerini ölçülendirme ve toleranslandırma standartlarına uygun hazırladım.",
 "Technical drawing": "Teknik resim",
 "Tolerancing": "Toleranslandırma",
 "Workshop Intern": "Atölye Stajyeri",
 "Yılmaz Redüktör <span>Gearboxes</span>": "Yılmaz Redüktör <span>Redüktör</span>",
 "Observed CNC turning, milling, heat treatment and grinding operations and gear quality control on a gearbox production line.": "Redüktör üretim hattında CNC torna, freze, ısıl işlem ve taşlama operasyonlarını ve dişli kalite kontrolünü yerinde inceledim.",
 "CNC machining": "CNC talaşlı imalat",
 "Heat treatment": "Isıl işlem",
 "Quality control": "Kalite kontrol",
 "Powertrain team": "Güç aktarma ekibi",
 "İÜC Racing Formula Student <span>Team project</span>": "İÜC Racing Formula Student <span>Takım projesi</span>",
 "Designed the chain guard in SolidWorks, checked it in ANSYS and revised the bracket for a 15% weight reduction.": "Zincir korumasını SolidWorks'te tasarladım, ANSYS'te doğruladım ve braketi revize ederek %15 ağırlık azaltma sağladım.",
 "Lightweighting": "Hafifletme",
 "BSc in Mechanical Engineering": "Makine Mühendisliği Lisans",
 "Istanbul University-Cerrahpaşa <span>30% English-medium</span>": "İstanbul Üniversitesi-Cerrahpaşa <span>%30 İngilizce</span>",
 "Company and university logos are trademarks of their owners, shown only to identify where I studied and worked.": "Şirket ve üniversite logoları sahiplerinin markasıdır, yalnızca okuduğum ve çalıştığım yerleri belirtmek için gösterilir.",
 "Skills and certifications": "Beceriler ve sertifikalar",
 "Design": "Tasarım",
 "Analysis": "Analiz",
 "Static and modal FEA": "Statik ve modal FEA",
 "Topology optimisation": "Topoloji optimizasyonu",
 "Manufacturing and data": "Üretim ve veri",
 "Design for manufacturability": "Üretilebilirlik için tasarım",
 "Certifications and training": "Sertifikalar ve eğitimler",
 "CSWP - Certified SOLIDWORKS Professional <em>(Oct 2026)</em>": "CSWP - Certified SOLIDWORKS Professional <em>(Eki 2026)</em>",
 "UAV Design and Build Training - TEİ Aviation Engine Schools": "İHA Tasarım ve Üretim Eğitimi - TEİ Havacılık Motor Okulları",
 "McKinsey &amp; Company Forward Program": "McKinsey &amp; Company Forward Programı",
 "Turkish <em>(native)</em>": "Türkçe <em>(ana dil)</em>",
 "English <em>(C1)</em>": "İngilizce <em>(C1)</em>",
 "Copy email": "E-postayı kopyala",
 "Save contact (vCard)": "Kişi kartını kaydet (vCard)",
 "Portfolio (PDF)": "Portfolyo (PDF)",
 "Portfolio, design first (PDF)": "Portfolyo, tasarım önce (PDF)",
 "Muhammet Mert Erdoğan, mechanical engineer": "Muhammet Mert Erdoğan, makine mühendisi",
 "Istanbul, 2026": "İstanbul, 2026"
};
  Object.assign(T, {
    "Built: carbon legs, printed T-joints and pads on the skids": "Üretilmiş hali: karbon bacaklar, baskı T-bağlantılar ve kızaklarda takozlar",
    "Flight test: the UAV hovering on its landing gear": "Uçuş testi: İHA iniş takımıyla havada",
    "The TEKNOFEST team with the UAV at the exhibition": "TEKNOFEST takımı, İHA ile sergide",
    "Powertrain assembly with the chain guards, SolidWorks": "Zincir korumalarıyla güç aktarma montajı, SolidWorks",
    "Open guard with bolted flange": "Cıvatalı flanşlı açık koruma",
    "Closed ring guard": "Kapalı halka koruma",
    "Selected work": "Seçilmiş projeler",
    "Four projects, from model to result": "Dört proje, modelden sonuca",
    "Scroll through each project. Every stop links to the full case study further down.": "Kaydırarak projeler arasında ilerle. Her durak aşağıdaki ayrıntılı vaka çalışmasına bağlanıyor.",
    "Vessel rendered from my ANSYS model, coloured by its von Mises result. UAV: flight test footage.": "Kap, ANSYS modelimden render edildi ve von Mises sonucuna göre renklendirildi. İHA: uçuş testi görüntüsü.",
    "Flight test footage": "Uçuş testi görüntüsü",
    "Voting ensemble": "Oylama modeli",
    "local safety factor found by FEA, against 11.2 from shell theory": "FEA ile bulunan yerel emniyet katsayısı, kabuk teorisinde 11,2",
    "under the weight target, UAV landing gear": "ağırlık hedefinin altında, İHA iniş takımı",
    "accuracy, steel defect classifier": "doğruluk, çelik hata sınıflandırıcı",
    "industrial internships": "endüstriyel staj",
  });
  const SEL = 'h1 .ln, h2, h3, p, li, figcaption, dt, dd, summary, .btn, .lnk, .nav__cv, .chip, .kpi span, .chap__n span, ' +
    '.contact-row a, .tl__go, .chap__go, .skip-tour, footer span, .facts dd b, .meta, .stat span, .hero2__stats span, .seq__uav span, .bar span';
  const norm = h => h.replace(/\s+/g, ' ').replace(/<br\/?>/g, '<br>').trim();
  document.querySelectorAll(SEL).forEach(el => {
    if (el.closest('.print-only')) return;
    const t = T[norm(el.innerHTML)];
    if (t) el.innerHTML = t;
  });

  // dates and numbers: Aug 2025 -> Ağu 2025, 3.05 -> 3,05, 91.3% -> %91,3
  const M = { Jan: 'Oca', Feb: 'Şub', Mar: 'Mar', Apr: 'Nis', May: 'May', Jun: 'Haz', Jul: 'Tem', Aug: 'Ağu', Sep: 'Eyl', Oct: 'Eki', Nov: 'Kas', Dec: 'Ara' };
  document.querySelectorAll('.tl__when, .meta, .chap__k').forEach(el => {
    el.innerHTML = el.innerHTML.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, m => M[m]).replace('present', 'devam ediyor');
  });
  document.querySelectorAll('.kpi b, .chap__n b, .hero2__stats b, .bar b').forEach(el => {
    el.textContent = el.textContent.replace(/(\d)\.(\d)/g, '$1,$2').replace(/^([\d,]+)%$/, '%$1');
  });
  const chap = { 'Structural analysis, 2025 - 2026': 'Yapısal analiz, 2025 - 2026', 'Design and manufacturing, 2024 - 2025, team': 'Tasarım ve üretim, 2024 - 2025, takım',
    'Machine learning, 2025': 'Makine öğrenmesi, 2025', 'Formula Student, 2023 - 2026, team': 'Formula Student, 2023 - 2026, takım' };
  document.querySelectorAll('.chap__k').forEach(el => { if (chap[el.textContent]) el.textContent = chap[el.textContent]; });

  // attributes and page metadata
  document.documentElement.lang = 'tr';
  document.title = 'Muhammet Mert Erdoğan, Makine Mühendisi';
  const d = document.querySelector('meta[name="description"]');
  if (d) d.content = 'Tasarım, yapısal analiz (FEA) ve üretim üzerine çalışan makine mühendisi. Portfolyo: basınçlı kap FEA ve patlama değerlendirmesi, İHA iniş takımı, çelik hata sınıflandırması.';
  document.querySelectorAll('.copy').forEach(b => b.dataset.done = 'Kopyalandı');
  const f = document.querySelector('.tl__filters'); if (f) f.setAttribute('aria-label', 'Filtre');
})();
