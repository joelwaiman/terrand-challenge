import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/jwt';
import clientPromise from '@/app/utils/db';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = (await params);

  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("recetas_app");
    const recipesCollection = db.collection("recipes");

    const recipe = await recipesCollection.findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(decoded.userId)
    });

    if (!recipe) {
      return NextResponse.json({ message: 'Receta no encontrada' }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener la receta' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = (await params);
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
  }

  try {
    const { title, description, ingredients, imageUrl } = await req.json();

    const client = await clientPromise;
    const db = client.db("recetas_app");
    const recipesCollection = db.collection("recipes");

    const result = await recipesCollection.updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(decoded.userId) },
      {
        $set: {
          title,
          description,
          ingredients,
          imageUrl
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Receta no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ id, title, description, ingredients, imageUrl });
  } catch (error) {
    return NextResponse.json({ message: 'Error al actualizar la receta' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = (await params);
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("recetas_app");
    const recipesCollection = db.collection("recipes");

    const result = await recipesCollection.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(decoded.userId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Receta no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Receta eliminada exitosamente' });
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar la receta' }, { status: 500 });
  }
}