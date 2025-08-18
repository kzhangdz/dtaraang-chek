import IPostDAO from "../../interfaces/post/postDAO";
import Post from "../../entities/post";

import { db } from "../../config/config";

export default class PostDAO implements IPostDAO {
    // Assuming you have a Firestore instance initialized

    async getPostById(id: number): Promise<Post | null> {
        const doc = await db.collection('posts').doc(id.toString()).get();
        if (!doc.exists) {
            return null;
        }
        return new Post(doc.data() as any);
    }

    async create(payload: Post): Promise<Post> {
        const docRef = await db.collection('posts').add(payload);
        return new Post({ ...payload, id: docRef.id });
    }

    async update(id: number, payload: Post): Promise<Post> {
        await db.collection('posts').doc(id.toString()).update({ ...payload });
        return new Post({ ...payload, id: id.toString() });
    }

    async delete(id: number): Promise<Boolean> {
        await db.collection('posts').doc(id.toString()).delete();
        return true;
    }
}