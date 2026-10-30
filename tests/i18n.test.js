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
    assert.equal(translate('Dr. WONG, Yuk Sum', 'zh-Hant'), 'Dr. WONG, Yuk Sum');
    assert.equal(translate('  Smart Grid\n', 'zh-Hant'), '  智能電網\n');
});

test('cohorts, qualifications, date ranges and profile titles switch in both Chinese variants', () => {
    const { translate } = createTranslator(content);
    assert.equal(translate('PhD Student @ 25 Spring', 'zh-Hans'), '博士生 · 2025年春季');
    assert.equal(translate('MEng & BEng @ Central South University', 'zh-Hant'), '工學碩士及學士 · 中南大學');
    assert.equal(translate('2026 - Now', 'zh-Hans'), '2026 - 至今');
    assert.equal(translate('Accepted Papers in 2026', 'zh-Hant'), '2026年已錄用論文');
    assert.equal(translate('Mr. WANG, Bo | JC STEM Lab of Future Energy Systems', 'zh-Hans'), '王礴先生 | 赛马会未来能源系统创科实验室');
});

test('all confirmed member names switch in Chinese while English and WONG remain unchanged', () => {
    const { translate } = createTranslator(content);
    const members = team.categories.flatMap(category => category.subcategories.flatMap(group => group.members));
    assert.equal(members.length, 32);
    for (const member of members) {
        assert.equal(translate(member.title, 'en'), member.title);
        for (const language of ['zh-Hans', 'zh-Hant']) {
            if (member.id === 'postdoc-yuk-sum-wong') {
                assert.equal(translate(member.title, language), member.title);
            } else {
                assert.match(translate(member.title, language), /^[\p{Script=Han}]+(教授|博士|先生|女士)$/u, member.id);
                assert.equal(translate(`${member.title} | JC STEM Lab of Future Energy Systems`, language),
                    `${translate(member.title, language)} | ${translate('JC STEM Lab of Future Energy Systems', language)}`);
            }
        }
    }
});

test('owner-confirmed name spellings are exact in both Chinese variants', () => {
    const { translate } = createTranslator(content);
    for (const [english, simplified, traditional] of [
        ['Dr. JIA, Yubin', '贾玉斌博士', '賈玉斌博士'],
        ['Dr. WANG, Tianjing', '王甜婧博士', '王甜婧博士'],
        ['Ms. TAO, Yiying', '陶怡颖女士', '陶怡穎女士'],
        ['Dr. ZHANG, Zhijun', '张智俊博士', '張智俊博士'],
        ['Dr. LIN, Zhihao', '林志浩博士', '林志浩博士'],
        ['Dr. ZHENG, Zuqing', '郑祖卿博士', '鄭祖卿博士'],
        ['Mr. HE, Yuzhe', '何羽喆先生', '何羽喆先生'],
        ['Mr. LEI, Jiale', '雷嘉乐先生', '雷嘉樂先生']
    ]) {
        assert.equal(translate(english, 'zh-Hans'), simplified);
        assert.equal(translate(english, 'zh-Hant'), traditional);
    }
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
