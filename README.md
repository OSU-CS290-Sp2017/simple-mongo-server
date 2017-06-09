# Simple server with an API powered by MongoDB

This repo contains a basic Express-based server in `server.js` that serves a simple API powered by MongoDB that allows the client to post photos of people to be persisted on the server side.  Before doing anything with it you need to install dependencies:
```
npm install
```

Before you start the server, you'll have to make sure you set environment variables to let the server know how to connect to your specific MongoDB database (these would be different if you're running on a Windows machine):
```
export MONGO_HOST="classmongo.engr.oregonstate.edu"
export MONGO_DB=YOUR_MONGODB_DATABASE_NAME
export MONGO_USER=YOUR_MONGODB_USER_NAME
export MONGO_PASSWORD=YOUR_MONGODB_PASSWORD
```

Then, you can start the server:
```
npm start
```
This will start the server running on port 3000 by default.  You can change the port it runs on by setting the `PORT` environment variable.  Once the server is running, you can visit it at [http://localhost:3000](http://localhost:3000).
