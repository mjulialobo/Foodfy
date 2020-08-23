
<h1 align="center">
<img src="https://github.com/mjulialobo/Foodfy/blob/master/public/assets/logo.png"/>
  <br>
  <br>
  <img src="https://github.com/luskafaria/foodfy/blob/master/public/assets/chef.png" alt="FOODFY LOGO" width="200">

<br>  
<br>
Final Challenge of Launchbase!
</h1>

<p align="center">#Fullstack project developed as approval criteria for <a href="https://rocketseat.com.br/">Rocketseat's </a> Launchbase bootcamp. </p>
<p align="center">Thanks to  <a href='https://github.com/maykbrito/'>Mayk Brito</a> for the dedication and amazing classes during the bootcamp!</p>

<hr />

<h2> <img src= "https://img.icons8.com/plasticine/2x/rocket.png" width="50px" height="50px" align="center"/> What we created? </h2>



<p> Foodfy is a recipe website created using:

- [Node.js](https://nodejs.org/en/) 
- [PostgreSQL](https://www.postgresql.org/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [Faker.js](https://github.com/marak/Faker.js/)
- [Lottie](https://github.com/airbnb/lottie-web)
  

<p> <strong> What we have so far:</strong> recipes and chefs organized in a database, restrict manager area where recipes can be created and updated, and chefs can be created. In my most recent updated, I implemented an option to upload recipes and chefs images. The next step is to create a login area, controll user session, and finish the database funcions. </p>


<h2> <img src="https://i.dlpng.com/static/png/6577858_preview.png" width="50px" align="center"/> How to use? </h2>
   

 <h4> You need the following tools installed in order to run this project:</h4>
 <p> <a href="https://nodejs.org/en/"> Node.js+NPM</a>, <a href="https://www.postgresql.org/download/"> PostgreSQL</a>, and  <a href="https://www.electronjs.org/apps/postbird"> Postbird.</a> </p>


1. Fork this repository and clone it into the current directory

  ```bash
  git clone https://github.com/mjulialobo/Foodfy
  ```


2. Install dependencies

 ```bash
 npm install
  ```


3. Set up the database

  ```bash
  psql -U <username> -c "CREATE DATABASE foodfy"
  psql -U <username> -d foodfy -f foodfy.sql
  ```

  You can manually import the foodfy.sql to Postbird, remember to create a new database with the name Foodfy.

  ```bash
  Important!
  You have to alter the db.js, located in src/config to match your PostgreSQL settings.    
  You also have to alter the mailer.js, located in src/lib to match your Mailtrap settings.  
  ```

4. Populate it with Faker.js
  ```bash
  node seed.js
  ```
  ```bash
  Important!
  Every Faker user password is "pass" and every single one of them have administrator status.   
  ```

5. Add an Image to public/images
  ```bash
  Add, if it does not already exist, an image of your choice to the public / images folder and use the name 'placeholder.png'. 
  This file will be used as an image for all the chefs and recipes in Foodfy;
 ```
   ```bash
  Be careful when excluding users and chefs, as we are using the same placeholder for avatars and recipe images.
  Remember to create a new file named 'placeholder.png' in the public / images folder whenever you delete a chef or recipe.
   ```
6. Fire up the server and watch files

  ```bash
  npm start
  ```
   
   
   <h2> <img src="https://img.icons8.com/ios-filled/50/000000/project.png" width="50px" align="center"/> Results </h2>
   
   <h4>Foodfy</h4>
   <h4>Foodfy | User session</h4>
   <h4>Foodfy | Details </h4>
 
