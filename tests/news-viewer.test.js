const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('news thumbnails open a dialog instead of another tab', () => {
    const page = {document: {addEventListener() {}}};
    vm.runInNewContext(fs.readFileSync(require.resolve('../script.js'), 'utf8'), page);
    const html = page.generateGalleryHTML(['/one.jpg', '/two.jpg']);
    assert.doesNotMatch(html, /target="_blank"/);
    assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, 2);
    for (const src of ['/one.jpg', '/two.jpg']) assert.ok(html.includes('src="' + src + '"'));
});

test('news viewer controls have both Chinese translations', () => {
    const {translate} = require('../js/i18n.js').createTranslator(require('../js/i18n-content.js'));
    assert.equal(translate('Close photo', 'zh-Hans'), '关闭照片');
    assert.equal(translate('Close photo', 'zh-Hant'), '關閉照片');
});
