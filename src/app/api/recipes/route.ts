import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';
import clientPromise from '@/app/utils/db';
import { ObjectId } from 'mongodb';
import { recipeSchema, RecipeInput } from '@/app/utils/schemas';

export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("recetas_app");
    const recipesCollection = db.collection("recipes");

    let recipes = await recipesCollection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener las recetas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const result = recipeSchema.safeParse(json);

    if (!result.success) {
      const errors = result.error.errors.map(error => ({
        path: error.path.join('.'),
        message: error.message
      }));
      return NextResponse.json({ message: 'Datos de receta inválidos', errors }, { status: 400 });
    }

    const recipeData: RecipeInput = result.data;

    const client = await clientPromise;
    const db = client.db("recetas_app");
    const recipesCollection = db.collection("recipes");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    const authorName = user ? user.name : 'Usuario Anónimo';

    const insertResult = await recipesCollection.insertOne({
      ...recipeData,
      userId: new ObjectId(decoded.userId),
      author: authorName,
      ratings: [],
      averageRating: 0,
      createdAt: new Date(),
    });

    const newRecipe = await recipesCollection.findOne({ _id: insertResult.insertedId });

    return NextResponse.json(newRecipe);
  } catch (error) {
    console.error('Error al crear la receta:', error);
    return NextResponse.json({ message: 'Error al crear la receta' }, { status: 500 });
  }
}