// Dependencies
import async from "async";
import util from "util";
import axios from "axios";
import helpers from "./helpers.mjs";

// Hubspot Client
const hubspotCreateOrUpdateEndpoint =
    "https://api.hubapi.com/contacts/v1/contact/batch/?hapikey=XXXXXXXXXXX";

// Add contacts to hubspot function
const addContactsToHubspot = async (contacts) => {
    // Contacts count
    let n = 0;

    // List of group by 1000
    const listToCreateOrUpdate = helpers.separateList(contacts, 1000);

    // Iterate every list to create or add
    await async.forEachLimit(
        listToCreateOrUpdate,
        1,
        async.asyncify(async (list) => {
            try {
                const response = await axios.post(
                    hubspotCreateOrUpdateEndpoint,
                    list.map((contact) => {
                        return {
                            email: contact.email,
                            properties: [
                                ...Object.entries(contact)
                                    .map(([property, value]) => ({
                                        property,
                                        value,
                                    }))
                                    .filter(
                                        (x) => typeof x.value !== "undefined"
                                    ),
                            ],
                        };
                    })
                );

                n += list.length;
                console.log(
                    "%d/%d contact(s) has been processed",
                    n,
                    contacts.length
                );

                if (list.length === 1000)
                    await util.promisify(setTimeout)(5 * 1000);
            } catch (e) {
                console.log(e);
            }
        })
    );

    console.log("Hubspot function has been finished!");
};

export default addContactsToHubspot;
