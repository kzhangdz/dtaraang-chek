import { ApifyClient } from "apify-client";
import { IPost, PostApify } from "../models/postModel"; // Assuming Post is defined in models/Post
require('./../config')

interface IActorInput {
    directUrls: string[];
    resultsType: string;
    resultsLimit: number;
    onlyPostsNewerThan: string;
}

export class ApifyApiClient extends ApifyClient {
    
    private postActorName: string;

    constructor(apiKey: string) {
        super({ token: apiKey });

        this.postActorName = "apify/instagram-scraper";
    }

    public async fetchSchedulePosts(input: IActorInput): Promise<IPost[]> {
        try{
            console.log("Input to fetch: " + input.directUrls)

            // Run an Actor with an input and wait for it to finish
            console.log("Running the Actor...");
            const actorRun = await this.actor(this.postActorName).call(input)
            const { items } = await this
                .dataset(actorRun.defaultDatasetId)
                .listItems();
            console.log("🚀 Actor finished:", actorRun);

            // Integrate the data into your application
            console.log("Data from the dataset:", items);
            console.log(`💾 Check your data here: https://console.apify.com/storage/datasets/${actorRun.defaultDatasetId}`);


            const posts = items.map((item: any) => {
                return new PostApify(item as IPost);
            })

            const schedulePosts = posts.filter(post => post.isSchedule());

            console.log("Schedule Posts: " + schedulePosts)

            return schedulePosts
        } catch (error) {
            console.error('Error fetching scheduled posts:', error);
            return [];
        }
    }

    public batchInput(input: any[], chunkSize = 10): any[]{
        if(chunkSize == 0){
            return input
        }
        else{
            const chunks = []
            for (let i = 0; i < input.length; i += chunkSize) {
                const chunk = input.slice(i, i + chunkSize);
                
                chunks.push(chunk)
            }
            return chunks       
        }
    }

    public async batchFetchSchedulePosts(inputs: IActorInput[]): Promise<IPost[]>{
        var posts: IPost[] = []
        
        for(let i = 0; i < inputs.length; i++){
            const currentInput = inputs[i]
            const currentPosts = await this.fetchSchedulePosts(currentInput)

            posts.push(...currentPosts)
        }

        return posts
    }
    
    public generateActorInput(urls: string[], resultsType: string = "posts", resultsLimit: number = 5, onlyPostsNewerThan: string = "3 days"): IActorInput {
        return {
            directUrls: urls,
            resultsType: resultsType,
            resultsLimit: resultsLimit,
            onlyPostsNewerThan: onlyPostsNewerThan
        };
    }
}

if (require.main === module) {

    async function getData(){
        const apiKey = process.env.APIFY_API_KEY || "";
        const apifyClient = new ApifyApiClient(apiKey);

        const actorInput = apifyClient.generateActorInput(
            [
                "https://www.instagram.com/pixxie_official/"
            ]
        )
        const posts = await apifyClient.fetchSchedulePosts(actorInput);
        console.log(posts);
    }

    getData().catch(console.error);
}