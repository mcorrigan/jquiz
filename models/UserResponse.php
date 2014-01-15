<?php

/**
 * Description of UserResponse
 * 
 * @property int $user_id
 * @property int $quiz_id
 * @property int $question_id
 * @property string $response
 *
 * @property User $user
 * @property Quiz $quiz
 * @property Question $question
 * 
 * @copyright 2012 CorrLabs, LLC. All rights reserved.
 * @author Michael Corrigan <mike@corrlabs.com>
 */
class UserResponse extends ActiveRecord\Model {

    static $table_name = 'user_response';
    
    // we have id to this
    static $belongs_to = array(
        array('user'),
        array('quiz'),
    );
    
    // these have an id to a form (i.e. form_id)
    static $has_one = array();
    
    // these have id for form
    static $has_many = array();
    
    /**
     * Magic tostring method
     * @return string 
     */
    public function __toString() {
        return '[object UserResponse response="'.$this->response.'"]';
    }
}