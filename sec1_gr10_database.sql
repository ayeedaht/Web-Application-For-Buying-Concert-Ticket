-- Ticketboo
-- Section 1, Group 10
-- ID 120, 179, 181, 210

-- DROP DATABASE IF EXISTS ticketboo;
CREATE DATABASE IF NOT EXISTS `ticketboo`;
USE `ticketboo`;

CREATE TABLE `admin_info` (
	`admin_code` VARCHAR(3) PRIMARY KEY,
	`fname` VARCHAR(100) NOT NULL,
	`lname` VARCHAR(100) NOT NULL,
	`dob` DATE NOT NULL,
	`gender` CHAR(1) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `login_log` DATETIME NOT NULL,
    `role` VARCHAR(100) NOT NULL
);


CREATE TABLE `ticket` (
	`ticket_code` VARCHAR(10) PRIMARY KEY,
	`ticket_title` VARCHAR(200) NOT NULL,
    `ticket_img` TEXT(50000) NOT NULL,
	`ticket_desc` VARCHAR(500) NOT NULL,
	`ticket_loca` VARCHAR(200) NOT NULL,
	`ticket_date` DATE NOT NULL,
	`ticket_time` TIME NOT NULL,
	`ticket_price` INT NOT NULL
);


INSERT INTO `admin_info` VALUES
("001", "Wudhichart", "Sawangphol","1980-12-11" ,"M", "Wudhichart", "2023-03-12 12:35:20","Admistrator"),
("002", "Jidapa", "Kraisangka","1979-09-01" ,"F", "Jidapa", "2023-03-24 09:46:17","Admistrator"),
("003", "Pisit", "Praiwattana","1979-04-24" ,"M", "Pisit", "2023-03-25 23:08:56","Admistrator"), 
("120", "Suphavadee", "Cheng","2002-11-15" ,"F", "Suphavadee", "2023-04-01 20:29:07","Admistrator"), 
("179", "Ponnapassorn", "Iamborisut","2003-02-24" ,"F", "Ponnapassorn", "2023-04-02 04:46:19","Admistrator"),
("181", "Thadeeya", "Duangkaew","2001-08-26" ,"F", "Thadeeya", "2023-04-02 10:37:58","Admistrator"),
("210", "Ravikarn", "Jarungjitvittawas","2003-10-02" ,"F", "Ravikarn", "2023-04-06 16:24:31","Admistrator");



INSERT INTO `ticket` VALUES
('TK_01', 'The 1975 Live in Bangkok','/homepagePic/card/1975con.jpg', 'Mangosteenfest Presents "THE 1975 : At their very best" live in Bangkok 2023', 'Impact Arena', '2023-04-04', '19:00:00', '5000'),
('TK_02', 'WATERBOMB BANGKOK', '/images/WaterBomb-Poster.jpg','Definitely the best summer festival from South Korea, WATERBOMB is on the beginning its 1st WORLD TOUR starting from BANGKOK. Join the same team with your favorite artists and lead your team to the victory.', 'Thunderdome Stadium', '2023-04-13', '12:00:00', '4600'),
('TK_03', 'ABOUT DAMN TIME', '/images/Ph1-Poster.jpg','IMC Live Global is proud to present 2023 pH-1 ABOUT DAMN TIME WORLD TOUR in Bangkok on 19 March 2022, 7 pm at the centralwOrld LIVE.', 'CentralwOrld LIVE', '2023-03-19', '19:00:00', '3800'),
('TK_04', 'Arctic Monkeys Live in Bangkok 2023','/homepagePic/card/arcMon.png', 'The wait is over! Get ready for the indie rock icon of the era and their first live show in Thailand “ARCTIC MONKEYS LIVE IN BANGKOK”, 9 March 2023 at Bitec Hall.', 'BITEC Bangna', '2023-03-09', '18:00:00', '6000'),
('TK_05', 'Pelupo Festival 2023', '/images/Pelupo-Poster.png','Leave your worries behind you and prepare to join us at PELUPO International Music Festival at The Fields at Siam Country Club in Chonburi on March 11, 2023.', 'Siam Country Club, Pattaya, Thailand', '2023-03-11', '15:00:00', '4000');

