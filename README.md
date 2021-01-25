# datawharehouse
Proyecto Acamica Data Wharehouse 

## Requisitos

### Instalar NodeJS
Nodejs es un entorno JavaScript que nos permite ejecutar en el servidor, de manera asíncrona, con una arquitectura orientada a eventos y basado en el motor V8 de Google.
  - [Descargar Nodejs](https://nodejs.org/en/download/)

### Instalar MongoDB en MS Windows

  **1) Obtener el instalador para Windows. [Descargar MongoDB](https://www.mongodb.com/try/download/community).**
  
  **2) Iniciar el instalador como administrador.**
  
  **3) Crear las carpetas de almacenamiento y configuración de MongoDB en el disco raíz.**
  
  * Dar permisos de escritura y lectura a estas carpetas

```
C:\data
C:\data\db
```
## Despliegue
  **1) Clonar el proyecto**

* Clonar el repositorio desde github accediendo al link: [DataWharehouse](https://github.com/seba365/datawharehouse)
* Desde la consola ejecutar el comando:
```
git clone https://github.com/seba365/datawharehouse.git
```

**2) Instalar dependencias**
```
npm install
```

**3) Iniciar el servicio de MongoDB ejecutando el comando mongod desde una terminal.**

**4) Iniciar el servidor**

```
npm run start
```
ó
```
node ./src/index.js
```
**5)
## Recursos y tecnologías utilizadas
* Node
* Postman
* MongoDB
* NPM PACKAGES:
  * Express
  * Nodemon
  * Jsonwebtoken
  * Dotenv
  * Mongoose
  * Bcryptjs
  * Cors
  * Multer

## Autor
**Díaz Sebastian** - [Github seba365](https://github.com/seba365).
