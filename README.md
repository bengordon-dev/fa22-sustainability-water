# Launder
Convergent Fall 2022 

Tech members: Ben Gordon, Sanat Nair, Jayden Lu, Kush Gandhi, Shanti Chanal

## Backend
[app.py](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/BackEnd/app.py) contains our backend API, done with Flask. Each route contains a call the ERCOT API and some data processing code.

## Frontend
The [Launder](https://github.com/bengordon-dev/fa22-sustainability-water/tree/master/Launder) directory has the most recent frontend code. We started development in Expo, but needed to drop down to the React Native CLI to add notifications and persistent storage.

Major files include:
* [App.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/App.js) contains calls to our API and state management code such as navigation and variables shared between multiple pages.
* [openScreen.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/pages/openScreen.js) is the home page of our app, mostly  containing buttons to navigate to other pages.
* [myInfo.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/pages/myInfo.js) is the place for users to input information about their washing machine and dryer (saved persistently to local storage), and information about their availability for the current and following day.
    * [AvailabilitySelector.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/components/AvailabilitySelector.js) is a component where users input their availability. Due to the differences in how the user inputs availability (in discrete, 30 minute sectors) and how the scheduling algorithm views availability (as ordered pairs of (start time, length)), the state management code is quite complex.
* [Schedule.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/pages/Schedule.js) is the heart of the functionality of the app, containing both the scheduling algorithm and the interface for using it.  
* [Graph.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/pages/Graph.js) contains a simple UI for viewing the the electricity price and renewable energy production data obtained from ERCOT, with availability intervals (blue) and a selected washing/drying interval (orange, if one exists) overlayed on top.
    * [GraphSVG.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/components/GraphSVG.js) contains the implementation of the graphs in the Data page. No help was obtained from UI libraries, though we did import [react-native-svg](https://github.com/software-mansion/react-native-svg) to get the same level of support for custom SVGs as one has in standard HTML.
