import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';
import clientPromise from '@/app/utils/db';
import { ObjectId } from 'mongodb';
import { ratingSchema, RatingInput } from '@/app/utils/schemas';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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
    const result = ratingSchema.safeParse(json);

    if (!result.success) {
      const errors = result.error.errors.map(error => ({
        path: error.path.join('.'),
        message: error.message
      }));
      return NextResponse.json({ message: 'Datos de calificación inválidos', errors }, { status: 400 });
    }

    const ratingData: RatingInput = result.data;

    const client = await clientPromise;
    const db = client.db("recetas_app");
    const recipesCollection = db.collection("recipes");

    const recipe = await recipesCollection.findOne({ _id: new ObjectId(id) });

    if (!recipe) {
      return NextResponse.json({ message: 'Receta no encontrada' }, { status: 404 });
    }

    const existingRatingIndex = recipe.ratings.findIndex((r: any) => r.userId === decoded.userId);

    if (existingRatingIndex > -1) {
      recipe.ratings[existingRatingIndex].rating = ratingData.rating;
    } else {
      recipe.ratings.push({ userId: decoded.userId, rating: ratingData.rating });
    }

    const averageRating = recipe.ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0) / recipe.ratings.length;

    await recipesCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ratings: recipe.ratings,
          averageRating: averageRating
        } 
      }
    );

    return NextResponse.json({ message: 'Calificación actualizada exitosamente' });
  } catch (error) {
    console.error('Error al calificar la receta:', error);
    return NextResponse.json({ message: 'Error al calificar la receta' }, { status: 500 });
  }
}

