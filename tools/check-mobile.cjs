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

async function checkMembers(page, cards) {
    const names = page.locator(cards + ' h4 a');
    await names.first().waitFor({state: 'attached'});
    const count = await names.count();
    assert.ok(count > 0);
    for (const index of new Set([0, Math.floor(count / 2), count - 1])) {
        const name = names.nth(index);
        await name.evaluate(el => el.scrollIntoView({block: 'center', behavior: 'instant'}));
        await page.waitForFunction(({cards, index}) => {
            const el = document.querySelectorAll(cards + ' h4 a')[index];
            const box = el.getBoundingClientRect();
            if (!el.textContent.trim() || box.width <= 0 || box.height <= 0 ||
                box.bottom <= 0 || box.top >= innerHeight) return false;
            for (let p = el; p; p = p.parentElement) {
                const style = getComputedStyle(p);
                if (+style.opacity < 0.95 || style.visibility !== 'visible') return false;
            }
            return true;
        }, {cards, index}, {timeout: 3500}).catch(error => {
            throw new Error('Member ' + (index + 1) + ' of ' + count + ' is not visible: ' + error.message);
        });
    }
}

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
                    if (path.includes('team')) await checkMembers(page, '.team-member');
                    if (path === 'index.html') await checkMembers(page, '#team .team-member-card');
                    if (path.includes('team')) {
                        const button = page.locator('.mobile-toggle');
                        await button.tap();
                        await page.waitForFunction(() => document.querySelector('.nav-menu').getBoundingClientRect().right <= innerWidth + 1, null, {timeout: 2500});
                        assert.deepEqual(await page.locator('.nav-links a').allTextContents(), [home, team]);
                        await button.tap();
                        await page.waitForFunction(() => document.querySelector('.nav-menu').getBoundingClientRect().left >= innerWidth, null, {timeout: 2500});
                    } else {
                        // These two stories intentionally use different photo layouts.
                        const gallery = page.locator('.news-gallery').filter({has: page.locator('a[href$="2026-11-04-crrc-qingdao-1-enhanced.jpg"]')});
                        const photos = gallery.locator('a');
                        await photos.first().waitFor();
                        const ceremonyPhotos = page.locator('.news-gallery').filter({has: page.locator('a[href$="2026-11-hkae-dong-presentation.jpg"]')}).locator('a');
                        assert.equal(await ceremonyPhotos.count(), 3);
                        for (const width of [320, 390, 768, 769, 1280]) {
                            await page.setViewportSize({width, height: 844});
                            const cards = await ceremonyPhotos.evaluateAll(links => links.map(a => a.getBoundingClientRect().toJSON()));
                            for (const [index, card] of cards.entries()) {
                                assert.ok(card.width > 0 && card.height > 0 && card.left >= 0 && card.right <= width + 1, 'every photo stays on the page at ' + width);
                                assert.ok(Math.abs(card.width - cards[0].width) < 1, 'equal-width photos');
                                if (!index) continue;
                                const prev = cards[index - 1];
                                if (width <= 768) {
                                    assert.ok(Math.abs(card.left - prev.left) < 1 && card.top >= prev.bottom + 19.9, 'single column with 20px clearance at ' + width);
                                } else {
                                    assert.ok(Math.abs(card.top - prev.top) < 1 && card.left >= prev.right + 23.9, 'one row with 24px clearance at ' + width);
                                }
                            }
                        }
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
