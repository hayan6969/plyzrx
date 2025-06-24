import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases } from 'node-appwrite';

// Initialize Appwrite client for server-side
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || ''); // Server-side API key

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const REWARDS_CATEGORY_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REWARDSCATEGORY_COLLECTION_ID!;
const REWARDS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REWARD_COLLECTION_ID!;
const REWARDS_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_REWARD_BUCKET_ID!;

interface RewardCategory {
  $id: string;
  category: string;
}

interface Reward {
  $id: string;
  rewardname: string;
  categoryName: string;
  price: number;
  image: string;
}

interface FormattedReward {
  category: string;
  items: {
    id: string;
    image: string;
    name: string;
    price: number;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    console.log(request);
    
    // Fetch categories and rewards from Appwrite
    const [categoriesResponse, rewardsResponse] = await Promise.all([
      databases.listDocuments(DATABASE_ID, REWARDS_CATEGORY_COLLECTION_ID),
      databases.listDocuments(DATABASE_ID, REWARDS_COLLECTION_ID)
    ]);

    const categories = categoriesResponse.documents as unknown as RewardCategory[];
    const rewards = rewardsResponse.documents as unknown as Reward[];

    // Format the data according to your specification
    const formattedData: FormattedReward[] = categories.map(category => {
      // Find all rewards for this category
      const categoryRewards = rewards.filter(reward => reward.categoryName === category.category);
      
      // Format the items
      const items = categoryRewards.map(reward => ({
        id: reward.$id,
        image: reward.image ? 
          `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${REWARDS_BUCKET_ID}/files/${reward.image}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}` 
          : "",
        name: reward.rewardname,
        price: reward.price
      }));

      return {
        category: category.category,
        items: items
      };
    });

    // Filter out categories with no items if needed
    const filteredData = formattedData.filter(category => category.items.length > 0);

    return NextResponse.json(filteredData, { status: 200 });

  } catch (error) {
    console.error('Error fetching rewards data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rewards data' },
      { status: 500 }
    );
  }
}