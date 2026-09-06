const fs = require('fs');
let code = fs.readFileSync('script_v3.js', 'utf8');

// Change in data
code = code.replace(
    "'meltdown': { title: 'Core Meltdown', desc: 'Overheat the site by clicking the Steam icon 15 times.', icon: 'fas fa-fire', locked: true },",
    "'meltdown': { title: 'Core Meltdown', desc: 'Overheat the site by clicking the Steam icon 7 times.', icon: 'fas fa-fire', locked: true },"
);

// Change in logic
const target15 = "if (window.overheatClicks > 15) {";
const replacement7 = "if (window.overheatClicks > 7) {";

if (code.includes(target15)) {
    code = code.replace(target15, replacement7);
    fs.writeFileSync('script_v3.js', code);
    console.log("Success");
} else {
    console.log("Could not find target15");
}
