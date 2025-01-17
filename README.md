# Foodly

## Funcionalidades principales

- **Registro e inicio de sesión**: Crea tu cuenta o inicia sesión para acceder a todas las funcionalidades de la aplicación.
- **Explorar recetas**: Descubre una variedad de recetas compartidas por otros usuarios.
- **Crear recetas**: Comparte tus propias recetas y edítalas en cualquier momento.
- **Valorar recetas**: Califica las recetas con un sistema de estrellas para ayudar a otros a elegir las mejores opciones.

Deploy: https://terrand-challenge.vercel.app/

## Tecnologías utilizadas

- **Frontend**:

  - [Next.js](https://nextjs.org/) (Framework de React)
  - TypeScript (para un desarrollo más robusto y tipado)
  - Hero UI (componentes estilizados y Skeleton para pantallas de carga)

- **Backend**:

  - API Routes de Next.js (para endpoints del servidor)
  - Cookies HTTP-only (para una autenticación segura)

- **Base de datos**:

  - MongoDB (almacenamiento de recetas y usuarios)

- **Autenticación**:

  - Manejo de tokens seguros para sesiones de usuario

---

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/) como gestor de paquetes

---

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/joelwaiman/terrand-challenge.git
   ```

2. Ingresa al directorio del proyecto:

   ```bash
   cd foodly
   ```

3. Instala las dependencias necesarias:

   ```bash
   npm install
   # o
   yarn install
   ```

4. Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

   ```env
   MONGODB_URI=tu_cadena_de_conexion_mongodb
   JWT_SECRET=tu_clave_secreta
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

5. Ejecuta el proyecto en modo desarrollo:

   ```bash
   npm run dev
   # o
   yarn dev
   ```

6. Abre tu navegador e ingresa a `http://localhost:3000` para ver la aplicación en funcionamiento.

---

## Prueba técnica

Este proyecto es el resultado de una prueba técnica enfocada en demostrar habilidades en:

- Desarrollo frontend con React y Next.js
- Implementación de API Routes para el backend
- Almacenamiento de usuarios y recetas en MongoDB
- Uso de TypeScript para asegurar tipado estático
- Gestión de estados con hooks personalizados
- Buenas prácticas en el desarrollo de software

Si deseas saber más o necesitas detalles adicionales, no dudes en preguntar.

---

## Contacto

Para cualquier consulta, puedes contactarme a través de:

- **Correo**: [waimanjoel@gmail.com](mailto\:waimanjoel@gmail.com)
- **GitHub**: [joelwaiman](https://github.com/joelwaiman)
- **LinkedIn**: [Waiman Joel](https://linkedin.com/in/tu-usuario)

---

¡Gracias por explorar Foodly! 🍲