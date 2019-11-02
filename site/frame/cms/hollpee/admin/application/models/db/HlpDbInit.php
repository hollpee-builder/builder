<?php  
/**
* Инициализация bd
*
*
*/
class HlpDbInit extends HlpDb {
	protected $dbname = 'admin.db';
	
	/**
	* Создает базы данных
	*
	* @see 	MainController->__construct()
	*/
	public function create()
	{
		$isCreate = false;

		// если не создана таблица
		$dbAdminObj = HlpDbAdmin::getInstance();
		if (!$dbAdminObj->isExistsTable("profile")) {
			$dbAdminObj->createTable();
			$isCreate = true;
		}

		// таблица лидов
		$dbLeadObj = HlpDbLead::getInstance();
		if (!$dbLeadObj->isExistsTable("lead")) {
			$dbLeadObj->createTable();
		}

		// таблица аналитики
		$dbAnalyticsObj = HlpDbAnalytics::getInstance();
		if (!$dbAnalyticsObj->isExistsTable("visit")) {
			$dbAnalyticsObj->createTable();
		}

		return $isCreate;
	}


} // end class

?>
