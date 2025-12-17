Proyecto para consumir API de classroom

Antes se debe entrar a la consola de gCloud y generar un nuevo proyecto
Crear credenciales de OAuth2.0 y descargar el json el cual contiene las credenciales a utilizar
Estas se deben llenar en el .env

ejecutar npm install
Iniciar el server con node server.js
navegar a http://localhost:3000/auth
nos redirige a acceder con google. Esto creara un archivo token.json
al finalizar debe decir ✅ Autenticación completada, esto genera un archivo token.json
Podemos solo cerrar esta pagina...

A partir de aqui, ya se puede consumir las rutas

http://localhost:3000/classroom/courses
Trae todos los cursos dados de alta en la cuenta

Ver demas rutas en routes y agregar mas rutas a utilizar