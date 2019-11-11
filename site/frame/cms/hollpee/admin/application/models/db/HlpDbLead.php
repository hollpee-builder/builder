<?php  
/**
*
*
*
*/
class HlpDbLead extends HlpDb {
	protected $dbname = 'constructor.db';

	/**
	* Создает таблицу
	*
	* @see 	HlpDbInit::create()
	*/
	public function createTable()
	{
		$sql = "CREATE TABLE lead (
					id INTEGER PRIMARY KEY,
					page_id TEXT NULL,
					variant_id TEXT NULL,
					status TEXT NULL,
					url TEXT NULL,
					form_name TEXT NULL,
					email TEXT NULL,
					name TEXT NULL,
					phone TEXT NULL,
					addr TEXT NULL,
					price TEXT NULL,
					data TEXT NULL,
					ip TEXT NULL,
					os TEXT NULL, 
					device TEXT NULL,
					browser TEXT NULL,
					note TEXT NULL,
					utm_source TEXT NULL,
					no_fixed_sts TEXT NULL,
					date_add TEXT NULL)";
		$res = $this->manipulation($sql);
		if (!$res) return $res;

		$sql = "CREATE TABLE lead_status (
					id INTEGER PRIMARY KEY,
					lead_id INTEGER NULL,
					status TEXT NULL,
					note TEXT NULL,
					date_add TEXT NULL)";
		$res = $this->manipulation($sql);

		return $res;
	}

	/**
	* Добавляет лид
	*
	* @see 	FormController::indexAction()
	*/
	public function add($params)
	{
		$sql = "INSERT INTO lead(page_id, variant_id, status, url, form_name, email, name, phone, price, data, ip, os, device, browser, utm_source, date_add)
					VALUES(:page_id, :variant_id, 'new', :url, :form_name, :email, :name, :phone, :price, :data, :ip, :os, :device, 
							:browser, :utm_source, strftime('%s', 'now', 'localtime'))";
		$res = $this->manipulation($sql, $params);
		
		$resId = $this->select("SELECT last_insert_rowid() as id");
		return $resId[0]['id'];
	}

	/**
	* Добавляет лид
	*
	* @see 	LeadController::deleteAction()
	*/
	public function delete($params)
	{
		$sql = "DELETE FROM lead WHERE id=:lead_id";
		$res = $this->manipulation($sql, $params);
		if (!$res) return false;

		$sql = "DELETE FROM lead_status WHERE lead_id=:lead_id";
		$this->manipulation($sql, $params);

		return $res;
	}

	/**
	* Отдает список лидов
	*
	* @see 	LeadController::indexAction()
	*/
	public function getList($pageId = false)
	{
		if ($pageId) {
			$params = array('page_id'=>$pageId);
			$strWhere = ' WHERE page_id=:page_id ';
		} else {
			$params = array();
			$strWhere = '';
		}

		$sql = "SELECT id, page_id, variant_id, status, url, form_name, email, name, phone, addr, data, price, ip, os, device, browser, note, utm_source,
						strftime('%d-%m-%Y %H:%M', date_add, 'unixepoch') AS date_add
					FROM lead ".$strWhere." 
					ORDER BY id DESC";
		return $this->select($sql, $params);
	}

	/**
	* Отдает список лидов страниц
	*
	* @see 	PageController::indexAction()
	*/
	public function getListPageSts($params)
	{
		$sql = "SELECT id, page_id, variant_id, ip, os, device, browser, price, utm_source, date_add, no_fixed_sts
					FROM lead 
					WHERE page_id=:page_id
						AND no_fixed_sts IS NULL";
		return $this->select($sql, $params);
	}

	/**
	* Отдает список лидов для экспорта
	*
	* @see 	HlpLead::export()
	*/
	public function getListExport($params)
	{
		$sql = "SELECT * FROM lead";
		return $this->select($sql, $params);
	}

	/**
	* Отдает количесто новых лидов
	*
	*
	*/
	public function getCountNew()
	{
		$sql = "SELECT COUNT(id) AS count
					FROM lead
					WHERE status = 'new'";
		$res = $this->select($sql);

		if ($res) return $res[0]['count'];
	}

	/**
	* Изменяет примечание
	*
	* @see 	LeadController::editNoteAction()
	*/
	public function editNote($params)
	{
		$sql = "UPDATE lead 
					SET note = :note
					WHERE  id = :id";
		return $this->manipulation($sql, $params);
	}

	/** 
	* Отдает количество от определенной даты
	*
	* @see 	Anylytics::getMainData()
	*/
	public function getCountFromDate($params)
	{
		$sql = "SELECT COUNT(id) AS count
					FROM lead
					WHERE date_add > :from_date";
		$count = $this->select($sql, $params);
		
		if ($count) return $count[0]['count'];
		else return 0;
	}

