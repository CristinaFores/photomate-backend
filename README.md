# Photomate

# CRUD BACK

## Produccion
💫[Back deploy on Render](https://https-cristina-fores-final-project.onrender.com)

💫[Photomate app](https://photomate-cristina.netlify.app/)

## Repository

💫[Repository Frontend](https://github.com/CristinaFores/photomate-fronted)

💫[Repository Backend](https://github.com/CristinaFores/photomate-backend)

## Sonar

✅[Sonar Backend](https://sonarcloud.io/project/overview?id=isdi-coders-2022_Cristina-Fores_Back-Final-Project-202209-BCN)

✅[Sonar Frontend](https://sonarcloud.io/project/overview?id=isdi-coders-2022_Cristina-Fores_Front-Final-Project-202209-BCN)

## Enpoints

## User

⚡[POST]/user/register ➡️ user registration status: 201 🟢

⚡[POST]/user/login➡️ login of the logged in user status:200🟢

📝[PUT]/users/user:id➡️ modify user's own profile status 201🟢 (nice to have)💬

## Post

- Explore community home page :

📍[GET]/users/posts/explore ➡️list of user posts status:200🟢

- Search by tag tag:

📍[GET]/posts?tag=<> ➡️list of posts by tags(?username) status:200🟢

- View the user's profile with their posts

📍[GET]/users/:id/posts User ➡️ list of users' profiles with their postsstatus:200🟢(nice to have)💬

- See detail of the publication

📍[GET]/posts/:id Post➡️ Show post status details:200🟢

- Create a post with images and post title, text, location,
  label

⚡[POST]/post ➡️ create new post status:201🟢

- Like or dislike a post

⚡[POST]/post/:id/like ➡️ create new post status:200🟢

- PUT-update.

📝[PUT]/posts/:id➡️ modify post status:201🟢

- DELETE: deletes a resource or a collection.

🪄[DELETE]/posts/id:➡️ delete post status:200🟢
#photomate
