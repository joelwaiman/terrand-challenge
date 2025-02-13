'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Recipe } from '@/app/types/types';

export default function EditarReceta({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Desempaqueta params usando React.use
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
        } else {
          setError('No se pudo cargar la receta');
        }
      } catch (error) {
        setError('Error al cargar la receta');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !recipe) return;

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipe),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError('No se pudo actualizar la receta');
      }
    } catch (error) {
      setError('Error al actualizar la receta');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (recipe) {
      setRecipe({
        ...recipe,
        [e.target.name]: e.target.value,
      });
    }
  };

  if (isLoading) return <div className='mx-auto max-w-[90%]'>
    <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
    <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
    <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
    <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
    <div className="bg-gray-700 animate-pulse w-full h-[15vh] mt-10 rounded-lg" />
  </div>;
  if (error) return <div>{error}</div>;
  if (!recipe) return <div>No se encontró la receta</div>;

  return (
    <div className="mt-20 container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Receta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 space-y-4">
        <div>
          <label htmlFor="title" className="block mb-4 text-lg font-medium text-gray-500">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={recipe.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-black/30 rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-[#FFFAEC] focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-4 text-lg font-medium text-gray-500">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={recipe.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-black/30 rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-[#FFFAEC] focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="ingredients" className="block mb-4 text-lg font-medium text-gray-500">
            Ingredientes
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={recipe.ingredients}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-black/30 rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-[#FFFAEC] focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block mb-4 text-lg font-medium text-gray-500">imagen URL (opcional)</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={recipe.imageUrl || ''}
            onChange={handleChange}
            className="mt-1 block w-full bg-black/30 rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-[#FFFAEC] focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#578E7E] hover:bg-[#FFFAEC] hover:text-black text-[#FFFAEC] font-bold py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:shadow-outline"
        >
          Actualizar Receta
        </button>
      </form>
    </div>
  );
}