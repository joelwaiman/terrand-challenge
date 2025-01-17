export type Recipe = {
  _id: string;
  title: string;
  description: string;
  ingredients: string;
  userId: string;
  author: string;
  ratings: { userId: string; rating: number }[];
  averageRating: number;
  createdAt: string;
  imageUrl?: string;
}; 