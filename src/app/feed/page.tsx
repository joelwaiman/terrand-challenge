'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import RecipeCard from '../components/RecipeCard';
import CreateRecipe from '../components/CreateRecipes';

import { Recipe } from '../types/types';
import Image from 'next/image';

export default function Feed() {
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
      fetchRecipes();
    }
  }, [router]);

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/recipes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRecipes(
          data.sort(
            (a: Recipe, b: Recipe) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        )
      } else {
        console.error('Error fetching recipes');
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    }
  };

  const handleNewRecipe = (newRecipe: Omit<Recipe, 'createdAt'>) => {
    if (recipes !== null) {
      const createdRecipe = {
        ...newRecipe,
        createdAt: new Date().toISOString(),
      };
      setRecipes([createdRecipe, ...recipes]);
    }
  };

  const handleDeleteRecipe = (id: string) => {
    if (recipes !== null) {
      setRecipes(recipes.filter((recipe) => recipe._id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <CreateRecipe NewRecipe={handleNewRecipe} />
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
          <Image
            className="w-80 h-80 opacity-60"
            src={'/empty.png'}
            alt="empty box"
            width={200}
            height={200}
          />
        ) : (
          recipes.map((recipe, index) => (
            <RecipeCard
              key={index}
              recipe={recipe}
              currentUserId={userId}
              onRatingChange={fetchRecipes}
              onDelete={handleDeleteRecipe}
            />
          ))
        )}
      </div>
    </div>
  );
}