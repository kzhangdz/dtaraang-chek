import Post from '../../entities/post'

export default interface IPostDAO{

    //getArtistPosts(artistName: string, instagramSourceURL: string): Promise<Post[]>

    getPostById(id: number): Promise<Post|null>

    create(payload: Post): Promise<Post>

    update(id: number, payload: Post): Promise<Post>

    delete(id: number): Promise<Boolean>
}