import Post from '../../entities/post'
//import { ValidationError } from '../../errors'
import IUseCase from '../../interfaces/useCase'
import IPostDAO from '../../interfaces/post/postDAO'

export default class CreatePost implements IUseCase<Post> {
    PostDAO: IPostDAO

    constructor(
        PostDAO: IPostDAO
    ){
        this.PostDAO = PostDAO
    }

    async call(payload: Post): Promise<Post>{

        return this.PostDAO.create(payload)
    }
}