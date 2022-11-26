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

 Date: 26/11/2022 23:10:49
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tags_users_relation
-- ----------------------------
DROP TABLE IF EXISTS `tags_users_relation`;
CREATE TABLE `tags_users_relation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

-- ----------------------------
-- Records of tags_users_relation
-- ----------------------------
BEGIN;
INSERT INTO `tags_users_relation` (`id`, `tag_id`, `user_id`) VALUES (1, 1, 7);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
