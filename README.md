# 2025SpringSoftDevProject
Project Members: Carter Plenge, Jake Schellhorn, Landon Swavey, Jack Hillman

## We will be making a web page and app for a restaurant. 

### Requirements
- Users must be able to access/see the menu from the website.
- Users should be able to make reservations from the website.
- Employees should be able to see reservations and plan accordingly.
- Users shouldn't be able to access information meant for employees. 

### Sub-objectives (what's the professional terminology for this again?)
- Users should be allowed to make accounts to make future reservations easier. 
- The website should be responsive to the maximum capacity of restaurants to prevent overbooking reservations. 
- Users should be able to reserve their preference for the table. (booth/table/bar/etc)
- The website should have an interactive display of all reservations and locations to inform employees of available tables and reservations easily

## Project Architecture. 
### Webpage
- can be split into front-end and back-end if needed but given the scale of the  project we can keep them bundled in the same repo.
- **Tools/Software we will use: Render**

### Database
- needed for user accounts
- **Tools/Software we will use: MongoDB**

## Getting started.
1. Open a terminal to where you would like to save the project
2. input the following commands
```
### Cloning the repo
git clone https://github.com/2025SpringSoftwareDev/2025SpringSoftDevProject.git

# Navigate to the project folder
cd 2025SpringSoftDevProject

# Set up a virtual environment named env
python -m venv env

# Activate the venv (windows only)
.\env\Scripts\activate

# Install packages (we don't have any packages right now)
pip install -r requirements.txt
```
3. when adding new packages use ```pip freeze > requirements.txt``` to update the requirements.txt
4. wait all the env stuff is irrelevant because we probably won't be using Python. Just js and pug.
5. install node ig.
6. unless we wanna do something different.
   
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
