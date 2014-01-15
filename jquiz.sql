-- phpMyAdmin SQL Dump
-- version 3.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 25, 2013 at 11:35 PM
-- Server version: 5.5.25a
-- PHP Version: 5.4.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `jquiz`
--

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE IF NOT EXISTS `question` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `quiz_id` int(10) unsigned NOT NULL,
  `type_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `options` text NOT NULL,
  `randomize_options` tinyint(1) NOT NULL DEFAULT '1',
  `answers` text NOT NULL COMMENT 'json array format',
  `show_answers_on_check` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `quiz_id` (`quiz_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`id`, `quiz_id`, `type_id`, `question`, `options`, `randomize_options`, `answers`, `show_answers_on_check`) VALUES
(1, 1, 1, 'Explain how global warming could affect our future.', '', 0, '', 1),
(2, 1, 2, 'Please order the numbers from lowest to highest value going from top to bottom.', '["one","two","three","four"]', 1, '["one","two","three","four"]', 1),
(3, 1, 3, 'Please select only the highest and lowest values listed.', '["one","two","three","four"]', 1, '["one","four"]', 1),
(4, 1, 4, 'Sure, when ____ ___.', '[{"accept":2}]', 0, '["pigs","fly"]', 1),
(5, 1, 5, 'If you take 4 and divide by 2 you get this number.', '["one","two","three","four"]', 1, '["two"]', 1),
(6, 1, 6, 'Where is Nebraska?', '[{"src":"images/us.jpg"}]', 0, '[{"x1":132,"y1":74,"x2":187,"y2":100}]', 1),
(7, 1, 4, 'Simple FITB question. You are ____!', '', 0, '["awesome"]', 1);

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE IF NOT EXISTS `quiz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `randomize_questions` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`id`, `title`, `randomize_questions`) VALUES
(1, 'jQuiz Example', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`) VALUES
(1, 'no_user@email.com');

-- --------------------------------------------------------

--
-- Table structure for table `user_response`
--

CREATE TABLE IF NOT EXISTS `user_response` (
  `user_id` int(10) unsigned NOT NULL,
  `quiz_id` int(10) unsigned NOT NULL,
  `question_id` int(11) NOT NULL,
  `response` text NOT NULL,
  PRIMARY KEY (`user_id`,`quiz_id`,`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_response`
--

INSERT INTO `user_response` (`user_id`, `quiz_id`, `question_id`, `response`) VALUES
(1, 1, 1, '[""]'),
(1, 1, 2, '["four","one","two","three"]'),
(1, 1, 3, '""'),
(1, 1, 4, '["",""]'),
(1, 1, 5, '""'),
(1, 1, 6, '["225","112"]'),
(1, 1, 7, '[""]');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
