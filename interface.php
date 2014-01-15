<?php

/**
 * This is the interface file that handles database interaction (via ActiveRecord objects) 
 * and collects and distributes questions from the database
 * 
 * @copyright 2012 CorrLabs, LLC.
 * @author Michael Corrigan <mike@corrlabs.com>
 */

// include config which contains DB info and phpActiveRecord instantiation (required PHP 5.3+)
include_once('config.php');

// user with ID 1 is our default user for database tracking (you should make this dynamic to actually track responses per user)
$user = User::find(1);
$quiz = Quiz::find($_REQUEST['quiz_id']); // get quiz using ID

// CSRF implementation is up to the developer and what makes sense for their platform
// @TODO: handle csrf validation, token passed via $_REQUEST['csrf_token']

// @TODO: handle the language indentifier via $_REQUEST['language']

// test if looking for answers or question, if no answers provided
if (!isset($_REQUEST['answers'])){
    
    // remaining questions for user
    $remaining_questions = $quiz->getRemainingQuestionsForUser($user->id);
    
    $total_questions = count($quiz->questions);
    
    if (count($remaining_questions) == 0){
        // there are no more questions for this user to handle
        // @TODO handle this situation
        $response = array();
        $response['error'] = true;
        $response['msg'] = 'You have completed all the questions in this quiz.';
        echo json_encode($response);
        exit;
    }
    
    // shuffle if set
    if ($quiz->randomize_questions){
        shuffle($remaining_questions);
    }
    
    $question = array_shift($remaining_questions); // get first item in filtered array
    
    // build our emtpy json-to-be response array
    $response = array();
    
    // this is generally the DB id of the question, it isn't displayed to the user, but is used when user submits an answer
    $response['id'] = $question->id;
    
    // randomly choose a type, this should be set by the database value between 1 and 5
    $response['type'] = $question->type_id;
    
    // set the question text
    $response['question'] = $question->question;
    
    // if question is of type ORDERED_LIST, MULTIPLE_RESPONSE, or MULTIPLE_CHOICE, we need to give options the users can select from
    if ($question->type_id == Question::ORDERED_LIST || 
        $question->type_id == Question::MULTIPLE_CHOICE || 
        $question->type_id == Question::MULTIPLE_RESPONSE ||
        $question->type_id == Question::HOT_SPOT ||
        $question->type_id == Question::FITB){
        // if random flag set, shuffle
        $opts = json_decode($question->options, TRUE);
        if ($question->randomize_options) shuffle($opts);
        
        $response['options'] = $opts;
    }
        
    // the total number of questions for the user
    // only required the first question, but will update when provided
    $response['total_questions'] = $total_questions;
    
    // return json response
    echo json_encode($response);
}else {
    
    // this is an user answer submittion / request for answer
    
    // get question based on question_id
    $question = Question::find($_REQUEST['question_id']);
    
    // save user's response in database
    $user_response = new UserResponse();
    $user_response->user_id = $user->id;
    $user_response->quiz_id = $quiz->id;
    $user_response->question_id = $question->id;
    $user_response->response = json_encode($_REQUEST['answers']);
    // could also save out other info like if they got it correct, etc. (considering specific order on order list view)
    $user_response->save();
    
    $response = array();
    $response['id'] = $question->id;
    $response['show_answers'] = TRUE;
    if ($question->show_answers_on_check){
        // answers should always be stored in json array format
        $response['answers'] = json_decode($question->answers, TRUE); 
    }else{
        // we don't return answers
        $response['answers'] = '';
        $response['show_answers'] = FALSE;
    }
    
    echo json_encode($response);
}