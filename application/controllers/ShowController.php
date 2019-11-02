<?php  
/**
* Редактирование стриницы
*
*
*
*
*/
class ShowController extends AdminController implements IController {
	/**
	*
	*
	*
	*
	*/
	function indexAction()
	{
		$params = array(
			'siteId'=> $_GET['id'],
			'pageId'=> $_GET['page'],
			'userId'=> $this->user_id,
			'siteType'=>$_GET['site_type']);
		$result = View::render('show.php', $params);

		echo $result;
	}

/**************************************************************************************/
	/**
	* Просмотр
	*
	*
	*/
	function showAction()
	{
		$siteId = preg_replace('/[^0-9_]+/', '', $this->params['site_id']);
		$siteType = Clear::leaveLettersAndNumber($_GET["site_type"]);
		if ($siteType == 'lp' || $siteType == 'site') {
			$pathSite = $_SERVER['DOCUMENT_ROOT'] . '/site/style/'.$siteType.'/'.$siteId;
		} else {
			$pathSite = $_SERVER['DOCUMENT_ROOT'] . '/user/'.$this->user_id.'/'.$siteId;
		}

		$showPath = $pathSite.'/show';

		if (!file_exists($pathSite)) {
			echo 'Такого сайта нет';
		} else if (file_exists($showPath)) {
			$pageId = $_GET['page_id'];
			if (!$pageId) {
				$pageId = file_get_contents($showPath.'/first_page_id.txt');
			}

			$pagePath = $showPath.'/page_'.$pageId.'.txt';
			// если нет страницы
			if (!file_exists($pagePath)) {
				for ($iPage = 0; $iPage < 100; $iPage++) {
					$pagePath = $showPath.'/page_'.$iPage.'.txt';;
					if (file_exists($pagePath)) break;
				}
			}
			
			if (file_exists($pagePath)) $res = file_get_contents($pagePath);
			else $res = 'Такой страницы нет';

			echo $res;
		} else {
			$fullSiteJson = file_get_contents($pathSite . '/code.txt');
			$fullSiteJson = json_encode(json_decode($fullSiteJson, true), true);
			$this->siteFormating($fullSiteJson, $siteId);
		}
	}

	public function siteFormating($fullSiteJson, $siteId)
	{
		$content = '<div class="blockData" style="display:none;">
						<div id="dataJson">'.$fullSiteJson.'</div>
						<div id="siteId">'.$siteId.'</div>
						<div id="siteStatus">formating</div>
					</div>
					<div class="styleSiteSection"></div>
					<div class="stylePageSection"></div>
					<div class="content"></div>';

		$headScript = '
				<link rel="stylesheet" href="'.Url::get('/css/main/modal.css').'">
				<script type="text/javascript" src="'.Url::get('/js/main/modal.js').'"></script>
				<script type="text/javascript" src="'.Url::get('/js/formating/formating.js').'"></script>
				<script type="text/javascript" src="'.Url::get('/js/formating/formating_html.js').'"></script>
				<script type="text/javascript" src="'.Url::get('/js/formating/formating_css.js').'"></script>
				<script type="text/javascript" src="'.Url::get('/js/formating/formating_widget.js').'"></script>
				<script type="text/javascript" src="'.Url::get('/js/show_iframe.js').'"></script>
		';

		//сформировываем странцу
		$param = array(
			'content'=>$content,
			'headScript'=>$headScript
			);
		$result = View::render('user_page.php', $param);

		echo $result;
	}
/***********************************************************************************/

	/**
	* Показывает закрытую страницу
	*
	* @see 	$this->showAction()
	*/
	private function showSitePrivate()
	{
		echo View::render('page_private.php', false, DIR_ACCOUNT, '/application/views/');
	}

	/**
	* Отдает полностью сайт
	*
	* @see 	$this->showSite()
	* @see 	$this->sitePublishedAction()
	*/
	private function getFullSite($params)
	{
		// получаем сайт 
		$fullSite = DbSiteEditor::getInstance()->getFullSite($params);
			
		// если нету
		if (!$fullSite) {
			header('Location: /error404');
			exit;
		}

		$fullSite = json_encode($fullSite, true);

		return $fullSite;
	}

