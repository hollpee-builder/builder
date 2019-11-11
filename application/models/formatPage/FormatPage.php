<?php  
/**
* Формат страницы
*
*
*
*/
abstract class FormatPage {
	protected $archive_format;
	protected $isAllImg;
	protected $type = '';
	public static $pathProjectS;

	function __construct($userId) {
		$this->userId = $userId;
		$downFolder = $_SERVER['DOCUMENT_ROOT'] . '/site/download';
		if (!file_exists($downFolder)) mkdir($downFolder);
		$this->rootFolder = $downFolder . '/' . $userId;
		
		if (file_exists($this->rootFolder)) Dir::remove($this->rootFolder);
		mkdir($this->rootFolder);


		$this->framePath = $_SERVER['DOCUMENT_ROOT'] . '/site/frame/';
	}

	/**
	* Скачать страницу
	*
	*
	*/
	public function create($params=array()) {
		$pageData = $params['site'];

		// для формата lpf
		if (empty($pageData)) {
			$siteId = $pageData['site_id'];
			if (!$siteId) $siteId = $params['site_id'];
			$pageData = $this->getPageData($siteId);
 		}

 		$siteId = $pageData['site_id'];
 		$this->siteId = $siteId;
		// данные страницы
		$this->pathSite = DIR_EDITOR.'/user/'.$this->userId.'/'.$siteId;
		$this->siteData = $pageData;
		$this->pageName = ConvertStr::ruToEn($pageData['style_name']);

		//создать папку для архива
		$this->pathProject = $this->createFolderByArchive();
		self::$pathProjectS = $this->pathProject;
		
		
		//создать фаил содержащий текст
		$this->createTextFile();
		//поместить туда графические файлы
		$this->copyImageFile();
		// перемещаем
		$this->moveFile();
		// копируем файлы
		$this->copyFolderFile();

		//сделать архив
		return $this->createArchive();
	}

	/**
	* Перемещает файлы
	*
	*/
	protected function moveFile()
	{
		// аватар если внутрений формат
		if ($this->type == 'lpf') {
			$avatarFrom = $this->pathSite.'/avatar.png';
			$avatarTo = $this->pathProject.'/avatar.png';

			if (file_exists($avatarFrom)) copy($avatarFrom, $avatarTo);
		}
	}

	public function getArchiveFormat()
	{
		return $this->archive_format;
	}
/***************************************************************************************************/
	public function getPageData($siteId)
	{
		$params = array('profile_id'=>$this->userId, 'site_id'=>$siteId);

		$objSite = DbSite::getInstance();
		
		// получить данные о страницы
		$site = $objSite->getFullSite($params);

		return $site;
	}

	protected function isFormatingTypeHtml()
	{
		return $this->type == "html";
	}

	protected function isCmsNameHollpee()
	{
		return $this->getCmsName() == 'hollpee';
	}

	protected function isCmsNameWp()
	{
		return $this->getCmsName() == 'wp';
	}

	protected function getCmsName()
	{
		return $this->cmsName;
	}

