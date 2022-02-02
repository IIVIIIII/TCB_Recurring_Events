# TCB_Recurring_Events

This repository represents a summary of my contributions to The Comedy Bureau’s website redesign. It is not to be mistaken for the repo of the website itself, which is still being developed and is not yet ready for public observation.

My task was to create a data model that could manage recurring events, successfully query the created database from the website, and generate all individual instances of each queried parent event in accordance with their designated recurrence pattern.

The final database is stored with Supabase and involves two separate tables: one called “events” that holds all data for parent events along with their recurrence pattern, and another called “exceptions,” which holds exceptions to the recurrence pattern of events linked to by the “parent_event_id” as a foreign key. The model can be visualized as such:

*image*

The jupyter notebook titled “data_processing” approximates the effect of consolidating all instances of “open mic” events as they were previously stored by the company into single rows comprised of all instances that could otherwise be communicated through one recurrence pattern. As can be seen below, wherein the “OGs” and “OMs” dataframes store all events pre- and post- consolidation, respectively, the implementation of recurring events reduces the total number of events stored by 38%. The before and after states of open mics at “Echoes on Pico,” initially the most populous event, best illustrate the effects of event consolidation and will serve as the example for how events are ultimately entered, queried, and generated.

*image*

First, the data is entered into Supabase as one event from March 14th to March 20th with one exception on the 15th:

*image*

When the website prompts Supabase to perform the query as defined in the SQL function below, it returns all data for events within the dates entered as arguments.

*image*

The website's internal JavaScript logic then generates the dates for all relevant instances of the event according to its extracted recurrence pattern and stores them in an array matched to the key of  “dates_.” This logic without context of its website can be viewed in the “events.js” file. The result for “Echoes on Pico” would appear as follows:

*image*
