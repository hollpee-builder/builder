<?php  
/**
* Статистика
*
*
*/
class HlpAnalytics {
	/**
	* Фиксируем визит
	*
	*
	*/	
	public static function fixedVisit($data = array())
	{
		// подключаем необходимые файлы
		$adminPath = 'admin';
		require_once 'admin/application/models/HlpDevice.php';
		require_once 'admin/application/models/db/HlpDb.php';
		require_once 'admin/application/models/db/HlpDbAnalytics.php';
		require_once 'admin/application/models/db/HlpDbLead.php';

		// получаем данные об устройстве
		$deviceData = HlpDevice::getData();
		
		$pageId = array_key_exists('page_id', $data) ? $data['page_id'] : NULL;
		$variantId = array_key_exists('variant_id', $data) ? $data['variant_id'] : NULL;
		$utmSrc = array_key_exists('utm_source', $data) ? $data['utm_source'] : NULL;
		$url = array_key_exists('REQUEST_URI', $_SERVER) ? $_SERVER['REQUEST_URI'] : NULL;
		$urlReferer = array_key_exists('HTTP_REFERER', $_SERVER) ? urldecode($_SERVER['HTTP_REFERER']) : NULL;
		$ip = array_key_exists('REMOTE_ADDR', $_SERVER) ? $_SERVER['REMOTE_ADDR'] : NULL;

		if ($url) $url = preg_replace('/\?[^\?]*$/', '', $url);

		// фиксируем в bd
		$params = array(
			'page_id' => $pageId,
			'variant_id' => $variantId,
			'utm_source' => $utmSrc,
			'url' => htmlspecialchars($url),
			'url_referer' => htmlspecialchars($urlReferer),
			'ip' => $ip,
			'device' => $deviceData['device'],
			'os' => $deviceData['os'],
			'browser' => $deviceData['browser']
		);
		HlpDbAnalytics::getInstance($adminPath)->fixedVisit($params);
	}

	/**
	* Отдает основные данные
	* 
	* @see 	IndexController::indexAction()
	*/
	public static function getSite()
	{
		// параметры
		$dateMonth = @strtotime('1 '.date('M').' '.date('Y'));
		$dateWeek = @strtotime('last Monday');
		$dateDay = @strtotime('today');

		$paramsMonth = array('from_date' => $dateMonth);
		$paramsWeek = array('from_date' => $dateWeek);
		$paramsDay = array('from_date' => $dateDay);

		$data = array();

		// посещения
		$data['visit_month'] = HlpDbAnalytics::getInstance()->getCountFromDateSite($paramsMonth);
		$data['visit_week'] = HlpDbAnalytics::getInstance()->getCountFromDateSite($paramsWeek);
		$data['visit_day'] = HlpDbAnalytics::getInstance()->getCountFromDateSite($paramsDay);

		//лиды 
		$data['lead_month'] = HlpDbLead::getInstance()->getCountFromDate($paramsMonth);
		$data['lead_week'] = HlpDbLead::getInstance()->getCountFromDate($paramsWeek);
		$data['lead_day'] = HlpDbLead::getInstance()->getCountFromDate($paramsDay);

		return $data; 
	}
	
} // end class

?>
