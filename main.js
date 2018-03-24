// Necessary to perform any API actions
var modhash = $("form.logout input[name=uh]").val();

function editFlair(thing, flairCss, flairText) {
    $.post('https://www.reddit.com/r/globaloffensive/api/flair', {
        api_type: 'json',
        css_class: flairCss,
        link: thing,
        text: flairText,
        uh: modhash
    }).done(function() {
        var fullID = "#thing" + thing;
        $(fullID).addClass('linkflair');
    });
}

function removeWithReason(thing, reason, distinguish, win) {
    $.post('https://www.reddit.com/r/globaloffensive/api/remove', {
        uh: modhash,
        id: thing,
        spam: false,
    }).done(function() {
        $.post('https://www.reddit.com/r/globaloffensive/api/comment', {
            parent: thing,
            text: reason,
            uh: modhash,
            api_type: 'json'
        }).done(function(res) {
            if (distinguish && res.json.hasOwnProperty("errors") && res.json.errors.length == 0) {
                $.post('https://www.reddit.com/r/globaloffensive/api/distinguish/yes', {
                    id: res.json.data.things[0].data.id,
                    uh: modhash,
                    sticky: true
                }).done(function() {
                    if ( win ) {
                        $( win ).dialog('close');
                    }
                });
            }
        });
    });
}

function addQuickFlair() {
    // Add our special button to all flatlists under threads
    $('.link .flat-list.buttons').each(function (i, e) {
        // Skip elements we've already added the dropdown to
        if ($(e).has('.rgo-qf-dropdown').length) { return; }

        // Create selected option/trigger div
        var quickFlair = document.createElement('DIV');

        quickFlair.className = 'dropdown lightdrop rgo-qf-dropdown';

        var qfDrop = document.createElement('SPAN');
        qfDrop.className = 'selected';
        $(qfDrop).text('quick flair');

        quickFlair.appendChild(qfDrop);

        // Create flair selections div
        var flairChoices = document.createElement('DIV');
        flairChoices.className = 'drop-choices';

        var linkFlairs = {
            'AMA': 'ama',
            'Discussion': 'discussion',
            'Discussion | Esports': 'discussion esports',
            'Feedback': 'feedback',
            'Fluff': 'fluff',
            'Fluff | Esports': 'fluff esports',
            'Game Update': 'update',
            'Gameplay': 'gameplay',
            'Gameplay | Esports': 'gameplay esports',
            'Help': 'help',
            'News/Events': 'news',
            'News/Events | Esports': 'news esports',
            'Scheduled Sticky': 'sticky',
            'Stream Highlight': 'gameplay highlight',
            'Stream Highlight | Esports': 'gameplay highlight esports',
            'Tips/Guides': 'guides',
            'UGC': 'ugc'
        };

        for (var lf in linkFlairs) {
            var linkFlair = document.createElement('A');
            $(linkFlair).text(lf);

            if (lf === 'UGC') {
                linkFlair.title = 'User Generated Content';
            } else {
                linkFlair.title = lf;
            }
            linkFlair.className = 'choice';

            $(linkFlair).click(function (ev) {
                ev.preventDefault();
                var flairText = ev.target.innerHTML;
                var flairClicked = linkFlairs[flairText];

                if (flairText.includes('/')) {
                    flairText = flairText.replace('/', ' & ');
                }
                var id = $(ev.target).closest('.thing').attr('data-fullname');

                if (flairText === 'UGC') {
                    flairText = 'User Generated Content';
                }
                editFlair(id, flairClicked, flairText);
                
                var dd = $(ev.target.parentNode).siblings('.rgo-qf-dropdown');
                dd.html('flaired!');
                dd.removeClass('rgo-qf-dropdown');
            });

            flairChoices.appendChild(linkFlair);
        }
        
        var li = document.createElement('LI');
        var spacer = document.createElement('DIV');
        spacer.className = 'spacer';

        spacer.appendChild(quickFlair);
        spacer.appendChild(flairChoices);
        li.appendChild(spacer);
        e.appendChild(li);
    });
}

