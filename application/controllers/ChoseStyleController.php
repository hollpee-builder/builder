<?php 
/**
* Добавление новой страницы
*
*
*/
class ChoseStyleController extends AdminController implements IController {
	private $siteType;
	private $pathStyle;
 
	/**
	* Контроллер отдает страницу
	*
	* @return 	html 	страница 
	* @uses 	AttachChoseStyle::getPagesGroup() 	/application/models/atach/AttachChoseStyle.php 	сформировывает страницу 'выбо стиля'
	*/
	function indexAction()
	{	
		//получить страницы
		$listSites = $this->getListStyle();	
		$error = '';
		$paramChoseStyle = array(	'error'=>$error,//ошибка
									'listSites'=>$listSites);//выбор стилей

		$content = $this->objView->render('chosestyle.php', $paramChoseStyle);
		$stylesheet = '	<link rel="stylesheet" href="'.Url::get('/css/chose_style.css').'">
						<script type="text/javascript" src="'.Url::get('/js/chose_style_even.js').'"> </script>';
		$titleContent = Resource::$page_chosenstyle_title;
		
		$param = array(	'content'=>$content, 
						'stylesheet'=>$stylesheet,
						'titleContent'=>$titleContent,
						'type'=>'site',
						'profileId'=>$this->user_id);

		//сформировываем странцу
		$result = $this->objView->render('admin.php', $param);
		$result .= "<script> $('.navChoseStyle').attr('chosen', 'true');</script>";

		$this->objFront->setBody($result);

	}

	/**
	* Отдает список стилей
	*
	* @see 	$this->indexAction()
	*/
	private function getListStyle()
	{
		$listStyle = array('lp'=>array(),'mlp'=>array(), 'longreads'=>array());
		$listType = array('lp', 'mlp', 'longreads');

		foreach ($listType as $styleType) {
			$pathType = $_SERVER['DOCUMENT_ROOT'].'/site/style/'.$styleType.'/';
			$dir = opendir($pathType);
			while ($folder = readdir($dir)) {
				if ($folder == '.' || $folder == '..') continue;
				$listStyle[$styleType][$folder] = 'avatar.png';
			}
			closedir($dir);
		}

		return $listStyle;
	}
/******************************************************************************************/

	/**
	* Отдает блок со страницами заданой группы
	* @query 	ajax
	*
	* @return 	html 	 блок страниц группы
	*
	* @uses 	/application/modal/attach/AttachChoseStyle::getSitesCategory() 	получает сформированый блок со страницы опредленной группыы
	*/
	public function getSitesCategoryAction()
	{
		$category = Clear::leaveNumber($_POST['category']);
		echo $this->objAttach->getSitesCategory($category);	
	}

/*****************************************************************************************/

	/**
	* Добавление стиля
	*
	*
	*/
	public function addStyleSiteAction()
	{		
		// параметры стиля
		$paramsSite = array();
		$paramsSite['profile_id'] = $this->user_id;
		$paramsSite['style_type'] = Clear::leaveLettersAndNumber($_GET['style_type']);
		$paramsSite['style_name'] = Clear::leaveLettersAndNumber($_GET['style_name']);
		$paramsSite['style_id'] = Clear::leaveLettersAndNumber($_GET['style_id']);

		// создаем сайт
		$siteObj = new Site();
		$newSiteId = $siteObj->addStyleSite($paramsSite);
		
		if ($newSiteId) {
			// перенаправляем на страницу редактора
			$editorHref = '/editor/?site='.$newSiteId;
			header('Location: '.$editorHref);
		} else {
			header('Location: '.$_SERVER['HTTP_REFERER']);
		}
	}


/*****************************************************************************************/
/*****************************************************************************************/
/*****************************************************************************************/
/*****************************************************************************************/

	/**
	* Копирует сайты для нового сайта
	*
	* @see this.addStyleSiteAction
	*/
	private function copyFileForNewSite($newSiteId)
	{
		// создаем папку для картинок
		$pathNewSite = $_SERVER['DOCUMENT_ROOT'].'/user/'.$this->user_id.'/'.$newSiteId;
		Dir::remove($pathNewSite);
		mkdir($pathNewSite);
		mkdir($pathNewSite.'/img'); // папка картинок
		mkdir($pathNewSite.'/file'); // папка видео
		mkdir($pathNewSite.'/fonts'); // шрифт
		// перемещаем
		Dir::copy($this->pathStyle.'/img', $pathNewSite.'/img');
		Dir::copy($this->pathStyle.'/file', $pathNewSite.'/file');
		Dir::copy($this->pathStyle.'/fonts', $pathNewSite.'/fonts');
		copy($this->pathStyle.'/avatar.png', $pathNewSite.'/avatar.png');

	}


