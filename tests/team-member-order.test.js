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

test('postdoctoral researchers follow the approved order', () => {
    assert.deepEqual(
        membersIn('Postdoctoral Researchers').map(member => member.title),
        [
            'Dr. JIA, Yubin',
            'Dr. ZHANG, Zhijun',
            'Dr. HUANG, Sunhua',
            'Dr. CHENG, Yuheng',
            'Dr. LIN, Zhihao',
            'Dr. PAN, Chunyang',
            'Dr. ZHENG, Zuqing',
            'Dr. WANG, Tianjing',
            'Dr. WONG, Yuk Sum'
        ]
    );
});

test('Mr. HUANG, Zuliang belongs to the 25 Spring cohort', () => {
    const member = membersIn('Current PhD Students').find(
        item => item.title === 'Mr. HUANG, Zuliang'
    );

    assert.deepEqual(member.role[0], {
        text: 'PhD Student @ 25 Spring',
        highlighted: true
    });
});

test('current PhD students are ordered by entry cohort and then surname', () => {
    assert.deepEqual(
        membersIn('Current PhD Students').map(member => member.title),
        [
            'Ms. LI, Tong',
            'Mr. HUANG, Zuliang',
            'Mr. WANG, Haosheng',
            'Mr. ZHANG, Yuchi',
            'Mr. ZHOU, Yujie',
            'Mr. DUAN, Juntao',
            'Mr. HU, Jiaxiang',
            'Mr. HE, Yuzhe',
            'Mr. WANG, Bo',
            'Ms. BAI, Jiayi',
            'Ms. TAO, Yiying'
        ]
    );
});
