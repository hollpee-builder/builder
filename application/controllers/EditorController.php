<?php  
/**
* Редактирование стриницы
*
*
*
*
*/
class EditorController extends AdminController implements IController {
	/**
	*
	*
	*/
	function __construct()
	{
		parent::__construct();
		$this->objSite = DbSiteEditor::getInstance();
	}

	/**
	* Отдает редактор с редактируемой страницей
	* 
	* @uses 	DbUserPage::getPageInfo() 		/application/modal/db/user/DbUserPage.php 	получить информацию о странице
	* @uses 	DbUserPage::getPageOptionAll()	/application/modal/db/user/DbUserPage.php 	получить html варианта  страниц (desctop и mobile)
	* @uses 	this::objSite 					доступ к бд
	*/
	function indexAction()
	{	
		$siteId = Clear::leaveNumber($_GET['site']);

		/***********/
		// создаем папку files
		$folderFilesPath = $_SERVER['DOCUMENT_ROOT'].'/user/'.$this->user_id.'/'.$siteId.'/file/files';
		if (!file_exists($folderFilesPath)) mkdir($folderFilesPath);
		/***********/
		
		$paramsSite = array('profile_id'=>$this->user_id, 'site_id'=>$siteId);
		$isExistsSite = DbSiteEditor::getInstance()->isExistsSite($paramsSite);

		if (!$isExistsSite) {
			header('Location: /error404');
			exit;
		}

		$consultantLable = '';

		$siteInfo = DbSite::getInstance()->getInfo($paramsSite);

		$jsPropertyJson = $this->getJs($siteId, $siteInfo);

		$paramsEditor = array(
			'siteId'=>$siteId,
			'siteInfo'=>$siteInfo,
			'title'=>$siteInfo['style_name'],
			'userId'=>$this->user_id,
			'consultantLable'=>$consultantLable,
			'jsPropertyJson'=>$jsPropertyJson);
		$result = $this->objView->render('/editor/editing.php', $paramsEditor);
		// вывод результата
		$this->objFront->setBody($result);
	}

	/**
	* Отдает фаил js
	*
	* @query 	ajax
	*/
	public function getJs($siteId, $siteInfo)
	{
		// полностью сайт
		$fullSite = $this->getFullSite($siteId);
		$fullSite['type_access'] = $siteInfo['type_access'];
		
		// данные пользователя
		$paramsData = array("profile_id"=>$this->user_id);
		$userData = DbUserProfile::getInstance()->getData($paramsData);
		
		$siteId = $fullSite['site_id'];

		$params = array('profile_id'=>$this->user_id, 'site_id'=>$siteId);
		$projectId = $siteInfo['project_id'];

		// переводим в json 
		unset($fullSite['project_id']);
		$fullSite = json_encode($fullSite, true);
		$userData = $userData[0]["data"];
		
		$exitHref = '/sites/?project='.$projectId;// href show
		$showId = $siteId;
		$showHref = '/show?id='.$showId;
		$sitePublished = '/show/sitePublished?id='.$showId;

		// $listSiteUrl = DbSiteDomain::getInstance()->getListSiteUrl($paramsData);

		$params = array(
			'jsonSite'=>$fullSite,
			'jsonUser'=>$userData, 
			'exitHref'=>$exitHref,
			'showHref'=>$showHref,
			'sitePublished'=>$sitePublished,
			// 'listSiteUrl'=>$listSiteUrl
		);

		return json_encode($params, true);
	}

	/**
	* Отдает полностью сайт
	*
	*
	* @see 	$this->indexAction
	*/
	protected function getFullSite($siteId)
	{
		$params = array('profile_id'=>$this->user_id, 'site_id'=>$siteId);
		
		//получаем полностью сайт
		$fullSite = $this->objSite->getFullSite($params);
		// нету сайта
		if (!$fullSite["site_id"]) exit;

		$projectId = $fullSite['project_id'];
		
		// преобразуем массив чтобы ключом к страницы был его id
		$listPages = $fullSite["pages"];
		$fullSite["pages"] = array();
		foreach ($listPages as $pageData) {
			$fullSite["pages"][$pageData["page_id"]] = $pageData;
		} 

		return $fullSite;
	}
/***************************************************************************************************/
	/**
	* Сохраняет изменения
	*
	* @uses 	this::objPage 					доступ к бд
	*
	*/
	function saveAction()
	{	
		$site = htmlspecialchars_decode(urldecode($_POST['site']));
		$siteId = Clear::leaveNumber($_POST['site_id']);
		$res = $this->objSite->saveSite($this->user_id, $siteId, $site);

		echo 1;
	}

