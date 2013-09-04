FooTweet
========

Node App for managing multiple Twitter bots that will search for and reply to a given search string. **THIS IS NOT FOR SPAMMING**. The goal of this project was to create an easy way to manage some novelty Twitter accounts, this is not built for nor encouraging of spamming people for any reason. The code in this app will never tweet the same person more than once and has limitations on what it will reply to in order to reduce it's spammy-ness.

Requirements
------------

 - Node
 - MySQL

Setup
-----

 1. Create a database in MySQL
 1. Fill out database.conf with your connection details
 1. Set `GLOBAL.debug_tweets` to `false` in `server.js` line 3
 1. Run `npm install` if necessary
 1. Start the node server by running `node server.js`

The application is now running.

The system defaults to port 8081 unless otherwise specified as a runtime parameter, i.e. `PORT=1234 node server.js`

Usage
-----

You can set the interval between tweet checks under `Root Settings`

To add an account

1. Go to `Manage Accounts` and select `NEW`.
1. Fill out the fields
 - All fields are required.
1. Save

Once you save a new account it will immediately attempt to search and tweet responses, so make sure your search, ignore and response texts are set correctly!

If you have the main page open tweets will appear as they are tweeted from any account.

Known Issues
------------

- The entire thing is ugly as sin
- Changing the Tweet Interval does not take effect until the server is restarted
- Sometimes there is an error thrown when saving a new account. The account is saved but the redirect errors out.
- Apparently IE doesn't hide an input field with `hidden=true`?
- The searching is limited by Twitter's meager indexing. Make sure to use the `Ignore Text` field to filter out any false-positives you can think of!


Future Features
---------------
- More root settings
 - Toggle debug mode from here
 - Maximum number of tweets per search (to get around some spamming issues)
 - Enter DB settings in the app
- Pretty everything up
- Put something useful on the main page
 - Statistics about each active account maybe?
- Add ability to set multiple response strings and have them chosen randomly (adds flavor plus avoid bot suspension)
- Add variables to be able to use in the response text - User name, date, time, etc...
- Provide a wizard on how to set up a new Twitter account (wizard version of instructions below), providing as much direction and automation as possible.
 - See if there's a way to bypass Twitter's annoying setup wizard
- Add an abstraction layer so you can choose your own DB type


----------


How To Create A Twitter Bot Account
===================================

 1. Create a Gmail account to associate with the new Twitter Bot.
  - <a href="https://accounts.google.com/SignUp?service=mail" target="_blank">Gmail Sign Up</a>
 1. Create a new Twitter account, using the Gmail information created in the previous step
  - <a href="https://twitter.com/signup" target="_blank">Twitter SignUp</a>
 1. Go through the e-mail verification and basic account setup required of you
 1. Sign the new Twitter account up as a Developer by signing in with your Twitter credentials
  - <a href="https://dev.twitter.com/user/login" target="_blank">Twitter Dev Login</a>
 1. Once logged in go to your avatar in the upper-right and select `My Applications` from the dropdown
 1. Select `Create a new application` and fill out the details with whatever values you like
 1. Once your application is created go to the `Settings` tab and change your Application Type to `Read and Write` and save your changes
 1. Now on the `Details` tab click the `Create my access token` button and verify that your access level is `Read and write`
 1. Save the following details somewhere for use:
  - Consumer key
  - Consumer secret
  - Access token
  - Access token secret
 1. In the FooTweet application go to `Manage Accounts->NEW` and fill in the fields above, and make sure that the Account Name field matches the name of the Twitter account exactly.
 1. Fill in the `Search Text`, `Ignore Text` and `Response Text` fields and save.
 1. Done!
