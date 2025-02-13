'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
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

        <div className="flex flex-col w-full items-center">
          {recipes === null ?
            <>
              <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
              <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
              <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
              <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
              <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
            </>
            : recipes.length < 1 ? (
              <>
                <Image
                  className="mt-40 w-96 h-96 opacity-60"
                  src={'/empty.png'}
                  alt="empty box"
                  width={200}
                  height={200}
                />
                <p className='text-black/60 text-6xl'>No hay recetas</p>
              </>
            ) : (
              recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  currentUserId={userId}
                  onRatingChange={fetchRecipes}
                  onDelete={() => { }}
                  isPublic={true}
                />
              ))
            )}
        </div>
      </main>
    </div>
  );
}
