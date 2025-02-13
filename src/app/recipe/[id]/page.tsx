import { notFound } from "next/navigation"
import clientPromise from "@/app/utils/db"
import Image from "next/image"
import { ObjectId } from "mongodb"

export default async function PublicRecipe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params //SE RODEA EL OBJETO QUE LLEGA EN PARAMS Y SE AWAIT LUEGO

  const client = await clientPromise
  const db = client.db("recetas_app")
  const recipesCollection = db.collection("recipes")

  const recipe = await recipesCollection.findOne({ _id: new ObjectId(id) })

  if (!recipe) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Detalles de la Receta</h1>
      <div className="flex relative w-full items-center gap-4 shadow-md rounded-lg p-4 mb-4 border border-gray-600">
        <div className="mb-4">
          <Image
            src={recipe.imageUrl || "/default.png"}
            alt={recipe.title}
            width={100}
            height={100}
            className="rounded-lg object-cover w-48 h-fit"
          />
        </div>
        <div className="relative">
          <p className="text-gray-500 mb-2">@{recipe.author}</p>
          <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
          <p className="mb-2">{recipe.description}</p>
          <div className="flex items-center mb-2">
            <span className="mr-2">Calificación:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl ${star <= recipe.averageRating ? "text-yellow-500" : "text-gray-300"}`}
              >
                ★
              </span>
            ))}
            <span className="ml-2">({recipe.averageRating ? recipe.averageRating.toFixed(1) : "0.0"})</span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Ingredientes:</h3>
            <p>{recipe.ingredients}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

