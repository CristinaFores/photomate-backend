# Photomate

# CRUD BACK

## Links

💫[Back deploy on Render](https://cristina-fores-final-project-202209.onrender.com/)

💫[Photomate app](https://cristina-fores-final-project-202209.netlify.app/)

## Enpoints

## Usuario

⚡[POST]/user/register ➡️ registro usuario status: 201 🟢

⚡[POST]/user/login➡️ login del usuario logueado status:200🟢

📝[PUT]/users/user:id➡️ modificar perfil del propio usuario status 201🟢 (nice to have)💬

## ITEM PRINCIPAL PUBLICACIONES.

    * Explorar comunidad pagina principal :

📍[GET]/users/posts/explore ➡️listado de publicaciones de los usuarios status:200🟢

- Bucar por etiqueta tag:

📍[GET]/posts?tag=<> ➡️listado de publicaciones por etiquetas(?nombre usuario) status:200🟢

    * Ver el perfil del usuario con sus publicaciones

📍[GET]/users/:id/posts User ➡️ listado del perfil de usarios con sus puclicacionesstatus:200🟢(nice to have)💬

    * Ver detalle de la publicacion

📍[GET]/posts/:id Post➡️ Mostrar detalles del post status:200🟢

    * Crear una publicacion con imagenes y titulo del post, texto, ubicacion,
    	etiqueta

⚡[POST]/post ➡️ crear nueva publicacion status:201🟢

- Darle like o dislike a una publicacion

⚡[POST]/post/:id/like ➡️ crear nueva publicacion status:200🟢

     * PUT-actualización.

📝[PUT]/posts/:id➡️ modificar la publicacion status:201🟢

    * ELIMINAR: elimina un recurso o una colección.

🪄[DELETE]/posts/id:➡️ eliminar el post status:200🟢
