-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 13, 2024 at 12:56 PM
-- Server version: 10.5.24-MariaDB
-- PHP Version: 8.1.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cjcollenette_postcodeDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_postcodes`
--

CREATE TABLE `tbl_postcodes` (
  `postcodeID` int(11) NOT NULL,
  `postcode` varchar(8) NOT NULL,
  `userID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tbl_postcodes`
--

INSERT INTO `tbl_postcodes` (`postcodeID`, `postcode`, `userID`) VALUES
(1, 'CH14BJ', 1),
(2, 'M139PL', 1),
(3, 'L693GJ', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `userID` int(11) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`userID`, `Username`, `Password`) VALUES
(1, 'J111978', '$2y$10$/zpneujtsEatRQIavuetceDE2cn59HKg40r06/r1f7kbyiQyQwkoa');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_postcodes`
--
ALTER TABLE `tbl_postcodes`
  ADD PRIMARY KEY (`postcodeID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`userID`);

--
-- ADD the 'role' column to tbl_users
--
ALTER TABLE `tbl_users`
  ADD COLUMN role ENUM('user', 'superuser') NOT NULL DEFAULT 'user';

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_postcodes`
--
ALTER TABLE `tbl_postcodes`
  MODIFY `postcodeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Foreign key constraint to ensure userID references tbl_users
--
ALTER TABLE `tbl_postcodes`
  ADD CONSTRAINT `tbl_postcodes_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `tbl_users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
