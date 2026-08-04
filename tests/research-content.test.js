const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const projectRoot = path.resolve(__dirname, '..');
const research = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'data', 'research.json'), 'utf8')
);
const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const normalizedHtml = indexHtml.replace(/\s+/g, ' ');

test('smart grid and smart cities are separate research thrusts', () => {
    assert.deepEqual(Object.keys(research), [
        'Renewable energy systems grid connection',
        'Smart grid',
        'Smart cities',
        'Computational methods for power system operations and planning'
    ]);
    assert.equal(Object.hasOwn(research, 'Smart grid and smart cities'), false);
});

test('both new research cards have dedicated icons and descriptions', () => {
    assert.match(indexHtml, /"Smart grid": "fas fa-bolt"/);
    assert.match(indexHtml, /"Smart cities": "fas fa-city"/);
    assert.match(
        indexHtml,
        /"Smart grid": "Developing intelligent and resilient power grids through advanced monitoring, control, and efficient coordination of energy resources\."/
    );
    assert.match(
        indexHtml,
        /"Smart cities": "Advancing sustainable smart cities through integrated urban energy systems, infrastructure coordination, and efficient resource allocation\."/
    );
    assert.doesNotMatch(indexHtml, /"Smart grid and smart cities":/);
});

test('about section lists the same four research thrusts in order', () => {
    assert.match(
        normalizedHtml,
        /including 1\. Renewable energy systems grid connection, 2\. Smart grid, 3\. Smart cities, 4\. Computational methods for power system operations and planning\./
    );
});
