-- MySQL dump 10.13  Distrib 5.5.32, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: development_talkingheads
-- ------------------------------------------------------
-- Server version	5.5.32-0ubuntu0.13.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `abuse`
--

DROP TABLE IF EXISTS `abuse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `abuse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `toUserId` int(11) DEFAULT NULL,
  `fromUserId` int(11) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `abuse`
--

LOCK TABLES `abuse` WRITE;
/*!40000 ALTER TABLE `abuse` DISABLE KEYS */;
/*!40000 ALTER TABLE `abuse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `toUserId` int(11) DEFAULT NULL,
  `fromUserId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (2,4,3,'2014-02-25 13:47:51');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loginattempts`
--

DROP TABLE IF EXISTS `loginattempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loginattempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `ip` varchar(255) DEFAULT NULL,
  `result` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loginattempts`
--

LOCK TABLES `loginattempts` WRITE;
/*!40000 ALTER TABLE `loginattempts` DISABLE KEYS */;
/*!40000 ALTER TABLE `loginattempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fromUserId` int(11) DEFAULT NULL,
  `toUserId` int(11) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=189 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,1,0,'sdsa','2013-12-04 18:02:41'),(2,1,0,'dsad','2013-12-04 18:02:42'),(3,1,0,'sad','2013-12-04 18:02:42'),(4,1,0,'sad','2013-12-04 18:02:43'),(5,1,0,'sad','2013-12-04 18:02:44'),(6,1,0,'sad','2013-12-04 18:02:44'),(7,1,0,'sad','2013-12-04 18:02:45'),(8,1,0,'sad','2013-12-04 18:02:45'),(9,1,0,'sad','2013-12-04 18:02:46'),(10,1,0,'asdsddd','2013-12-04 18:02:54'),(11,1,0,'sdsad','2013-12-04 18:02:55'),(12,1,0,'sdad','2013-12-04 18:10:44'),(13,1,0,'sadsad','2013-12-04 18:10:45'),(14,1,0,'sadsad','2013-12-04 18:10:46'),(15,1,0,'sadasd','2013-12-04 18:10:46'),(16,4,0,'h!','2013-12-05 21:21:58'),(17,3,0,'hey ','2013-12-05 21:22:20'),(18,4,0,'hi','2013-12-06 01:33:33'),(19,3,0,'thats bollocks man','2013-12-06 01:35:03'),(20,3,0,'dont believe you','2013-12-06 01:35:05'),(21,3,0,'init','2013-12-06 01:35:09'),(22,3,0,'geeze','2013-12-06 01:35:11'),(23,5,0,'hiu','2013-12-06 01:35:34'),(24,5,0,'yaaa','2013-12-06 01:37:42'),(25,6,0,'hello world','2013-12-06 11:56:20'),(26,6,0,'I\'m live on talking heads.. 33secs remaining','2013-12-06 11:57:02'),(27,6,0,'this is very cool','2013-12-06 11:57:11'),(28,6,0,'there is no lag in the video','2013-12-06 11:57:25'),(29,6,0,'3 secs remain','2013-12-06 11:57:30'),(30,5,0,'smhfjkaSD','2013-12-07 01:34:36'),(31,3,0,'hdasi','2013-12-07 01:34:55'),(32,6,0,'hey al','2013-12-08 20:59:37'),(33,6,0,'can you read this','2013-12-08 20:59:58'),(34,3,0,'yea i got that','2013-12-08 21:00:03'),(35,3,0,'can you hear me?','2013-12-08 21:01:11'),(36,6,0,'can you hear me ytalk?','2013-12-08 21:01:15'),(37,3,0,'cant hear you no','2013-12-08 21:01:24'),(38,6,0,'ok','2013-12-08 21:01:27'),(39,3,0,'but I can see you','2013-12-08 21:01:28'),(40,3,0,'now I am live... ','2013-12-08 21:01:41'),(41,3,0,'you should be able to hear me','2013-12-08 21:01:50'),(42,3,0,'can you hear me?','2013-12-08 21:02:01'),(43,6,0,'i can\'t hear you...','2013-12-08 21:02:02'),(44,6,0,'or see you','2013-12-08 21:02:07'),(45,3,0,'what browser are you using? .. ','2013-12-08 21:02:14'),(46,6,0,'safari','2013-12-08 21:02:25'),(47,3,0,'hmm.. on ipad?','2013-12-08 21:02:32'),(48,6,0,'no','2013-12-08 21:02:36'),(49,3,0,'or mac','2013-12-08 21:02:36'),(50,6,0,'imac','2013-12-08 21:02:38'),(51,3,0,'Does mac support flash then? ','2013-12-08 21:02:48'),(52,6,0,'can you say something?','2013-12-08 21:10:56'),(53,3,0,'Im talking, no sound?','2013-12-08 21:11:03'),(54,6,0,'cane hear you','2013-12-08 21:11:05'),(55,6,0,'cant','2013-12-08 21:11:08'),(56,6,0,'no audio','2013-12-08 21:11:17'),(57,3,0,'lets reconnect perhaps because Im sure it was working before.. ','2013-12-08 21:11:19'),(58,6,0,'ok','2013-12-08 21:11:22'),(59,6,0,'ok i can hear you now','2013-12-08 21:12:05'),(60,6,0,'slight delay','2013-12-08 21:12:20'),(61,6,0,'but ok','2013-12-08 21:12:24'),(62,6,0,'say 123','2013-12-08 21:12:31'),(63,6,0,'about a 1 or 1.5 sec delay','2013-12-08 21:12:43'),(64,6,0,'pretty good','2013-12-08 21:12:48'),(65,5,0,'I cant hear you','2013-12-08 21:13:04'),(66,5,0,'forgot you cant hear me because im \"muted\" now','2013-12-08 21:13:11'),(67,5,0,'at least i should be... you cant hear me right?','2013-12-08 21:13:23'),(68,6,0,'can\'t hear you','2013-12-08 21:14:15'),(69,5,0,'hmm ok.. ','2013-12-08 21:14:21'),(70,5,0,'possible bug then. Back to skype? ','2013-12-08 21:14:29'),(71,6,0,'talk','2013-12-08 21:14:29'),(72,6,0,'can\'t hear you','2013-12-08 21:14:37'),(73,6,0,'an o/s or access rights issue with flash plugin?','2013-12-08 21:14:51'),(74,6,0,'no audio','2013-12-08 21:20:19'),(75,7,0,'hello','2013-12-08 21:25:09'),(76,5,0,'hey','2013-12-08 21:25:15'),(77,5,0,'can you hear me?','2013-12-08 21:25:17'),(78,7,0,'talk','2013-12-08 21:25:25'),(79,5,0,'ah, your live now.','2013-12-08 21:25:37'),(80,7,0,'audio?','2013-12-08 21:25:37'),(81,5,0,'yes','2013-12-08 21:25:37'),(82,5,0,'I hear you','2013-12-08 21:25:39'),(83,7,0,'ok cool','2013-12-08 21:25:41'),(84,5,0,'ah.. now i cant.. ','2013-12-08 21:25:53'),(85,7,0,'strange','2013-12-08 21:26:03'),(86,5,0,'it was very brief.. all I heard was \"can you hear me\" and now silence','2013-12-08 21:26:05'),(87,7,0,'I\'m still talking','2013-12-08 21:26:14'),(88,7,0,'so nothing has changed','2013-12-08 21:26:17'),(89,7,0,'not sure why it would cut in cut out','2013-12-08 21:26:26'),(90,7,0,'bandwidth?','2013-12-08 21:26:31'),(91,7,0,'can you talk','2013-12-08 21:26:35'),(92,5,0,'Could be','2013-12-08 21:26:38'),(93,7,0,'say something','2013-12-08 21:26:39'),(94,5,0,'Im talking','2013-12-08 21:26:46'),(95,7,0,'no audio','2013-12-08 21:26:48'),(96,5,0,'ok. ','2013-12-08 21:26:53'),(97,5,0,'Seems to work at first then dies. ','2013-12-08 21:27:01'),(98,7,0,'ok lets talk on skype','2013-12-08 21:27:03'),(99,4,0,'yeaaaa','2013-12-11 19:46:21'),(100,3,0,'yo','2013-12-12 21:03:10'),(101,4,0,'test','2013-12-12 23:50:00'),(102,6,0,'test message','2013-12-21 17:21:54'),(103,9,0,'type message here','2013-12-21 17:27:01'),(104,6,0,'Testing','2013-12-21 17:31:31'),(105,6,0,'fromi pad','2013-12-21 17:31:35'),(106,6,0,'Hi kim','2013-12-22 21:11:17'),(107,6,0,'can you see this?','2013-12-22 21:11:24'),(108,10,0,'yes','2013-12-22 21:11:39'),(109,6,0,'hi anna','2013-12-29 23:17:31'),(110,6,0,'hello','2013-12-29 23:17:47'),(111,11,0,'do i type or talk?','2013-12-29 23:17:54'),(112,6,0,'can you see me on video?','2013-12-29 23:17:59'),(113,11,0,'we cant hear you but can see you','2013-12-29 23:18:21'),(114,6,0,'still can\'t hear me?','2013-12-29 23:18:53'),(115,11,0,'no','2013-12-29 23:19:00'),(116,6,0,'i can see you in the bottom window now','2013-12-29 23:19:07'),(117,6,0,'idea is that in 23 secs you will move to the top window','2013-12-29 23:19:20'),(118,11,0,'it says i\'m queing','2013-12-29 23:19:24'),(119,6,0,'and have control of the deabte','2013-12-29 23:19:25'),(120,6,0,'im not sure whats up with the sound','2013-12-29 23:19:37'),(121,11,0,'so people take it in turns?','2013-12-29 23:19:41'),(122,6,0,'i can hear you ok','2013-12-29 23:19:41'),(123,6,0,'it will be, people can vote on who speaks for how long','2013-12-29 23:20:10'),(124,6,0,'but only one person gets to talk at any momemnt','2013-12-29 23:20:28'),(125,3,0,'hi','2014-01-25 21:11:36'),(126,4,0,'ahh','2014-01-25 21:11:45'),(127,3,0,'can you hear me?','2014-01-25 21:11:55'),(128,4,0,'whats talking heads?','2014-01-25 21:12:02'),(129,4,0,'this yours?','2014-01-25 21:12:05'),(130,3,0,'yes','2014-01-25 21:12:09'),(131,4,0,'Aye, I can hear you','2014-01-25 21:12:09'),(132,4,0,'I brokes it!','2014-01-25 21:13:10'),(133,3,0,'ok .. so you can still me but you cant hear me','2014-01-25 21:13:19'),(134,4,0,'I think the bw is having a problem, you\'re cutting in and out','2014-01-25 21:13:39'),(135,4,0,'put on some clothes man!','2014-01-25 21:13:48'),(136,4,0,'yeah audio is fuar','2014-01-25 21:14:08'),(137,4,0,'fubar','2014-01-25 21:14:11'),(138,4,0,'cuts out a lot, but structures here! ','2014-01-25 21:14:18'),(139,3,0,'yes','2014-01-25 21:14:29'),(140,3,0,'fack orf you cant','2014-01-26 00:09:24'),(141,3,0,'yeah works','2014-01-26 00:09:34'),(142,3,0,'yeah','2014-01-26 00:10:17'),(143,4,0,'Hi rick','2014-02-13 14:28:08'),(144,4,0,'Can you see this','2014-02-13 14:28:13'),(145,3,0,'yes, I can see this','2014-02-13 14:29:11'),(146,3,0,'looks good','2014-02-13 14:29:29'),(147,3,0,'j;khnil','2014-02-25 02:04:26'),(148,3,0,'pjpj\'as','2014-02-25 02:04:27'),(149,3,0,'df','2014-02-25 02:04:28'),(150,3,0,'dsfsafsdfasd','2014-02-25 02:58:40'),(151,3,0,'sdfsdafs','2014-02-25 09:54:44'),(152,3,0,'sdfsa','2014-02-25 09:54:47'),(153,3,0,'sdfsfs','2014-02-25 09:56:05'),(154,3,0,'sdfsdf','2014-02-25 09:56:08'),(155,5,0,'sdfsdfsd','2014-02-25 09:58:04'),(156,5,0,'sdfds','2014-02-25 09:58:06'),(157,3,0,'Hello Allan','2014-02-25 13:41:22'),(158,4,0,'Hi Jim','2014-02-25 13:45:55'),(159,4,0,'the chat is working good. Also, the context menu (if you right click on the username, on the right hand side) is also working, just no functions assigned','2014-02-25 13:46:19'),(160,3,0,'yeah, I see the context menu','2014-02-25 13:47:41'),(161,4,0,'So.. the user does not have to participate, to be able to watch, or chat. ','2014-02-25 13:48:20'),(162,4,0,'But when they join, to stream, based on their score/rank they will be placed higher in the queue, so that they get to stream more often','2014-02-25 13:49:03'),(163,4,0,'And this is the main thing we need for this site now, to code a voting system. ','2014-02-25 13:49:29'),(164,3,0,'yeah, I understand now','2014-02-25 13:49:53'),(165,4,0,'ok','2014-02-25 13:50:18'),(166,5,0,'fsfsfsfs','2014-02-25 15:11:02'),(167,3,0,'Hi','2014-03-01 19:27:38'),(168,4,0,'test','2014-03-01 19:28:41'),(169,3,0,'abc','2014-03-02 00:23:45'),(170,3,0,'dasd','2014-03-02 00:29:07'),(171,3,0,'dfsdfsd','2014-03-02 00:54:30'),(172,3,0,'hi','2014-03-03 05:50:07'),(173,3,0,'hello','2014-03-04 13:46:42'),(174,4,0,'hi','2014-03-04 13:47:17'),(175,3,0,'how r u ?','2014-03-04 13:47:45'),(176,4,0,'fine ','2014-03-04 13:47:49'),(177,4,0,'you ','2014-03-04 13:47:52'),(178,3,0,'as it is yar','2014-03-04 13:47:57'),(179,4,0,'hi','2014-03-05 06:20:34'),(180,3,0,'hello','2014-03-05 06:22:48'),(181,3,0,'ih','2014-03-05 06:22:56'),(182,3,0,'hhhhh','2014-03-05 06:23:02'),(183,3,0,'hhhhh','2014-03-05 06:23:05'),(184,3,0,'test1:hello test1:ih test1:hhhhh test1:hhhhh','2014-03-05 06:24:23'),(185,3,0,'hi','2014-03-07 10:03:51'),(186,3,0,'how are you ','2014-03-07 10:04:13'),(187,3,0,'op[p','2014-03-07 10:04:23'),(188,3,0,'o','2014-03-07 10:04:25');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedule` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `startAt` datetime DEFAULT NULL,
  `endAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `streamactions`
--

DROP TABLE IF EXISTS `streamactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `streamactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streamactions`
--

LOCK TABLES `streamactions` WRITE;
/*!40000 ALTER TABLE `streamactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `streamactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(12) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'www','sha1$8eb7debb$1$6c0343b9ce8c6c113211f0562c34e01f5a9b9e3e','www@www.com','local','active'),(2,'zxc','sha1$76fe2e8a$1$d538802d18d211f4878c76a64fc1b4b7149e34a3','zxc@zxc.com','local','active'),(3,'test1','sha1$5f479587$1$092670cb6f66a0ae5ec49763d6966b44497f5c98','test@test.com','local','active'),(4,'test2','sha1$d520a2df$1$78a37bdacd66cdd87858678857691f69e9c0ba36','test2@test2.com','local','active'),(5,'test3','sha1$4f2c1ec0$1$d0f150a2bc6ddd3853720cf95c9db6d9b9022f2c','test3@test.com','local','active'),(6,'test101','sha1$7363915b$1$dfcc95f25423683f258975d6b912ecf13a25b6d5','alexander.hanks@tream.co.uk','local','active'),(7,'test103','sha1$5e21e6bb$1$1484ccbc940a6687a2754648e0243f3b0aeb8350','alexander.hanks@tream.co.uk','local','active'),(8,'giovanni','sha1$bc96a822$1$33322e3c349efff6aa9667c2a8a25420dc222114','test@test.com','local','active'),(9,'test102','sha1$bf536410$1$68968c1feef9955476558dd4ea475e11d2d416dc','alexander.hanks@tream.co.uk','local','active'),(10,'testkv','sha1$d87b22ec$1$1782efa3e954a54750121f9293a01fa05324bf4e','kimvaldez@blueyonder.co.uk','local','active'),(11,'Missanna1935','sha1$173819c8$1$e0d28c99f5cfbb5545ceecf3404bb18891e99371','annavaldezhanks@yahoo.co.uk','local','active'),(12,'test4','sha1$64a85b6b$1$f731a641d1286d0a7dbdbc01f6e78ee117919fe7','test4@test.com','local','active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `toUserId` int(11) DEFAULT NULL,
  `fromUserId` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-03-13  9:01:22
