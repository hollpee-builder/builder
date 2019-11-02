<?php 
/**
* Работа со страницей
* 
* @see 		
*/
class DbSite extends Db {

	/**
	* Отдает информацию о сайте
	*
	* @see 	PageController::indexAction()
	* @see 	LeadController::detailAction()
	* @see 	DownloadController::createHtmlAction()
	*/
	public function getInfo($params)
	{
		$sql = 'SELECT id as site_id, profile_id, project_id, style_name, type
					FROM site_site
					WHERE profile_id=:profile_id 
						AND id = :site_id
						AND date_delete IS NULL';
		$res = $this->select($sql, $params);
		if ($res) return $res[0];
		else return false;
	}


	/**
	* Копирует сайт
	*
	* IndexController::copySiteAction()
	*/
	public function copySite($params)
	{
		// получаем весь сайт польность
		$fullSite = $this->getFullSite($params);
		$fullSite['style_name'] = $fullSite['style_name'].' (копия)';
		$params = array_merge($params, $fullSite);
		unset($fullSite['site_id']);
		
		
		// добавляем сайта
		$newSiteId = $this->addFullSite($fullSite);

		if ($newSiteId) return $newSiteId;
		else return false; 
	}

	/**
	* Добавляет полностью сайт
	*
	* @see this::addNewSite(), this::copySite()
	*/	
	public function addFullSite($params)
	{
		$codeJson = $params['code'];
		unset($params['code']);

		$sql = "INSERT INTO site_site(profile_id, project_id, style_name, type, date_add)
					VALUES (:profile_id, :project_id, :style_name, :type, strftime('%s', 'now', 'localtime'))";
		$siteId = $this->insert($sql, $params);

		/*заменяем данные*******/
		$code = json_decode($codeJson, true);
		$code['site_id'] = $siteId;
		$code['profile_id'] = $params['profile_id'];


		/*******/
		$codeJson = json_encode($code, true);
		$fileFolderPath = $_SERVER['DOCUMENT_ROOT'] . '/user/' . $params['profile_id'] . '/' . $siteId;
		if (!file_exists($fileFolderPath)) mkdir($fileFolderPath);
		$filePath = $fileFolderPath . '/code.txt';
		file_put_contents($filePath, $codeJson);

		/*******/

		return $siteId;
	}

	/**
	* Отдает полностью сайт
	*
	* @see 	this::copySite()
	* @see 	FormatPage->getPageData()
	* @see 	IndexController->showSiteAction()
	*/
	public function getFullSite($params)
	{
		$sql = 'SELECT id as site_id, profile_id, project_id, style_name, type
					FROM site_site
					WHERE profile_id=:profile_id 
						AND id = :site_id
						AND date_delete IS NULL';
		$res = $this->select($sql, $params);
		if (!$res) return false;
		$res = $res[0];

		/********/
		$sitePath = $_SERVER['DOCUMENT_ROOT'] . '/user/' . $params['profile_id'] . '/' . $params['site_id'];
		$filePath = $sitePath . '/code.txt';
		if (file_exists($filePath)) {
			$res['code'] = file_get_contents($filePath);

			/**для cms***********/
			unset($res['cms_site_id']);
			/*************/
		}
		/*******/

		return $res;
	}


	private function addCmsSiteId($params)
	{
		$sql = "UPDATE site_site SET cms_site_id=:cms_site_id WHERE id=:id";
		return $this->manipulation($sql, $params);
	}

/*************************************************************************************************/
/***список сайтов*******************************************************************************************/
	/**
	* Отдает список сайтов пользователя определенной группы
	*
	* @param 	int 	$userId - id пользователя 
	* @param 	int 	$groupId - id группы 
	* @return  	array 	список страниц
	*
	* @see 	attachListPages::getBlockSites()
	* @see 	ConsultantController::getSiteAction()
	*/
	public function getListSitesUser($params, $projectId = false) 
	{
		if ($projectId) {
			$sqlProject = " AND project_id = :project_id ";
			$params["project_id"] = $projectId;
		} else {
			$sqlProject = '';
		}

		$sql = 'SELECT id, project_id, style_name, type, date_add
					FROM site_site 
					WHERE profile_id = :profile_id ' 
						.$sqlProject
						.' AND date_delete IS NULL
					';


		return $this->select($sql, $params);	
	}

/********************************************************************************************/
	/**
	* Удалить полностью сайт
	*
	* @param 	array 	параметры 	
	*
	* @see 	IndexController::deleteSiteAction() 	account
	*/
	public function deleteFullSite($params)
	{
		$sql = "UPDATE site_site SET date_delete=strftime('%s', 'now', 'localtime')
		 			WHERE profile_id = :profile_id 
		 				AND id = :site_id";
		return $this->manipulation($sql, $params);
	}

/********************************************************************************************/
	/**
	* Изменяет имя страницы или файла
	*
	*
	* @see 	IndexController::editNameSiteAction()
	*/
	public function editSiteName($params)
	{
		$sql = "UPDATE site_site 
					SET style_name=:name
		 			WHERE profile_id = :profile_id 
		 				AND id = :site_id
		 				AND date_delete IS NULL";
		return $this->manipulation($sql, $params);
	}


/**************************************************************************************/
	/**
	* Переместить сайт
	*
	* @see 	IndexController::moveSiteAction()
	*/
	public function moveSite($params)
	{
		$sql = "UPDATE site_site 
					SET project_id=:project_id
		 			WHERE profile_id = :profile_id 
		 				AND id = :site_id
		 				AND date_delete IS NULL";
		return $this->manipulation($sql, $params);
	}
/************************************************************************************************/
/****проект******************************************************************************************/
	/**
	* Отдает список проектов пользователя 
	*
	* @param 	int 	$idUser - id пользователя
	* @return  	arr 	список групп пользователя
	*
	* @see  	AttachListPages::getListGroup() 	/application/modal/attach/AttachListPages.php
	*/
	public function getListProject($params) 
	{
		$sql = "SELECT id AS project_id, name
					FROM site_project
					WHERE profile_id = :profile_id
					AND date_delete IS NULL
				";
		return $this->select($sql, $params);	
	}
	/**
	* Создает проект
	*
	* @see DbUserProfile->addNewProfile()
	*/
	public function createProject($params)
	{
		$sql = "INSERT INTO site_project(name, profile_id, date_add)
					VALUES(:name, :profile_id, strftime('%s', 'now', 'localtime'))";
		return $this->insert($sql, $params);
	}

