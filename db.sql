-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 10, 2014 at 10:53 AM
-- Server version: 5.6.12-log
-- PHP Version: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `dsv_vote`
--

-- --------------------------------------------------------

--
-- Table structure for table `abuse`
--

CREATE TABLE IF NOT EXISTS `abuse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `toUserId` int(11) DEFAULT NULL,
  `fromUserId` int(11) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `chatusers`
--

CREATE TABLE IF NOT EXISTS `chatusers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `favorites` int(11) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

--
-- Dumping data for table `chatusers`
--



-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `toUserId` int(11) DEFAULT NULL,
  `fromUserId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `toUserId`, `fromUserId`, `createdAt`) VALUES
(2, 4, 3, '2014-02-25 13:47:51');

-- --------------------------------------------------------

--
-- Table structure for table `loginattempts`
--

CREATE TABLE IF NOT EXISTS `loginattempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `result` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fromUserId` int(11) DEFAULT NULL,
  `toUserId` int(11) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=578 ;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `fromUserId`, `toUserId`, `text`, `createdAt`) VALUES

(9, 1, 0, 'sad', '2013-12-04 18:02:46'),
(10, 1, 0, 'asdsddd', '2013-12-04 18:02:54'),
(11, 1, 0, 'sdsad', '2013-12-04 18:02:55'),
(12, 1, 0, 'sdad', '2013-12-04 18:10:44'),
(13, 1, 0, 'sadsad', '2013-12-04 18:10:45'),
(14, 1, 0, 'sadsad', '2013-12-04 18:10:46'),
(15, 1, 0, 'sadasd', '2013-12-04 18:10:46'),
(16, 4, 0, 'h!', '2013-12-05 21:21:58'),
(17, 3, 0, 'hey ', '2013-12-05 21:22:20'),
(18, 4, 0, 'hi', '2013-12-06 01:33:33'),
(19, 3, 0, 'thats bollocks man', '2013-12-06 01:35:03'),
(20, 3, 0, 'dont believe you', '2013-12-06 01:35:05'),
(21, 3, 0, 'init', '2013-12-06 01:35:09'),
(22, 3, 0, 'geeze', '2013-12-06 01:35:11'),
(23, 5, 0, 'hiu', '2013-12-06 01:35:34'),
(24, 5, 0, 'yaaa', '2013-12-06 01:37:42'),
(25, 6, 0, 'hello world', '2013-12-06 11:56:20'),
(26, 6, 0, 'I''m live on talking heads.. 33secs remaining', '2013-12-06 11:57:02'),
(27, 6, 0, 'this is very cool', '2013-12-06 11:57:11'),
(28, 6, 0, 'there is no lag in the video', '2013-12-06 11:57:25'),
(29, 6, 0, '3 secs remain', '2013-12-06 11:57:30'),
(30, 5, 0, 'smhfjkaSD', '2013-12-07 01:34:36'),
(31, 3, 0, 'hdasi', '2013-12-07 01:34:55'),
(32, 6, 0, 'hey al', '2013-12-08 20:59:37'),
(33, 6, 0, 'can you read this', '2013-12-08 20:59:58'),
(34, 3, 0, 'yea i got that', '2013-12-08 21:00:03'),
(35, 3, 0, 'can you hear me?', '2013-12-08 21:01:11'),
(36, 6, 0, 'can you hear me ytalk?', '2013-12-08 21:01:15'),
(37, 3, 0, 'cant hear you no', '2013-12-08 21:01:24'),
(38, 6, 0, 'ok', '2013-12-08 21:01:27'),
(39, 3, 0, 'but I can see you', '2013-12-08 21:01:28'),
(40, 3, 0, 'now I am live... ', '2013-12-08 21:01:41'),
(41, 3, 0, 'you should be able to hear me', '2013-12-08 21:01:50'),
(42, 3, 0, 'can you hear me?', '2013-12-08 21:02:01'),
(43, 6, 0, 'i can''t hear you...', '2013-12-08 21:02:02'),
(44, 6, 0, 'or see you', '2013-12-08 21:02:07'),
(45, 3, 0, 'what browser are you using? .. ', '2013-12-08 21:02:14'),
(46, 6, 0, 'safari', '2013-12-08 21:02:25'),
(47, 3, 0, 'hmm.. on ipad?', '2013-12-08 21:02:32'),
(48, 6, 0, 'no', '2013-12-08 21:02:36'),
(49, 3, 0, 'or mac', '2013-12-08 21:02:36'),
(50, 6, 0, 'imac', '2013-12-08 21:02:38'),
(51, 3, 0, 'Does mac support flash then? ', '2013-12-08 21:02:48'),
(52, 6, 0, 'can you say something?', '2013-12-08 21:10:56'),
(53, 3, 0, 'Im talking, no sound?', '2013-12-08 21:11:03'),
(54, 6, 0, 'cane hear you', '2013-12-08 21:11:05'),
(55, 6, 0, 'cant', '2013-12-08 21:11:08'),
(56, 6, 0, 'no audio', '2013-12-08 21:11:17'),
(57, 3, 0, 'lets reconnect perhaps because Im sure it was working before.. ', '2013-12-08 21:11:19'),
(58, 6, 0, 'ok', '2013-12-08 21:11:22'),
(59, 6, 0, 'ok i can hear you now', '2013-12-08 21:12:05'),
(60, 6, 0, 'slight delay', '2013-12-08 21:12:20'),
(61, 6, 0, 'but ok', '2013-12-08 21:12:24'),
(62, 6, 0, 'say 123', '2013-12-08 21:12:31'),
(63, 6, 0, 'about a 1 or 1.5 sec delay', '2013-12-08 21:12:43'),
(64, 6, 0, 'pretty good', '2013-12-08 21:12:48'),
(65, 5, 0, 'I cant hear you', '2013-12-08 21:13:04'),
(66, 5, 0, 'forgot you cant hear me because im "muted" now', '2013-12-08 21:13:11'),
(67, 5, 0, 'at least i should be... you cant hear me right?', '2013-12-08 21:13:23'),
(68, 6, 0, 'can''t hear you', '2013-12-08 21:14:15'),
(69, 5, 0, 'hmm ok.. ', '2013-12-08 21:14:21'),
(70, 5, 0, 'possible bug then. Back to skype? ', '2013-12-08 21:14:29'),
(71, 6, 0, 'talk', '2013-12-08 21:14:29'),
(72, 6, 0, 'can''t hear you', '2013-12-08 21:14:37'),
(73, 6, 0, 'an o/s or access rights issue with flash plugin?', '2013-12-08 21:14:51'),
(74, 6, 0, 'no audio', '2013-12-08 21:20:19'),
(75, 7, 0, 'hello', '2013-12-08 21:25:09'),
(76, 5, 0, 'hey', '2013-12-08 21:25:15'),
(77, 5, 0, 'can you hear me?', '2013-12-08 21:25:17'),
(78, 7, 0, 'talk', '2013-12-08 21:25:25'),
(79, 5, 0, 'ah, your live now.', '2013-12-08 21:25:37'),
(80, 7, 0, 'audio?', '2013-12-08 21:25:37'),
(81, 5, 0, 'yes', '2013-12-08 21:25:37'),
(82, 5, 0, 'I hear you', '2013-12-08 21:25:39'),
(83, 7, 0, 'ok cool', '2013-12-08 21:25:41'),
(84, 5, 0, 'ah.. now i cant.. ', '2013-12-08 21:25:53'),
(85, 7, 0, 'strange', '2013-12-08 21:26:03'),
(86, 5, 0, 'it was very brief.. all I heard was "can you hear me" and now silence', '2013-12-08 21:26:05'),
(87, 7, 0, 'I''m still talking', '2013-12-08 21:26:14'),
(88, 7, 0, 'so nothing has changed', '2013-12-08 21:26:17'),
(89, 7, 0, 'not sure why it would cut in cut out', '2013-12-08 21:26:26'),
(90, 7, 0, 'bandwidth?', '2013-12-08 21:26:31'),
(91, 7, 0, 'can you talk', '2013-12-08 21:26:35'),
(92, 5, 0, 'Could be', '2013-12-08 21:26:38'),
(93, 7, 0, 'say something', '2013-12-08 21:26:39'),
(94, 5, 0, 'Im talking', '2013-12-08 21:26:46'),
(95, 7, 0, 'no audio', '2013-12-08 21:26:48'),
(96, 5, 0, 'ok. ', '2013-12-08 21:26:53'),
(97, 5, 0, 'Seems to work at first then dies. ', '2013-12-08 21:27:01'),
(98, 7, 0, 'ok lets talk on skype', '2013-12-08 21:27:03'),
(99, 4, 0, 'yeaaaa', '2013-12-11 19:46:21'),
(100, 3, 0, 'yo', '2013-12-12 21:03:10'),
(101, 4, 0, 'test', '2013-12-12 23:50:00'),
(102, 6, 0, 'test message', '2013-12-21 17:21:54'),
(103, 9, 0, 'type message here', '2013-12-21 17:27:01'),
(104, 6, 0, 'Testing', '2013-12-21 17:31:31'),
(105, 6, 0, 'fromi pad', '2013-12-21 17:31:35'),
(106, 6, 0, 'Hi kim', '2013-12-22 21:11:17'),
(107, 6, 0, 'can you see this?', '2013-12-22 21:11:24'),
(108, 10, 0, 'yes', '2013-12-22 21:11:39'),
(109, 6, 0, 'hi anna', '2013-12-29 23:17:31'),
(110, 6, 0, 'hello', '2013-12-29 23:17:47'),
(111, 11, 0, 'do i type or talk?', '2013-12-29 23:17:54'),
(112, 6, 0, 'can you see me on video?', '2013-12-29 23:17:59'),
(113, 11, 0, 'we cant hear you but can see you', '2013-12-29 23:18:21'),
(114, 6, 0, 'still can''t hear me?', '2013-12-29 23:18:53'),
(115, 11, 0, 'no', '2013-12-29 23:19:00'),
(116, 6, 0, 'i can see you in the bottom window now', '2013-12-29 23:19:07'),
(117, 6, 0, 'idea is that in 23 secs you will move to the top window', '2013-12-29 23:19:20'),
(118, 11, 0, 'it says i''m queing', '2013-12-29 23:19:24'),
(119, 6, 0, 'and have control of the deabte', '2013-12-29 23:19:25'),
(120, 6, 0, 'im not sure whats up with the sound', '2013-12-29 23:19:37'),
(121, 11, 0, 'so people take it in turns?', '2013-12-29 23:19:41'),
(122, 6, 0, 'i can hear you ok', '2013-12-29 23:19:41'),
(123, 6, 0, 'it will be, people can vote on who speaks for how long', '2013-12-29 23:20:10'),
(124, 6, 0, 'but only one person gets to talk at any momemnt', '2013-12-29 23:20:28'),
(125, 3, 0, 'hi', '2014-01-25 21:11:36'),
(126, 4, 0, 'ahh', '2014-01-25 21:11:45'),
(127, 3, 0, 'can you hear me?', '2014-01-25 21:11:55'),
(128, 4, 0, 'whats talking heads?', '2014-01-25 21:12:02'),
(129, 4, 0, 'this yours?', '2014-01-25 21:12:05'),
(130, 3, 0, 'yes', '2014-01-25 21:12:09'),
(131, 4, 0, 'Aye, I can hear you', '2014-01-25 21:12:09'),
(132, 4, 0, 'I brokes it!', '2014-01-25 21:13:10'),
(133, 3, 0, 'ok .. so you can still me but you cant hear me', '2014-01-25 21:13:19'),
(134, 4, 0, 'I think the bw is having a problem, you''re cutting in and out', '2014-01-25 21:13:39'),
(135, 4, 0, 'put on some clothes man!', '2014-01-25 21:13:48'),
(136, 4, 0, 'yeah audio is fuar', '2014-01-25 21:14:08'),
(137, 4, 0, 'fubar', '2014-01-25 21:14:11'),
(138, 4, 0, 'cuts out a lot, but structures here! ', '2014-01-25 21:14:18'),
(139, 3, 0, 'yes', '2014-01-25 21:14:29'),
(140, 3, 0, 'fack orf you cant', '2014-01-26 00:09:24'),
(141, 3, 0, 'yeah works', '2014-01-26 00:09:34'),
(142, 3, 0, 'yeah', '2014-01-26 00:10:17'),
(143, 4, 0, 'Hi rick', '2014-02-13 14:28:08'),
(144, 4, 0, 'Can you see this', '2014-02-13 14:28:13'),
(145, 3, 0, 'yes, I can see this', '2014-02-13 14:29:11'),
(146, 3, 0, 'looks good', '2014-02-13 14:29:29'),
(147, 3, 0, 'j;khnil', '2014-02-25 02:04:26'),
(148, 3, 0, 'pjpj''as', '2014-02-25 02:04:27'),
(149, 3, 0, 'df', '2014-02-25 02:04:28'),
(150, 3, 0, 'dsfsafsdfasd', '2014-02-25 02:58:40'),
(151, 3, 0, 'sdfsdafs', '2014-02-25 09:54:44'),
(152, 3, 0, 'sdfsa', '2014-02-25 09:54:47'),
(153, 3, 0, 'sdfsfs', '2014-02-25 09:56:05'),
(154, 3, 0, 'sdfsdf', '2014-02-25 09:56:08'),
(155, 5, 0, 'sdfsdfsd', '2014-02-25 09:58:04'),
(156, 5, 0, 'sdfds', '2014-02-25 09:58:06'),
(157, 3, 0, 'Hello Allan', '2014-02-25 13:41:22'),
(158, 4, 0, 'Hi Jim', '2014-02-25 13:45:55'),
(159, 4, 0, 'the chat is working good. Also, the context menu (if you right click on the username, on the right hand side) is also working, just no functions assigned', '2014-02-25 13:46:19'),
(160, 3, 0, 'yeah, I see the context menu', '2014-02-25 13:47:41'),
(161, 4, 0, 'So.. the user does not have to participate, to be able to watch, or chat. ', '2014-02-25 13:48:20'),
(162, 4, 0, 'But when they join, to stream, based on their score/rank they will be placed higher in the queue, so that they get to stream more often', '2014-02-25 13:49:03'),
(163, 4, 0, 'And this is the main thing we need for this site now, to code a voting system. ', '2014-02-25 13:49:29'),
(164, 3, 0, 'yeah, I understand now', '2014-02-25 13:49:53'),
(165, 4, 0, 'ok', '2014-02-25 13:50:18'),


-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE IF NOT EXISTS `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `startAt` datetime DEFAULT NULL,
  `endAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `streamactions`
--

CREATE TABLE IF NOT EXISTS `streamactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(12) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT '0',
  `email` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `bancount` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=25 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `rating`, `email`, `provider`, `status`, `bancount`) VALUES
