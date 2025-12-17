Proyecto para consumir API de classroom

Antes se debe entrar a la consola de gCloud y generar un nuevo proyecto
Crear credenciales de OAuth2.0 y descargar el json el cual debe quedar guardado como credentials.json

ejecutar npm install
Iniciar el server con node server.js
navegar a http://localhost:3000/auth
se genera una URL como response. Navegar alli y seguir proceso de auth
al finalizar debe decir token creado correctamente, esto genera un archivo token.json

A partir de aqui, ya se puede consumir las rutas

http://localhost:3000/courses
Trae todos los cursos dados de alta en la cuenta

Ver demas rutas en server.js y agregar estructura a futuro