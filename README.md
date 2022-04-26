# todo-pinia-deepgram

This tutorial presents how to use Vue 3 and Deepgram to create a voice-powered to-do list web application.

## Project setup

First, clone the project. Then install the dependencies with `npm install`.

## Set up .env file

Rename the .env-example file to .env. Then add the values for each environment variable.

## Run the development environment

Run the node server with `npm run start`.

Run the frontend Vue cli with `npm run serve`.

## Test out the Voice Commands

Click the speech button. Wait for Deepgram to connect. Then use a command to add, delete, or check-off an item from the list:

The commands are: - "ADD TO DO..." - "DELETE..." - "CHECK OFF..."

For example, "Add to do go to the store" will add "go to the store" to the list.

## Starter Branch

The **starter-branch** has only the code needed to start from the beginning of the tutorial. It includes the composables that have logic to connect to Deepgram and the Pinia store.

Try out the tutorial starting from setting up the `TodoSpeech.vue` component.

Happy coding!
