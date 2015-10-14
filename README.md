# Deskbookers Back-end Developer Trial

Hi Back-ender!

Great that you're interested in this exercise! Thanks a lot for making it. The exercise exists of a few assignments. They are related to the Deskbookers way of working. Good luck and we are looking forward to hearing from you soon!

To complete these assignments you need to **fork** this repo. When you're done you can push your changes to your own repo (and let us know where to find it ofcourse).

For this assignment it's necessary to have a working webserver with PHP support. You can use your own web server (if you have one) or use XAMP (https://www.apachefriends.org/index.html) to install one on your own machine.

## Assignment 1: Create a LTV Report (SQL)

For this assignment you need to implement a LTV (Life Time Value) report. To create this report you need to alter [index.php](assignment1/index.php) in a way you have the most optimial solution to calculate the report. Try to write as least as possible SQL queries by smartly loop through data.

The report should be made in a way it is easy to run the report for 3, 12 or 18 months. This could be done in the code by using variables. Bonus points if you use a form to say which period and commission should be used.

**What is a LTV Report?**

A LTV report gives a grouped overview of booking counts and turnover for a specific period and the start of those periods. What the report shows is when a booker had their first booking in a specific month, how many bookings and how much turnover the booker generates on average for a specific period (duration).

The most important part of the report is the LTV (Life Time Value). This value says that when the first booking happened in a specific month, for a life time of a specific length, what is the actual 'profit' we make on this booker. We define 'profit' as the commission we make over the booking. For this exercise let's say the commission is 10%.

This kind of reports are typically run over different periods: 3 months, 12 months and 18 months. So when you run the report over a period of 18 months it shows all bookers who 18 months ago (or longer) had their first booking aggregated per start month.

Let's illustrate this with an example (with a period of 18 months and a commission of 10%):

| Start      | Bookers  | # of bookings (avg) | Turnover (avg) | LTV    |
|------------|---------:|--------------------:|---------------:|-------:|
| Aug 2013   | 145      | 10.6                | 375.04         | 37.50  |
| Sep 2013   | 57       | 15.3                | 1139.70        | 113.97 |
| ...        |          |                     |                |        |

This report shows that 145 bookers had their first booking in August 2013, in 18 months they made an average of 10.6 bookings and with an average turnover of 375.04 euro. If we get a commission of 10% of this turnover that means that over a period of 18 months we make an average of 37.50 per booker. So for August 2013, with a life time of 18 months, bookers have a LTV of 37.50 euro.

**Side notes**

* Be aware that there is a difference between when a booking is created (bookings.created) and when a booking actually takes place (bookingitems.start_timestamp, bookingitems.end_timestamp). With 'a booking happend in month X' we mean the end time of the booking(item) is in that month.
* For this report when we talk about a 'booking' we mean a booked space, not a booked product.
