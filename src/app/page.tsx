'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RecipeCard from './components/RecipeCard';

import { Recipe } from './types/types';
import Image from 'next/image';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/feed');
    } else {
      fetchRecipes();
    }
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Bienvenido a Foodly</h1>

        <div className="mb-8 text-center">
          <Link
            href="/register"
            className="bg-[#c5ab6b] hover:bg-[#ad9558] text-white font-bold py-2 px-4 rounded mr-4"
          >
            Registrarse
          </Link>
          <Link
            href="/login"
            className="bg-[#578E7E] hover:bg-[#437567] text-white font-bold py-2 px-4 rounded"
          >
            Iniciar Sesión
          </Link>
        </div>

        <div className="flex flex-col w-full items-center">
          {recipes === null ?
            <p className="text-gray-500 text-lg mt-10">Cargando recetas...</p>
           : recipes.length < 1 ? (
            <Image
              className="mt-20 w-80 h-80 opacity-60"
              src={'/empty.png'}
              alt="empty box"
              width={200}
              height={200}
            />
          ) : (
            recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                currentUserId={userId}
                onRatingChange={fetchRecipes}
                onDelete={() => {}}
                isPublic={true}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
