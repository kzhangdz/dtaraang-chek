import { ApifyClient } from "apify-client";
import { IPost, PostApify } from "../models/postModel"; // Assuming Post is defined in models/Post
require('./../config')

interface IActorInput {
    directUrls: string[];
    resultsType: string;
    resultsLimit: number;
    onlyPostsNewerThan: string;
}

class ApifyApiClient {
    
    private client: ApifyClient
    private postActorName: string;

    constructor(apiKey: string) {
        this.client = new ApifyClient({ token: apiKey });
        this.postActorName = "apify/instagram-scraper";
    }

    public async fetchSchedulePosts(input: IActorInput): Promise<IPost[]> {
        try{
            const actorRun = await this.client.actor(this.postActorName).call(input)
            const { items } = await this.client
                .dataset(actorRun.defaultDatasetId)
                .listItems();

            const posts = items.map((item: any) => {
                return new PostApify(item as IPost);
            })

            const schedulePosts = posts.filter(post => post.isSchedule);

            return schedulePosts
        } catch (error) {
            console.error('Error fetching scheduled posts:', error);
            return [];
        }
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