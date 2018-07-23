# Chatter-Box

This is a CLI chatting platform designed for the ease of messaging without taking the hassle of switching on the platform on browser.
Currently, the app is on prototype stage and hence supports messenger only.
Our aim is to integrate it with other chatting platforms in near future.

## Features
- Works on Linux, Mac and Windows
- Integrate various chatting platforms under one roof
- Easy to navigate between chats
- CLI allows your chatting platform to run in background and no need to open any tabs in browser
- An intuitive terminal design

## Get started for developers
- Clone the repository
  - `git clone https://github.com/Atishya-jain/Chatter-Box`
- Install npm packages
  - `cd Chatter-Box`
  - `npm install`
- Start the application
  - `cd Source`
  - `node Index.js`
- Enter your credentials (For the first time facebook might block it in the first go. You need to verify the activity on facebook so that it allows you to connect through your CLI)
- An appstate.json will be created that essentially stores your session and one need not enter his/her credentials again and again
- appstate.json contains all the confedential information in an encrypted form
- Follow On-CLI instructions to proceed further

## Extra Features
- Extra side window for all unread messages
- Notification bar for incoming messages
- Type @menu while on chat to go back and chat with someone else
- Type @dp while on chat to see the dp of the person and verify that you are chatting with the correct person
- Type @auto Message to set Message as an auto reply to the person for any incoming message from him/her
- Type @autostop to stop auto message on
- Type @schedule dd/mm/yyyy hh:mm Message to schedule a message on dd/mm/yyyy at hh:mm to be sent automatically
  - For message to be sent, the process must be running on a terminal.
  - A solution for this is to use screen to similar tools for running the process in backgrund, but still the system must be on.
  - A permanent solution is to host a central server for all scheduled and auto reply service but this app is at a prototype stage so       does not include that at the moment.
## Technology and API's used
- This CLI currently only supports messenger.
- We have use facebook-chat-api for building a connection protocol with facebook.
- It uses graph API for getting the profile pictures of a user.
- For terminal appearence and looks we have used blessed.js which allows us to create UI within terminal.
- Currently, emojis are supported only on Mac platforms. We are trying to increase their support to other platforms also.

## Publication
- As mentioned this app is currently available on all windows, linux and Mac platforms
- Currently, only messenger chat is supported. More supports to be added in near future.

## Contributors
* Atishya Jain
* Varun Gupta
