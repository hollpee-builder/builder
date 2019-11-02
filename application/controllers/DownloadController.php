<?php 
/**
* Список страниц пользователя
*
* account.hollpee.ru/download/html/?name=aaa.rar
*
* @uri /pages
*/
class DownloadController extends AdminController implements IController {
	/**
	* Скачать архив html
	*
	*
	*/
	public function htmlAction()
	{
		$fileName = Clear::leaveLettersAndNumber($_GET['name']);
		$file = $_SERVER['DOCUMENT_ROOT'].'/site/download/'.$this->user_id.'/'.$fileName.'.zip';

		// фиксируем действие
		$siteId = Clear::leaveNumber($_GET['site_id']);

		// отдает архив
		// $this->download($file);
		$objFile = new File();
		$objFile->download($file);
	}

	/** 
	* сформировать html архив
	*
	*  @query ajax
	*/
	public function shapeHtmlAction()
	{	
		$siteId = Clear::leaveNumber($_POST['site_id']);

		$params = array('profile_id'=>$this->user_id, 'site_id'=>$siteId);
		$site = DbSiteEditor::getInstance()->getFullSite($params);

		$site['site_id'] = $siteId;

		$paramsDomain = array('profile_id'=>$this->user_id);

		echo json_encode($site, true);
	}

	/**
	* Создаем архив
	*
	*  @query ajax
	*/
	public function createHtmlAction()
	{	
		$siteJson = Clear::json($_POST['site']);
		$siteJson = preg_replace('/hlp-this-tag-span-start/', '<', $siteJson);
		$siteJson = preg_replace('/hlp-this-tag-span-end/', '>', $siteJson);
		
		$site = json_decode($siteJson, true);

		/*****/
		$pageIndex = 0;
		$listPage = $site['pages'];
		$site['pages'] = array();
		foreach ($listPage as $page) {
			$site['pages'][$pageIndex] = $page;
			$pageIndex++;
		}
		/*****/

		$paramsInfo = array('profile_id' => $this->user_id, 'site_id' => $site['site_id']);
		$siteInfo = DbSite::getInstance()->getInfo($paramsInfo);
		$site['style_name'] = ConvertStr::ruToEn($siteInfo['style_name']);

		$fileType = $_POST['file_type'];
		$cmsName = $_POST['cms_name'];
		$cmsHollpeeType = $_POST['cms_hollpee_type'];
		if ($fileType != "html" && $fileType != "php") $fileType = "";

		$objFormatHTML = new FormatPageHTML($this->user_id, $cmsName, $fileType, $cmsHollpeeType);
		$pagePath = $objFormatHTML->create(array('site'=>$site));			
		
		if ($pagePath) {
			$siteName = $site['style_name'];
			echo $siteName;
		}		
	}
/********************************************************************************************************/
	/**
	* Скачивание во внутренем формате lpf
	*
	*/
	public function lpfAction()
	{
		$siteId = Clear::leaveNumber($_GET['site_id']);
		
		//создаем архив 
		$objFormatLPF = new FormatPageLPF($this->user_id);
		$pagePath = $objFormatLPF->create(array('site_id'=>$siteId));

		if ($pagePath) {
			$objFile = new File();
			$objFile->download($pagePath);
		}
	}
/***********************************************************************************************/
	/**
	* Загрузка lpf
	*
	*
	*/
	public function uploadLPFAction()
	{
		$activationKey = Clear::leaveLettersAndNumber($_POST['activation_key']);

		$objFormatLPf = new FormatPageLPF($this->user_id);
		$listSiteId = $objFormatLPf->upload($activationKey);

		if ($listSiteId) {
			$res = json_encode(array('status'=>'success'), true);
			echo $res;
		} else {
			return false;
		}	
	}

/*************************************************************************************************/


	/**
	* Отдает ссылку для скачивания
	*/
	private function download($sitePath)
	{
		$pathFromRoot = '';
		preg_match_all("@[0-9]+/[^/]+$@i", $sitePath, $pathFromRoot);
		$link = 'http://'.DOMAIN_ACCOUNT.'/site/download/'.$pathFromRoot[0][0];

		header("Location: ".$link);
		exit;
	}

/**********************************************************************************************/







}






