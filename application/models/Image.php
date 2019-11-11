<?php 
/**
* Работа с картинками
*
*
*
*/
class Image {
	public static $userId;
	public static $newSiteId;
	public static $imgFolder;
	public static $selfImgFolder;
/***************************************************************************************************/
	/**
	* Копирование папки с картинками
	*
	* @see 	IndexController->copySiteAction()
	*/
	public static function copyFolderImage($userId, $siteId, $newSiteId)
	{
		// копируем картинки
		$pathRoot = $_SERVER['DOCUMENT_ROOT'].'/user/'.$userId.'/';
		$pathOld = $pathRoot.$siteId;
		$pathNew = $pathRoot.$newSiteId;
		Dir::copy($pathOld, $pathNew); 
	}

	/**
	* Удаление папки с картинками
	*
	* @see 	SiteController->deleteSiteAction()
	*/
	public static function deleteFolderImage($userId, $siteId)
	{
		$rootPath = $_SERVER['DOCUMENT_ROOT'].'/user';
	
		// копируем картинки
		$pathOld = $rootPath.'/'.$userId.'/'.$siteId;
		$pathNew = $rootPath.'/0_delete/'.$siteId;
		Dir::copy($pathOld, $pathNew); 
		
		// удаляем старую папку
		Dir::remove($pathOld);
	}

	/**
	* Востанавливает папки с картинками
	*
	* @see 	IndexController->deleteSiteAction()
	*/
	public static function restoryFolder($userId, $siteId)
	{
		$rootPath = $_SERVER['DOCUMENT_ROOT'].'/../www/user';
	
		// копируем картинки
		$pathOld = $rootPath.'/0_delete/'.$siteId;
		$pathNew = $rootPath.'/'.$userId.'/'.$siteId;
		Dir::copy($pathOld, $pathNew); 

		// удаляем старую папку
		Dir::remove($pathOld);

	}

	/**
	* Отдает картинку стиля
	*
	* @see 	AttachListSites->listSites()
	*/
	public static function getImgStyle($userId, $siteId)
	{
		return 'http://'.DOMAIN_EDITOR.'/user/'.$userId.'/'.$siteId.'/avatar.png';
	}

/***********************************************************************************************/	
	/**
	* Замена картинок
	*
	* @see 	IndexController->copySiteAction()
	* @see 	FormatPageLPF->copyImgUploadFile()
	* @see 	ChosenStyleController->addStyleSiteAction()
	*/
	public static function replaceImage($userId, $newSiteId, $noMain=false, $isAddStyle=false)
	{
		// получаем сайт
		$params = array('profile_id'=>$userId, "site_id"=>$newSiteId);
		$site = DbSiteEditor::getInstance()->getFullSite($params);
		$site = json_encode($site, true);
		// убираем экранирование
		$site = preg_replace("|[\\\]+/|", "/", $site);
		$site = preg_replace('@https?://[^/]+/user/@', '/user/', $site);

		if ($noMain) $patternImg = '@/user/[0-9]+/[0-9]+/img@i';
		else $patternImg = '@/user/[0-9]+/[\w]+/img@i';

		self::$userId = $userId;
		self::$newSiteId = $newSiteId;

		// изменяем картинки
		$site = preg_replace_callback($patternImg, function($m) {
			return '/user/'.Image::$userId.'/'.Image::$newSiteId.'/img';
		}, $site);

		// заносим в бд
		DbSiteEditor::getInstance()->saveSite($userId, $newSiteId, $site);
	}

	/**
	* 
	*
	* @see 	FormatPageLpf::addInDB();
	*/
	public static function replaceImageText($text, $userId, $newSiteId)
	{
		$newSiteFolder = '/user/'.$userId.'/'.$newSiteId.'/';
		$text = preg_replace('@/user/[0-9]+/[0-9]+/img@', $newSiteFolder.'img', $text);
		$text = preg_replace("/@@@@@hp@@@@@/", 'http', $text);

		return $text;
	}


	/**
	* Очистить src у image
	*
	* @see 	FormatpageHTML->createHeader()
	* @see 	FormatpageHTML->createFooter()
	* @see 	FormatpageHTML->createListPage()
	*/
	public static function clearImgSrc($content, $folder = '', $imgPath = 'images')
	{
		$startPattern = '@(https?://[^/]+)?/user/[0-9]+/[\w]+/';
		$endPattern = '/([^),\'"]+)@i';
		
		Image::$imgFolder = $folder;

		Image::$selfImgFolder = $imgPath;
 
		//изображение  'css'
		$patternImg = $startPattern.'img'.$endPattern;
		$content = preg_replace_callback($patternImg, function($m) {
			return Image::$selfImgFolder.Image::$imgFolder.'/'.$m[2];
		}, $content);


		/*для стандартного шаблона секций***********************************/	
		// bg-image css
		$listStdTemplatesRes = array();
		preg_match_all('|/user/0_template/([\w]+)\/|', $content, $listStdTemplatesRes);
		$listStdTemplates = array();
		foreach ($listStdTemplatesRes[1] as $stdTemp) $listStdTemplates[$stdTemp] = 1;

		$folderTempPath = FormatpageHTML::$pathProjectS . '/images/hlp_template';
		if (!file_exists($folderTempPath)) mkdir($folderTempPath);

		foreach ($listStdTemplates as $stdTempId => $stdTempStatus) {
			$tempFromPath = $_SERVER['DOCUMENT_ROOT'].'/user/0_template/'.$stdTempId;
			$tempToPath = $folderTempPath . '/ht_'.$stdTempId;
			Dir::copy($tempFromPath, $tempToPath);
		}

		$content = preg_replace('|/user/0_template/|', $imgPath.'/hlp_template/ht_', $content);
		/************************************/

		return $content;
	}
/***********************************************************************************************/	

}//end class

?>

