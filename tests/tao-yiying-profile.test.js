const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const teamData = JSON.parse(
    fs.readFileSync(path.join(root, 'data', 'team-members.json'), 'utf8')
);
const meetOurTeam = teamData.categories.find(category => category.name === 'Meet Our Team');

function membersIn(subcategoryName) {
    const subcategory = meetOurTeam.subcategories.find(item => item.name === subcategoryName);
    return subcategory ? subcategory.members : [];
}

test('Ms. TAO, Yiying is listed once under Current PhD Students with supplied details', () => {
    const allMembers = meetOurTeam.subcategories.flatMap(subcategory => subcategory.members);
    const matches = allMembers.filter(member => member.title === 'Ms. TAO, Yiying');

    assert.equal(matches.length, 1);
    assert.ok(membersIn('Current PhD Students').includes(matches[0]));
    assert.equal(matches[0].id, 'phd26-taoyiying');
    assert.deepEqual(matches[0].role, [
        { text: 'PhD Student @ 26 Fall', highlighted: true },
        {
            text: 'Department of Electrical Engineering, City University of Hong Kong',
            highlighted: false
        }
    ]);
    assert.equal(matches[0].avatar, 'data/people/taoyiying.png');
    assert.deepEqual(matches[0].socialLinks, [
        {
            type: 'envelope',
            url: 'mailto:yiyingtao3-c@my.cityu.edu.hk',
            icon: 'fas fa-envelope',
            title: 'Email'
        }
    ]);
    assert.deepEqual(matches[0].interests, [
        'AI Data Center–Power System Integration',
        'Smart Grid',
        'Renewable Energy Integration'
    ]);
    assert.deepEqual(matches[0].education, [
        {
            degree: 'PhD in Electrical Engineering',
            institution: 'City University of Hong Kong',
            year: '2026 - Now'
        },
        {
            degree: 'BSc in Computer Science and Technology',
            institution: 'Beijing Normal-Hong Kong Baptist University',
            year: '2022 - 2026'
        }
    ]);
    assert.match(matches[0].biography, /AI data center–power system integration/);
    assert.equal(matches[0].last_name, 'taoyiying');
});
test('the two specified postdoctoral avatars use a centered focal point', () => {
    const postdocs = membersIn('Postdoctoral Researchers');

    for (const title of ['Dr. CHENG, Yuheng', 'Dr. PAN, Chunyang']) {
        const member = postdocs.find(item => item.title === title);
        assert.ok(member, `${title} should remain a postdoctoral researcher`);
        assert.equal(member.avatarPosition, 'center center');
    }
});

test('all team-member renderers consume the optional avatarPosition field', () => {
    const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const teamPage = fs.readFileSync(path.join(root, 'js', 'team-loader.js'), 'utf8');
    const profilePage = fs.readFileSync(path.join(root, 'js', 'profile-loader.js'), 'utf8');

    assert.match(homepage, /avatar\.style\.objectPosition\s*=\s*member\.avatarPosition/);
    assert.match(teamPage, /avatar\.style\.objectPosition\s*=\s*member\.avatarPosition/);
    assert.match(profilePage, /member\.avatarPosition/);
    assert.match(profilePage, /object-position/);
});
