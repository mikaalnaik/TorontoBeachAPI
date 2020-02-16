# Toronto Beach 
&nbsp;

The easiest way to access **The City of Toronto's** Open Data beach data API.


&nbsp;

# Getting Started



### Installation

&nbsp;
Super easy, first run this:

    npm install torontobeach


Then to use:

    import torontobeach from 'torontobeach';

That's it!

 Now start using it with the functions and documentation below. 


&nbsp;

# Usage



### We are fetching data here, so we're returning promises.
&nbsp;
Using promises:


    torontobeach.getAllBeachesLatest()
	    .then(response => {
		   doCoolStuffWithData(response);
	    });


Using Async/Await

    const beachData = await torontobeach.getAllBeachesLatest();

&nbsp;

All good? Awesome. Onto the good stuff.
&nbsp;

# Methods


A couple of ideas that will make this make more sense, hopefully.
&nbsp;
&nbsp;
Do you want:
### A specific beach or all of them?
### And a specific time frame, or all time?

&nbsp;
A sample response of a single data point.:


   
```
const response = [
	...,
	{
		beachID: 4,
		name: 'Gibraltar Point Beach',
		map: 'https://www.google.com/maps?saddr=My+Location&daddr=43.612487,-79.382173',
		sampleDate: '2019-09-02',
		publishDate: '2019-09-04',
		eColiCount: 11,
		beachAdvisory: "E.coli levels are within the City of Toronto's established beach water quality standard of 100 E.coli per 100ml of water.",
		beachState: 'Safe'
	},
	...,
]
```

Latest reading for all beaches

    getAllBeachesLatest();

&nbsp;

All time data for all beaches

    getAllBeachesAllTime();

&nbsp;

All beaches between two dates.




    getAllBeachesAllTime('YYYY-MM-DD', 'YYYY-MM-DD');

&nbsp;

All good? Awesome. Onto the stuff you want.
&nbsp;