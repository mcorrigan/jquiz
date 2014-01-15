<?php
    include_once('config.php');
    // When this page loads, we will delete all recorded answers in the database for test user and test quiz
	// DO NOT KEEP THE FOLLOWING LINE IN A PRODUCTION ENVIRONMENT
    UserResponse::delete_all(array('conditions' => array('user_id' => 1, 'quiz_id' => 1)));
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>jQuiz Tool</title>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
    <script type="text/javascript" src="js/jquery.jquiztool-dev.js"></script>
    <link rel="stylesheet" href="css/ui-lightness/jquery-ui-1.8.18.custom.css" type="text/css" />
    <link rel="stylesheet" href="css/jquiztool/jquery.jquiztool.css" type="text/css" />
    
    <script type="text/javascript">
        $(function(){
            $("#quiz-demo").jquiztool({
                'quiz_id': 1, // this can be a database value or just something to allow PHP to determine which quiz questions/responses are coming from
                'interface': "http://localhost/jquiztool/interface.php" // the PHP interface for this quiz
            });
        })
    </script>
</head>
<body>
    <div id="quiz-demo"></div>
    <h1>About this demo</h1>
    <p>
        The demo above is featuring:
    </p>
    <ul>
        <li>
            All 6 supported question types
            <ul>
                <li>Ordered List</li>
                <li>Fill-in-the-blank</li>
                <li>Multiple Choice</li>
                <li>Multiple Response</li>
                <li>Essay</li>
                <li>Hot Spot</li>
            </ul>
        </li>
        <li>Random question delivery</li>
        <li>Random option order on applicable question types</li>
        <li>Immediate question feedback</li>
        <li>Recording user's answers in a database</li>
        <li>Ajax secure loading and rendering of various questions</li>
        <li>Full CSS control of design</li>
        <li>Quiz summary on completion</li>
    </ul>
    <p>
        <b>NOTE:</b> Refreshing the page clears out your previously stored 
        answers in the database to allow you to answer the same questions again. 
        As you go, please look at the user_response table in the database to see 
        how user's responses are stored.
    </p>
</body>
</html>
