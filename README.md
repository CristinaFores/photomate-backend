# Photomate

# CRUD BACK

## Produccion
ð«[Back deploy on Render](https://https-cristina-fores-final-project.onrender.com)

ð«[Photomate app](https://photomate-cristina.netlify.app/)

## Repository

ð«[Repository Frontend](https://github.com/CristinaFores/photomate-fronted)

ð«[Repository Backend](https://github.com/CristinaFores/photomate-backend)

## Sonar

â[Sonar Backend](https://sonarcloud.io/project/overview?id=isdi-coders-2022_Cristina-Fores_Back-Final-Project-202209-BCN)

â[Sonar Frontend](https://sonarcloud.io/project/overview?id=isdi-coders-2022_Cristina-Fores_Front-Final-Project-202209-BCN)

## Enpoints

## User

â¡[POST]/user/register â¡ï¸ user registration status: 201 ð¢

â¡[POST]/user/loginâ¡ï¸ login of the logged in user status:200ð¢

ð[PUT]/users/user:idâ¡ï¸ modify user's own profile status 201ð¢ (nice to have)ð¬

## Post

- Explore community home page :

ð[GET]/users/posts/explore â¡ï¸list of user posts status:200ð¢

- Search by tag tag:

ð[GET]/posts?tag=<> â¡ï¸list of posts by tags(?username) status:200ð¢

- View the user's profile with their posts

ð[GET]/users/:id/posts User â¡ï¸ list of users' profiles with their postsstatus:200ð¢(nice to have)ð¬

- See detail of the publication

ð[GET]/posts/:id Postâ¡ï¸ Show post status details:200ð¢

- Create a post with images and post title, text, location,
  label

â¡[POST]/post â¡ï¸ create new post status:201ð¢

- Like or dislike a post

â¡[POST]/post/:id/like â¡ï¸ create new post status:200ð¢

- PUT-update.

ð[PUT]/posts/:idâ¡ï¸ modify post status:201ð¢

- DELETE: deletes a resource or a collection.

ðª[DELETE]/posts/id:â¡ï¸ delete post status:200ð¢
#photomate
