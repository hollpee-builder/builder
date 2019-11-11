<?php  

require_once 'php/hlp_function.php';

class HlpHosting {
	
	public function getPage()
	{
		// получаем id
		$listPagesJson = file_get_contents('data/hlp_site.json');
		$listPages = json_decode($listPagesJson, true);
		$pageId = $this->getPageId($listPages);

		
		/**********/
		// стави куку
		$cookieVariantKey = 'hlp-page-'.$pageId;
		if (array_key_exists($cookieVariantKey, $_COOKIE)) {
			$currentPageId = $_COOKIE[$cookieVariantKey];
		} else {
			$currentPageId = $this->getCurrentPageId($pageId);
			setcookie($cookieVariantKey, $currentPageId, time() + 3600*24*356);
		}
		
		// не учитывать
		if (array_key_exists('hlp-cook', $_GET) && $_GET['hlp-cook'] == 'no') {
			$currentPageId = $this->getCurrentPageId($pageId);
		}

		/*******************/
		HlpData::setPageId($currentPageId);
		$variantName = $currentPageId.'.php';
		header('Content-Type: text/html; charset=utf-8');
		
		// ставим константы
		if (!defined('HLP_SITE_FOLDER')) setConstPath();

		// выводим результат
		ob_start();
		require_once $variantName;
		echo $this->getCodeProperty($pageId, $currentPageId, $listPagesJson);
		echo $this->getCodeAnalytics($pageId, $currentPageId);
		echo trim(ob_get_clean());
	}

/************************************************************************************/

	private function getPageId($listPages)
	{
		// не создан админ
		if (!file_exists('admin/data/db/admin.db')) {
			header('Location: admin');
			exit;
		}

		// имя
		$fileName = getFileName();

		// в начале сфлеш
		$url = $_SERVER['REQUEST_URI'];
		if ($fileName != "index.php" && preg_match('/(\\/\?)|(\\/$)/', $url)) {
			$url = preg_replace('/\\/$/', '', $url);
			$url = preg_replace('/\\/\?/', '?', $url);
			header('Location: '.$url);
			exit;
		}

		// стандартный файл
		if ($this->isStdFile($fileName)) {
			ob_start();
			require_once $fileName;
			echo trim(ob_get_clean());
			exit;
		}

		// ищем pageId страницы
		$pageId = false;
		foreach ($listPages as $pageItemId => $pageItem) {
			$pageItemName = $pageItem['file'];
			if ($pageItemName == $fileName) {
				$pageId = $pageItemId;
				break;
			}
		}

		// если нет такой страницы
		if (!$pageId) {
			// короткая ссылка
			$listUrlShort = $this->getListUrlShort();
			if (array_key_exists($fileName, $listUrlShort)) {
				$urlLong = $listUrlShort[$fileName];
				header('Location: ' . $urlLong);
				exit;
			// если это другой файл, которго не в списке
			} else if (file_exists($fileName) && is_file($fileName)) {
				require_once $fileName;
				exit;
			} else {
				$this->error404();
			}
		}

		return $pageId;
	}

	private function isStdFile($fileName)
	{
		if (	$fileName == 'hlp_editor.php'
				|| $fileName == 'hlp_title.php'
				|| $fileName == 'hlp_sts.php'
				|| $fileName == 'hlp_download.php'
				|| $fileName == 'hlp_upload_admin.php'
				|| $fileName == 'hlp_new_admin_installation.php') {
			return true;
		} else {
			return false;
		}
	}

	private function getListUrlShort()
	{
		$path = 'data/shorten.txt';
		if (!file_exists($path)) return array();
		
		$listShortenJson = file_get_contents($path);
		$listShorten = json_decode(trim($listShortenJson), true);
		$listShorten = $listShorten["link"];
		$listUrl = array();
		foreach ($listShorten as $item) {
			$listUrl[$item['shorten']] = $item['link'];
		}

		return $listUrl;
	}

/************************************************************************************/

	private function getCurrentPageId($pageId)
	{
		// abtest
		$abtestPath = getAbtestFilePath($pageId);
		if (!file_exists($abtestPath)) {
			$abtestJson = $abtestJson = '{"current_page":"'.$pageId.'","list":{"'.$pageId.'":{"running":"yes","visit":"0", "lead":"0"}}}';
			file_put_contents($abtestPath, $abtestJson);
			return $pageId;
		}

		$abtestJson = file_get_contents($abtestPath);
		$abtest = json_decode(trim($abtestJson), true);
		$currentPage = $abtest['current_page'];
		$abtestList = $abtest['list'];
		$nextPage = 0;
		$isNextPage = false;
		$abtestFirstPage = false;

		// если всего одна страница
		if (count($abtestList) == 1) return $pageId;

		/*включаем текущий*****/
		$abtestList[$pageId]['running'] = 'yes';
		/*****/

		foreach ($abtestList as $abtestPageId => $abtestPage) {
			if (!array_key_exists('running', $abtestPage) || $abtestPage['running'] != 'yes') continue;
			if (!$abtestFirstPage) $abtestFirstPage = $abtestPageId;
			
			if ($abtestPageId == $currentPage) {
				$isNextPage = true;
			} else if ($isNextPage) {
				$nextPage = $abtestPageId;
				break;
			}
		}
		if (!$nextPage) $nextPage = $abtestFirstPage;
		
		//вариант не существует
		if (!file_exists($nextPage.'.php')) {
			unset($abtest['list'][$nextPage]);
			$nextPage = $pageId;
		}

		// сохраняем текущий вариант
		$abtest['current_page'] = $nextPage;
		$abtestJson = json_encode($abtest, true);
		file_put_contents($abtestPath, $abtestJson);

		return $nextPage;
	}

/************************************************************************************/	

