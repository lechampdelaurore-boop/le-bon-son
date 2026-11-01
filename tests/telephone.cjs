// Vérifie sur le site EN LIGNE que l'écran de jeu tient dans la hauteur de plusieurs
// téléphones (pas d'ascenseur) : question, erreur (règle agrandie), bonne réponse, question « lire ».
// Cas le plus haut : g / ge / gu au niveau 1 (4 lignes de règle, 3 boutons).
// Usage : node tests/telephone.cjs [url]   (captures dans captures/)
const { chromium } = require('playwright');
const fs = require('fs');

const URL = process.argv[2] || 'https://lechampdelaurore-boop.github.io/le-bon-son/';
const LIVE = !process.argv[2];
const SIZES = [[320, 568], [360, 640], [375, 667], [390, 664], [390, 844], [412, 780], [430, 932]];
const expectedCache = (fs.readFileSync('sw.js', 'utf8').match(/le-bon-son-v\d+/) || [])[0];

(async () => {
  fs.mkdirSync('captures', { recursive: true });
  if (LIVE) {
    // Attendre que GitHub Pages serve bien la version du dépôt (même CACHE que sw.js).
    for (let i = 0; ; i++) {
      const live = await fetch(URL + 'sw.js?nocache=' + Date.now()).then(r => r.text()).catch(() => '');
      if (live.includes(expectedCache)) { console.log('Version en ligne : ' + expectedCache); break; }
      if (i >= 18) { console.log('Version en ligne différente de ' + expectedCache + ' après 3 min'); process.exit(1); }
      await new Promise(r => setTimeout(r, 10000));
    }
  }

  const browser = await chromium.launch();
  const lines = ['| Écran | Pire dépassement | Erreurs console |', '|---|---|---|'];
  let failed = false;
  for (const [w, h] of SIZES) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('seeded')) {
        sessionStorage.setItem('seeded', '1');
        localStorage.setItem('marc.bon-son', JSON.stringify({ prefs: { fams: ['g'], voice: false, sound: false, anim: false } }));
      }
    });
    await page.goto(URL + '?nocache=' + Date.now());
    await page.click('#startBtn');
    await page.waitForTimeout(200);
    const over = () => page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    let worst = 0, shot = 0;
    const measure = async (label) => {
      const d = await over();
      if (d > worst) worst = d;
      if (shot < 6) await page.screenshot({ path: `captures/${w}x${h}-${++shot}-${label}.png` });
    };
    // Trois mots : le 3e est une question « lire ».
    for (let item = 0; item < 3; item++) {
      await measure('question');
      const n = await page.locator('#choices .choice').count();
      for (let i = 0; i < n; i++) {
        if (await page.locator('#next').isVisible()) break;
        const b = page.locator('#choices .choice').nth(i);
        if (await b.isDisabled()) continue;
        await b.click();
        await page.waitForTimeout(150);
        await measure((await page.locator('#next').isVisible()) ? 'juste' : 'erreur');
      }
      await page.click('#next');
      await page.waitForTimeout(150);
    }
    const cell = d => (d > 0 ? `❌ dépasse de ${d} px` : '✅');
    if (worst > 0 || errors.length) failed = true;
    lines.push(`| ${w}×${h} | ${cell(worst)} | ${errors.length ? '❌ ' + errors.join(' / ') : '✅'} |`);
    await page.close();
  }
  await browser.close();
  const report = lines.join('\n');
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '## Test téléphone (site en ligne)\n\n' + report + '\n');
  process.exit(failed ? 1 : 0);
})();
