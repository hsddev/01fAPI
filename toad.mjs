// Dependencies
import axios from "axios";
import csv from "csvtojson";
import helpers from "./helpers.mjs";

// Async / await usage

const toadResults = (async () => {
    try {
        const response = await axios({
            method: "get",
            url: "https://metabase-api.herokuapp.com/toad",
            headers: {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            },
        });

        if (response.status !== 200 || !response.data)
            throw new Error("Invalid response or data");

        const jsonArray = await csv().fromString(response.data);

        //return todayResult;
        const lastToadList = jsonArray.map((user) => {
            let lastUpdate = user.updatedAt.split("T")[0].split("-");

            // Return the object
            return {
                login: user.login,
                email: user.email,
                application_score: Number(user.gamesScore) || 0,
                attempt_number: Number(user.gamesAttempts),
                stepstatus: user.stepStatus,
                lvl_memory: user.memory,
                lvl_zzle: user.zzle,
                gameplay_date: new Date(
                    Date.UTC(
                        lastUpdate[0],
                        Number.parseInt(lastUpdate[1]) - 1,
                        lastUpdate[2]
                    )
                ).getTime(),
            };
        });

        return lastToadList.filter((x) => {
            const isEmailValid = helpers.validateEmail(x.email);
            if (!isEmailValid)
                console.log("%s has invalid email (%s)", x.login, x.email);
            return !!x.email && !!isEmailValid;
        });
    } catch (e) {
        console.log(e);
    }
})();

export default toadResults;
