// Saves options to chrome.storage.sync.
function save_options() {
    var rule1   = document.getElementById('rule1').value;
    var rule2   = document.getElementById('rule2').value;
    var rule3   = document.getElementById('rule3').value;
    var rule4   = document.getElementById('rule4').value;
    var rule5   = document.getElementById('rule5').value;
    var rule6   = document.getElementById('rule6').value;
    var rule7   = document.getElementById('rule7').value;
    var rule8   = document.getElementById('rule8').value;
    var rule9   = document.getElementById('rule9').value;
    var footer  = document.getElementById('footer').value;
    var oneTaps = document.getElementById('oneTaps').checked;
    chrome.storage.sync.set({
        rule1: rule1,
        rule2: rule2,
        rule3: rule3,
        rule4: rule4,
        rule5: rule5,
        rule6: rule6,
        rule7: rule7,
        rule8: rule8,
        rule9: rule9,
        footer: footer,
        oneTaps: oneTaps
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        rule1: "Your thread was removed under **[Rule 1](https://www.reddit.com/r/GlobalOffensive/about/rules/)**.",
        rule2: "Your thread was removed under **[Rule 2](https://www.reddit.com/r/GlobalOffensive/about/rules/)**.",
        rule3: "Your thread was removed under **[Rule 3](https://www.reddit.com/r/GlobalOffensive/about/rules/)**.",
        rule4: "Your thread was removed under **[Rule 4](https://www.reddit.com/r/GlobalOffensive/about/rules/)**.",
        rule5: "Your thread was removed under **[Rule 5](https://www.reddit.com/r/GlobalOffensive/about/rules/)**.",
        rule6: "Your thread was removed under **[Rule 6](https://www.reddit.com/r/GlobalOffensive/about/rules/)**.",
        rule7: "Your thread was removed under **[Rule 7](https://www.reddit.com/r/GlobalOffensive/about/rules/)**.",
        rule8: "Your thread was removed under **[Rule 8](https://www.reddit.com/r/GlobalOffensive/about/rules/)**.",
        rule9: "Your thread was removed under **[Rule 9](https://www.reddit.com/r/GlobalOffensive/about/rules/)**.",
        footer: "",
        oneTaps: ""
    }, function(storage) {
        document.getElementById('rule1').value     = storage.rule1;
        document.getElementById('rule2').value     = storage.rule2;
        document.getElementById('rule3').value     = storage.rule3;
        document.getElementById('rule4').value     = storage.rule4;
        document.getElementById('rule5').value     = storage.rule5;
        document.getElementById('rule6').value     = storage.rule6;
        document.getElementById('rule7').value     = storage.rule7;
        document.getElementById('rule8').value     = storage.rule8;
        document.getElementById('rule9').value     = storage.rule9;
        document.getElementById('footer').value    = storage.footer;
        document.getElementById('oneTaps').checked = storage.oneTaps;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);