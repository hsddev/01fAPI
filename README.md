Founders API

Description:

-   This api is used to get the data from 01edu platform and push into Hubspot.

Packages:

-   01-edu/api : we use ths package to get the token which is used in graphql request to get the data.
-   axios : to make http requests.

How the API works:

-   The requestToken function (from 01-edu/api) takes an object as an argument containing the name of the platform and the access key generated from Gitea (see config.mjs) and returns a token written to token.json.

-   In helpers.mjs the checkToken function reads the contents of token.json and checks if the token has expired or not. If expired the function will generate a new token.

-   The valid token is then used to make a http request (graphql post request) to pull the data from the platform and pushed into an array of objects where each object contains user information (see getContacts.mjs).

-   In addToHubspot.mjs there is a function called hubspotAPI that splits aforementioned array into smaller arrays with a maximum capacity of 1000 objects. This function also does a check using the email address' in each object and if it exists already in Hubspot it will update the users details or create a new user with all the details from the object. (see addToHubspot.mjs)

Important:

-   All contact properties within the object should be equal to the property names in Hubspot for example: date_of_birth exists in Hubspot as contact property but hair_colour does not.
-   Since Hubspot can only allow for 1000 entries to be updated at a time it is important that the function addContactsToHubspot remains unchanged.
