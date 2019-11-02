<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

/**
* Форма
*
*/
class HlpFormController extends HlpMainController implements HlpIController {
	/**
	* Добавление лида
	*
	*
	*/
	public function indexAction()
	{
		//данные лида
		$params = $_SERVER['REQUEST_METHOD'] == 'POST' ? $_POST : $_GET;

		if ($this->isBlockRequest($params)) {
			header('Location: http://'.$_SERVER['HTTP_HOST']);
			exit;
		}

		
		// $params
		foreach ($params as $paramKey => $paramsValue) {
			$paramsValue = urldecode($paramsValue);
			$paramsValue = htmlspecialchars(stripslashes(trim($paramsValue)));
			$params[$paramKey] = $paramsValue;
		}

		if (array_key_exists('hlp-redirect', $params)) {
			$redirectUrl = $params['hlp-redirect'];
			unset($params['hlp-redirect']);
		} else {
			$redirectUrl = '';
		}

		if (array_key_exists('hlp-form-name', $params)) {
			$formName = $params['hlp-form-name'];
			unset($params['hlp-form-name']);
		} else {
			$formName = '';
		}	

		if (array_key_exists('hlp-page-id', $params)) {
			$pageId = $params['hlp-page-id'];
			unset($params['hlp-page-id']);
		} else {
			$pageId = '';
		}

		if (array_key_exists('hlp-variant-id', $params)) {
			$variantId = $params['hlp-variant-id'];
			unset($params['hlp-variant-id']);
		} else {
			$variantId = '';
		}

		if (array_key_exists('hlp-type-query', $params)) {
			$typeQuery = $params['hlp-type-query'];
			unset($params['hlp-type-query']);
		} else {
			$is = false;
		}

		$utmSrc = array_key_exists('utm_source', $params) ? $params['utm_source'] : NULL;
		if (!$utmSrc) $utmSrc = array_key_exists('ch', $params) ? $params['ch'] : NULL;

		// установка стандартный параметров
		$params = $this->setParamsStd($params);
		// фиксируем в abtest 
		$this->fixedAbtest($pageId, $variantId);
		
		// добавляем лид 
		$leadId = HlpLead::addNew($params, $formName, $pageId, $variantId, $utmSrc);
		//отправляем лида на email 
		HlpLead::sendEmail($params, $formName, $leadId);
		
		/**************************************/
		$params['hlp-form-name'] = $formName;
		$params['lead_id'] = $leadId;
		if (CMS_TYPE != "start") {
			// интеграция
			$integrationObj = new HlpIntegration();
			$integrationObj->execute($params, $pageId);
		}
		// user handler
		$this->userHandler($params);
		/**************************************/
		
		// перенаправляем на страницу
		if ($typeQuery == 'ajax') {
			echo 1;
			return false;
		} else if (!$redirectUrl) {
			$redirectUrl = $_SERVER['HTTP_REFERER'];
		} else {
			$isLink = $this->isLink($redirectUrl);
			if (!$isLink) {
				$redirectUrl = preg_replace('/^\//', '', $redirectUrl);
				$redirectUrl = '../' . $redirectUrl;
			}
		}

		header('Location: ' . urldecode($redirectUrl) );
	}

	private function userHandler($params)
	{
		$userHandlerPath = '../hlp_user_form_handler.php';
		if (file_exists($userHandlerPath)) {
			include_once $userHandlerPath;

			if (function_exists('hlp_user_form_handler')) {
				$propertyQuery = $_SERVER['REQUEST_METHOD'] == 'POST' ? $_POST : $_GET;
				hlp_user_form_handler('../', $params, $propertyQuery);
			}
		}
	}

	private function setParamsStd($params)
	{
		$params = $this->setParamsStdItem($params, 'name');
		$params = $this->setParamsStdItem($params, 'email');
		$params = $this->setParamsStdItem($params, 'phone');

		if (!array_key_exists('name', $params)) {
			$params['name'] = 'No name';
		}

		// recapcha
		if (array_key_exists('g-recaptcha-response', $params)) {
			$params['recaptcha'] = 'yes';
			unset($params['g-recaptcha-response']);
		}

		if (array_key_exists('confirmation-personal-data', $params)) {
			unset($params['confirmation-personal-data']);
		}

		return $params;
	}

	private function setParamsStdItem($params, $name)
	{
		if (array_key_exists($name, $params)) return $params;

		foreach ($params as $key => $value) {
			$isKeyEmail = preg_match('/'.$name.'/i', $key);

			if ($isKeyEmail) {
				$params[$name] = $value;
				unset($params[$key]);
				return $params;
			}
		}
		
		return $params;
	}


	private function isLink($text)
	{
		if (preg_match('|^https?://|', $text)) return true;
		else if (preg_match('|^//|', $text)) return true;
		else return false;
	}

	private function fixedAbtest($pageId, $variantId)
	{
		$adminPath = preg_replace('/[^\/]+$/', '', $_SERVER['SCRIPT_FILENAME']);
		$abtestPath = $adminPath . '/../data/abtest/abtest_'.$pageId.'.txt';
		if (file_exists($abtestPath) && $variantId) {
			$abtestJson = file_get_contents($abtestPath);
			$abtest = json_decode($abtestJson, true);
			$abtest['list'][$variantId]['lead'] = $abtest['list'][$variantId]['lead'] + 1;
			$abtestJson = json_encode($abtest, true);
			file_put_contents($abtestPath, $abtestJson);
		}
	}

/***************************************************************************/
	
	/**
	* Блокирует спам запросы
	*
	*
	*/
	private function isBlockRequest($params)
	{
		// рекапча
		if (isset($params['recaptcha_response'])) {
			$res = HlpIntegrationRecaptcha3::check($params['recaptcha_response']) ? false : true;
			
			$params['recaptcha_v3'] = 'yes';
			unset($params['recaptcha_response']);
			return $res;
		} 
		
		if (array_key_exists('HTTP_REFERER', $_SERVER)) {
			$refererHost = explode('/', $_SERVER['HTTP_REFERER']);
			if (!array_key_exists(3, $refererHost)) 
				return true;
			$refererHost = $refererHost[2];
			if ($refererHost != $_SERVER['HTTP_HOST'])
				return true;
		} else {
			return true;
		}

		// защита от спама
		if (!$_COOKIE['zls12'] 
				|| !$params['zls12']
				|| $_COOKIE['zls12'] != $params['zls12']) {
			return true;
		}

		return false;
	}

/********************************************************************************************************/

}// end class 

?>
