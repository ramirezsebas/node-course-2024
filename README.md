# Sistema de Autenticación y Autorización de Usuarios

Esta aplicación Node.js proporciona un sistema básico de autenticación y autorización de usuarios utilizando Tokens Web JSON (JWT) y bcrypt para el hash de contraseñas. Permite a los usuarios registrarse, iniciar sesión y acceder a rutas protegidas según su rol.

## Configuración

1. Clona este repositorio.
2. Navega hasta el directorio del proyecto.
3. Ejecuta `npm install` para instalar las dependencias.
4. Crea un archivo `.env` en el directorio raíz y agrega las siguientes variables:

- JSON_WEB_TOKEN_SECRET=tu_clave_secreta_aquí
Reemplaza `tu_clave_secreta_aquí` con una clave secreta para la firma del token JWT.

5. Inicia el servidor ejecutando `npm run start:dev`.

## Rutas

### POST /register

Registra un nuevo usuario.

#### Cuerpo de la Solicitud

- `usuario`: Nombre de usuario del usuario.
- `contra`: Contraseña del usuario.
- `role`: (Opcional) Rol del usuario (por defecto es "USER").

### POST /login

Inicia sesión con credenciales existentes y recibe un token JWT para la autenticación.

#### Cuerpo de la Solicitud

- `usuario`: Nombre de usuario del usuario.
- `contra`: Contraseña del usuario.

### GET /productos

Recupera una lista de productos. Esta ruta requiere autenticación de usuario y autorización de administrador.

### GET /health

Comprueba si el servidor está funcionando correctamente.

## Middlewares

### isUserValid

Middleware para verificar si el usuario está autenticado.

### isAdmin

Middleware para verificar si el usuario es un administrador.

## Dependencias

- `express`: Marco web para Node.js.
- `jsonwebtoken`: Para generar tokens JWT.
- `bcrypt`: Para el hash de contraseñas.
- `fs`: Módulo de sistema de archivos para leer y escribir archivos.
- `morgan`: Middleware de registro de solicitudes HTTP para Node.js.

## Seguridad

- Las contraseñas se hashean utilizando bcrypt antes de almacenarse en la base de datos.
- Los tokens JWT están firmados con una clave secreta y tienen un tiempo de expiración corto (1 minuto en este ejemplo).
- Se utilizan funciones de middleware (`isUserValid`, `isAdmin`) para proteger las rutas contra el acceso no autorizado.

## Nota Importante

- Autenticación: Si el usuario no es reconocido, se devuelve un código de estado 401.
- Autorización: Si el usuario es reconocido pero no tiene permiso para acceder a un recurso, se devuelve un código de estado 403.