	/**
	*  Сохраняет аватар сайта
	*
	*
	*/
	public function saveSiteAvatarAction()
	{
		$avatarData = base64_decode($_POST['data']); 
		$siteId = Clear::leaveNumber($_POST['site_id']); 

		$imgPath = $_SERVER['DOCUMENT_ROOT'] . '/user/' . $this->user_id . '/' . $siteId . '/avatar.png';
		
		file_put_contents($imgPath, $avatarData); 

		echo $imgPath;
	}

/************************************************************************************/
/***изображения*************************************************************************/
	/**
	* отдаем картинки определеной категории 
	* AJAX
 	*
 	* @see 		ajax
	*/
	public function getFileHolAction() 
	{
		$fileType = $this->getFileType();
		$siteId = Clear::leaveNumber($_POST['site']);
		$path = $this->getRootFilePath($fileType, $siteId);

		$result = $this->getImgDir($path);
		//получить картинки категории
		echo json_encode($result, true);
		
	}

	private function getRootFilePath($fileType, $siteId)
	{
		$path = '/user/'.$this->user_id.'/'.$siteId.'/'.$fileType;

		return $path;
	}

	protected function getImgDir($path, $folder = '') 
	{
		$path_full = $_SERVER['DOCUMENT_ROOT'] . '/' . $path;

		//если такая директория есть
		if (is_dir($path_full)) {
			//открываем директорию
			$dir = opendir($path_full);

			//проходим по директории
			$list = array();
			$listName = array();
			while ($file = readdir($dir)) {
				if ($file != '.' and $file != '..') {
					//путь к файлу
					$file_path = $path.'/'.$file;
					$file_path_full = $path_full.'/'.$file;

					if ($folder) $nameFile = $folder.'/'.$file;
					else $nameFile = $file;

					$fileInfo = $this->getPropertyImg($file_path, $folder, $file);
					$list[$nameFile] = $fileInfo;

					// если директория
					if (is_dir($file_path_full)) {
						$listChildFolder = $this->getImgDir($file_path, $nameFile);
						$list = array_merge($list, $listChildFolder);
					}					
				}
			}
			//закрываем директорию
			closedir($dir);

			// отдает результат
			return $list;
		} else {
			return false;
		}
	}

	protected function getPropertyImg($file_path, $folder, $file)
	{
		$path_full = $_SERVER['DOCUMENT_ROOT'] .'/'. $file_path;

		//разрешение файла
		$screen = getimagesize($path_full);
		$type = is_dir($path_full) ? 'dir' : 'file';


		if ($folder) $fileName = $folder . '/' . $file;
		else $fileName = $file;

		return array(
			'name' => 	$fileName,//имя,
			'width'=> 	$screen[0],
			'height'=> 	$screen[1],
			'src' => 	$file_path,
			'size' => 	filesize($path_full),//размер
			'date' =>	filemtime($path_full),
			'type' => 	$type,
			'dir' => 	$folder
		);
	}

	/**
	* Отдает тип файла
	*
	* @see 	$this->getFileAction()
	* @see 	$this->
	*/
	private function getFileType()
	{
		$fileType =  $_POST['file_type'];
		
		if ($fileType == "video") $fileType = "file";
		else $fileType = "img";

		return $fileType;
	}

/*********************************************************************************/
	
	/**
	* Сохраняет шрифт
	*
	* 
	*/
	public function uploadFontsAction()
	{
		//данные 
		$file = $_POST['content'];

		// имя
		$fileNameMain = ConvertStr::ruToEn($_POST['name']);
		$fileNameMain = preg_replace('/\.[^\.]+$/', '', $fileNameMain);
		$fileNameMain = preg_replace('/\./', '', $fileNameMain);
		$fileFolder = $fileNameMain;
		$fileName = $fileNameMain . '.ttf';
		

		// создаем папку для шрифта
		$siteId = Clear::leaveNumber($_POST['site_id']);
		$rootFontPath = '/user/' . $this->user_id .'/' .$siteId.'/fonts';
		$rootFontPathDR = $_SERVER['DOCUMENT_ROOT'] . $rootFontPath;
		if (!file_exists($rootFontPathDR)) mkdir($rootFontPathDR);

		$pathFolder = $rootFontPath . '/' . $fileFolder;
		if (file_exists($_SERVER['DOCUMENT_ROOT'] . $pathFolder)) {
			echo $fileName;
			exit;
		}
		$fullPathFolder = $_SERVER['DOCUMENT_ROOT'] . $pathFolder;
		mkdir($fullPathFolder);

		// сохраняем
		$fileObj = new File();
		$fontName = $fileObj->save($fileName, $file, $pathFolder);
		
		// преобразовываем в другие форматы
		$fontPath = $fullPathFolder . '/' . $fileFolder;
		system('ttf2woff '.$fontPath.'.ttf '.$fontPath.'.woff > /dev/null');
		system('ttf2svg '.$fontPath.'.ttf '.$fullPathFolder.' > /dev/null');

		echo $fontName;
	}	

