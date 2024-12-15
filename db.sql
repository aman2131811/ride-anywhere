/*
SQLyog Community Edition- MySQL GUI v5.22a
Host - 5.0.19-nt : Database - cabbooking
*********************************************************************
Server version : 5.0.19-nt
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

create database if not exists `cabbooking`;

USE `cabbooking`;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*Table structure for table `booking` */

DROP TABLE IF EXISTS `booking`;

CREATE TABLE `booking` (
  `id` int(11) NOT NULL auto_increment,
  `source` varchar(100) default NULL,
  `destination` varchar(100) default NULL,
  `total_km` varchar(100) default NULL,
  `cust_name` varchar(200) default NULL,
  `cust_id` int(11) default NULL,
  `total_cost` varchar(100) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `booking` */

insert  into `booking`(`id`,`source`,`destination`,`total_km`,`cust_name`,`cust_id`,`total_cost`) values (1,'Delhi','Punjab','300','Laxmi',2,'1800');

/*Table structure for table `customer` */

DROP TABLE IF EXISTS `customer`;

CREATE TABLE `customer` (
  `id` int(11) NOT NULL auto_increment,
  `fname` varchar(100) default NULL,
  `lname` varchar(100) default NULL,
  `email` varchar(100) default NULL,
  `phone` varchar(50) default NULL,
  `passw` varchar(100) default NULL,
  `photo` varchar(500) default NULL,
  `pin_code` varchar(100) default NULL,
  `address` varchar(500) default NULL,
  `country` varchar(100) default NULL,
  `state` varchar(100) default NULL,
  `dob` varchar(100) default NULL,
  `utype` varchar(100) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `customer` */

insert  into `customer`(`id`,`fname`,`lname`,`email`,`phone`,`passw`,`photo`,`pin_code`,`address`,`country`,`state`,`dob`,`utype`) values (1,'Laxmi','Narayan','admin@gmail.com','9990167716','admin',NULL,NULL,NULL,NULL,NULL,NULL,'admin'),(2,'Laxmi','Narayan','ln@gmail.com','9990167716','12345678',NULL,NULL,NULL,NULL,NULL,NULL,'customer');

/*Table structure for table `fare` */

DROP TABLE IF EXISTS `fare`;

CREATE TABLE `fare` (
  `id` int(11) NOT NULL auto_increment,
  `source` varchar(100) default NULL,
  `destination` varchar(100) default NULL,
  `total_km` varchar(100) default NULL,
  `first_km` varchar(100) default NULL,
  `cost` varchar(100) default NULL,
  `total_cost` varchar(100) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `fare` */

insert  into `fare`(`id`,`source`,`destination`,`total_km`,`first_km`,`cost`,`total_cost`) values (1,'Delhi','Punjab','300','1','20','1800');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
