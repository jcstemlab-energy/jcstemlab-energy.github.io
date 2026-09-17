const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const teamData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '..', 'data', 'team-members.json'), 'utf8')
);
const meetOurTeam = teamData.categories.find(category => category.name === 'Meet Our Team');

function membersIn(subcategoryName) {
    const subcategory = meetOurTeam.subcategories.find(item => item.name === subcategoryName);
    return subcategory ? subcategory.members : [];
}

test('Dr. ZHENG, Zuqing is listed under Postdoctoral Researchers only', () => {
    const isZhengZuqing = member => member.title === 'Dr. ZHENG, Zuqing';
    const postdoctoralMatches = membersIn('Postdoctoral Researchers').filter(isZhengZuqing);
    const researchAssistantMatches = membersIn('Research Assistant').filter(isZhengZuqing);

    assert.equal(postdoctoralMatches.length, 1);
    assert.equal(researchAssistantMatches.length, 0);
    assert.equal(postdoctoralMatches[0].id, 'ra24-zhengzuqing');
});

test('Dr. ZHENG, Zuqing is described as a Postdoctoral Fellow', () => {
    const member = membersIn('Postdoctoral Researchers').find(
        item => item.title === 'Dr. ZHENG, Zuqing'
    );

    assert.deepEqual(member.role[0], {
        text: 'Postdoctoral Fellow',
        highlighted: true
    });
});

test('Dr. ZHENG, Zuqing has a completed PhD and current postdoctoral biography', () => {
    const member = membersIn('Postdoctoral Researchers').find(
        item => item.title === 'Dr. ZHENG, Zuqing'
    );
    const phd = member.education.find(
        item => item.degree === 'PhD in Control Science and Engineering'
    );

    assert.equal(phd.institution, 'Central South University');
    assert.equal(phd.year, '2022 - 2026');
    assert.match(member.biography, /received his Ph\.D\. degree.*in 2026/);
    assert.match(member.biography, /In 2026, he joined.*as a Postdoctoral Fellow/);
    assert.doesNotMatch(member.biography, /currently pursuing a Ph\.D\./);
    assert.doesNotMatch(member.biography, /Research Assistant/);
});
