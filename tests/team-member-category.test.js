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

test('Mr. ZHENG, Zuqing is listed under Postdoctoral Researchers only', () => {
    const isZhengZuqing = member => member.title === 'Mr. ZHENG, Zuqing';
    const postdoctoralMatches = membersIn('Postdoctoral Researchers').filter(isZhengZuqing);
    const researchAssistantMatches = membersIn('Research Assistant').filter(isZhengZuqing);

    assert.equal(postdoctoralMatches.length, 1);
    assert.equal(researchAssistantMatches.length, 0);
    assert.equal(postdoctoralMatches[0].id, 'ra24-zhengzuqing');
});

test('Mr. ZHENG, Zuqing is described as a Postdoctoral Fellow', () => {
    const member = membersIn('Postdoctoral Researchers').find(
        item => item.title === 'Mr. ZHENG, Zuqing'
    );

    assert.deepEqual(member.role[0], {
        text: 'Postdoctoral Fellow',
        highlighted: true
    });
});
