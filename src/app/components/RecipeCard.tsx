"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Recipe } from "../types/types"

type RecipeCardProps = {
  recipe: Recipe
  currentUserId: string | null
  onRatingChange: () => void
  onDelete: (id: string) => void
  isPublic?: boolean
}

export default function RecipeCard({ recipe, currentUserId, onRatingChange, onDelete }: RecipeCardProps) {
  const [isRating, setIsRating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleRating = async (rating: number) => {
    if (recipe.userId === currentUserId) return

    setIsRating(true)
    const token = localStorage.getItem("token")
    const response = await fetch(`/api/recipes/${recipe._id}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating }),
    })

    if (response.ok) {
      onRatingChange()
    }
    setIsRating(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const token = localStorage.getItem("token")
    const response = await fetch(`/api/recipes/${recipe._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      onDelete(recipe._id)
    } else {
      alert("Error al eliminar la receta")
    }
    setIsDeleting(false)
    setShowModal(false)
  }

  return (
    <>
      <div className="flex relative w-full items-center gap-4 shadow-md rounded-lg p-4 mb-4 border border-gray-600">
        <div className="mb-4">
          <Image
            src={!recipe.imageUrl ? "/default.png" : recipe.imageUrl}
            alt={recipe.title}
            width={100}
            height={100}
            className="rounded-lg object-cover w-48 h-fit"
          />
        </div>
        <div className="relative">
          <p className="text-gray-500 mb-2">@{recipe.author}</p>
          <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
          <p className="mb-2">{recipe.description}</p>
          <div className="flex items-center mb-2">
            <span className="mr-2">Calificación:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                disabled={isRating || recipe.userId === currentUserId}
                className={`text-2xl ${star <= recipe.averageRating ? "text-yellow-500" : "text-gray-300"} ${recipe.userId === currentUserId ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                ★
              </button>
            ))}
            <span className="ml-2">({recipe.averageRating ? recipe.averageRating.toFixed(1) : "0.0"})</span>
          </div>
          <Link href={`/recipe/${recipe._id}`} className="text-gray-500 font-semibold hover:underline">
            Ver detalles
          </Link>
          {currentUserId === recipe.userId && (
            <div className="flex mt-4">
              <Link
                href={`/recipe/edit-recipe/${recipe._id}`}
                className="text-gray-300 mr-7 bg-gray-700 p-2 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 hover:scale-105 transition-all duration-150"
                >
                  <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                </svg>
              </Link>
              <button onClick={() => setShowModal(true)} className="bg-red-500 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 hover:scale-105 transition-all duration-150"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col bg-[#222831] w-9/12 md:w-1/3 p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
            <p className="mb-4">¿Estás seguro de que quieres eliminar esta receta?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}