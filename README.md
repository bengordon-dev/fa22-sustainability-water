# Launder
Convergent Fall 2022, Sustainability Build Team

Tech members: Ben Gordon, Sanat Nair, Jayden Lu, Kush Gandhi, Shanti Chanal

## Backend
[app.py](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/BackEnd/app.py) contains our backend API, done with Flask. Each route contains a call the ERCOT API and some data processing code.
Routes include:
* GET /getCombinedWindandSolar
* GET /getSystemWidePrices/\<region\>

## Frontend
The [Launder](https://github.com/bengordon-dev/fa22-sustainability-water/tree/master/Launder) directory has the most recent frontend code. We started development in Expo, but needed to drop down to the React Native CLI to add notifications and persistent storage.

Major files include:
* [App.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/App.js) contains calls to our API and state management code such as navigation and variables shared between multiple pages.
* [openScreen.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/pages/openScreen.js) is the home page of our app, mostly  containing buttons to navigate to other pages.
* [myInfo.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/pages/myInfo.js) is the place for users to input information about their washing machine and dryer (saved persistently to local storage), and information about their availability for the current and following day.
    * [AvailabilitySelector.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/components/AvailabilitySelector.js) is a component where users input their availability. Due to the differences in how the user inputs availability (in discrete, 30 minute sectors) and how the scheduling algorithm views availability (as ordered pairs of (start time, length)), the state management code is quite complex.
* [Schedule.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/pages/Schedule.js) is the heart of the functionality of the app, containing both the scheduling algorithm and the interface for using it. Users have 9 different settings to run the scheduling algorithm on, and can choose a time from the output to get a notification for. The algorithm works as such:
    * Loop through each availability interval, including intervals from today, tomorrow, or both.
        * Use a sliding-window technique to find the best (lowest total price, highest average renewable energy, or both) washing + drying cycle within the interval. Assume that washing and drying happens immediately back-to-back, and return the start time of that optimal cycle.
    * Return a list of the best times (1 from each interval,) sorted by the same optimization function used to find them in the first place. 
* [Graph.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/pages/Graph.js) contains a simple UI for viewing the data obtained from ERCOT. One graph plots electricity prices vs. time, while another plots combined wind and solar production vs. time. User-specified availability intervals (blue) and the selected washing/drying cycle (orange, if one exists) are overlayed on top to easily show the merits of the time the app chose (and the perils of what it didn't!)
    * [GraphSVG.js](https://github.com/bengordon-dev/fa22-sustainability-water/blob/master/Launder/components/GraphSVG.js) contains the implementation of the graphs in the Data page. No help was obtained from UI libraries, though we did import [react-native-svg](https://github.com/software-mansion/react-native-svg) to get the same level of support for custom SVGs that one has in standard HTML.