	/**
	* Удаление шрифта
	*
	*
	*/
	public function deleteFontAction()
	{
		$fontName = $_POST['font_name'];

		// создаем папку для шрифта
		// $rootFontPath = $_SERVER['DOCUMENT_ROOT'] . '/user/' . $this->user_id . '/0_fonts';
		$siteId = Clear::leaveNumber($_POST['site_id']);
		$rootFontPath = $_SERVER['DOCUMENT_ROOT'] . '/user/' . $this->user_id .'/' .$siteId.'/fonts';

		$pathFolder = $rootFontPath . '/' . $fontName;

		if (file_exists($pathFolder)) Dir::remove($pathFolder);
		echo $pathFolder;

	}

	/**
	* Сохранение шрифта
	*
	*
	*/
	public function saveFontAction()
	{
		$siteId = Clear::leaveNumber($_POST['site_id']);
		$params = array('profile_id' => $this->user_id, 'site_id' => $siteId);

		$fullSite = DbSiteEditor::getInstance()->getFullSite($params);
		$fullSite['font'] = json_decode($_POST['font'], true);
		DbSiteEditor::getInstance()->saveSite($this->user_id, $siteId, $fullSite); 
	}
/*************************************************************************************************/
	
	/**
	* Сохраняет  картинку
	* AJAX
	* 
	*/
	public function saveFileHolAction()
	{					
		$folderUser = '/user/'.$this->user_id;

		//данные 
		$file = $_POST['content'];
		if (!$file) exit;

		$fileName = ConvertStr::ruToEn($_POST['name']);
		$siteId = $_POST['site_id'];
		$folder = preg_replace("/\.\./", '', $_POST['dir']);
		$fileType = $_POST['type'];

		if ($fileType == "video") $fileType = "file";
		else $fileType = "img";

		$pathRoot = $this->getRootFilePath($fileType, $siteId);
		
		$pathFolder = $pathRoot.'/'.$folder;
		$fileObj = new File();
		$fileName = $fileObj->save($fileName, $file, $pathFolder);
		
		$newImgProperty = $this->getPropertyImg($pathFolder.'/'.$fileName, $folder, $fileName);
		echo json_encode($newImgProperty, true);
	}

	/**
	* Проверяет фаил на соответствие
	*
	* @see 	this.saveFileAction()
	*/
	private function checkFileValid($fileName)
	{
		if ($fileType == 'img') $isValid = preg_match("/(png)|(jpe?g)|(gif)|(svg)|(ico)/i", $fileName);
		// else if ($fileType == 'video') $isImg = preg_match("/mp4/i", $fileName);
		else $isValid = true;

		if (!$isValid) {
			echo "__no_valid__";
			exit;
		} else if ($_FILES['new_image']['error'] == 1) {// привышен размер
			echo "__max_size__";
			exit;
		}
	}

	/**
	* Сохраняем фаил
	* 
	* @see  this.saveFileAction()
	*/
	private function saveFile($imgPath, $imgData, $pathFolder, $fileName)
	{
		$res = file_put_contents($imgPath, $imgData);
		if ($res) {
			echo 1;
		}
	}

	/**
	* Отдает путь новой картинки
	*
	* @see 	$this->saveFileAction()
	*/
	private function getNewImagePath($pathFolder, $fileName)
	{	
		$imageProperty = array();
		preg_match_all("|^([\w\-\.]+)\.([\w]+)$|i", $fileName, $imageProperty);
		$name = $imageProperty[1][0];
		$unit = $imageProperty[2][0];

		for ($i=0; $i < 100; $i++) {
			$nameNum = $name;
			if ($i) $nameNum .= '_'.$i;
			$imgPath = $pathFolder.'/'.$nameNum.'.'.$unit;
			if (!file_exists($imgPath)) break;
		}
	
		return $imgPath;
	}

/********************************************************************************************/

