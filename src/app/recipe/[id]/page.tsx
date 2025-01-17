import { notFound } from 'next/navigation';
import clientPromise from '@/app/utils/db';
import Image from 'next/image';
import { ObjectId } from 'mongodb';
import type { Metadata, ResolvingMetadata } from 'next';

// Esta función genera los metadatos dinámicos de la receta
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Recupera la receta desde la base de datos utilizando el id
  const { id } = await params; // Espera que params sea un Promise
  const client = await clientPromise;
  const db = client.db("recetas_app");
  const recipesCollection = db.collection("recipes");

  const recipe = await recipesCollection.findOne({ _id: new ObjectId(id) });

  if (!recipe) {
    throw new Error("Receta no encontrada");
  }

  // Si es necesario, accede y extiende los metadatos previos (como openGraph)
  const previousOpenGraph = (await parent).openGraph?.images || [];

  return {
    title: recipe.title,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: [recipe.imageUrl || '/default.png', ...previousOpenGraph],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.title,
      description: recipe.description,
      images: [recipe.imageUrl || '/default.png'],
    },
  };
}

// El componente de la página de la receta
export default async function RecetaPublica({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Espera que params sea un Promise

  const client = await clientPromise;
  const db = client.db("recetas_app");
  const recipesCollection = db.collection("recipes");

  const recipe = await recipesCollection.findOne({ _id: new ObjectId(id) });

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
  );
}
