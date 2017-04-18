# Most-Dangerous-Game

## What is it?
This game was inspired by the game 'Assassin' played by students at UMASS Amherst.
Everyone drew names out of a hat and had to hunt down and 'kill' their target between classes.
When you did, you recieved their target as your next one.
Last person standing wins.

I felt that with cellphone tech being what it is, a modern version of the game could be created.
Demo video can be found here: [The Most Dangerous Game](https://www.youtube.com/watch?v=cRoQxh7cdSM)

#### The Rules are Simple

1. A user invites their friends to join their game.
2. Upon joining the username is added to the list in the 'waiting room'
3. The administrator launches the game when ready and every player is assigned another player as their 'target'
4. The gameplay screen has a radar display with the real world direction and distance to your 'target'
5. Get within range and attempt to 'kill' your target
6. Successful shot will grant points and you will recieve their target as your next target.
7. Gameplay ends when only one player remains 'alive'

## How to find what you're looking for:

#### The server is run by the file serverio.js
It is an express.js server running socket.io for realtime communication.

#### The angular components can be found in /public/app
The components are written in typescript and tend to be contained in a single file rather than separating function from template and styles.
This is only due to the time constraints involved in finishing the project in under two weeks

## A new day is coming
A new version of the game is under development which will include native device funcitonality as well as the use of facial recognition api's
