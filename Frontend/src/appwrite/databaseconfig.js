import { Client, ID, Databases, Storage, Query } from "appwrite";
import configenv from "../configenv/configenv.js"

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(configenv.appwriteURI)
        .setProject(configenv.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userid}){
        try {
            return await this.databases.createDocument(
                configenv.appwriteDatabaseId,
                configenv.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userid,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                configenv.appwriteDatabaseId,
                configenv.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,

                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                configenv.appwriteDatabaseId,
                configenv.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                configenv.appwriteDatabaseId,
                configenv.appwriteCollectionId,
                slug
            
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    // async getPosts(queries = [Query.equal("status", "active")]){
    //     try {
    //         return await this.databases.listDocuments(
    //             configenv.appwriteDatabaseId,
    //             configenv.appwriteCollectionId,
    //             queries,
    //         )
    //     } catch (error) {
    //         console.log("Appwrite serive :: getPosts :: error", error);
    //         return false
    //     }
    // }

    // async getPosts(userid) {
    //     try {
    //         const filters = [Query.equal("userid", userid)];
    
    //         const result = await this.databases.listDocuments(
    //             configenv.appwriteDatabaseId,
    //             configenv.appwriteCollectionId,
    //             filters
    //         );
    
    //         return result.documents;
    //     } catch (error) {
    //         console.error("Error fetching posts:", error);
    //         return [];
    //     }
    // }

    async getPosts(userid = null) {
        try {
            let filters = [];
    
            if (userid !== null) {
                filters.push(Query.equal("userid", userid));
            } else {
                // If userid is not provided, add a filter for status "active"
                filters.push(Query.equal("status", "active"));
            }
    
            const result = await this.databases.listDocuments(
                configenv.appwriteDatabaseId,
                configenv.appwriteCollectionId,
                filters
            );
    
            return result.documents;
        } catch (error) {
            console.error("Error fetching posts:", error);
            return [];
        }
    }
    
    

    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                configenv.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(featuredImage){
        try {
            await this.bucket.deleteFile(
                configenv.appwriteBucketId,
                featuredImage
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

   getFilePreview(fileId){
        return this.bucket.getFilePreview(
            configenv.appwriteBucketId,
            fileId
        )
    }
}


const service = new Service()
export default service;