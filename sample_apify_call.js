import { ApifyClient } from 'apify-client';

const apifyClient = new ApifyClient({ token: 'MY-APIFY-TOKEN' });

// Define the input for the Actor
const actorInput = {
    searchStringsArray: ["ramen"],
    locationQuery: "New York, USA",
    maxCrawledPlacesPerSearch: 10,
    language: "en",
};

// Run an Actor with an input and wait for it to finish
console.log("Running the Actor...");
const actorRun = await apifyClient
    .actor("compass/crawler-google-places")
    .call(actorInput);
console.log("🚀 Actor finished:", actorRun);

// Load the data from the dataset
const { items } = await apifyClient
    .dataset(actorRun.defaultDatasetId)
    .listItems();

// Integrate the data into your application
console.log("Data from the dataset:", items);
console.log(`💾 Check your data here: https://console.apify.com/storage/datasets/${actorRun.defaultDatasetId}`);