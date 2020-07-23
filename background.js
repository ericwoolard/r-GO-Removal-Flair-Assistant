chrome.runtime.onMessage.addListener(
    async function(request) {
        if (request.contentScriptQuery == "editFlair") {
            const flairTemplates = {
                'ama': 'b385ab06-422d-11e5-9cdb-0e49b4de90e1',
                'discussion': 'a053fda8-422d-11e5-b461-0e184320b869',
                'discussion esports': 'af5b57fc-374a-11e6-abd9-0e7c62f92521',
                'feedback': '7dd1bf36-422d-11e5-aa4f-0e5ca32a3025',
                'fluff': '70a869f4-422d-11e5-9246-0ee61c357d3b',
                'fluff esports': '98eaa356-374a-11e6-8499-0ed34ee2f5e7',
                'gameplay': '494583ba-422d-11e5-aa5e-0e49b4de90e1',
                'gameplay esports': '7d39883e-374a-11e6-bcef-0ee62a832d0b',
                'gameplay highlight': 'ab2bc63c-3d3d-11e6-b770-0ed21bc28d05',
                'gameplay highlight esports': 'dbaf9fd0-2af5-11e7-a375-0e70f163db0e',
                'guides': 'aab0ede2-422d-11e5-9818-0e1fa8047017',
                'help': 'afcf8cac-422d-11e5-b01d-0e3f27028b2f',
                'news': '8d3ceec8-422d-11e5-a7ec-0e8ad82823eb',
                'news esports': 'a3172a70-374a-11e6-8317-0edda3eec021',
                'sticky': 'bbfa00b6-422d-11e5-b9c0-0e707a1ba6df',
                'ugc': '856065a4-422d-11e5-a73c-0e707a1ba6df',
                'update': '9a40fd26-422d-11e5-b1eb-0e5e20c89e15',
                'workshop skin': 'be3c0bde-cc62-11ea-b316-0eb8e0b23e13'
            };

            const url = new URL('https://www.reddit.com/r/globaloffensive/api/selectflair');
            url.search = new URLSearchParams({
                api_type: 'json',
                flair_template_id: flairTemplates[request.flairCSS],
                link: request.thing,
                text: request.text,
                uh: request.mod
            });

            fetch(url, {method: 'POST'})
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('Request Error');
                    }
                })
                .catch(function(error) {
                    chrome.tabs.query({
                        active: true,
                        currentWindow: true
                    },
                    function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            status: 'error',
                            func: 'editFlair',
                            msg: error.message
                        });
                    });
                });

            return true;
        }
        else if (request.contentScriptQuery === 'removeWithReason') {
            const removeUrl = new URL('https://www.reddit.com/r/globaloffensive/api/remove');
            const commentUrl = new URL('https://www.reddit.com/r/globaloffensive/api/comment');
            const distinguishUrl = new URL('https://www.reddit.com/r/globaloffensive/api/distinguish/yes');
            removeUrl.search = new URLSearchParams({
                api_type: 'json',
                uh: request.mod,
                id: request.thing,
                spam: false
            });
            commentUrl.search = new URLSearchParams({
                api_type: 'json',
                parent: request.thing,
                text: request.text,
                uh: request.mod
            });

            try {
                const removeResp = await (await fetch(removeUrl, { method: 'POST' })).json();
                const commentResp = await (await fetch(commentUrl, { method: 'POST' })).json();
                distinguishUrl.search = new URLSearchParams({
                    id: commentResp.json.data.things[0].data.id,
                    uh: request.mod,
                    sticky: true
                });
                if (request.distinguish) {
                    const distinguishResp = await (await fetch(distinguishUrl, { method: 'POST' })).json();
                    if (!request.win) return;
                    chrome.tabs.query({
                        active: true, 
                        currentWindow: true
                    }, 
                    function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            status: 'success'
                        });
                    });
                }
            }
            catch(e) {
                // handle errors
                chrome.tabs.query({
                    active: true, 
                    currentWindow: true
                }, 
                function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        status: 'error',
                        err: 'The previous request encountered an error: ',
                        msg: e.message
                    });
                });
            }
            return true;
        }
    }
);