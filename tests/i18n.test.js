const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const content = require('../js/i18n-content.js');
const { createTranslator, fingerprint } = require('../js/i18n.js');
const team = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'team-members.json'), 'utf8'));

test('language translation preserves exact English and safely falls back for unknown content', () => {
    const { translate } = createTranslator(content);
    for (const text of ['  Research\n', 'A new untranslated research topic', 'mailto:name@cityu.edu.hk', 'Mr. WANG, Bo']) {
        assert.equal(translate(text, 'en'), text);
        assert.equal(translate(text, 'unsupported-language'), text);
    }
    assert.equal(translate('A new untranslated research topic', 'zh-Hans'), 'A new untranslated research topic');
    assert.equal(translate('Mr. WANG, Bo', 'zh-Hant'), 'Mr. WANG, Bo');
    assert.equal(translate('  Smart Grid\n', 'zh-Hant'), '  智能電網\n');
});

test('cohorts, qualifications, date ranges and profile titles switch in both Chinese variants', () => {
    const { translate } = createTranslator(content);
    assert.equal(translate('PhD Student @ 25 Spring', 'zh-Hans'), '博士生 · 2025年春季');
    assert.equal(translate('MEng & BEng @ Central South University', 'zh-Hant'), '工學碩士及學士 · 中南大學');
    assert.equal(translate('2026 - Now', 'zh-Hans'), '2026 - 至今');
    assert.equal(translate('Accepted Papers in 2026', 'zh-Hant'), '2026年已錄用論文');
    assert.equal(translate('Mr. WANG, Bo | JC STEM Lab of Future Energy Systems', 'zh-Hans'), 'Mr. WANG, Bo | 赛马会未来能源系统创科实验室');
});

test('every current member has complete simplified and traditional profile translations', () => {
    const { translate, registerProfiles } = createTranslator(content);
    registerProfiles(team);
    for (const category of team.categories) {
        for (const group of category.subcategories) {
            for (const member of group.members) {
                const biography = content.biographies[member.id];
                assert.ok(biography, member.id);
                assert.equal(biography.fingerprint, fingerprint(member.biography));
                const text = [
                    ...(member.role || []).map(role => role.text),
                    ...(member.interests || []),
                    ...(member.education || []).flatMap(item => [item.degree, item.institution]),
                    ...member.biography.split(/\n\n+/).filter(paragraph => paragraph.trim())
                ];
                for (const source of text) {
                    for (const language of ['zh-Hans', 'zh-Hant']) {
                        assert.notEqual(translate(source, language), source, `${member.id}: ${language}: ${source}`);
                    }
                }
            }
        }
    }
});

test('edited biographies cannot accidentally receive an outdated translation', () => {
    const { translate, registerProfiles } = createTranslator(content);
    const changed = structuredClone(team);
    const member = changed.categories[0].subcategories[0].members[0];
    member.biography += ' New research appointment.';
    registerProfiles(changed);
    assert.equal(translate(member.biography, 'zh-Hans'), member.biography);
});
