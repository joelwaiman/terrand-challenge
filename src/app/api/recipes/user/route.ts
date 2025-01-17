import { NextResponse } from 'next/server';

import { verifyToken } from '@/app/utils/jwt';
import clientPromise from '@/app/utils/db';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
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

    const recipes = await recipesCollection.find({ userId: new ObjectId(decoded.userId) }).toArray();

    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener las recetas del usuario' }, { status: 500 });
  }
}

