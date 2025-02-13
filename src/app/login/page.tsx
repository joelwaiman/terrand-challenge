'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // COVERTIMOS A CASE SENSITIVE EL INPUT DEL EMAIL
    setFormData({
      ...formData,
      [name]: name === 'email' ? value.toLowerCase() : value,
    });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const { token } = await response.json();
        login(token);
        router.push('/feed');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error en el inicio de sesión');
      }
    } catch (error) {
      setError('Error en el inicio de sesión');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center overflow-auto">
      <div className="w-full max-w-md space-y-8 rounded-xl p-10 shadow-md border border-gray-600">
        <h2 className="text-center text-3xl font-extrabold">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
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
          </div>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold bg-[#578E7E] hover:bg-[#3c695c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5ECD5] transition-colors duration-150"
          >
            {!loading ?
              <p>Iniciar Sesión</p>
              :
              <div className="w-5 h-5 border-4 border-t-[#578E7E] border-gray-300 rounded-full animate-spin" />
            }

          </button>
        </form>
        <p className='text-center'>Aún no tienes una cuenta? <Link href={"/register"} className='font-bold text-[#c5ab6b] transition-colors duration-150'>Registrate</Link></p>
      </div>
    </div>
  );
}