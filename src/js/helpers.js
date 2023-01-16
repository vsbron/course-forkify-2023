import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";

// Timeout function
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Working with API function
export const AJAX = async function (url, uploadData = undefined) {
  try {
    // Checking whether we need to upload or download the data from API, thus changing the fetch function
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Racing two promises to be able to reset if the responce is not received during TIMEOUT_SEC
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    // Throwing error if no data received
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data; // Return data to Model
  } catch (err) {
    throw err;
  }
};