(13, 'hung', 'sha1$eeee7624$1$6dafb3bae78253bdf6616541bd3d6c579aaf65f6', 0, 'hung@designveloper.com', 'local', 'active', 0),
(14, 'alex', 'sha1$bee4d084$1$674164d2741b86727f6b397c3eea6615d70b396a', 0, 'alex@alex.com', 'local', 'active', 0),
(15, 'allan', 'sha1$ad8e1fd0$1$495c1127b9c917bcf1d6749a9c13a744122dfaec', 0, 'allan@allan.com', 'local', 'active', 0),
(16, 'tream1', 'sha1$c340c406$1$fdfcda5afc3e8b9b0c32d0d25e536502643b9dce', 6, 'tream1@tream1.com', 'local', 'blocked', 0),
(17, 'tream2', 'sha1$c340c406$1$fdfcda5afc3e8b9b0c32d0d25e536502643b9dce', 3, 'tream2@tream2.com', 'local', 'active', 0),
(18, 'tream3', 'sha1$c340c406$1$fdfcda5afc3e8b9b0c32d0d25e536502643b9dce', 2, 'tream3@tream3.com', 'local', 'active', 0),
(19, 'tream4', 'sha1$a5a67285c18fed42a8f48fa1405a8eb864c1dca8', 0, 't4@a.com', 'local', 'active', 0),
(20, 'tream5', 'sha1$e226bc9d$1$c9017de7fd7c0ed422b782c0064a447d1aa3f2cd', 0, 't5@a.com', 'local', 'active', 0),
(21, 'tream6', 'sha1$f833a8a8$1$3360ba7564a3bd16d9505036b8f1812426abba42', 0, 't6@a.com', 'local', 'active', 0),
(22, 'tream7', 'sha1$2327208a$1$82ae4f3f6ee37fabfad6a9ebb7ed1c00df919c42', 0, 't7@a.com', 'local', 'active', 0),
(23, 'tream8', 'sha1$c4652b4e$1$5cb084d1f6d3a85fee8fb0ea778979261567d713', 0, 't8@a.com', 'local', 'active', 0),
(24, 'tream9', 'sha1$7740f26c$1$ae98e2f63ee50e246ed883757e785f3dad437ff8', 0, 't9@a.com', 'local', 'active', 0);

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE IF NOT EXISTS `votes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `toUserId` int(11) DEFAULT NULL,
  `fromUserId` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=644 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
