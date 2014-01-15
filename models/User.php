<?php

/**
 * Description of User
 * 
 * @property int $id
 * @property string $email
 *
 * @property UserResponse[] $responses
 * 
 * @copyright 2012 CorrLabs, LLC. All rights reserved.
 * @author Michael Corrigan <mike@corrlabs.com>
 */
class User extends ActiveRecord\Model {

    static $table_name = 'user';
    
    static $belongs_to = array();
    
    static $has_many = array(
        array('responses', 'class_name' => 'UserResponse')
    );
    
    /**
     * Magic tostring method 
     * @return string 
     */
    public function __toString() {
        return '[object User]';
    }
}