<?php

/**
 * Description of Quiz
 * 
 * @property int $id
 * @property string $title
 * @property boolean $randomize_questions
 *
 * @property Question[] $questions
 * 
 * @copyright 2012 CorrLabs, LLC. All rights reserved.
 * @author Michael Corrigan <mike@corrlabs.com>
 */
class Quiz extends ActiveRecord\Model {

    static $table_name = 'quiz';
    
    static $belongs_to = array();
    
    static $has_many = array(
        array('questions', 'class_name' => 'Question')
    );
    
    
    /**
     * Method to return user's remaining questions for a quiz
     * @return array 
     */
    public function getRemainingQuestionsForUser($user_id)
    {
        return Question::find('all', 
            array(
                'conditions' => "quiz_id = {$this->id} AND id NOT IN (
                    SELECT question_id
                    FROM user_response
                    WHERE quiz_id = {$this->id} AND user_id = {$user_id}
                )" 
            )
        );
    }
    
    /**
     * Magic tostring method 
     * @return string 
     */
    public function __toString() {
        return '[object Quiz]';
    }
}