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

## Get started for users
- Install npm package of the app globally
  - `npm install chatterbox-devclub -g`
- Run the app
  - `sudo messenger`
- Enter your credentials (For the first time facebook might block it in the first go. You need to verify the activity on facebook so that it allows you to connect through your CLI)
- Follow On-CLI instructions to proceed further

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
