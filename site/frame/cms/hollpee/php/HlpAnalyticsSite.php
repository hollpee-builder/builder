<?php

class HlpAnalyticsSite {

	public function __construct($adminFolder)
	{
		$this->adminFolder = $adminFolder;
	}

	public function fixedVisitPage($pageId, $currentPageId)
	{	
		$utmSrc = array_key_exists('utm_source', $_GET) ? $_GET['utm_source'] : NULL;
		if (!$utmSrc) $utmSrc = array_key_exists('ch', $_GET) ? $_GET['ch'] : NULL;

		$dataVisit = array(
			'page_id' => $pageId,
			'variant_id' => $currentPageId,
			'utm_source' => $utmSrc
		);
		$this->fixedVisit($dataVisit);
	}

	public function fixedVisitAbtest($pageId, $currentPageId)
	{
		$abtestPath = getAbtestFilePath($pageId);
		$abtestJson = file_get_contents($abtestPath);
		$abtest = json_decode(trim($abtestJson), true);
		
		$countVisit = $abtest['list'][$currentPageId]['visit'] + 1;
		$abtest['list'][$currentPageId]['visit'] = $countVisit;

		$abtestJson = json_encode($abtest, true);
		file_put_contents($abtestPath, $abtestJson);
	}

	public function fixedVisitSite($cmsIndex)
	{
		if (!$cmsIndex) return false;
		$visitKey = 'visit_' . $cmsIndex;
		$lastVisitDate = array_key_exists($visitKey, $_COOKIE) ? $_COOKIE[$visitKey] : false;

		$currentDate = date('y.m.d');
		// визит уже зафиксирован
		if ($lastVisitDate == $currentDate) return false;
		
		// фиксируем в cookie
		$time = time() + 3600 * 24 * 365;
		setcookie($visitKey, $currentDate, $time);

		$this->fixedVisit();
	} 

	public function fixedVisit($data=array())
	{
		$hlp_path_analytics =  'admin/application/models/HlpAnalytics.php';
		if (file_exists($hlp_path_analytics)) {
			require_once $hlp_path_analytics; 

			// фиксируем визит
			HlpAnalytics::fixedVisit($data);
		}
	}

} // end class


?>
