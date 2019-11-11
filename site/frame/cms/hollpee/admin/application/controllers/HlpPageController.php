<?php 
/**
* Страница контактов
*
*
*/
class HlpPageController extends HlpAdminController implements HlpIController {
 
	/**
	* Контроллер отдает страницу
	*
	* @return 	html 	страница 
	*/
	function indexAction()
	{	
		$pageId = HlpClear::text($_GET['id']);

		$listPages = HlpSite::getListPage();
		$infoSite = $listPages[$pageId];

		/******/
		$paramsDbPage = array('page_id'=>$pageId);
		// посещения
		$listVisit = HlpDbAnalytics::getInstance()->getListVisitPage($paramsDbPage);
		if (!$listVisit) $listVisit = array();
		// лиды
		$listLead = HlpDbLead::getInstance()->getListPageSts($paramsDbPage);
		if (!$listLead) $listLead = array();
		/*******/

		$abtestPath = HlpFile::getAbtestPath($pageId, HLP_SITE_FOLDER_PATH);
		if (file_exists($abtestPath)) {
			$abtestJson = file_get_contents($abtestPath);
		} else {
			$abtestJson = '{"current_page":"'.$pageId.'","list":{"'.$pageId.'":{"running":"yes"}}}';
			file_put_contents($abtestPath, $abtestJson);
		}

		// динамическиее заголовки
		$adaptiveTitlePath = HlpFile::getDymTitlePath($pageId, HLP_SITE_FOLDER_PATH);
		
		if (file_exists($adaptiveTitlePath)) {
			$adaptiveTitleJson = file_get_contents($adaptiveTitlePath);
		} else {
			$adaptiveTitleJson = '{"list_elm":{},"list_value":{}}';
			file_put_contents($adaptiveTitlePath, $adaptiveTitleJson);
		}

		// url 
		$fullUrl = '/' . HLP_SITE_FOLDER .'/'. $infoSite['file'];
		// list img
		$listImg = HlpFile::getListFile("images", '/'.$infoSite['site_id']);

		$paramsPage = array(
			'site'=>$infoSite,
			'fullUrl'=>$fullUrl,
			'listPages'=>$listPages,
			'abtestJson' => $abtestJson,
			'adaptiveTitleJson' => $adaptiveTitleJson,
			'listImg' => $listImg,
			'listVisit' => $listVisit,
			'listLead' => $listLead,
		);
	
		$content = $this->objView->render('page.php', $paramsPage);
		$stylesheet = '	<link rel="stylesheet" href="'.HlpUrl::attach('/css/page.css').'">
						<link rel="stylesheet" href="'.HlpUrl::attach('/css/editor_file_manager.css').'">
						<script type="text/javascript" src="'.HlpUrl::attach('/js/page/page.js').'"></script>
						<script type="text/javascript" src="'.HlpUrl::attach('/js/page/abtest.js').'"></script>
						<script type="text/javascript" src="'.HlpUrl::attach('/js/page/adaptive_title.js').'"></script>
						<script type="text/javascript" src="'.HlpUrl::attach('/js/page/sts.js').'"></script>
						<script type="text/javascript" src="'.HlpUrl::attach('/js/editor/ManagerFile.js').'"></script>
						<script type="text/javascript" src="'.HlpUrl::attach('/js/main/file.js').'"></script>
						';
		
		$param = array(	'content'=>$content, 
						'stylesheet'=>$stylesheet,
						'title'=>'Страница "'.$infoSite['file'].'"');

		//сформировываем странцу
		$result = $this->objView->render('admin.php', $param);

		$this->objFront->setBody($result);
	}

/*****************************************************************************/
/***abtest**************************************************************************/
	
	/**
	* Сохранение изменения abtest
	*
	*/
	public function saveAbtestAction()
	{
		$siteId = HlpClear::text($_POST['site_id']);
		$abtestJson = $_POST['abtest'];

		$abtestPath = HlpFile::getAbtestPath($siteId, HLP_SITE_FOLDER_PATH);
		file_put_contents($abtestPath, $abtestJson);

		echo 1;
	}

	/**
	* Сохранение adaptive title
	*
	*/
	public function saveAdaptiveTitleAction()
	{
		$siteId = HlpClear::text($_POST['site_id']);
		$adaptiveTitle = $_POST['adaptive_title'];

		$adaptiveTitlePath = HlpFile::getDymTitlePath($siteId, HLP_SITE_FOLDER_PATH);
		echo file_put_contents($adaptiveTitlePath, $adaptiveTitle);
	}


/*****************************************************************************/
	
	/**
	* Сброс статистики
	*
	*
	*/
	public function resetStsAction()
	{
		$pageId = HlpClear::text($_POST['page_id']);
		$params = array('page_id'=>$pageId);

		HlpDbLead::getInstance()->resetSts($params);
		HlpDbAnalytics::getInstance()->resetSts($params);	

		echo 1;
	}


/*****************************************************************************/

} // end class

?>