	private function getCodeAnalytics($pageId, $currentPageId)
	{
		$utmSrc = array_key_exists('utm_source', $_GET) ? $_GET['utm_source'] : false;
		if (!$utmSrc) $utmSrc = array_key_exists('ch', $_GET) ? $_GET['ch'] : false;

		$property = 'hlp-page-id='.$pageId;
		$property .='&hlp-variant-id='.$currentPageId;
		if ($utmSrc) $property .='&utm_source='.$utmSrc;

		$code = '
			<script type="text/javascript">
				var scriptCode = \'<script type="text/javascript" id="script_sts" src="hlp_sts.php?'.$property.'" ><\/script>\'; 
				$("body").after(scriptCode);
				$("#script_sts").load("hlp_sts.php", function() {
					var h = document.cookie.match(/zls12=[^;]+/gim);
					if (h && h[0]) HLP_ZLS12 = h[0].match(/[^=]+$/)[0];
				});
			</script>
		';

		return $code;
	}

	private function getCodeProperty($pageId, $currentPageId, $listPagesJson)
	{
		$code = '
			<script type="text/javascript">
				var HLP_PAGE_ID = "'.$pageId.'";
				var HLP_VARIANT_ID = "'.$currentPageId.'";
			</script>
		';

		return $code;
	}

	private function error404()
	{
		$path404 = '404.php';
		header("HTTP/1.0 404 Not Found");
		
		if (file_exists($path404)) {
			require_once $path404;
		} else {
			echo 'Error 404';
		}
		exit;
	}

/********************************************************************************/	

} // end class

function getArr($arr)
{
	echo '<pre>';
	print_r($arr);
	echo '</pre>';
	exit;
}

/****************************************************************************************/
/****************************************************************************************/

class HlpData {
	private static $pageId;
	private static $siteId;
	private static $listCustomizer = array();
	private static $listAdpTitle = false;

	public static function setPageId($pageId)
	{
		self::$pageId = $pageId;
		self::$siteId = preg_replace('/_[0-9]+$/', '', $pageId);
	}

	public static function getPageId()
	{
		return self::$pageId;
	}
	
	public static function getSiteId()
	{
		return self::$siteId;
	}

	/**
	* Костомизация
	*
	*
	*/
	public static function getResource($property, $default = '')
	{
		$value = self::getDymTitle($property);
		if ($value) return $value;

		$pageId = self::getPageId();
		$siteId = self::getSiteId();

		$value = self::getCustomizerFile($pageId, $property);
		if (!$value) $value = self::getCustomizerFile($siteId.'_main', $property);
		if (!$value) $value = $default;

		return $value;
	}

	private static function getDymTitle($property)
	{
		if (array_key_exists('hlp-ttl', $_GET)) {
			$titleId = $_GET['hlp-ttl'];
		} else if (array_key_exists('utm_source', $_GET)) {
			$titleId = $_GET['utm_source'];
		} else if (array_key_exists('ch', $_GET)) {
			$titleId = $_GET['ch'];
		} else {
			return false;
		}
		

		$pageId = self::getPageId();

		$adaptiveTitlePath = getDymTitleFilePath($pageId);
		if (self::$listAdpTitle) {

		} else if (file_exists($adaptiveTitlePath)) {
			$adaptiveTitleJson = file_get_contents($adaptiveTitlePath);
			$adaptiveTitle = json_decode($adaptiveTitleJson, true);
			$adaptiveTitle = $adaptiveTitle['list_value'];
			if (!array_key_exists($titleId, $adaptiveTitle)) return false;
			self::$listAdpTitle = $adaptiveTitle[$titleId];
		} else {
			return false;
		}

		$title = self::$listAdpTitle;

		if (is_array($title) && array_key_exists($property, $title) && trim($title[$property])) return $title[$property];
		else return false;
	}

	private static function getCustomizerFile($file, $property)
	{
		$file = strval($file);
		$customizerPath = 'data/customizer';
		$customizerPath .= '/hlp_customizer_' . $file . '.xml';

		if (!file_exists($customizerPath)) return false;

		if (empty(self::$listCustomizer[$file])) self::$listCustomizer[$file] = simplexml_load_file($customizerPath);
		$listCustomizer = self::$listCustomizer[$file];
			
		if (!$listCustomizer) return false;
		$customizer = $listCustomizer->xpath('//customizer[name="'.trim($property).'"]');

		return $customizer ? $customizer[0]->value->__toString() : false;
	}
	
/**********************************************************************************/

} // end class

$objHlpHosting = new HlpHosting();
$objHlpHosting->getPage();

?>

