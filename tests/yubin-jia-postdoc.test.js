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

test('Dr. JIA, Yubin is listed once at the end of Postdoctoral Researchers', () => {
    const postdocs = membersIn('Postdoctoral Researchers');
    const allMembers = meetOurTeam.subcategories.flatMap(subcategory => subcategory.members);
    const matches = allMembers.filter(member => member.title === 'Dr. JIA, Yubin');

    assert.equal(matches.length, 1);
    assert.equal(postdocs.at(-1)?.title, 'Dr. JIA, Yubin');
});

test('Dr. JIA, Yubin has the corrected supplied profile details', () => {
    const member = membersIn('Postdoctoral Researchers').find(
        item => item.title === 'Dr. JIA, Yubin'
    );

    assert.ok(member);
    assert.equal(member.id, 'postdoc-yubin-jia');
    assert.deepEqual(member.role, [
        { text: 'Postdoctoral Fellow', highlighted: true },
        {
            text: 'Department of Electrical Engineering, City University of Hong Kong',
            highlighted: false
        }
    ]);
    assert.equal(member.avatar, 'data/people/jiayubin.png');
    assert.deepEqual(member.socialLinks, [
        {
            type: 'envelope',
            url: 'mailto:yubinjia@cityu.edu.hk',
            icon: 'fas fa-envelope',
            title: 'Email'
        },
        {
            type: 'google-scholar',
            url: 'https://scholar.google.com/citations?user=MDzz750AAAAJ&hl=zh-CN',
            icon: 'fas fa-graduation-cap',
            title: 'Google Scholar'
        }
    ]);
    assert.deepEqual(member.interests, [
        'Power System Control and Optimization',
        'AI in Power Systems'
    ]);
    assert.deepEqual(member.education, [
        {
            degree: 'PhD in Control Science and Engineering',
            institution: 'Southeast University',
            year: '2016.03 - 2020.12'
        },
        {
            degree: 'MEng in Control Theory and Control Engineering',
            institution: 'North China Electric Power University',
            year: '2012 - 2015'
        },
        {
            degree: 'BEng in Automation',
            institution: 'North China Electric Power University',
            year: '2008 - 2012'
        }
    ]);
    assert.match(member.biography, /B\.Eng\. and M\.Eng\. degrees/);
    assert.match(member.biography, /Ph\.D\. degree in Control Science and Engineering/);
    assert.match(member.biography, /Since 2025, he has been a Postdoctoral Fellow/);
    assert.match(member.biography, /From 2018 to 2020, he was a visiting Ph\.D\. student/);
    assert.equal(member.last_name, 'jiayubin');
    assert.ok(fs.existsSync(path.join(root, member.avatar)));
});
