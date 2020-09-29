# Hours Calculator App
**Version 1.0.0**
General project notes and basic app functionality.


#### The Project
---
I wanted to create something of my own to familiarise myself with both the technologies I have been learning and the use of RESTful routing in creating a CRUD application. This was built using NodeJS, Express, MongoDB/Mongoose and utilises HTML, CSS & Javascript.

This web app is for my girlfriend and a few friends who still keep track of all their shifts using pen and paper.

#### Functionality
---
The app works like so;
* Register/Login
* Add a new shift (date, start time, end time and lunch/break time). See tool tips on required format and examples.
* The shift is displayed in a table for the month which calculates the true hours worked minus lunch breaks. The total for the month is displayed at the bottom.
* From there you can edit or destroy any shift added.

#### Discoveries
---
Completing this project has given me a much deeper understanding of all the technologies used. Some key points of development were:
* Searching through MongoDB docs in order to target/edit specific key/value pairs as well as utilising sorting methods.
* Identifying cross-browser compatibility issues with 'time' inputs and creating a suitable javascript alternative to fix the problem.
* Creating all functions that control how user input is converted into time,  formatted, then displayed, taking into consideration the differing calculations required for day/night shifts.
* Adding frontend functionality with a serverside app. Click events, page loads, tooltips, form validation.
* Creating user authentication and tying other model data to users.

##### License & Copyright
© Ruari Douglas 
















