import { requestToken } from "@01-edu/api";

// Credentials for 01Edu api
const z01Credentials = {
    domain: "learn.01founders.co",
    access_token: "PUT_YOUR_ACCESS_KEY",
};

// Get token for 01Edu api
const token = await requestToken(z01Credentials);

export default token;
