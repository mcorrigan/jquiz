jQuiz for jQuery ReadMe

Thank you for purchasing jQuiz for jQuery. In this directory you will find several 
files and folders which have been created to give you an idea of how jQuiz can work. 
This example uses PHP ActiveRecord library to quickly implement objects which relate 
to records in the database. PHP ActiveRecord requires version PHP 5.3 or greater. 

REQUIREMENTS
jQuery Library (version 1.3+)
jQuery UI Library (compatible with jQuery version being used, Only required for Ordered List)
MySQL 5+ (Only required for the example)
PHP 5.3+ (Only required for the example)

INSTALLATION
To install the provided example:
1. Place the jquiztool directory somewhere in your web root folder
2. Create a new database called "jquiz" and import the jquiz.sql file into it. This 
will have the basic structure and a limited amount of data. 
3. Configure PHP in the example to use this database by updating the defined constants 
in the config.php file.
4. Update the index.php file, and set the interface value to the full web path to your
interface.php file. 

You're done! At this point, you should be able to navigate to the web folder via 
your local web server alias or IP. (i.e. http://localhost/jquiztool/index.php)

NOTE: This example clears out user responses from the database when the HTML page is 
loaded to allow you to progress through the quiz. In order to allow randomized 
questions, MySQL has to filter the questions which the user has already answered. Once 
these responses have been recorded, you will get a primary key conflict if you run the 
demo twice without clearing out the demo user's responses.

FILES & FOLDERS
Here is a quick review of the files in this folder.

css/
This folder contains the main jQuiz cascading style sheet and a images directory 
relative to it. 

images/
This folder is used by the demo to store graphics for Hot Spot questions.

js/
This folder contains the jQuiz JavaScript file (the jQuery plug-in). There is also a 
version of jQuery however the example is currently set to use Google APIs CDN hosting 
the newest file of jQuery and jQuery UI. Please note that jQuery UI is only required 
if you plan to use the Ordered List question type. jQuiz will continue to function 
without the jQuery UI library but will throw warnings if it tried to render a question 
that requires the jQuery UI library.

models/
These are ActiveRecord models that correlate to the database tables. These are only
needed for the example.

php-activerecord/
This directory contains the PHP ActiveRecord library. This is only needed for the 
example.

config.php
This file has the basics for connecting to the database via mySQL and instantiation of 
the PHP ActiveRecord library. This is only needed for the example.

index.php
This is the bare bones HTML file showing how to embed the jQuiz component on your web 
page. Many different properties can be controlled here per jQuiz instance. For a 
complete list, view the js/jquery.jquiztool-dev.js file.

interface.php
This file contains a little bit of programming showing how answers can be collected and 
how questions can be requested via the interface. You should receate this as is needed
for your project.

jquiz.sql
This file has the SQL structure and demo data for the example. This expects the database 
to be named "jquiz".

jQuiz CONFIGURABLE PROPERTIES
quiz_id : string/int - This is a unique identifier for this quiz used by the server side code when storing responses.
interface : string 	- This is the full path to the server script handling storing responses and getting questions.
type : string 		- This is how the data will be transferred to the interface file (GET or POST)
language : string	- This will be passed to the interface in order to load the correct language questions
width: int 			- This is the fixed width of the jquiz component (i.e. 450)
height : int 		- This is the fixed height of the jquiz component (i.e. 440)
csrf_token : string 	- This allows a csrf_token to be set when the quick is generated which will be passed with each request to the interface.
animate_ui : boolean	- This determines if the interface is to use animations when switching questions, displaying results, etc.
title : string 			- This is displayed in the title area by the jQuiz component
checking_text : string 	- This is displayed when an answer is being checked against the server
correct_text : string 	- This is displayed when the user get's the answer correct
incorrect_text : string 	- This is displayed when the user gets an answer wrong
info_text : string		- This is displayed when a free response is saved (ungraded input, i.e. essay)
loading_text : string 	- This is displayed when the quiz is loading information from the interface
check_ans_text : string 	- This is displayed on the button used to check an answer
next_btn_text : string 	- This is displayed on the button used to navigate forward to the next question
orderlist_hint : string 	- This is displayed as a hint to completing the Ordered List type question (i.e. Sequence the following...)
multiresponse_hint : string - This is displayed as a hint to completing the Muliple Response type question
multichoice_hint : string	- This is displayed as a hint to completing the Multiple Choice type question
fitb_hint : string 		- This is displayed as a hint to completing the Fill In The Blank type question
essay_hint : string 		- This is displayed as a hint to completing the Essay type question
hotspot_hint : string 	- This is displayed as a hint to completing the Hot Spot type question
fitb_placeholder : string	- This is displayed in the input used on Fill In The Blank questions (when browser supported)
essay_placeholder : string	- This is displayed in the input used on Essay questions (when browser supported)
quiz_result_title : string	- This is displayed when the results of the entire quiz are displayed in summary
correct_result_text : string - This is displayed on the result summary table after completion
incorrect_result_text : string - This is displayed on the result summary table after completion
pending_result_text : string - This is displayed on the result summary table after completion
fitb_correct_ans : string 	- This is displayed when showing the correct answers to a Fill In The Blank question
view_quiz_result_lbl : string - This is displayed when the user has completed the last question and continues to view a summary

DATABASE QUESTION OPTIONS
"question" Table Description
Type 1 (Essay) 
	Question: Text the user will see above the eassy input.
	Options: NONE
	Randomize Options: 0 (Not used)
	Answer: NONE (Not used) 
Type 2 (Ordered List)
	Question: Text the user will see above the list.
	Options: JSON format array of options provided in the list
	Randomize Options: 0 or 1 (This will determine if the list will load in the order provided in Options)
	Answers: JSON format list containing the same items as Options in the correct order 
Type 3 (Multiple Response)
	Question: Text the user will see above the checkbox inputs.
	Options: JSON format array of options provided in the checkbox list 
	Randomize Options: 0 or 1 (This will determine if the list will load in the order provided in Options)
	Answers: JSON Format array of anything that should be checked
Type 4 (Fill In The Blank)
	Question: Text the user will see above the eassy input(s).
	Options: JSON format array containing an object with the key "accept" and an integer describing how many words to ask for 
	Randomize Options: 0 (Not used)
	Answers: This is the expected terms for the question above in the correct order
Type 5 (Multiple Choice)
	Question: Text the user will see above the radio inputs.
	Options: JSON format array of options provided in the radio list 
	Randomize Options: 0 or 1 (This will determine if the list will load in the order provided in Options)
	Answers: JSON Format array containing the 1 item that should be selected
Type 6 (Hot Spot)
	Question: Text the user will see above the image.
	Options: JSON format array containing an object with the key "src" and a value determing the location of the image 
	Randomize Options: 0 (Not used)
	Answers: JSON Format array containing the keys x1,y1,x2,y2 with ints determining the bounds of the rectangle that should be clicked 
	
"user_response" Table Description
Type 1 (Essay)
	Response: JSON Format array containing the response of the user
Type 2 (Ordered List)
	Response: JSON format array with all the options of the question in the order the user submitted them 
Type 3 (Muliple Response)
	Response: JSON format array containing the items which the user selected from the list
Type 4 (Fill In The Blank)
	Response: JSON format array containing one or more responses from the user in the order they were submitted
Type 5 (Multiple Choice)
	Response: JSON format array containing the 1 selection of the user
Type 6 (Hot Spot)
	Response JSON format array containing two points (x,y) of where the user clicked on the image

TERMS & SUPPORT
This software is provided as-is with no warranty. That being said, we really appreciate 
your feedback and will assist you as time and circumstances permit. Please contact 
mike@corrlabs.com if you have questions or need further assistance. 
This standard licence does not authorize the buyer to share, lease, or resell jQuiz in any 
form nor does it imply a transfer of ownership of the code in whole or part from 
CorrLabs, LLC to the buyer. CorrLabs, LLC does not assume any responsibility or liability 
for the code. All code is provided as-is. No warranty is expressed or implied. You understand 
that you are using this software at your own risk. 

CREDITS
PHPActiveRecord is owned and MIT licensed by phpactiverecord.org. (http://www.phpactiverecord.org/)
jQuery and jQueryUI are owned and MIT licensed by jQuery Foundation (http://jquery.org/license/)
Some icons (Silk Icon Set) are licensed Creative Commons Attribution 2.5 License by Mark James (http://www.famfamfam.com)
