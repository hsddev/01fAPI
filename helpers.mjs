// Dependencies
import token from "./config.mjs";
import fs from "fs";

const helpers = {};

// Function generate and return the token
helpers.generateGetToken = () => {
    // The data
    let data = {
        token: token.token,
        exp: token.payload.exp,
    };

    // Create and save the token in token.json
    fs.writeFile("token.json", JSON.stringify(data), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("New token generated");
    });

    // return the token
    return data.token;
};

// Function read the token from token.json
helpers.getToken = () => {
    // Get the token from token.json
    const data = fs.readFileSync("token.json", "utf8", (err, content) => {
        if (err) {
            console.error(err);
            return;
        }
        return content;
    });
    // Return the token as an object
    return JSON.parse(data);
};

// Check the token is valid or invalid
helpers.checkToken = () => {
    var token = "";

    // Check if the token Exist
    if (!fs.existsSync("./token.json")) {
        token = helpers.generateGetToken();
    } else {
        // If token exist check
        // Get the token
        const myToken = helpers.getToken();

        // Get the expiry time of the existing token
        const expToken = myToken.exp;

        // //check if the token is expired
        if (expToken >= Date.now() / 1000) {
            // Token is still valid -> return the token
            token = myToken.token;
        } else {
            // Token is expired -> generate a new token
            token = helpers.generateGetToken();
        }
    }

    // Return the token
    return token;
};

helpers.separateList = (array, by) => {
    const list = [];
    let arrayToAdd = [];

    for (const [id, item] of array.entries()) {
        arrayToAdd.push(item);

        if (arrayToAdd.length === by) {
            list.push(arrayToAdd);
            arrayToAdd = [];
        } else {
            if (id === array.length - 1) {
                list.push(arrayToAdd);
                arrayToAdd = null;
            }
        }
    }

    return list;
};

// Validate email
helpers.validateEmail = (email) => {
    return (
        String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ) !== null
    );
};

export default helpers;
