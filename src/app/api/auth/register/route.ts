import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';

import { signToken } from '@/app/utils/jwt';
import clientPromise from '@/app/utils/db';

export async function POST(req: Request) {
  try {
    const { nombre, apellido, email, password } = await req.json();
    const hashedPassword = await hash(password, 10);

    const client = await clientPromise;
    const db = client.db("recetas_app");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'El email ya está registrado' }, { status: 400 });
    }

    const result = await usersCollection.insertOne({
      name: `${nombre} ${apellido}`,
      email,
      password: hashedPassword,
    });

    const token = signToken({ userId: result.insertedId.toString(), email });

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ message: 'Error al crear el usuario' }, { status: 500 });
  }
}

