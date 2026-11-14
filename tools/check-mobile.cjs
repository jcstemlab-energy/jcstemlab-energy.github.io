// Run against a local preview or a deployed copy: node tools/check-mobile.cjs <base URL>
// Requires Playwright and Microsoft Edge. No changes are made to the site.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const localRoot = require('node:path').resolve(__dirname, '..');
const base = process.argv[2] || 'http://lab-preview.test/';
const labels = {
    en: ['Home', 'Team', 'Close photo'],
    'zh-Hans': ['首页', '团队', '关闭照片'],
    'zh-Hant': ['首頁', '團隊', '關閉照片']
};

(async () => {
    const browser = await chromium.launch({ channel: 'msedge', chromiumSandbox: true });
    try {
        for (const path of ['pages/team.html', 'pages/all-news.html', 'index.html']) {
            const page = await browser.newPage({ viewport: {width: 390, height: 844}, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
            try {
                // Keep third-party metrics and fonts out of the layout/interaction check.
                await page.route('**/*', async route => {
                    const url = new URL(route.request().url());
                    if (url.origin !== new URL(base).origin) return route.abort();
                    if (process.argv[2]) return route.continue();
                    const file = require('node:path').resolve(localRoot, '.' + decodeURIComponent(url.pathname));
                    if (!file.startsWith(localRoot + require('node:path').sep)) return route.abort();
                    try { await route.fulfill({path: file}); } catch { await route.fulfill({status: 404, body: ''}); }
                });
                page.setDefaultTimeout(6000);
                await page.goto(new URL(path, base).href, { waitUntil: 'domcontentloaded' });
                for (const [lang, [home, team, close]] of Object.entries(labels)) {
                    await page.locator('[data-language="' + lang + '"]').click();
                    await page.waitForFunction(l => document.documentElement.lang === l, lang);
                    if (path.includes('team')) {
                        const button = page.locator('.mobile-toggle');
                        await button.tap();
                        await page.waitForFunction(() => document.querySelector('.nav-menu').getBoundingClientRect().right <= innerWidth + 1, null, {timeout: 2500});
                        assert.deepEqual(await page.locator('.nav-links a').allTextContents(), [home, team]);
                        await button.tap();
                        await page.waitForFunction(() => document.querySelector('.nav-menu').getBoundingClientRect().left >= innerWidth, null, {timeout: 2500});
                    } else {
                        const gallery = page.locator('.news-gallery').filter({has: page.locator('a:nth-child(3)')}).first();
                        const photos = gallery.locator('a');
                        await photos.first().waitFor();
                        for (const width of [320, 390, 768, 1280]) {
                            await page.setViewportSize({width, height: 844});
                            const boxes = await photos.evaluateAll(links => links.map(a => a.getBoundingClientRect().toJSON()));
                            if (width > 768) {
                                assert.equal(await gallery.evaluate(e => getComputedStyle(e).display), 'flex');
                                assert.ok(boxes[1].left < boxes[0].right, 'desktop overlap preserved');
                            } else {
                                assert.ok(boxes.every(b => b.left >= 0 && b.right <= width + 1), 'photos stay inside ' + width + 'px viewport');
                                if (width === 320) assert.ok(boxes[1].top >= boxes[0].bottom, 'single column');
                                else assert.ok(boxes[1].left >= boxes[0].right && boxes[1].top === boxes[0].top, 'two columns');
                                assert.ok(boxes[2].top >= boxes[0].bottom, 'third photo below first');
                            }
                        }
                        await page.setViewportSize({width: 390, height: 844});
                        for (const link of await page.locator('.news-gallery a').all()) {
                            const src = await link.evaluate(a => a.href);
                            await link.tap();
                            const dialog = page.locator('dialog[open]');
                            await page.waitForFunction(() => document.querySelector('dialog[open] img')?.naturalWidth > 0);
                            assert.equal(await dialog.locator('img').evaluate(img => img.currentSrc), src);
                            await dialog.getByRole('button', {name: close, exact: true}).tap();
                            assert.equal(await dialog.count(), 0);
                        }
                    }
                    console.log('PASS', path, lang);
                }
            } catch (error) {
                console.error('FAIL', path, error.message); process.exitCode = 1;
            } finally { await page.close(); }
        }
    } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
