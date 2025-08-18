import Entity from "./entity";
import { IPost } from "../interfaces/post/post";

export default class Post extends Entity<Post> implements IPost{
    inputUrl: string;
    id: string;
    caption: string;
    url: string;
    displayUrl: string;
    images: string[];
    ownerFullName: string;
    ownerUsername: string;

    constructor(data: IPost){
        super(data)

        this.inputUrl = data.inputUrl;
        this.id = data.id;   
        this.caption = data.caption;
        this.url = data.url;
        this.displayUrl = data.displayUrl;
        this.images = data.images;
        this.ownerFullName = data.ownerFullName;
        this.ownerUsername = data.ownerUsername;
    }

    // Method to get images, returns displayUrl if images array is empty
    getImages(): string[] {
        return this.images.length == 0 ? [this.displayUrl] : this.images
    }

    // Method to check if the post is a schedule
    isSchedule(): boolean {
        return this.caption.includes('ตาราง') || this.caption.includes('Schedule') || this.caption.includes('schedule');
    }
}