# Summary
----

git: https://github.com/vhmh2005/vote

# Version
----

1.0

# Stack
----

* Environment: NodeJs (on linux)
* Framework: Sailsjs
* Authentication: passport.js
* Presentation: ejs (Template engine)
* Logging: sails log
* Stream Server: Red5
* Stream: Adobe flash (sRTMP)
* Stream Language: Flash Actionscript

# How to use
----

```sh
$ git clone https://github.com/vhmh2005/vote.git
$ git checkout <branch>
$ cd vote
$ npm install
$ sails lift --port ????
```

# Overview
----

The vote is system for user cant chat and view webcam. 

# Functionality
----

#### Voting

Every speaker starts with 30 seconds on the clock.

Formal vote counts are taken every 15 seconds, with the real-time running total of
up and down votes for each speaker displayed during the 15 seconds.

Users can vote up or vote down during every 15-second time block, they can
change their vote as many times as they like during the 15 seconds, but only the up
or down vote selected at the end of the 15 seconds will be the only one that is
counted.

The number of up votes less down votes at the end of each session is computed
and the following actions taken:

* Overall down vote (more downs than ups)
    * The speakers all time vote score is debited by 1
    * The speakers remaining talk time is reduced by 15 seconds
    * If negative or 0 time remains the next speaker will take control
* Overall up vote (more ups than downs)
    * The speakers all time vote score is credited by 1
    * The speakers remaining talk time is increased by 15 seconds
    * If the speaker has already spoken for 2mins continuously the next speaker
    will take control despite the up vote
* Overall neutral vote (same number of up and down votes)
    * No change to the speakers all time vote score
    * No change to the speakers remaining talk time 

Up or down voting can be done by either clicking on the up or down buttons or
by typing a text command in the chat message window. Both clicking and typing
votes will have identical functionality

#### Queue system

At the start of each debate the queue for the 7 positions (main speaker, the four
video queue positions, and three further) will just be the order of the first 7 users
to connect.
A space in the queue will become available when:
1. The current speaker runs out of time
2. User already in the queue or speaking is removed for abuse
3. User already in the queue or speaking disconnects voluntarily
The user to take the spare space will be determined based on random selection
weighted by the number of all time votes of each connected user.

Probability user X is selected for next place in queue:
= All time votes for user X / (Sum of all time votes for all users connected less those
already in the six remaining queue positions)

#### Reporting abuse

Each of the list user chat will have a context menu is action report item. If clicked by a
viewer of the site the video and audio from that screen will be blocked to that
viewer only and an abuse count recorded against that user by the that viewing
user.

Reporting a user for abusive behaviour can also be manually done by typing a text
command in the chat message window.


Any user that gets more than 10 abuse reports in total, from 10 different users, will
be permanently banned from the site.  

#### Chat window commands – typed voting and typed reporting

Users can type commands in the chat input window, prefixing them with the hash
sign #

Any text entered in the chat input window that is prefixed with a # will not
be displayed to other users

Three commands supported

1. "#vote up" use for user speaking
2. "#vote down" use for user speaking
3. "#report username"

These command actions will display a confirmation or failure message in
the main chat window, visible to the user who typed the commands only

#### Display in the participant’s window

The all time vote score of each user will be shown next to their name in the
chat room participant window

The ordering of the users in the chat room participants window will be:

* First 7 users in the queue
* Followed by the sorted list of users from highest to lowest number of
votes