	/**
	* Отдает стиль который добавляем
	*
	* @see 	$this->addStyleSiteAction
	*/
	private function getStyleAdd()
	{
		$styleId = Clear::leaveNumber($_GET['style_id']);
		$styleType = $this->getSiteType($_GET['style_type']);
		
		$styleName = Clear::leaveLettersAndNumber($_GET['style_name']);

		$pathStyle = $_SERVER['DOCUMENT_ROOT'].'/site/style/'.$styleType.'/'.$styleId;
		$this->pathStyle = $pathStyle;
		$siteString = file_get_contents($pathStyle.'/site.txt');
		
		$projectId = $_SESSION['project'];
		$paramsProject = array('profile_id'=>$this->user_id, 'project_id'=>$projectId);
		$isProjectExists = DbSite::getInstance()->isProjectExists($paramsProject);
		if (!$isProjectExists) {
			$projectId = DbSite::getInstance()->getFirstProjectId(array('profile_id'=>$this->user_id));
			$projectId = $projectId[0]['id'];
		}

		/*******/
		$site = array();
		$site['profile_id'] = $this->user_id;
		$site['project_id'] = $projectId;
		$site['style_id'] = $styleId;
		$site['style_name'] = $styleName;
		$site['type'] = $styleType;
		
		$siteCode = json_decode($siteString, true);
		unset($siteCode['profile_id']);
		unset($siteCode['project_id']);
		unset($siteCode['site_id']);
		unset($siteCode['style_id']);
		unset($siteCode['style_name']);
		$site['code'] = json_encode($siteCode, true);
		/*******/

		return $site;
	}


/*******************************************************************************************/
	/**
	* Просмотр
	* 
	* @return 	html 	отдает сраницу 	
	*
	* @uses 	DbStyle::getStyleSite()  /application/models/db/DbStyle.php 	выбирает с бд определенную страницу
	*/
	public function showAction()
	{		
		// id страницы
		$styleId = Clear::leaveNumber($_GET['id']);
		$styleType = $this->getSiteType($_GET['type']);
		$folder = '/site/style/'.$styleType.'/'.$styleId;
		$pathStyle = $_SERVER['DOCUMENT_ROOT'].$folder;

		// нету страницы
		if (!file_exists($pathStyle)) {
			header("Location: /error404"); 
			exit;
		}

		$pathFileShow = $pathStyle.'/show.txt';
		
		/***************/
		// если нет файла show, создаем его 
		if (!file_exists($pathFileShow)) {
			$pathFileSite = $pathStyle.'/site.txt';
			$fileSite = file_get_contents($pathFileSite);
			$fileSite = preg_replace("|[\\\]+/|", '/',  $fileSite);
			$fileSite = preg_replace("|/user/[0-9]+/[^/]+|", $folder,  $fileSite);
			file_put_contents($pathFileShow, $fileSite);
		}
		/**************************/

		$fullSite = file_get_contents($pathFileShow);
		$fullSite = json_decode($fullSite, true);
		
		// добавляем фрифты
		$font = DbUserProfile::getInstance()->getFont(array('profile_id'=>$this->user_id));
		$fullSite["font"] = $font;
		
		$fullSite = json_encode($fullSite, true);
		$content = '<div class="dataJson" style="display:none;">'.$fullSite.'</div>
					<div class="content"></div>';

		//сформировываем странцу
		$params = array(
			'content'=>$content,
			'headCss'=>'<link rel="stylesheet" href="/site/frame/css/style.css">',
			'headScript'=>'
						<script type="text/javascript" src="'.Url::attachRoot('/js/jquery-1.10.2.min.js').'"></script>
						<script type="text/javascript" src="/js/html.js"></script>
						<script type="text/javascript" src="/js/show.js"></script>
						<script type="text/javascript" src="/site/frame/js/widget.js"></script>'
			);

		$result = View::render('user_page.php', $params);

		echo $result;
	}
/************************************************************************************/	
	

	/**
	* Отдает тип сайта
	*
	* @see 	this::getStyleAdd()
	* @see 	this::showAction()
	*/
	function getSiteType($type)
	{
		if ($type == 'mlp') $siteType = 'mlp';
		else if ($type == 'longreads') $siteType = 'longreads'; 
		else $siteType = 'lp';

		return $siteType;
	}

}//end class

?>

