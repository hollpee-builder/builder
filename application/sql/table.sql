/***************************************************************************************/
/***************************************************************************************/
CREATE TABLE user_profile (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	data MEDIUMTEXT NULL COMMENT 'массив с данными для элементов',
	template MEDIUMTEXT NULL COMMENT 'шаблоны секций',
) ENGINE=INNODB DEFAULT CHARACTER SET utf8;


CREATE TABLE site_project ( 
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'название группы',
	profile_id INT UNSIGNED NOT NULL COMMENT 'id пользователя',
	date_add DATETIME NULL COMMENT 'дата добавления',
	date_delete DATETIME NULL COMMENT 'дата удаления',
) ENGINE=INNODB DEFAULT CHARACTER SET utf8;

CREATE TABLE site_site (
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	profile_id INT UNSIGNED NOT NULL COMMENT 'id пользователя',
	project_id INT UNSIGNED NULL COMMENT 'id группы',
	style_name VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'название, которое дал пользователь',
	type ENUM('lp', 'site') NOT NULL DEFAULT 'lp' COMMENT 'тип сайта',
	date_add DATETIME NULL COMMENT 'дата добавления страницы',
	date_delete DATETIME NULL COMMENT 'дата удаления, если удаляет',
) ENGINE=INNODB DEFAULT CHARACTER SET utf8;

