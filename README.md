# Timezynk

## Initialize sandbox environment

1. Open two tabs in you terminal
2. Inside the first we will run server. To achieve this follow the next steps:

- `cd server` from the root of project
- `npm i` to install all dependencies
- `npm run start` to start the server

3. Inside the second terminal tab or window we will run our client.

- `cd client` from the project's root
- `npm i` to install all dependencies
- `npm run start` to start the client

4. Open 2 tabs or windows in you browser (at port 3000)
5. Enter random username and click `Enter chatroom` in both.

_Following those steps should lead to established websocket connection which let you to send messages between connected clients._

## Complete the quest

You found a scroll with a quest from Timezynk. It looks like some userstory.

```
AS a user
I WOULD like to be able to use emoji in messages
IN ORDER to convey my meaning and feelings better
Support both picker and slack-like emoji codes for a good experience on both mobile and web.
```

Now to finish your adventure you have to complete this task.

You may use any existing library as well as change anything you want in provided sandbox.

We are looking forward to hearing from you and discuss your solution together.

---

## Notes:

1. Prevent multiple logins from 1 client. For 2 users pleas use 2 different browsers or normal and incognito mode for each user.
2. Additional step before running server is to run [PocketBase](https://pocketbase.io/). You may need Go. To start it go to /server and run `./pocketbase serve`
3. Server was refactored from csj to esm which means you may need an up to date node.js to run everyhing smoothly.

### Features:

- Registration & Login
- Multiple reactions
- Increment existing reaction count
- Remove your own reaction