	/**
	* Отдает первый проект пользователя
	*
	* @see 	IndexController::createProjectAction()
	* @see 	ChosenStyleController::getStyleAdd()
	*/
	public function getFirstProjectId($params)
	{
		$sql = "SELECT MIN(id) AS id
					FROM site_project 
					WHERE profile_id=:profile_id
						AND date_delete IS NULL";
		return $this->select($sql, $params);
	}

	/**
	* Есть ли проект
	*
	* @see 	ChosenStyleController::getStyleAdd()
	*/
	public function isProjectExists($params)
	{
		$sql = "SELECT id 
					FROM  site_project 
					WHERE id=:project_id
					 	AND profile_id=:profile_id";
		$res = $this->select($sql, $params);
		
		if ($res) return $res[0]['id'];
		else return false;
	}

	/**
	* Создает проект
	*
	* @see 	IndexController::editProjectAction()
	*/
	public function editNameProject($params)
	{
		$sql = "UPDATE site_project 
					SET name=:name
					WHERE id=:project_id
					 	AND profile_id=:profile_id
					 	AND date_delete IS NULL";
		return $this->manipulation($sql, $params);
	}

	/**
	* Удаляет проект
	*
	* @see 	IndexController::deleteProjectAction()
	*/
	public function deleteProject($params)
	{
		$sql = "UPDATE site_project 
					SET date_delete=strftime('%s', 'now', 'localtime')
					WHERE id=:project_id
					 	AND profile_id=:profile_id";
		return $this->manipulation($sql, $params);
	}
/********************************************************************************************/
/***добавление нового сайта(стиль)****************************************************************************************/
	/**
	* Добавляет новый стиль
	*
	* @uses 	this::addNewOption() 	добавление нового варианта
	* @see 		ChoseStyleConstroller::addStyleSiteAction()
	*/
	public function addNewSite($params) 
	{ 
		// получаем сайт 
		$fullSite = $this->getNewFullSite($params);
		if (!$fullSite) return fasle;

		// вставляем сайт
		$newSiteId = $this->addFullSite($fullSite);	  

		if ($newSiteId) return $newSiteId;
		else return false;
	}

	/**
	* получаем новый сайт полностью
	*
	* @see 	this.addNewSite()
	*/
	private function getNewFullSite($params)
	{
		$profileId = $params['style_id'];
		// получаем сайт
		$paramsQuery = array('site_id'=>$profileId);
		$arrStyle = DbStyle::getInstance()->getSite($paramsQuery);
		$fullSite = array_merge($params, $arrStyle[0]);
		
		// получаем все страницы и формируем массив
		$listAllPages = DbStyle::getInstance()->getAllPagesSite($paramsQuery);
		$fullSite['pages'] = $listAllPages;
		
		return $fullSite;
	}
/*****************************************************************************************/
/**************************************************************************************/
	/**
	* Отдает количество страниц в каждом проекте
	*
	* @param 	int 	$idUser - id пользователя
	* @return  	arr 	количество страниц по группам
	*
	* @see  	AttachListPages::getListCountPages() 	/application/modal/attach/AttachListPages.php
	*/
	public function getCountSitesInProject($params) 
	{
		$sql = "SELECT project_id, COUNT(project_id) AS count
					FROM site_site
					WHERE profile_id = :profile_id
						 AND date_delete IS NULL
					GROUP BY project_id";
		return $this->select($sql, $params);
	}

	/**
	* Отдает количество сайтов у пользователя
	*
	* @see 	DbUserProfile->uploadCountSite()
	*/
	public function getCountSiteUser($params)
	{
		$sql = "SELECT COUNT(id) AS count_site
					FROM site_site
					WHERE profile_id = :profile_id
						AND date_delete IS NULL";
		$res = $this->select($sql, $params);
		return $res[0]['count_site'];
	}


} // end class

?>
