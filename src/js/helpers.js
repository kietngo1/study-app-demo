import { TIMEOUT_SEC } from "./config";

const timeout = function(s) {
    return new Promise((_, reject) => setTimeout(() => 
        reject(new Error(`Request took so long! Timeout after ${s} seconds`)), s * 1000));

} 

export const getJSON = async function(url) {
    try {
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch (error) {
        throw error;
    }
}