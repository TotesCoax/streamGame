Welcome to my little project!

I wanted some practice coding a web game so I decided to convert a quick paper card/dice game I like to play into a digital format.

My end goal for the project is to try to make this game Twitch Interactive using an overlay extension, instead of the usual chat commands.

The original game is called Sword Art Online: Sword of Fellows.
I really liked the mechanics of this game but what came in the box left me feeling like so much more could be done with the core mechanics.
So I initially wanted to code the game engine, strip most of the branded flavor, and rework some of the sections of the game to be more open-ended.

Current Phase (8/31/21): Phase 3
  - I have a working prototype of the client and server code for single person testing. Just need to have some friends do a bit of QA for the engine.
  - In the meantime, I get to research how I can turn it into a multiplayer game using socket.io

Phase 1: Coding the game engine
  - Just translating the game rules into computer code to make the game engine
  - Using primarily Javascript
  
Phase 2: Making a User Interface
  - Creating a web page to let other people test and play the game engine
  - Had considered using React but brain was fried from learning HTML/CSS/JS so I'm using a HTML template system and front end code to build the game pieces.
  
Phase 3: Transition to a client/server model
  - Separate the client and the game engine for gameplay integrity and open the doors to multiplayer
  - I will be using socket.io for this. It seems to let me easily accomplish all my goals.
  
Phase 4: Twitch Extension build
  - Implement the things required to allow Twitch integration so the players can interact with the game via an overlay and not chat commands.
  
Phase 5: Content and coding expansion
  - Once the core system is running, add in additional gameplay content in terms of expanded mechanics directly in the game and other features that work with Twitch to improve the player experience.
  
