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

test('Dr. LIN, Zhihao is listed once under Postdoctoral Researchers after Dr. WONG, Yuk Sum', () => {
    const postdocs = membersIn('Postdoctoral Researchers');
    const allMembers = meetOurTeam.subcategories.flatMap(subcategory => subcategory.members);
    const matches = allMembers.filter(member => member.title === 'Dr. LIN, Zhihao');
    const wongIndex = postdocs.findIndex(member => member.title === 'Dr. WONG, Yuk Sum');

    assert.equal(matches.length, 1);
    assert.equal(postdocs[wongIndex + 1]?.title, 'Dr. LIN, Zhihao');
});

test('Dr. LIN, Zhihao has the supplied postdoctoral profile details', () => {
    const member = membersIn('Postdoctoral Researchers').find(
        item => item.title === 'Dr. LIN, Zhihao'
    );

    assert.ok(member);
    assert.equal(member.id, 'postdoc-zhihao-lin');
    assert.deepEqual(member.role, [
        { text: 'Postdoctoral Fellow', highlighted: true },
        {
            text: 'Department of Electrical Engineering, City University of Hong Kong',
            highlighted: false
        }
    ]);
    assert.equal(member.avatar, 'data/people/linzhihao.png');
    assert.deepEqual(member.socialLinks, [
        {
            type: 'envelope',
            url: 'mailto:zhihao.lin@ieee.org',
            icon: 'fas fa-envelope',
            title: 'Email'
        }
    ]);
    assert.deepEqual(member.interests, [
        'Power Converter Topologies and Control',
        'Reliability-Oriented Multi-Objective Design',
        'Condition Monitoring and Fault Diagnosis'
    ]);
    assert.deepEqual(member.education, [
        {
            degree: 'PhD in Energy Technology',
            institution: 'Aalborg University',
            year: '2021 - 2025'
        }
    ]);
    assert.equal(
        member.biography,
        'Zhihao Lin received his Ph.D. degree in energy technology from Aalborg University, Aalborg, Denmark, in 2025. He is currently a postdoctoral fellow in the Department of Electrical Engineering at the City University of Hong Kong. His research focuses on topologies and control, multi-objective design optimization, condition monitoring and fault diagnosis for power electronics.'
    );
    assert.equal(member.last_name, 'linzhihao');
    assert.ok(fs.existsSync(path.join(root, member.avatar)));
});
