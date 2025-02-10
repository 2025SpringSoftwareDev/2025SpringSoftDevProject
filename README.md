# 2025SpringSoftDevProject
Project Members: Carter Plenge, Jake Schellhorn, Landon Swavey, Jack Hillman

## We will be making a web page and app for a restaurant. 

### User Stories grouped by key features:
________________________________________
#### Customer-Facing Features
1. Restaurant Information and Menu
•	As a customer, I want to view the restaurant’s contact information, operating hours, and location so I can easily reach or visit the restaurant.
•	As a customer, I want to browse the menu with detailed descriptions and images of dishes so I can decide what to order.
•	As a customer, I want to filter the menu by dietary preferences (e.g., vegetarian, gluten-free) so I can quickly find suitable options.
2. Reservation System
•	As a customer, I want to check table availability for a specific date and time so I can plan my visit accordingly.
•	As a customer, I want to book a table online and receive a confirmation so I can avoid waiting when I arrive.
3. Payment Information
•	As a customer, I want to securely save my payment details so I can quickly pay for orders in the future.
•	As a customer, I want multiple payment options (e.g., credit card, digital wallets) so I can pay in my preferred way.
4. Order Tracking
•	As a customer, I want to place an order online for pickup or delivery so I can enjoy the restaurant’s food at my convenience.
•	As a customer, I want to track the status of my delivery order in real-time so I know when to expect it.

5. Rewards Program
•	As a customer, I want to sign up for a rewards program so I can earn points for my purchases.
•	As a customer, I want to view my reward points balance so I know when I can redeem them.

________________________________________
#### Staff and Manager Features
1. Menu and Inventory Management
•	As a manager, I want to update the menu with new items or prices so the menu is always accurate.
•	As a manager, I want to track inventory levels and receive alerts for low-stock items so I can prevent shortages.
2. Scheduling and Employment Management
•	As a staff member, I want to view my work schedule so I know when I am expected to work.
•	As a manager, I want to assign shifts and notify staff of changes so I can ensure proper staffing at all times.
3. Table Management
•	As a staff member, I want to view current table assignments and reservations so I can efficiently manage seating.
•	As a manager, I want to adjust table layouts and availability in real-time to accommodate varying customer demands.
________________________________________
#### Admin Features
1.	Staff and Sale Management
•	As an admin, I want to manage user roles and permissions (e.g., customer, staff, manager) so each user has access to the appropriate features.
•	As an admin, I want to generate reports on sales, customer activity, and inventory so I can make informed business decisions.



## Project Architecture. 
### Web App
- We will be using what we learned in WebApps. (pug and js) to build the Web App
- **Tools/Software we will use: Pug, JS, host on Render**

### Database
- needed for accounts (User, Employee, Supervisor)
- menu items
- **Tools/Software we will use: MongoDB**
### App
- Only if we have time
- I got no expereince here so someone else can write something or we can figure it out when we get there
### Project organization
Please refer to the following to keep our project organized

```
Project Root
├── assignment documents # a folder for submission files.
├── bin  # dont touch
│   ├── www  # dont touch
├── controllers  # for future backend logic
├── models  # Database schemas 
│   ├── employees.js  
│   ├── menuItems.js  
│   ├── user.js  
├── node_modules  # Dependencies, auto-managed by npm. dont touch dont commit
├── public  # (Static assets)  
│   ├── HTML  # Static HTML pages (pages that dont change)
│   │   ├── aboutus.html  
│   ├── images  # All images for the project
│   ├── stylesheets  # CSS files 
│   │   ├── style.css  # main stylesheet
│   │   ├── navigationBar.css # if needed we can break it into componets as such
├── routes  # API and page routing
│   ├── api.js  
│   ├── index.js  
│   ├── user.js  
├── views  # Dynamic pages (pug or html) 
│   ├── login.pug
│   ├── signup.pug
│   ├── homepage.html
├── app.js  # Main Express server file
├── .env # stores secrets that we dont want shared. 
├── .gitignore # use to prevent files from being commited/tracked by git
├── package-lock.json # npm stuff, shouldnt need to touch
├── package.json # npm stuff, shouldnt need to touch
├── README.md # use to communicate info regarding running/working on the project
```

## Getting started.
1. Open a terminal to where you would like to save the project
2. input the following commands
```
### Cloning the repo
git clone https://github.com/2025SpringSoftwareDev/2025SpringSoftDevProject.git

# Navigate to the project folder
cd 2025SpringSoftDevProject
```
5. install [node.js](https://nodejs.org/en/download).
6. use npm start, 
   
### Merge Conflicts
good luck lol

### Branches
- Given the scale of the project we can get away without using branches but if you guys want the practice then here's how we do it. 
- We can use branches to develop features then merge the branch to main once the feature is completed. 
- This allows us to reduce merge conflicts and avoid convoluting the main branch's comment history.
#### Creating a new branch.
  ```
  git checkout -b <branch-name>
  ```
#### Changing a branch.
  ```
  git checkout <branch-name>
  ```
#### Creating a pull request.
1. Ensure you pushed and tested all changes
2. Go to the GitHub repo page and click "Pull request"
3. Select your branch as the source and the main branch as the destination
4. Fill out the info and submit the pull request.
5. Since we don't have any live features or customers you can just accept the pull request yourself without peer review. If you break anything o well there is no collateral to be had. 

## Notes: 
- None of this has been confirmed and reviewed by the group as a whole.
- If there is anything incorrect in this read me then fix it.
- The first person to commit a secret will be sacrificed.
- May we all be blessed with many naps and colorful crayons.
