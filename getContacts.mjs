// Dependencies
import axios from "axios";
import helpers from "./helpers.mjs";

// GraphQL request opts
const opts = {
    method: "post",
    url: "https://learn.01founders.co/api/graphql-engine/v1/graphql",
    headers: {
        Authorization: `Bearer ${helpers.checkToken()}`,
        "Content-Type": "application/json",
    },
    data: JSON.stringify({
        query: `{
            toad_result_view{
                attempts
                user{
                    login  
                }
                score
            }
             user {
                login
                attrs
                sessions {
                    final_score
                }
            }
            user_aggregate (
                where: {
                  registrations: {registration:  {path: {_eq: "/london/piscine-go"}}}
                  _not: {events: {event:  {path: {_eq: "/london/piscine-go"}}}}
                }
              ) {
                nodes{
                  login
                  registrations{
                    registration{
                      endAt
                    }
                  
                  }
                }
                aggregate {count}
              }
         }`,
        variables: {},
    }),
};

// Get contacts function
const getContacts = async () => {
    try {
        // Make axios request
        const response = await axios(opts);

        // Check data
        if (!response || !response.data || !response.data.data)
            throw new Error("Data object not found");

        if (!response.data.data.user || !Array.isArray(response.data.data.user))
            throw new Error("Users object not found");

        if (
            !response.data.data.user_aggregate.nodes ||
            !Array.isArray(response.data.data.user_aggregate.nodes)
        )
            throw new Error("Piscine users object not found");
        // Extract
        const users = response.data.data.user;
        const piscineUsers = response.data.data.user_aggregate.nodes;

        // Make change to users
        const changedUsers = users.map((user) => {
            // Check if user is registered in the piscine
            const piscineUser = piscineUsers.find(
                (result) => result.login === user.login
            );

            // Set the selection pool
            var poolDate = piscineUser
                ? piscineUser.registrations[0].registration.endAt
                : undefined;

            // Return users who are registered in piscine
            if (piscineUser) {
                return {
                    ...user,
                    attrs: {
                        ...user.attrs,
                        pool_date: poolDate || undefined,
                    },
                };
            } else {
                return user;
            }
        });

        // Re-prepare info
        return changedUsers
            .map(({ login, attrs }) => {
                // Address prepare
                let address = "";
                if (attrs.addressStreetFirstLine)
                    address += attrs.addressStreetFirstLine;

                if (attrs.addressStreetSecondLine)
                    address += ", " + attrs.addressStreetSecondLine;

                if (attrs.addressStreetThirdLine)
                    address += ", " + attrs.addressStreetThirdLine;

                // Date of birth prepare
                let dob =
                    attrs.dateOfBirth === undefined
                        ? undefined
                        : attrs.dateOfBirth.split("T")[0];

                function getAge(dateString) {
                    var today = new Date();
                    var birthDate = new Date(dateString);
                    var age = today.getFullYear() - birthDate.getFullYear();
                    var m = today.getMonth() - birthDate.getMonth();
                    if (
                        m < 0 ||
                        (m === 0 && today.getDate() < birthDate.getDate())
                    ) {
                        age--;
                    }
                    return age;
                }
                // Return result
                return {
                    login,
                    email: attrs.email
                        ? attrs.email.toLowerCase().trim()
                        : undefined || undefined,
                    firstname: attrs.firstName || undefined,
                    lastname: attrs.lastName || undefined,
                    mobilephone: attrs.phone || undefined,
                    date_of_birth: dob || undefined,
                    gender: attrs.gender || undefined,
                    financial_assistance_request:
                        attrs.requireFinancialAssistance
                            ? attrs.requireFinancialAssistance.toLowerCase() ===
                              "yes"
                                ? "TRUE"
                                : "FALSE"
                            : undefined,
                    ethnicity: attrs.ethincity || undefined,
                    address: address || undefined,
                    city: attrs.addressCity || undefined,
                    zip: attrs.addressPostalCode || undefined,
                    country: attrs.addressCountry || undefined,
                    pool_date: attrs.pool_date || undefined,
                    age: getAge(dob) || undefined,
                    registered: "TRUE",
                };
            })
            .filter((x) => {
                const isEmailValid = helpers.validateEmail(x.email);
                if (!isEmailValid)
                    console.log("%s has invalid email (%s)", x.login, x.email);
                return !!x.email && !!isEmailValid;
            });
    } catch (e) {
        console.log(e);
        // Return empty array on error
        return [];
    }
};

export default getContacts;
