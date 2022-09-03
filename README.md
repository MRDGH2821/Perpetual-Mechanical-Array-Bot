# Perpetual Mechanical Array Bot

Discord Bot for [Traveler Mains Server](https://discord.gg/RsdUnupKpj)

Invite link - click [here](https://discord.com/api/oauth2/authorize?client_id=914932368647815230&permissions=1514517351488&scope=bot%20applications.commands)

## Bot permissions

![Bot Permissions](https://i.imgur.com/yUDcZii.png)

## Hosting (Production environment)

If you wish to run this bot follow the given steps.

### Pre-requisites

#### Firestore

1. Create a new [Firebase](https://console.firebase.google.com/) project 
2. Download [Firebase admin key](https://firebase.google.com/docs/admin/setup#initialize-sdk) 
3. Copy that key into [`firebase-service-acc`](./firebase-service-acc/) folder

#### Discord Bot Token

1. Create a new [bot](https://discord.com/developers/applications)
2. Make a copy of [`sample.env`](./sample.env) file & rename it to `.env`
3. Copy Application ID & paste into `CLIENT_ID` field
4. Copy Token (from `Bot` page) & paste into `TOKEN` field
5. Copy Server ID & paste into `GUILD_ID` field

#### Code preparation

Execute the following:

```sh
npm install
```
This will install the dependencies


```sh
npm run build
```
This will transpile Typescript code to Javascript code

### Install Docker

#### Method 1

The best way is to install & start [Docker Desktop](https://www.docker.com/) 
#### Method 2

For headless install (or where there is no GUI available for e.g. Virtual Private Server Environments)

1. Install [Docker Engine](https://docs.docker.com/engine/install/)
2. Install [Docker Compose](https://docs.docker.com/compose/install/) 

### Run

After Docker is installed, run the following command to start the bot.

```sh
npm run docker:prod
```