	//удаляет картинку
	function deleteFileHolAction()
	{
		//удаляемая картинка
		$fileProperty = $this->getPathFile();
		$pathImg = $_SERVER['DOCUMENT_ROOT'].'/'.$fileProperty['path'];

		// удаляем если существует
		if (file_exists($pathImg)) {
			$res = Dir::remove($pathImg);

			echo true;
		}
	}

	private function getPathFile()
	{
		$fileName = ConvertStr::ruToEn($_POST['name']);
		$fileName = preg_replace("/\.\./", '', $fileName);
		
		$folder = $_POST['folder'];
		$folder = preg_replace("|\/|", '___flsh___', $folder);
		$folder = ConvertStr::ruToEn($folder);
		$folder = preg_replace("/___flsh___/", '/', $folder);
		$folder = preg_replace("/\.\./", '', $folder);

		$siteId = Clear::leaveNumber($_POST['site_id']);
		$fileType = $_POST['file_type'] == 'img' ? 'img' : 'file';

		$pathRoot = $this->getRootFilePath($fileType, $siteId);

		$folderPath = $pathRoot.'/'.$folder.'/'.$fileName;

		return array(
			'path' => $folderPath, 
			'file_name' => $fileName, 
			'folder' => $folder);
	} 

	/**
	* Переместить картинку
	* ajax
	*
	*/
	function moveImgAction()
	{
		$profileId = $this->user_id;
		$oldFolder = Clear::leaveLettersAndNumber($_POST['old_folder']);
		$newFolder = Clear::leaveLettersAndNumber($_POST['new_folder']);
		$name = Clear::leaveLettersAndNumber($_POST['name']);
		$oldSrc = "/user/img_user/".$profileId."/".$oldFolder."/".$name;
		$newSrc = "/user/img_user/".$profileId."/".$newFolder."/".$name;
		$usedImage = $_POST['used_image'];

		// заменяем бд
		if ($usedImage) {
			$usedImage = json_decode($usedImage, true);
			
			$res = DbSiteEditor::getInstance()->moveImage($usedImage, $oldSrc, $newSrc, $profileId);
			if (!$res) return false;
		}

		// перемещаем
		$res = rename($_SERVER['DOCUMENT_ROOT'].$oldSrc, $_SERVER['DOCUMENT_ROOT'].$newSrc);

		echo $newSrc;
	}

	/**
	* Создание директории
	*
	*/
	function createFileFolderHolAction()
	{
		$fileProperty = $this->getPathFile();
		$folderPath = $fileProperty['path'];
		$fileName = $fileProperty['file_name'];
		$folder = $fileProperty['folder'];

		$folderPathFull = $_SERVER['DOCUMENT_ROOT'] . '/' . $folderPath;

		// создаем папку
		if (!file_exists($folderPathFull)) {
			mkdir($folderPathFull);
			
			$newFolderProperty = $this->getPropertyImg($folderPath, $folder, $fileName);
			echo json_encode($newFolderProperty);
		}
	}

/********************************************************************************************/
	
	/**
	* Сохранение данных пользователя 
	*
	*
	*/
	public function saveUserDataAction()
	{
		$this->saveDataUser($_POST['user']);

		echo true;
	}

	/**
	* Сохранение данных пользователя
	*
	* @see 	this::saveAction()
	*/
	private function saveDataUser($userData)
	{
		// $userData = json_encode(json_decode($userData, true), true);
		
		// сохраняем данные позователя
		$paramsUser = array('profile_id'=>$this->user_id, 'data'=>$userData);
		DbUserProfile::getInstance()->saveData($paramsUser);
	} 
	
/**********************************************************************************/
/**********************************************************************************/
/**********************************************************************************/
	// режим разработчика
	private function isTemplateModeDeveloper()
	{
		/*************/
		// return true;
		/*************/


		return false;
	}

	// что бы не пересохранялись изображения
	private function isTemplateModeDeveloperReplace()
	{
		/*************/
		// if ($this->isTemplateModeDeveloper()) return true; 
		/*************/


		return false;
	}
	
	private function getTemplateFolderPath()
	{
		$templateFolderPath = $_SERVER['DOCUMENT_ROOT'].'/user';
		/*в режиме developer нужно закоментировать********/
		if (!$this->isTemplateModeDeveloper()) {
			$templateFolderPath .= '/'.$this->user_id;
		}

		$templateFolderPath .= '/0_template';

		return $templateFolderPath;
	}

