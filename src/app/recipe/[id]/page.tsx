import { notFound } from 'next/navigation';
import clientPromise from '@/app/utils/db';
import Image from 'next/image';
import { ObjectId } from 'mongodb';

export default async function RecetaPublica({ params }: { params: { id: string } }) {
  const client = await clientPromise;
  const db = client.db("recetas_app");
  const recipesCollection = db.collection("recipes");

  const recipe = await recipesCollection.findOne({ _id: new ObjectId(params.id) });

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="flex items-center justify-center">
              <Image
                src={recipe.imageUrl || "/default.png"}
                alt={recipe.title}
                width={100}
                height={100}
                className="rounded-lg object-cover w-48 h-48"
              />
            </div>
            <div className="p-8">
              <h2 className="mt-2 text-3xl leading-8 font-extrabold sm:text-4xl">
                {recipe.title}
              </h2>
              <p className="mt-4 text-gray-300">
                {recipe.ingredients}
              </p>
              <p className="mt-4 text-gray-500">
                {recipe.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}