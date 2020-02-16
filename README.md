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