/*********************************************************************************/
	// для оплаты

	/**
	* Отдает page_id по id лида
	*
	*
	* @see 	HlpPaymentController.getServicePropert()
	*/
	public function getPageId($params)
	{
		$sql = "SELECT page_id
					FROM lead
					WHERE id = :lead_id";
		$res = $this->select($sql, $params);
		
		if ($res) return $res[0]['page_id'];
		else return 0;
	}

	

/*********************************************************************************/
/************************************************************************************/
	
	/**
	* Отдает лид
	*
	* @see 	LeadController::detailAction()
	*/
	public function get($params)
	{
		$sql = "SELECT id, status, url, form_name, email, name, phone, addr, data, price, ip, os, device, browser, note, utm_source,
						strftime('%d-%m-%Y %H:%M', date_add, 'unixepoch') AS date_add
					FROM lead
					WHERE id = :lead_id";
		$res = $this->select($sql, $params);
		if ($res) return $res[0];
		else return false;
	}

	public function setStatusSuccess($leadId)
	{
		$params = array('lead_id'=>$leadId);
		
		$sql = "UPDATE lead 
					SET sale_status = 'yes'
					WHERE id = :lead_id";
		return $this->manipulation($sql, $params);
	}

/*******************************************************************************/
	
	/**
	* Добавляет лид
	*
	* @see 	Lead::addNew()
	* @see 	LeadController::uploadStatus()
	*/
	public function addStatus($params)
	{
		$sql = "INSERT INTO lead_status(lead_id, status, note, date_add)
					VALUES(:lead_id, :status, :note, strftime('%s', 'now', 'localtime'))";
		$res = $this->manipulation($sql, $params);
		
		// отмечаем статус продажии лиду
		if ($res && $params['status'] == 'success') {
			$this->setStatusSuccess($params['lead_id']);
		}

		return $res;
	}

	/**
	* Отдает количесто новых лидов
	*
	* @see 	LeadController::detailAction()
	*/
	public function getListStatusLead($params)
	{
		$sql = "SELECT status, note, strftime('%d-%m-%Y %H:%M', date_add, 'unixepoch') AS date_add
					FROM lead_status
					WHERE lead_id = :lead_id
					ORDER BY id DESC";
		return $this->select($sql, $params);
	}

	/**
	* Отмечает лид как прочитаный
	*
	* @see 	LeadController::markLeadReadAction()
	*/
	public function markLeadRead($params)
	{
		$sql = "UPDATE lead 
					SET status = 'read'
					WHERE id = :lead_id";
		return $this->manipulation($sql, $params);
	}

/*******************************************************************************/
	
	/**
	* Отмечает лид как прочитаный
	*
	* @see 	LeadController::editLeadDataAction()
	* @see 	LeadController::uploadStatus()
	*/
	public function editLeadProperty($params, $type)
	{
		$sql = "UPDATE lead 
					SET $type = :value
					WHERE id = :lead_id";
		return $this->manipulation($sql, $params);
	}


/*******************************************************************************/
	
	/**
	* Отдыет список лидов сайта для статистики 
	*
	* @see 	PageController::indexAction()
	*/
	public function getListForSiteAnalytics($params)
	{
		$sql = "SELECT variant, utm_source, os, device, browser, day, hour, date_add
					FROM lead
					WHERE site_id = :site_id";
		return $this->select($sql, $params);
	}

/*******************************************************************************/
	
	/**
	* Сброс статистики лидов
	*
	* @see 	HlpPageController::resetStsAction()
	*/
	public function resetSts($params)
	{
		$sql = "UPDATE lead
					SET no_fixed_sts = 'yes'
					WHERE page_id = :page_id";
		return $this->manipulation($sql, $params);
	} 

	/**
	* Сброс статуса новый
	*
	* @see 	HlpPageController::resetStatusNewAction()
	*/
	public function resetStatusNew()
	{
		$sql = "UPDATE lead
					SET status = 'read'
					WHERE status = 'new'";
		return $this->manipulation($sql);
	} 

/*******************************************************************************/
	


/*******************************************************************************/


} // end class

?>
