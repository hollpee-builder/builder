<?php  
/**
*
*
*
*/
class HlpDbAnalytics extends HlpDb {
	protected $dbname = 'analytics.db';

	/**
	* Создает таблицу
	*
	* @see 	DbInit::create()
	*/
	public function createTable()
	{
		$sql = "CREATE TABLE visit (
					id INTEGER PRIMARY KEY,
					page_id TEXT NULL,
					variant_id TEXT NULL,
					url TEXT NULL,
					url_referer TEXT NULL,
					utm_source TEXT NULL,
					ip TEXT NULL,
					os TEXT NULL, 
					device TEXT NULL,
					browser TEXT NULL,
					date_visit TEXT NULL)";
		return $this->manipulation($sql);
	}

	/**
	* Фиксирует визит
	*
	* @see 	HlpAnalytics::fixedVisit()
	*/
	public function fixedVisit($params)
	{
		$sql = "INSERT INTO visit(page_id, variant_id, url, url_referer, ip, device, os, browser, utm_source, date_visit)
					VALUES(:page_id, :variant_id, :url, :url_referer, :ip, :device, :os, :browser, :utm_source, strftime('%s', 'now', 'localtime'))";

		return $this->manipulation($sql, $params);
	}

	/** 
	* Отдает количество от определенной даты
	*
	* @see 	Anylytics::getMainData()
	*/
	public function getCountFromDateSite($params)
	{
		$sql = "SELECT COUNT(id) AS count
					FROM visit
					WHERE date_visit > :from_date
							AND page_id IS NULL";

		$count = $this->select($sql, $params);

		if ($count) return $count[0]['count'];
		else return 0;
	}

	/**
	* Отдает визит для страницы
	*
	* @see 	HlpAnalytics::fixedVisit()
	*/
	public function getListVisitPage($params)
	{
		$sql = "SELECT * FROM visit WHERE page_id=:page_id ORDER BY id DESC";
		return $this->select($sql, $params);
	}

/************************************************************************************/
	
	/**
	* Сброс статистики
	*
	* @see 	HlpPageController::resetStsAction()
	*/
	public function resetSts($params)
	{
		$sql = "DELETE FROM visit
					WHERE page_id = :page_id";
		return $this->manipulation($sql, $params);
	}

/************************************************************************************/


} // end class


?>
