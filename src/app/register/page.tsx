'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.repeatPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error en el registro');
      }
    } catch (error) {
      setError('Error en el registro');
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center">
      <div className="mt-8 w-full max-w-md space-y-8 rounded-xl border border-gray-600 p-10 shadow-md">
        <h2 className="text-center text-3xl font-extrabold">Registro</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                className="mt-1 bg-transparent block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F5ECD5] focus:border-[#F5ECD5]"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                required
                className="mt-1 bg-transparent block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F5ECD5] focus:border-[#F5ECD5]"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 bg-transparent block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F5ECD5] focus:border-[#F5ECD5]"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 bg-transparent block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F5ECD5] focus:border-[#F5ECD5]"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="repeatPassword" className="block text-sm font-medium">Repetir Contraseña</label>
              <input
                id="repeatPassword"
                name="repeatPassword"
                type="password"
                required
                className="mt-1 block bg-transparent w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F5ECD5] focus:border-[#F5ECD5]"
                onChange={handleChange}
              />
            </div>
          </div>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-[#578E7E] hover:bg-[#3c695c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5ECD5] transition-colors duration-150"
          >
            Registrarse
          </button>
        </form>
        <p className='text-center'>Ya tienes una cuenta? <Link href={"/login"} className='font-bold text-[#c5ab6b] transition-colors duration-150'>Iniciar Sesion</Link></p>
      </div>
    </div>
  );
}

