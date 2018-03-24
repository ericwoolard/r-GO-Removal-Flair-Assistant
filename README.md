![Dropdown Options](https://i.imgur.com/R29XqDI.png)

# r/Global Offensive Removal and Flair Assistant

##### Remove threads with removal reasons and add link flairs with ease
------------

INFO
------------
This Chrome extension was made for the r/GlobalOffensive mod team to create an easier way of removing threads while leaving a
removal reason, as well as adding a quick flair menu to flair posts in a single click. 

By default, when choosing a rule under the 'Remove w/ Reason' dropdown, it will open a modal window with the default text for 
that rule (configured in the extension options) and allow you to add any custom text before removing the thread. [(Example)](https://i.imgur.com/LAvuDVs.png)
You can also configure a custom footer through the extension options which will automatically be added as a footer to every 
removal reason you leave. This is a good place to add a generic "If you have any further questions or concerns, please send us a modmail!"

You can also enable 'OneTap' mode via the extension options, which will instantly remove the thread with the default rule text 
configured for that rule (via extension options) without opening the modal. 


Configuring for other Subreddits
------------
In order to modify this extension for a subreddit of your own, you will need to edit several strings in:
* main.js
* manifest.json
* options.js (lines 41-50, storage defaults for the extension options)

In the manifest file, simply change all of the URL's ending in 'GlobalOffensive' to that of your subreddit.

In main.js, you'll need to go through and change all instances of 'GlobalOffensive' URL's to those of your own, as well as
any strings relating to our rules to those of your own. The only changes necessary here should be strings, but make sure you
look over everything to double check. 

Once you've finished modifying everything to fit your needs, simply create a chrome web store account and upload it! First 
time extension uploaders will be required to pay a one-time $5 fee before uploading the extension. 

