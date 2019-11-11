<?php  
/**
* Работа с сайтом
*
*
*/
class HlpSite {
	private $folderUploadAdmin = 'hlp_template_2892342308093';
	private $fileUploadAdmin = 'hlp_upload_admin.php';

	public function getFileUploadAdmin()
	{
		return $this->fileUploadAdmin;
	}

	public function removeFileUploadAdmin()
	{
		$path = HLP_SITE_FOLDER_PATH . '/' . $this->getFileUploadAdmin();
		if (file_exists($path)) unlink($path);
	}
	
/***********************************************************************************/

	/**
	* Удаляет сами фаилы
	*
	* @see 	IndexController::deletePageAction()
	*/
	public function deletePage($pageId)
	{
		$listPages = $this->getListPage();
		unset($listPages[$pageId]);
		$this->saveListPage($listPages);

		unlink(HLP_SITE_FOLDER_PATH.'/'.$pageId.'.php');	
		unlink(HLP_SITE_FOLDER_PATH.'/css/'.$pageId.'.css');

		// удаление cusotmier

		// удаление интеграции
		$listIntregration = HlpIntegration::getListIntegrationApiValue();
		unset($listIntregration[$pageId]);
		$listIntregrationJson =  json_encode($listIntregration, true);
		HlpIntegration::saveValue($listIntregrationJson);
	}	


/*********************************************************************************/
	/**
	* Изменение имени файла
	*
	* @see 	IndexController::editPageNameAction()
	*/
	public function editPageName($pageId, $newName)
	{
		$listPages = self::getListPage();
		$listPages[$pageId]['file'] = $newName;
		self::saveListPage($listPages);

		return true;
	} 

/**********************************************************************************/
/************************************************************************************/
	
	public function getFolderUploadAdmin()
	{
		return $this->folderUploadAdmin;
	}	

	/**
	* Загружка шаблона
	*
	* @see 	IndexController->uploadTemplateAction()
	*/
	public function uploadTemplate($fileName, $fileContent)
	{
		$folder = '/' . $this->getFolderUploadAdmin();
		$rootPath = HLP_SITE_FOLDER_PATH;
		$templatePath = $rootPath . $folder;

		// создаем папку
		HlpDir::remove($templatePath);
		mkdir($templatePath);
		
		// загружаем фаил
		$fileObj = new HlpFile();
		$filePath = $fileObj->save($fileName, $fileContent, $folder);
		$filePath = $rootPath . $filePath;

		// разворачиваем
		$zip = new ZipArchive;
		if ($zip->open($filePath) === TRUE) {
		    $zip->extractTo($templatePath);
		    $zip->close();
		} else {
		    exit;
		}
		unlink($filePath);

		$siteXmlPath = $templatePath . '/data/hlp_site.json';
		if (!file_exists($siteXmlPath)) return 'no_cms';

		// копируем файлы сайта
		$this->copyTemplateSite($templatePath);
		// основа
		$this->copyTemplateMain($templatePath, $rootPath);
		// все остальные
		$this->copyTemplateFileOther($templatePath, $rootPath);

		// фаил для обновления admin
		$fileUpload = $this->getFileUploadAdmin();
		$fileUploadPath = $rootPath . '/' . $fileUpload;
		if (file_exists($fileUploadPath)) unlink($fileUploadPath);
		copy($templatePath . '/' . $fileUpload, $fileUploadPath);

		$urlUpload = HLP_SITE_FOLDER ? '/'.HLP_SITE_FOLDER : '';
		$urlUpload .= '/'.$fileUpload;
		return $urlUpload;
	}

	/**
	* Копируем сайт шаблона
	*
	* @see 	this::uploadTemplateAction()
	*/
	private function copyTemplateSite($templatePath)
	{	
		$rootPath = HLP_SITE_FOLDER_PATH;

		// template
		$templateSiteJsonPath = $templatePath . '/data/hlp_site.json';
		$templateSiteJson = file_get_contents($templateSiteJsonPath);
		$tempListPages = json_decode($templateSiteJson, true);
		// site
		$siteListPages = $this->getListPage();

		foreach ($tempListPages as $pageId => $page) {
			// php
			$tempPhpPath = $templatePath.'/'.$pageId.'.php';
			$sitePhpPath = $rootPath.'/'.$pageId.'.php';
			HlpDir::copy($tempPhpPath, $sitePhpPath);
			// css
			$tempCssPath = $templatePath.'/css/'.$pageId.'.css';
			$siteCssPath = $rootPath.'/css/'.$pageId.'.css';
			HlpDir::copy($tempCssPath, $siteCssPath);

			// если нет страницы
			// if (!$siteListPages[$pageId]) {
			$siteListPages[$pageId] = $tempListPages[$pageId];
			// }
		}

		$this->saveListPage($siteListPages);
	}

