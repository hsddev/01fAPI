// Dependencies
import axios from "axios";
import csv from "csvtojson";
import helpers from "./helpers.mjs";

const lastAdminList = (async () => {
    try {
        const response = await axios({
            method: "get",
            url: "https://metabase-api.herokuapp.com/admin",
            headers: {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            },
        });

        if (response.status !== 200 || !response.data)
            throw new Error("Invalid response or data");

        const jsonArray = await csv().fromString(response.data);

        //return todayResult;
        const lastAdmList = jsonArray.map((user) => {
            // Return result
            return {
                login: user.login,
                email: user.email,
                administration_phase: user.phase,
            };
        });

        return lastAdmList;
    } catch (e) {
        console.log(e);
    }
})();

export default lastAdminList;