	protected function getSiteId()
	{
		return $this->siteId;
	}
	
/***************************************************************************************************/
	/**
	* Создает папку для архива
	*
	* @return 	void
	* @uses 	$this->create()
	*/
	protected function createFolderByArchive()
	{
		// если нет папки пользователя
		if (file_exists($this->rootFolder)) Dir::remove($this->rootFolder);
		mkdir($this->rootFolder);

		// создаем папку проекта
		$pathFolder = $this->rootFolder.'/'.$this->pageName;
		if (file_exists($pathFolder)) Dir::remove($pathFolder);
		mkdir($pathFolder);

		return $pathFolder;
	}
/****************************************************************************************************/
	/**
	* Перемещает графические файлы
	*
	* @return 	void
	* @uses 	$this->create()
	*/
	protected function copyImageFile()
	{
		// создаем папку
		$folderImgPath = $this->pathProject."/images";
		if (!file_exists($folderImgPath)) mkdir($folderImgPath);

		// favicon.ico
		if ($this->siteData["data"] && $this->siteData['data']['icon']) {
			$faviconFrom = $_SERVER['DOCUMENT_ROOT'] . $this->siteData['data']['icon'];
			if (file_exists($faviconFrom)) copy($faviconFrom, $folderImgPath.'/favicon.ico');
		}
		
		// копируем все img
		if ($this->type == "html" && $this->cmsName == 'hollpee') {
			$folderImgPath .= "/".$this->getSiteId();
			if (!file_exists($folderImgPath)) mkdir($folderImgPath);
		}
		Dir::copy($this->pathSite.'/img', $folderImgPath);

		// стандартные
		if ($this->type == "html") {
			$imgStandartFolderPath = $_SERVER['DOCUMENT_ROOT'] . '/user/0/main/img';
			if (!file_exists($folderImgPath. '/menu.png')) {
				copy($imgStandartFolderPath . '/menu.png', $folderImgPath. '/menu.png');
			}
			if (!file_exists($folderImgPath. '/close.png')) {
				copy($imgStandartFolderPath . '/close.png', $folderImgPath. '/close.png');
			}
			if (!file_exists($folderImgPath. '/bg-default.jpg')) {
				copy($imgStandartFolderPath . '/bg-default.jpg', $folderImgPath. '/bg-default.jpg');
			}

			if (!file_exists($folderImgPath. '/icon-default.png')) {
				copy($imgStandartFolderPath . '/icon-default.png', $folderImgPath. '/icon-default.png');
			}
		}

		// для каждого сайта свой favicon
		if ($this->isFormatingTypeHtml()) {
			$rootImgFavicon = $this->pathProject."/images";
			rename($rootImgFavicon.'/favicon.ico', $rootImgFavicon.'/favicon_'.$this->getSiteId().'.ico');
		}
	}


	/**
	* Копируем файлы
	*
	* @see 	this::create()
	*/
	protected function copyFolderFile()
	{
		if ($this->type == 'lpf') {
			$folderFilePath = $this->pathProject . '/file';
			if (!file_exists($folderFilePath)) mkdir($folderFilePath);
			Dir::copy($this->pathSite.'/file', $folderFilePath);
		} else {
			Dir::copy($this->pathSite.'/file', $this->pathProject);

			$hlpFiles = $this->pathProject.'/hlp_files';
			if (!file_exists($hlpFiles)) mkdir($hlpFiles);
			Dir::copy($this->pathSite.'/file', $hlpFiles);
		}
	}
	

/***********************************************************************************/
	
	/**
	* Копирует локальный шрифт
	*
	* @see 	
	*/
	protected function addFontLocal($rootFolder = '')
	{
		$fontFolderPath = $this->pathProject . $rootFolder .'/fonts';
		if (!file_exists($fontFolderPath)) mkdir($fontFolderPath);

		$fontUserPath = $this->pathSite . '/fonts';
		Dir::copy($fontUserPath, $fontFolderPath);
	}

	/**
	* Создает архив
	*
	* @return 	void
	* @uses 	$this->create()
	*/
	protected function createArchive()
	{
		$siteName = $this->pageName;
		
		$lpfPathNo = $this->rootFolder.'/'.$siteName;
		$lpfPath = $lpfPathNo.'.'.$this->archive_format;

		if (file_exists($lpfPath)) unlink($lpfPath);
		$log = $this->pathProject."/../log.txt";

		$pathDirProject = $this->pathProject;
		
		
		/******************************************************/
		$zip = new ZipArchive();
		$zip->open($lpfPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);
		$files = new RecursiveIteratorIterator(
		    new RecursiveDirectoryIterator($pathDirProject),
		    RecursiveIteratorIterator::LEAVES_ONLY
		);

		foreach ($files as $name => $file)
		{
		    $filePath = $file->getRealPath();
		    $relativePath = substr($filePath, strlen($pathDirProject) + 1);
		    if (!$file->isDir()) {
		        $zip->addFile($filePath, $relativePath);
		    } else {
		    	$zip->addEmptyDir($relativePath);
		    }
		}

		if ($this->isCmsNameHollpee()) {
			$zip->addFile($pathDirProject.'/.htaccess', '.htaccess');
		}

		$zip->close();


		if (file_exists($log)) unlink($log);
		Dir::remove($this->pathProject);

		return $lpfPath;
	}

} // end class

