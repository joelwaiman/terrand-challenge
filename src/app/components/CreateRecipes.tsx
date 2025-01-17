import { useState } from 'react';
import { Recipe } from '../types/types';
import { recipeSchema, RecipeInput } from '../utils/schemas';

type CreateRecipeProps = {
  NewRecipe: (recipe: Recipe) => void;
};

export default function CreateRecipe({ NewRecipe }: CreateRecipeProps) {
  const [formData, setFormData] = useState<RecipeInput>({
    title: '',
    description: '',
    ingredients: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const result = recipeSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path.join('.')] = issue.message;
      });
      setErrors(formattedErrors);
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem('token');
    const response = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(result.data)
    });

    if (response.ok) {
      const newRecipe = await response.json();
      NewRecipe(newRecipe);
      setFormData({
        title: '',
        description: '',
        ingredients: '',
        imageUrl: '',
      });
    } else {
      const errorData = await response.json();
      setErrors(errorData.errors || { general: errorData.message });
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-600 shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-4">Crear nueva receta</h2>
      {errors.general && <p className="text-red-500 mb-4">{errors.general}</p>}
      <div className="mb-4">
        <label htmlFor="title" className="block text-lg font-medium">Título</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full bg-black rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-[#FFFAEC] focus:ring-opacity-50"
          required
        />
        {errors.title && <p className="text-red-500 mt-1">{errors.title}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full bg-black rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-[#FFFAEC] focus:ring-opacity-50"
          required
        />
        {errors.description && <p className="text-red-500 mt-1">{errors.description}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium">Ingredientes</label>
        <textarea
          id="ingredients"
          name="ingredients"
          value={formData.ingredients}
          onChange={handleChange}
          className="mt-1 block w-full bg-black rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-[#FFFAEC] focus:ring-opacity-50"
          required
        />
        {errors.ingredients && <p className="text-red-500 mt-1">{errors.ingredients}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium">Image Url (Opcional)</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl === null ? '/default.png' : formData.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full bg-black rounded-md p-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-[#FFFAEC] focus:ring-opacity-50"
        />
        {errors.imageUrl && <p className="text-red-500 mt-1">{errors.imageUrl}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#578E7E] hover:bg-[#FFFAEC] hover:text-black text-[#FFFAEC] font-bold py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:shadow-outline"
      >
        {isSubmitting ? 'Creando...' : 'Crear Receta'}
      </button>
    </form>
  );
}