function addRemoveWithReasons() {
    var diaDiv  = document.createElement('DIV'),
        txtArea = document.createElement('TEXTAREA');

    diaDiv.id  = 'ruleDialog';
    txtArea.id = 'ruleText';
    diaDiv.appendChild(txtArea);

    $('#ruleDialog').hide();
    $('#ruleText').hide();

    $('#siteTable').append( diaDiv );

    // Add our special button to all flatlists under threads
    $('.link .flat-list.buttons').each(function(i, e) {
        // Skip elements we've already added the dropdown to
        if ($(e).has('.rgo-dropdown').length) { return; }

        // Create selected option/trigger div
        var selected = document.createElement('DIV');

        selected.className = 'dropdown lightdrop rgo-dropdown';

        var selectedSpan = document.createElement('SPAN');
        selectedSpan.className = 'selected';
        $(selectedSpan).text('remove w/ reason');

        selected.appendChild(selectedSpan);

        // Create options div
        var options = document.createElement('DIV');
        options.className = 'drop-choices';

        // The rule by button label and hover-text
        var rules = {
            'Rule 1: Relevancy': 'Relevancy',
            'Rule 2: Quality': 'Quality',
            'Rule 3: Support': 'Support',
            'Rule 4: Exploits': 'Exploits & Bugs',
            'Rule 5: Trading': 'Trading, Betting & Giveaways',
            'Rule 6: Scamming': 'Scamming & Cheating',
            'Rule 7: Witch-hunts': 'Accusations & Witch-hunts',
            'Rule 8: Advertising': 'Advertising',
            'Rule 9: Abuse': 'Abuse & Poor Behavior'
        };

        for (var r in rules) {
            var ruleLink = document.createElement('A');

            $(ruleLink).text(r);
            ruleLink.title = rules[r];
            ruleLink.className = 'choice';

            $(ruleLink).click(function(ev) {
                ev.preventDefault();
                var id = $(ev.target).closest('.thing').attr('data-fullname');
                // If ctrl key is pressed when a rule is clicked with
                //  OneTap mode enabled, open a custom removal dialog.
                if (ev.ctrlKey) {
                    chrome.storage.sync.get(chromeGet, function(storage) {
                        if (storage.oneTaps) {
                            $("#ruleText").css("display", "inline");
                            $("#ruleDialog").dialog({
                                height  : 200,
                                width   : 700,
                                modal   : true,
                                title   : 'Custom Removal',
                                buttons : {
                                    "Get Salt": function() {
                                        var removedThreadLink = 'https://redd.it/' + id.replace('t3_', '');
                                        var removalMessage = $('#ruleText').val();
                                        var footer = "";

                                        if (storage.footer != '') {
                                            footer = "\n\n---\n\n" + storage.footer.replace('%%thread_link%%', removedThreadLink);
                                        }

                                        // This actually makes the POSTs happen and removes the thread, it also closes the dialog on completion
                                        removeWithReason(id, removalMessage + footer, true, this);

                                        var dd = $(ev.target.parentNode).siblings('.rgo-dropdown');
                                        dd.html('removed');
                                        dd.removeClass('rgo-dropdown');
                                    },
                                    "Abort!" : function() {
                                        $( this ).dialog( 'close' );
                                    }
                                }
                            });
                        }
                    });
                } else {
                    var ruleClicked = ev.target.innerHTML.replace(' ','').toLowerCase().split(':')[0];

                    // Default values for the comments for each removal
                    var chromeGet = {
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
                    };

                    chrome.storage.sync.get(chromeGet, function(storage) {
                        // If they want one click removals, don't show dialog
                        if (storage.oneTaps) {
                            // var property = $(ev.target).text().toLowerCase().replace(' ', '');
                            var property = ev.target.innerHTML.replace(' ','').toLowerCase().split(':')[0]

                            if (!chromeGet.hasOwnProperty(property)) {
                                chromeGet[property] = "Your thread has been removed.  Please carefully [read our rules](https://www.reddit.com/r/GlobalOffensive/about/rules/) and ask if you have any questions.";
                            }

                            var removedThreadLink = 'https://redd.it/' + id.replace('t3_', '');
                            var removalMessage = storage[property];
                            var footer = "";

                            if (storage.footer != "") {
                                footer = "\n\n---\n\n" + storage.footer.replace('%%thread_link%%', removedThreadLink);
                            }

                            removeWithReason(id, removalMessage + footer, true, null);
                            var dd = $(ev.target.parentNode).siblings('.rgo-dropdown');
                            dd.html("removed");
                            dd.removeClass('rgo-dropdown');
                        } else { // Show dialog on each click
                            var ruleClicked = ev.target.innerHTML.replace(' ','').toLowerCase().split(':')[0];
                            $("#ruleText").val(storage[ruleClicked]);
                            $("#ruleText").html(storage[ruleClicked]);
                            $("#ruleText").css("display", "inline");

                            $("#ruleDialog").dialog({
                                height  : 200,
                                width   : 700,
                                modal   : true,
                                title   : ev.target.innerHTML + " Removal",
                                buttons : {
                                    "Get Salt": function() {
                                        var property = $(ev.target).text().toLowerCase().replace(' ', '');

                                        if (!chromeGet.hasOwnProperty(property)) {
                                            chromeGet[property] = "Your thread has been removed.  Please carefully [read our rules](https://www.reddit.com/r/GlobalOffensive/about/rules/) and ask if you have any questions.";
                                        }

                                        var removedThreadLink = 'https://redd.it/' + id.replace('t3_', '');
                                        var removalMessage = $( "#ruleText" ).val();
                                        var footer = "";

                                        if (storage.footer != "") {
                                            footer = "\n\n---\n\n" + storage.footer.replace('%%thread_link%%', removedThreadLink);
                                        }

                                        // This actually makes the POSTs happen and removes the thread, it also closes the dialog on completion
                                        removeWithReason(id, removalMessage + footer, true, this);

                                        var dd = $(ev.target.parentNode).siblings('.rgo-dropdown');
                                        dd.html("removed");
                                        dd.removeClass('rgo-dropdown');
                                    },
                                    "Abort!" : function() {
                                        $( this ).dialog( "close" );
                                    }
                                }
                            });
                        }
                    });
                }
            });
            options.appendChild(ruleLink);
        }
        var li = document.createElement('LI');
        var spacer = document.createElement('DIV');
        spacer.className = "spacer";

        spacer.appendChild(selected);
        spacer.appendChild(options);
        li.appendChild(spacer);
        e.appendChild(li);
    });
}

// Hook our functions
$(window).on('neverEndingLoad', function () {
    addQuickFlair();
    addRemoveWithReasons();
});
$(document).ready(function () {
    addQuickFlair();
    addRemoveWithReasons();
});