# Seal Take-home Product Challenge

Congratulations! This is the last stage before the final interview. It's your opportunity show your product skills, so we weight it very highly.

## How to complete this stage of the interview process

1. Please clone this repo into your own private repo
2. Complete the 'Seal product problem' below
4. Invite _hfmw_ to view the repo & put a link in the form [here](https://forms.gle/E9LASH1Nyhoa3pu48)

## Seal product problem

Scientists are automatically uploading their data from bioreactors into Seal. To help you, some example data is already loaded into a table.

In the example data, each row shows the density of the cells and the total volume in the bioreactor at a given point in time.

The scientists want to calculate the cell count at any point in time, as well as being able to see the maximum cell count.

Instead of building in these features, we have identified two higher level features to build which would solve their problem, and would be useful to all of our customers:

1. `Calculation columns`, these are columns in the table that are populated based on a user defined formula e.g. A cell count column that is created by the formula: `Cell Density * Volume` 
2.  A `Column Aggregations` feature which allows a user to perform operations on a selected data column, such as showing the `Maximum Density`, `Minimum Cell Count`, etc...

You have a meeting scheduled with the scientist who is a customer. Build something they will be use on your laptop to give you feedback. Please use <a href="https://blueprintjs.com/">Blueprintjs</a>.

Put any notes and your instructions in the README as well as what you would do next to improve this. Please also answer how you would make it possible to do `Rate of change calculations` e.g. `Rate of Cell Count Growth`

#### FAQS

- Not sure about something? Please ask! Email `will@seal.run.
- How should I communicate? Please over communicate. Please ask questions.
- What are you looking for? The goal is to get feedback on the features specified. It needs to deliver the specified features well, being easy to use and making a good impression on the customer.
- Unsure whether to submit? Would you be happy to sit next to a customer and let them test it on your laptop?
- Ran out of time? Make this clear in the readme, and write out what you would do next.

## Alex Notes

- I've made a good stab at this. I definitely took longer than 2 hours - I'm rusty with react and also haven;t previously used typescript or blueprint. I did however manage to resist adding my favourite css frameworks!
- The application is by no means complete but makes a good demo I think. There's one annoying bug with popups that I can't quite figure out - documentation is limited but I'm using the reccomended approach and have found others using the same approach on GitHub. It could be to do with the custom styles I've used for the scroll container.
- I've been opening the app with 'npm run dev'

### Features added:
- Tabbed layout to view aggregate and main tables - could expand to include e.g. a charting tab
    - Tables now scroll within a container so that tabs and the header are always visible

- Ability to add new, derived columns - also included a default derived column as an example
    - Feature accessed through an 'Add Column' button in the header row of both tables
        - Using this feature will add the column to both tables
    - Derived columns have a right click context menu allowing editing of options and deletion
    - Derived columns can be added, subtracted, multiplied or divided together
        - Some operations are not supported for the time column
    - You can also differentiate data or derived columns with respect to time - currently set to change per hour

- A new 'aggregates' table, with the ability to add rows for the sum, mean, max, min, and count of each column
    - New aggregates can be added via the 'plus' button in the last row of the aggregates table
    - Aggregate rows should in theory be able to be deleted via a context menu (but I can't get this to display properly or at all)

### Next Steps

To continue to build out this application I might implement the following features/fixes

- More robust differentiating derived columns - the current approach only works because the data is already sorted by time
- Implement a charting tab, allowing a user to pick a column for the x axis and several for the y axis
- Fix the popup issue on the aggreagate table row header
- Include support for units and datatypes for more robust derived columns and automatic calculation of data units
- Date formatting options - possibly as another popover context menu on date type columns
- Performance enhancements. I've used a react UseEffect() to ensure table data is only recalculated when different columns or aggregates are selected, but there's room to make calculations more performant still
- The thing could always be prettier as well! The space above the tab headers is begging for a company logo.



