<?php

/**
 * This config file sets up the necessary data for DB connections and usage of
 * phpActiveRecord library (this lib is not required for jQuiz javascript, it
 * was only used to imply the PHP interaction).
 * 
 * phpActiveRecord requires PHP 5.3+
 * 
 * @copyright 2012 CorrLabs, LLC.
 * @author Michael Corrigan <mike@corrlabs.com>
 */

// phpActiveRecord (required PHP 5.3+)

define('DB_USER', 'root');
define('DB_HOST', 'localhost');
define('DB_PASS', '');
define('DB_DATABASE', 'jquiz');

// require the other pages
require_once 'php-activerecord/ActiveRecord.php';

ActiveRecord\Config::initialize(function($cfg)
{
    $cfg->set_model_directory('models');
    $connections = array("development" =>
        'mysql://'. DB_USER . 
              ':' . DB_PASS .
              '@' . DB_HOST .
              '/' . DB_DATABASE
    );
    $cfg->set_connections($connections);
});
