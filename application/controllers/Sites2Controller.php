<?php 
/**
* Список страниц пользователя
*
*
*
* @uri /pages
*/
class Sites2Controller extends AdminController implements IController {
	public function __construct()
	{
		parent::__construct();
		$this->objDbSite = DbSite::getInstance();
	}

	/**
	* Отдает Landing Page
	*
	*
	*/
	public function indexAction()
	{	
		/*********************/
		DbInit::getInstance()->create();
		/**********************/

		$projectId = @Clear::leaveNumber($_GET['project']);
		//страница стилей
		$objAttach = new AttachListSites($this->user_id, $projectId);
		$resAttach = $objAttach->get(); 
		$content = $resAttach['content'];
		$listSites = $resAttach['listSites'];
		
		// устанавливаем project в session
		$this->setSessionProject($projectId);
		
		$stylesheet = '	<link rel="stylesheet" href="'.Url::get('/css/sites.css').'">
						<script type="text/javascript" src="'.Url::get('/js/main/file.js').'"></script>
						<script type="text/javascript" src="'.Url::get('/js/sites.js').'"></script>
						<script type="text/javascript" src="'.Url::get('/js/formating/formating.js').'"></script>
						<script type="text/javascript" src="'.Url::get('/js/formating/formating_html.js').'"></script>
						<script type="text/javascript" src="'.Url::get('/js/formating/formating_css.js').'"></script>
						<script type="text/javascript" src="'.Url::get('/js/formating/formating_widget.js').'"></script>
						';



		$countSites = count($listSites);
		if ($countSites == 1) $strSites = 'сайт';
		else if ($countSites > 1 && $countSites <= 4) $strSites = 'сайта';
		else $strSites = 'сайтов';

		$param = array(	'content'=>$content, 
						'stylesheet'=>$stylesheet,
						'titleContent'=>'Сайты',
						'titleContentDesc'=>'Количество: '.$countSites.' '.$strSites,
						'navLP'=>'true',
						'type'=>'site',
						'profileId'=>$this->user_id);
		//сформировываем странцу
		$result = View::render('admin.php', $param);
		
		$result .= "<script> $('.navSite').attr('chosen', 'true');</script>";
		
		// вывод результата
		$this->objFront->setBody($result);

	}


	private function setSessionProject($projectId)
	{
		if ($projectId) {
			// устанавливаем project
			$_SESSION['project'] = $projectId;
		} else {
			// если нету id project
			$paramsFirstProject = array('profile_id'=>$this->user_id);
			$newProjectId = $this->objDbSite->getFirstProjectId($paramsFirstProject); 
			$_SESSION['project'] = $newProjectId[0]['id'];
		}
	}


/*************************************************************************************************/
/************************************************************************************************/
	/**
	* Добавляет проект
	*
	*/
	public function createProjectAction()
	{
		//название папки
		$name = Clear::leaveLettersAndNumber($_POST['name']);

		if ($name) {
			//создаем проект
			$params = array('profile_id'=>$this->user_id, 'name'=>$name);
			$newProjectId = $this->objDbSite->createProject($params);
			
			if ($newProjectId) {
				// ставим в сессию
				$_SESSION['project'] = $newProjectId;
				// перенаправляем на новый проект
				header('Location: /sites2/?project='.$newProjectId);
				exit;
			}  
		}
		//возращяем обратно
		header('Location: '.$_SERVER['HTTP_REFERER']);
	}

	/**
	* Изменить название группы
	* 
	* @query ajax
	*/
	public function editProjectAction()
	{
		//id группы
		$projectId = Clear::leaveNumber($_POST['project_id']);
		$name = Clear::leaveLettersAndNumber($_POST['name']);
		$params = array(
			'profile_id'=>$this->user_id,
			'project_id'=>$projectId,
			'name'=>$name);

		$res = $this->objDbSite->editNameProject($params);
		if ($res) echo true;
	}

	/**
	* Удаляем проект
	*
	*/
	public function deleteProjectAction()
	{
		//id группы
		$projectId = Clear::leaveNumber($_GET['project_id']);
		$params = array(
			'profile_id'=>$this->user_id,
			'project_id'=>$projectId);

		$res = $this->objDbSite->deleteProject($params);
		
		//перенаправляем 
		if ($res) {
			header('Location: /sites2');
		} else {
			header('Location: '.$_SERVER['HTTP_REFERER']);
		}
	}
/**********************************************************************************************/
/*******************************************************************************************/
	/**
	* изменить название страницы
	*
	*
	*/
	function editNameSiteAction()
	{
		//название
		$name = Clear::leaveLettersAndNumber($_POST['name']);
		$type = Clear::leaveLettersAndNumber($_POST['type']);

		$maxCountChar = $type == 'comment' ? 1000 : 256;
		$name = substr($name, 0, $maxCountChar);

		//id сраницы
		$siteId = Clear::leaveNumber($_POST['site_id']);
		// параметры
		$params = array(
			'profile_id'=>$this->user_id, 
			'site_id'=>$siteId, 
			'name'=>$name
		);

		//запрос на сервер
		if ($type == 'comment') {
			$res = $this->objDbSite->editSiteComment($params, $column);
		} else {
			$res = $this->objDbSite->editSiteName($params, $column);
		}
		
		if ($res) echo true;
	}

/*********************************************************************************************/
	/**
	* Переместить
	*
	*
	*/
	public function moveSiteAction() {
		//id сраницы
		$siteId = Clear::leaveNumber($_POST['site_id']);
		$projectId = Clear::leaveNumber($_POST['project_id']);
		$params = array(
			'profile_id'=>$this->user_id, 
			'site_id'=>$siteId,
			'project_id'=>$projectId);
		//перемещаем
		$res = $this->objDbSite->moveSite($params);
		if ($res) echo true;
	}
/********************************************************************************************/
	/**
	* Удаляем сайт
	*
	*
	*/
	public function deleteSiteAction()
	{
		//id сраницы
		$siteId = Clear::leaveNumber($_POST['site_id']);
		if (!$siteId) return false;
		

		$params = array('profile_id'=>$this->user_id, 'site_id'=>$siteId);
		// перемещаем картинки
		Image::deleteFolderImage($this->user_id, $siteId);

		//удаляем
		$res = $this->objDbSite->deleteFullSite($params);
		
		echo true;
	} 
/********************************************************************************************/
	/**
	* Копируем страницу
	*
	*
	*/
	public function copySiteAction()
	{
		//id сраницы
		$siteId = Clear::leaveNumber($_POST['site_id']);
		
		$params = array("profile_id"=>$this->user_id, "site_id"=>$siteId);

		//копируем страницу
		$newSiteId = $this->objDbSite->copySite($params);
		if (!$newSiteId) return false;

		// пути
		$pathUser = $_SERVER['DOCUMENT_ROOT'].'/user/'.$this->user_id;
		$pathOldSite = $pathUser.'/'.$siteId;
		$pathNewSite = $pathUser.'/'.$newSiteId;

		//копируем файлы
		Site::copy($pathOldSite, $pathNewSite);
		// замена картинок
		$noMain = true;
		Image::replaceImage($this->user_id, $newSiteId, $noMain);

		// возращаем новый id
		echo $newSiteId;
	}  

/*********************************************************************************/
	
} // end class



?>