DROP DATABASE IF EXISTS `lux_test`;
CREATE DATABASE `lux_test` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `lux_test`;
-- MySQL dump 10.13  Distrib 5.6.24, for osx10.8 (x86_64)
--
-- Host: 127.0.0.1    Database: lux_test
-- ------------------------------------------------------
-- Server version	5.7.11

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
-- Table structure for table `authors`
--

DROP TABLE IF EXISTS `authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `authors` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT 'New Author',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `authors_name_created_at_updated_at_index` (`name`,`created_at`,`updated_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authors`
--

LOCK TABLES `authors` WRITE;
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
INSERT INTO `authors` VALUES (1,'New Author 1','2016-04-16 19:02:28','2016-04-16 19:02:28'),(2,'New Author 2','2016-04-16 19:02:31','2016-04-16 19:02:31');
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `version` varchar(16) NOT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES ('2016050414243068'),('2016050414243335');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT 'New Post',
  `body` text,
  `is_public` tinyint(1) DEFAULT '0',
  `author_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `posts_title_is_public_author_id_created_at_updated_at_index` (`title`,`is_public`,`author_id`,`created_at`,`updated_at`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'New Post 1','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(2,'New Post 2','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(3,'New Post 5','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(4,'New Post 3','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(5,'New Post 6','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(6,'New Post 4','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(7,'New Post 7','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(8,'New Post 12','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(9,'New Post 11','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(10,'New Post 10','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(11,'New Post 8','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(12,'New Post 9','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(13,'New Post 13','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(14,'New Post 14','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(15,'New Post 15','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(16,'New Post 17','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(17,'New Post 16','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(18,'New Post 19','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(19,'New Post 18','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(20,'New Post 20','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(21,'New Post 23','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(22,'New Post 22','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(23,'New Post 21','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(24,'New Post 24','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(25,'New Post 25','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,1,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(26,'New Post 26','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(27,'New Post 27','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(28,'New Post 29','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(29,'New Post 28','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(30,'New Post 31','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(31,'New Post 30','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(32,'New Post 34','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(33,'New Post 35','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(34,'New Post 32','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(35,'New Post 33','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(36,'New Post 36','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(37,'New Post 39','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(38,'New Post 40','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(39,'New Post 41','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(40,'New Post 37','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(41,'New Post 38','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(42,'New Post 42','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(43,'New Post 43','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(44,'New Post 48','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(45,'New Post 46','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(46,'New Post 45','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(47,'New Post 44','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(48,'New Post 47','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(49,'New Post 49','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04'),(50,'New Post 50','Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',1,2,'2016-04-16 19:00:53','2016-04-16 19:10:04');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-06  9:53:49
