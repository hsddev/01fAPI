// Dependencies;
import getContacts from "./getContacts.mjs";
import lastToadList from "./toad.mjs";
import lastAdminList from "./administration.mjs";
import addToHubspot from "./addToHubspot.mjs";
import express from "express";
const app = new express();
import helpers from "./helpers.mjs";

// Start function
(async function () {
    // App log
    console.log("Hubspot App script started");

    console.log("###############################");

    // Get all new contacts
    const contacts = await getContacts();

    // Contact count log
    console.log("Will process: %d contact(s)", contacts.length);

    // Add contacts list to hubspot
    await addToHubspot(contacts);

    console.log("###############################");

    // Get the student list who played the game with info
    const gameList = await lastToadList;

    // Game list count log
    console.log("Will process: %d player(s)", gameList.length);

    console.log(gameList);
    // Add gameList to hubspot
    await addToHubspot(gameList);

    console.log("###############################");

    // Get the student list who passed the administration phase
    const adminList = await lastAdminList;

    console.log(adminList);
    // Admin list count log
    console.log("Will process: %d contact(s)", adminList.length);

    // Add adminList to hubspot
    await addToHubspot(adminList);
})();
