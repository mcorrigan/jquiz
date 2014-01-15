<?php

/**
 * Description of Question
 * 
 * @property int $id
 * @property int $quiz_id
 * @property int $type_id
 * @property string $question
 * @property string $options
 * @property boolean $randomize_options
 * @property string $answers
 * @property boolean $show_answers_on_check
 *
 * @property Quiz $quiz
 * 
 * @copyright 2012 CorrLabs, LLC. All rights reserved.
 * @author Michael Corrigan <mike@corrlabs.com>
 */
class Question extends ActiveRecord\Model {

    static $table_name = 'question';
    
    // we have id to this
    static $belongs_to = array(
        array('quiz'),
    );
    
    // these have an id to a form (i.e. form_id)
    static $has_one = array();
    
    // these have id for form
    static $has_many = array();
    
    // possible question types
    const ESSAY             = 1;
    const ORDERED_LIST      = 2;
    const MULTIPLE_RESPONSE = 3;
    const FITB              = 4;
    const MULTIPLE_CHOICE   = 5;
    const HOT_SPOT          = 6;
    
    /**
     * Magic tostring method
     * @return string 
     */
    public function __toString() {
        return '[object Question id="'.$this->id.'"]';
    }
}