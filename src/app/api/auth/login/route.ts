import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { signToken } from '@/app/utils/jwt';
import clientPromise from '@/app/utils/db';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const client = await clientPromise;
    const db = client.db("recetas_app");
    const usersCollection = db.collection("users");

    const normalizedEmail = email.toLowerCase(); // CASE SENSITIVE

    const user = await usersCollection.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 });
    }

    const token = signToken({ userId: user._id.toString(), email: user.email });

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ message: 'Error en el inicio de sesión' }, { status: 500 });
  }
}