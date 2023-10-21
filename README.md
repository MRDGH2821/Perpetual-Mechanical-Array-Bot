# Perpetual Mechanical Array Bot

Discord Bot for [Traveler Mains Server](https://discord.gg/RsdUnupKpj)

Invite link - click [here](https://discord.com/api/oauth2/authorize?client_id=914932368647815230&permissions=1514517351488&scope=bot%20applications.commands)

## Bot permissions

![Bot Permissions](https://i.imgur.com/yUDcZii.png)

## Hosting & Deployment (Production environment)

If you wish to use this bot in your own server, you will have to modify `Constants.ts` file and some other places where stuff is hard coded.

### Pre-requisites

Make a copy of [`sample.env`](./sample.env) file & rename it to `.env`.

#### Firestore

1. Create a new [Firebase](https://console.firebase.google.com/) project
2. Download [Firebase admin key](https://firebase.google.com/docs/admin/setup#initialize-sdk)
3. Copy that key into [`firebase-service-acc`](./firebase-service-acc/) folder
4. Rename that key file into something simple, for eg - `firebase-admin-key.json`
5. Copy the file name & paste it into `GOOGLE_APPLICATION_CREDENTIALS` field of the `.env` file
    OR
6. Copy `client_email`, `private_key` & `project_id` from `Firebase admin key` file & paste it into respective field of `.env` file. Make sure to copy with double quotes.

#### Discord Bot Token

1. Create a new [bot](https://discord.com/developers/applications)
2. Copy Token (from `Bot` page) & paste into `DISCORD_TOKEN` field of the `.env` file
3. Copy Server ID & paste into `GUILD_ID` field of the `.env` file

### Deployment

There are 2 methods: With docker _or_ Without docker.

#### With Docker

There are 2 methods: Building container from source _or_ Using pre-built container image.
In any case, you will need to install Docker.

##### Installing Docker

The best way is to install & start [Docker Desktop](https://www.docker.com/)

**_OR_**

For headless install (or where there is no GUI available for e.g. Virtual Private Server Environments)

1. Install [Docker Engine](https://docs.docker.com/engine/install/)
2. Install [Docker Compose](https://docs.docker.com/compose/install/)

_You may also refer this outdated [guide](https://www.howtogeek.com/devops/how-to-install-docker-and-docker-compose-on-linux/)_

##### Building Container from source

After Docker is installed, run the following command to start the bot.

```sh
# This will install dependencies and transpile Typescript code to Javascript code
yarn install
yarn run build

# This will create a container from scratch
docker compose up -d
```

##### Using pre-built container image

You will not need to clone entire repository in this case. But you need to perform [pre-requisites](#pre-requisites).
After you have `firebase-service-acc` folder & `.env` file ready, create a file `docker-compose.yml` and put this:

```yml
version: '3.9'

services:
  pma-bot:
    container_name: perpetual-mechanical-array-bot
    image: ghcr.io/mrdgh2821/perpetual-mechanical-array-bot:latest
    env_file:
      - .env
    volumes:
      - ./firebase-service-acc:/app/firebase-service-acc:ro
```

Then run:

```sh
docker compose up -d
```

#### Without Docker

Clone the repo, complete the [pre-requisites](#pre-requisites) and do:

Execute the following:

```sh
yarn install
yarn run dev:start
```

## Contributing & Testing

Pull requests are welcome!

If you wish to do some modifications/testing:

1. Complete the pre-requisites except docker part, as listed in [Hosting section](#hosting--deployment-production-environment)
2. Run:

```sh
yarn run watch:start
```

In case of error 401 or 403, you may have to kick out the bot, generate new invite link with bot & application.command scope, invite back the bot & run the command again.

Another solution is to check if the token is set correctly or not. Use `console.log(process.env.DISCORD_TOKEN)` to check how token looks. Remove any extra quotation marks at start & end of the token.

## License

[Unlicense](./LICENSE)

## Help the Dev

This bot is a gift for Traveler Mains discord server, which I have been hosting for free.
I'm also bringing new feature updates without charging anything.

If you have benefitted from this bot, and would like to keep the development of this bot active or just want to support me out of good will, please click on the sponsor button.

It will help me keep the bot alive for years to come & keep me motivated to add more features in future.