	/**
	* Отдает стиль
	*
	* @see 	$this->showSite()
	*/
	private function getFullStyle($params)
	{
		$pathStyle = '/site/style/'.$params['site_type'].'/'.$params['site_id'];
		$pathStyle = $_SERVER['DOCUMENT_ROOT'].$pathStyle;

		$pathStyleFile = $pathStyle.'/show.txt';
		$fullStyle = file_get_contents($pathStyleFile);
		$fullStyle = urldecode($fullStyle);

		return $fullStyle;
	}


/**********************************************************************************/

/**********************************************************************************/ 
/**********************************************************************************/
	/**
	*
	*
	*
	*/
	public function publishedSiteAction()
	{
		$code = htmlspecialchars_decode(urldecode($_POST['code']));

		$code = Clear::json($code, true);
		$this->writeFormatingSite($code);

		echo true;
	}

	/**
	* Склеивает весь сайт
	*
	*
	*/
	public function writeFormatingSite($fullSite, $isHosting = false)
	{
		$fullSite = json_decode($fullSite, true);
		$siteId = $fullSite['site_id'];
		$userId = $this->user_id;

		$folderPagePath = $_SERVER['DOCUMENT_ROOT'] . '/user/'.$userId.'/'.$siteId.'/show';
		if (file_exists($folderPagePath)) Dir::remove($folderPagePath);
		mkdir($folderPagePath);

		$listPages = $fullSite['pages'];
		$newSite = array();
		$newSite['pages'] = array();
		$firstPageId = false;
		foreach ($listPages as $pageIndex => $page) {
			if (!$firstPageId) $firstPageId = $pageIndex;

			$pageHtml = $this->joinOnePage($fullSite, $pageIndex, $userId);
			$newSite['pages'][$pageIndex] = array();
			$newSite['pages'][$pageIndex]['html'] = $pageHtml;
				
			$filePagePath = $folderPagePath . '/page_'.$pageIndex.'.txt';
			file_put_contents($filePagePath, $pageHtml);
		}

		file_put_contents($folderPagePath.'/first_page_id.txt', $firstPageId);

	}

	/**
	*
	*
	* @see 	this.writeFormatingSite()
	*/
	private function joinOnePage($fullSite, $pageIndex, $userId)
	{
		$isTypeSite = $fullSite['type'] == 'site';

		$siteId = $fullSite['site_id'];
		$page = $fullSite['pages'][$pageIndex];
		$contentHtml = $page['html'];
		$contentPageCss = '';

		
		// для многостраничника
		$siteMain = $fullSite['main'];
		$contentPageCss .= $siteMain['css']; 
		if ($isTypeSite) {
			$contentHtml = $siteMain['header'].'<div class="hlp-page">'.$contentHtml.'</div>'.$siteMain['footer'];
		}

		// 
		$contentPageCss .= $page['css'];
		$contentSite = "\r\n".'<style id="stylePage">'."\r\n".$contentPageCss.'</style>';
		$contentSite .= "\r\n".'<div class="hlp-site">'.$contentHtml.'</div>';

		$content = $fullSite['data']['added_code']['body_start'];
		$content .= $page['data']['added_code']['body_start'];
		$content .= $contentSite;
		$content .= $fullSite['data']['added_code']['body_end'];
		$content .= $page['data']['added_code']['body_end'];

		$pathSite = '';

		// code head
		// $headScript = FormatPageHTMLWidget::getIncludeFile($fullSite, $page);
		$headScript = '';
		$headScript .= $fullSite['data']['added_code']['head'];
		$headScript .= $page['data']['added_code']['head'];
		$headScript .= $listIntegrationCode['head'];	
		$headScript .= "\r\n";

		//сформировываем странцу 
		$param = array(
			'content'=>$content,
			'headCss'=>$cssStd,
			'headScript'=>$headScript,
			'title'=> $page['data']['seo']['title'],
			'description' => $page['data']['seo']['description'],
			'keywords' => $page['data']['seo']['key'],
			);

		$result = View::render('user_page.php', $param);

		// php на всякий случай
		$result = preg_replace("/<\?/", '<!--', $result);
		$result = preg_replace("/\?>/", '-->', $result);

		$result = preg_replace("/@@@@@plus@@@@@/", '+', $result);
		$result = preg_replace("/@@@@@hp@@@@@/", 'http', $result);
		$result = preg_replace("/&#43;/", '+', $result);

		// перенос строки
		$result = preg_replace("/@@@@@sign_rn@@@@@/", "\r\n", $result);
		$result = preg_replace("/@@@@@sign_tab@@@@@/", "\t", $result);

		return $result;
	}

	


/**********************************************************************************/


}//end class
