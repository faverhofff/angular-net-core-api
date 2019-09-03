# angular-net-core-api
Examen remoto


# Instalacion

## Frontend [Angular]

npm install

ng server

http://localhost:4200


## Backend [.Net Core]

Instalar dependencias de NuGet

Configurar en el proyecto Web-Api el fichero   "appsettings.json". Dentro modificar la llave "IdentityConnection" con la direccion del servidor sql. 

Correr migraciones, ejecutando "update-database" en la consola de NuGet.

F5, correr.

NOTAS:

1) Las images subidas, se guardan en la carpeta Web-Upload/Upload. El nombre del fichero es el Id del usuario modificado.

2) En caso de que la migración no funcione, en la raiz de la carpeta "backend [.net core]" se encuentra el fichero examen-bd.sql, para resturar la base de datos.