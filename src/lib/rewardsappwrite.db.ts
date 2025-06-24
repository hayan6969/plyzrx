import { Client, Databases, Storage, ID } from "appwrite";

// Initialize Appwrite Client - this should only run on the client side
let client: Client;
let databases: Databases;
let storage: Storage;

// Initialize the client only on the client side
if (typeof window !== "undefined") {
  client = new Client()
    .setEndpoint(
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
        "https://cloud.appwrite.io/v1"
    )
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

  databases = new Databases(client);
  storage = new Storage(client);
}

export interface rewardcategory {
    $id: string;
    category: string;
}

export interface reward {
    $id: string;
    rewardname: string;
    categoryName: string;
    price: number;
    image: string;
}

const REWARDS_CATEGORY_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REWARDSCATEGORY_COLLECTION_ID!;
const REWARDS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REWARD_COLLECTION_ID!;
const REWARDS_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_REWARD_BUCKET_ID!;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Category functions
export const createRewardCategory = async (categoryData: Omit<rewardcategory, '$id'>) => {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            REWARDS_CATEGORY_COLLECTION_ID,
            ID.unique(),
            categoryData
        );
        return response;
    } catch (error) {
        console.error('Error creating reward category:', error);
        throw error;
    }
};

export const getRewardCategories = async () => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            REWARDS_CATEGORY_COLLECTION_ID
        );
        return response.documents as unknown as rewardcategory[];
    } catch (error) {
        console.error('Error fetching reward categories:', error);
        throw error;
    }
};

export const updateRewardCategory = async (categoryId: string, categoryData: Partial<rewardcategory>) => {
    try {
        const response = await databases.updateDocument(
            DATABASE_ID,
            REWARDS_CATEGORY_COLLECTION_ID,
            categoryId,
            categoryData
        );
        return response;
    } catch (error) {
        console.error('Error updating reward category:', error);
        throw error;
    }
};

export const deleteRewardCategory = async (categoryId: string) => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            REWARDS_CATEGORY_COLLECTION_ID,
            categoryId
        );
    } catch (error) {
        console.error('Error deleting reward category:', error);
        throw error;
    }
};

// Reward functions
export const uploadRewardImage = async (file: File) => {
    try {
        const response = await storage.createFile(
            REWARDS_BUCKET_ID,
            ID.unique(),
            file
        );
        return response;
    } catch (error) {
        console.error('Error uploading reward image:', error);
        throw error;
    }
};

export const createReward = async (rewardData: Omit<reward, '$id'>) => {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            REWARDS_COLLECTION_ID,
            ID.unique(),
            rewardData
        );
        return response;
    } catch (error) {
        console.error('Error creating reward:', error);
        throw error;
    }
};

export const getRewards = async () => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            REWARDS_COLLECTION_ID
        );
        return response.documents as unknown as reward[];
    } catch (error) {
        console.error('Error fetching rewards:', error);
        throw error;
    }
};

export const updateReward = async (rewardId: string, rewardData: Partial<reward>) => {
    try {
        const response = await databases.updateDocument(
            DATABASE_ID,
            REWARDS_COLLECTION_ID,
            rewardId,
            rewardData
        );
        return response;
    } catch (error) {
        console.error('Error updating reward:', error);
        throw error;
    }
};

export const deleteReward = async (rewardId: string) => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            REWARDS_COLLECTION_ID,
            rewardId
        );
    } catch (error) {
        console.error('Error deleting reward:', error);
        throw error;
    }
};

export const deleteRewardImage = async (fileId: string) => {
    try {
        await storage.deleteFile(REWARDS_BUCKET_ID, fileId);
    } catch (error) {
        console.error('Error deleting reward image:', error);
        throw error;
    }
};