	/**
	* Сохранение шаблона
	*
	*
	*/
	public function saveNewTemplateAction()
	{
		// сохраняем данные пользователя
		/*в режиме developer нужно закоментировать***************/
		if (!$this->isTemplateModeDeveloper()) {
			$this->saveDataUser($_POST['user']);
		}
		/*************/	

		// данные
		$newTemplateId = Clear::leaveLettersAndNumber($_POST['new_id']);
		$listImg = json_decode($_POST['list_img'], true);
		
		// пути
		$templateFolderPath = $this->getTemplateFolderPath();
		if (!file_exists($templateFolderPath)) mkdir($templateFolderPath);

		$templatePath = $templateFolderPath.'/'.$newTemplateId;

		// если создание, а не копирование
		if (!$this->isTemplateModeDeveloperReplace()) {
			// копируем
			$this->copyImgNewTemplate($listImg, $templatePath);
		}
		// сохраняем шаблон
		$this->saveNewTemplate($newTemplateId, $_POST['template']);
		// сохраняем папки
		$siteId = $_POST['site_id'];
		$this->saveNewTemplateFolder($siteId, $newTemplateId, $_POST['folder']);

		echo true;
	}

	/**
	* Сохраняет новый шаблон
	*
	* @see 	this::sabeNewTemplateAction()
	*/
	private function saveNewTemplate($newTemplateId, $newTemplate)
	{
		// получаем шаблоны пользователя
		$paramsGet = array('profile_id'=>$this->user_id);
		
		$templateFolderPath = $this->getTemplateFolderPath();
		$userCodeFolderPath = $templateFolderPath.'/0_code';
		
		if (!file_exists($userCodeFolderPath)) mkdir($userCodeFolderPath);
		
		/*********/
		/******/
		$this->saveNewTemplateCode($userCodeFolderPath, $newTemplate, $newTemplateId);
		/*****/
	}

	private function saveNewTemplateCode($userCodeFolderPath, $newTemplate, $newTemplateId)
	{
		$userCodePath = $userCodeFolderPath . '/t'.$newTemplateId.'.txt';
		file_put_contents($userCodePath, $newTemplate);
	}

	/**
	* Копируем картинки для нового шаблона
	*
	* @see 	this::saveNewTemplateAction()
	*/
	private function copyImgNewTemplate($listImg, $templatePath)
	{
		// создаем папку
		if (!file_exists($templatePath)) mkdir($templatePath);
		
		// копируем изображение
		foreach ($listImg as $imgSrc) {
			$imgSrc = preg_replace('/\.\./', '', $imgSrc);
			$imgPathOrg = $_SERVER['DOCUMENT_ROOT'] . '/' . $imgSrc; 
			
			$imgName = array(); 
			preg_match_all('/[^\/]+$/', $imgSrc, $imgName);
			$imgPathNew = $templatePath . '/' . $imgName[0][0];
			
			copy($imgPathOrg, $imgPathNew);
		}
	}

	/**
	* Сохраняем папку для шаблона
	* 
	*
	*/
	private function saveNewTemplateFolder($siteId, $newTemplateId, $folder)
	{
		if (!$folder) return false;
		$folder = preg_replace('/\./', '', $folder);

		$templateRoot = $this->getTemplateFolderPath();
		$templateRootFiles = $templateRoot . '/0_files';
		if (!file_exists($templateRootFiles)) mkdir($templateRootFiles);
		$templateFolder = $templateRootFiles . '/' .$newTemplateId;
		mkdir($templateFolder);
		$templateFolder .= '/'.$folder;

		$folderOrgPath = $_SERVER['DOCUMENT_ROOT'] . '/user/'.$this->getUserId().'/'.$siteId.'/file/widget/'.$folder;

		if (file_exists($folderOrgPath)) {
			Dir::copy($folderOrgPath, $templateFolder);
		}
	}

	/**
	* Копируем файлы шаблона
	* 
	*
	*/
	private function copyTemplateFolder($rootTemplatePath, $templateId, $siteId, $folder)
	{
		// template path
		$templateFolder = $rootTemplatePath . '/0_files/'.$templateId.'/'.$folder;

		// site path
		$siteWidget = $_SERVER['DOCUMENT_ROOT'] . '/user/'.$this->getUserId().'/'.$siteId.'/file/widget/';
		if (!file_exists($siteWidget)) mkdir($siteWidget);
		$siteWidgetFolder = $siteWidget . '/' . $folder;

		if (file_exists($templateFolder)) {
			Dir::copy($templateFolder, $siteWidgetFolder);
		}
	}

