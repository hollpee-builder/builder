<?php  
/**
* Инициализация bd
*
*
*/
class DbInit extends Db {
	/**
	* Создает базы данных
	*
	* @see 	MainController->__construct()
	*/
	public function create()
	{
		$isCreate = false;

		// если не создана таблица
		$dbObj = self::getInstance();
		if (!$dbObj->isExistsTable("user_profile")) {
			$this->createUserProfile();
		}

		if (!$dbObj->isExistsTable("site_site")) {
			$this->createSiteSite();
		}

		if (!$dbObj->isExistsTable("site_project")) {
			$this->createSiteProject();	
		}
	}


	private function createUserProfile()
	{
		$sql = "CREATE TABLE user_profile (
					id INTEGER PRIMARY KEY,
					data TEXT NULL,
					template TEXT NULL)";
		$res = $this->manipulation($sql);
		
		$sql = "INSERT INTO user_profile(id, data, template) VALUES(1, '', '')";
		$newUserId = $this->insert($sql);
	}

	private function createSiteSite()
	{
		$sql = "CREATE TABLE site_site (
					id INTEGER PRIMARY KEY,
					profile_id TEXT NULL,
					project_id TEXT NULL, 
					style_name TEXT NULL, 
					type TEXT NULL,
					date_add TEXT NULL,
					date_delete TEXT NULL)";
		$res = $this->manipulation($sql);
		if (!$res) return $res;
	}

	private function createSiteProject()
	{
		$sql = "CREATE TABLE site_project (
					id INTEGER PRIMARY KEY,
					profile_id TEXT NULL,
					name TEXT NULL,
					date_add TEXT NULL,
					date_delete TEXT NULL)";
		$res = $this->manipulation($sql);

		$sql = "INSERT INTO site_project(id, profile_id, name, date_add) 
					VALUES(1, 1, 'Первый проект', strftime('%s', 'now', 'localtime'))";
		$newUserId = $this->insert($sql);
	}

} // end class

?>