	/**
	* Копируем основу шаблона
	*
	* @see 	this::copyTemplateSite()
	*/
	private function copyTemplateMain($templatePath, $rootPath)
	{
		$templateSiteJson = file_get_contents($templatePath . '/data/hlp_site.json');
		$tempListPages = json_decode($templateSiteJson, true);
		foreach ($tempListPages as $firstPageId => $page);
		$siteId = preg_replace('/_[0-9]+$/', '', $firstPageId);

		// копируем основу
		$headerPath = $rootPath . '/header_'.$siteId.'.php';
		$headerTemPath = $templatePath . '/header_'.$siteId.'.php';
		
		if (file_exists($headerTemPath)) {
			if (file_exists($headerPath)) unlink($headerPath);
			copy($headerTemPath, $headerPath);
		}

		$footerPath = $rootPath . '/footer_'.$siteId.'.php';
		$footerTemPath = $templatePath . '/footer_'.$siteId.'.php';
		if (file_exists($footerTemPath)) {
			if (file_exists($footerPath)) unlink($footerPath);
			copy($footerTemPath, $footerPath);
		}

		$mainCssPath = $rootPath . '/css/main_'.$siteId.'.css';
		$mainCssTemPath = $templatePath . '/css/main_'.$siteId.'.css';
		if (file_exists($mainCssTemPath)) {
			if (file_exists($mainCssPath)) unlink($mainCssPath);
			copy($mainCssTemPath, $mainCssPath);
		}

		/*404***********/
		$footerPath = $rootPath . '/404.php';
		$footerTemPath = $templatePath . '/404.php';
		if (file_exists($footerTemPath)) {
			if (file_exists($footerPath)) unlink($footerPath);
			copy($footerTemPath, $footerPath);
		}

		$mainCssPath = $rootPath . '/css/404.css';
		$mainCssTemPath = $templatePath . '/css/404.css';
		if (file_exists($mainCssTemPath)) {
			if (file_exists($mainCssPath)) unlink($mainCssPath);
			copy($mainCssTemPath, $mainCssPath);
		}
	}

	/**
	* Другие файлы шаблона
	*
	* @see 	this::uploadTemplate()
	*/
	private function copyTemplateFileOther($templatePath, $rootPath)
	{
		// копируем файлы - контент
		HlpDir::copy($templatePath . '/images', $rootPath . '/images');
		HlpDir::copy($templatePath . '/files', $rootPath . '/files');
		
		// копируем шрифт
		$rootFontPath = $rootPath . '/css/fonts';
		if (!file_exists($rootFontPath)) mkdir($rootFontPath); 
		HlpDir::copy($templatePath . '/css/fonts', $rootFontPath);
	}

/*********************************************************************************/
	
	/**
	* Отдает список страниц
	*
	* @see 	HlpIndexController::indexAction()
	* @see 	HlpPageController::indexAction()
	* @see 	this::getListPageUrl()
	*/
	public static function getListPage()
	{
		$listJson = file_get_contents(self::getSiteJsonPath());		
		$listPage = json_decode($listJson, true);

		return $listPage;
	}

	public static function getSiteJsonPath()
	{
		return '../data/hlp_site.json';
	}

	public static function saveListPage($listPage)
	{
		$listJson = json_encode($listPage, true);
		file_put_contents(self::getSiteJsonPath(), $listJson);
	}

	/**
	* Отдает информацию о странице
	*
	* @see 	HlpPageController::addAdaptiveElmAction()
	*/
	public static function getPageInfo($pageId)
	{
		$listPages = self::getListPage();
		if (!array_key_exists($pageId, $listPages)) return false;

		return $listPages[$pageId]; 
	}

	/**
	* Отдает список url страниц
	*
	* @see 	HlpUtmController::indexAction()
	*/
	public function getListPageUrl()
	{
		$listSite = self::getListPage();

		$listUrl = array();
		foreach ($listSite as $page) {
			$pageFile = $page['file'];
			$url = HLP_SITE_FOLDER . '/' . $page['file'];

			$listUrl[$page['page_id']] = array(
				'page_id' => $page['page_id'],
				'domain_name' => $_SERVER['HTTP_HOST'],
				'url' => $url,
				'style_name' => $pageFile,
			);
		}

		return $listUrl;
	}

/***************************************************************************************************/

} // end class

?>