	private function deleteTemplateFile($rootTemplatePath, $templateId)
	{
		$fullPath = $rootTemplatePath.'/0_files/'.$templateId;
		if (!file_exists($fullPath)) return false;

		Dir::remove($fullPath);
	}

/**********************************************************************************/

	/**
	*  Сохраняет аватар нового шаблона
	*
	*
	*/
	public function saveTemplateAvatarAction()
	{
		$templateId = Clear::leaveLettersAndNumber($_POST['template_id']);
		$avatarData = base64_decode($_POST['data']); 
		$pathRoot = $_SERVER['DOCUMENT_ROOT'];

		$imgName = 'avatar_' . $templateId . '.png';

		$templateFolderPath = $this->getTemplateFolderPath();
		$avatarFolderPath = $templateFolderPath . '/0_avatar';
		if (!file_exists($avatarFolderPath)) mkdir($avatarFolderPath);
		$imgPath = $avatarFolderPath . '/' . $imgName;
		
		file_put_contents($imgPath, $avatarData);

		echo $imgPath;
	}

/**********************************************************************************/

	/**
	* Добавление шаблона на страницу
	*
	* 
	*/
	public function addTemplateAction()
	{
		$templateId = Clear::leaveLettersAndNumber($_POST['template_id']);
		$siteId = Clear::leaveNumber($_POST['site_id']);
		$folderType = $_POST['folder_type']; 

		$typeAccess = preg_replace('/\.\./', '', $_POST['type_access']);
		$isStdType = $typeAccess != "my";

		$userId = $isStdType ? '' : $this->user_id;

		// копируем изображения
		$rootPath = $_SERVER['DOCUMENT_ROOT']  . '/user/' . $this->user_id;

		$rootTemplatePath = $_SERVER['DOCUMENT_ROOT'].'/user/'.$userId.'/0_template';
		$pathTemplate = $rootTemplatePath . '/' . $templateId;

		// получаем путь изображений 
		$folderName = ConvertStr::ruToEn($_POST['template_name']);
		$fileObj = new File();
		$pathSiteImg = $rootPath . '/' . $siteId . '/img';
		$folderName = $fileObj->getNewName($pathSiteImg, $folderName);
		$pathSiteImgNew = $pathSiteImg . '/' . $folderName;

		// получаем шаблон
		$userCodeFolderPath = $rootTemplatePath.'/0_code/t'.$templateId.'.txt';

		if (file_exists($userCodeFolderPath)) {
			$template = file_get_contents($userCodeFolderPath);
		// это времено пока все шаблоны, не уберутся с bd 
		} else {
			$params = array('profile_id' => $this->user_id);
			$listTemplate = DbUserProfile::getInstance()->getTemplate($params);
			$listTemplate = json_decode($listTemplate, true);
			$template = $listTemplate[$templateId];
		}

		// копируем изображения и файлы
		if (!$isStdType) {
			$this->copyImgAddTemplate($pathTemplate, $pathSiteImgNew);
			$this->copyTemplateFolder($rootTemplatePath, $templateId, $siteId, $_POST['folder']);	
		}

		$res = array('template' => $template, 'folder_name' => $folderName);
		echo json_encode($res, true);
	}

	private function copyImgAddTemplate($pathTemplate, $pathSiteImgNew)
	{
		$isExistsImg = false;
		$dir = opendir($pathTemplate);
		while ($fileName = readdir($dir)) {
			if ($fileName != '.' && $fileName != '..') {
				$isExistsImg = true;
				break;
			}
		};
		closedir($dir);
		
		if ($isExistsImg) {
			// копируем изображения
			mkdir($pathSiteImgNew);
			Dir::copy($pathTemplate, $pathSiteImgNew);
		}
	}

	/**
	* Удаление шаблона
	*
	* 
	*/
	public function deleteTemplateAction()
	{
		// удаляем шаблон
		$templateId = Clear::leaveLettersAndNumber($_POST['template_id']);

		// удаляем аватар
		$rootTemplatePath = $this->getTemplateFolderPath();
		$imgName = 'avatar_' . $templateId . '.png';
		$imgPath = $rootTemplatePath . '/0_avatar/' . $imgName;
		unlink($imgPath);

		// удаляем папку
		$templateImgPath = $rootTemplatePath . '/' . $templateId;
		Dir::remove($templateImgPath);
		// сам код
		Dir::remove($rootTemplatePath.'/0_code/t'.$templateId.'.txt');
		// файлы
		$this->deleteTemplateFile($rootTemplatePath, $templateId);

		echo true;
	}

}//end class

?>