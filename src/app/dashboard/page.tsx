'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import RecipeCard from '../components/RecipeCard';

import { Recipe } from '../types/types';

export default function Dashboard() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.userId);
      fetchUserRecipes();
    }
  }, [router]);

  const fetchUserRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/recipes/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.sort((a: Recipe, b: Recipe) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } else {
        console.error('Error fetching recipes');
        setRecipes([])
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    }
  };

  const handleDeleteRecipe = (id: string) => {
    if (recipes !== null) {
      setRecipes(recipes.filter(recipe => recipe._id !== id));
    } else {
      setRecipes([])
    }

  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mis Recetas</h1>
      <div className="flex flex-col w-full items-center">
        {recipes === null ? (
          <>
            <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
            <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
            <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
            <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
            <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
          </>
        ) : recipes.length < 1 ? (
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
          recipes.map((recipe, index) => (
            <RecipeCard
              key={index}
              recipe={recipe}
              currentUserId={userId}
              onRatingChange={fetchUserRecipes}
              onDelete={handleDeleteRecipe}
            />
          ))
        )}
      </div>
    </div>
  );
}