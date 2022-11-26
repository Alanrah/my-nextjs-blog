/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80031 (8.0.31)
 Source Host           : localhost:3306
 Source Schema         : tomas

 Target Server Type    : MySQL
 Target Server Version : 80031 (8.0.31)
 File Encoding         : 65001

 Date: 26/11/2022 23:10:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `follow_count` int DEFAULT NULL,
  `article_count` int DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of tags
-- ----------------------------
BEGIN;
INSERT INTO `tags` (`id`, `title`, `icon`, `follow_count`, `article_count`, `create_time`, `update_time`) VALUES (1, 'HTML', 'Html5Outlined', 0, 0, '2022-11-26 21:48:41', '2022-11-26 21:48:44');
INSERT INTO `tags` (`id`, `title`, `icon`, `follow_count`, `article_count`, `create_time`, `update_time`) VALUES (2, 'Github', 'GithubOutlined', 0, 0, '2022-11-26 21:49:12', '2022-11-26 21:49:14');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
