<?php  
/**
* Интеграция
*
*
*/
class HlpIntegration {
	public static $listIntegrationApi = array(
		'mailchimp' => array(
			'class' => 'HlpIntegrationMailchimp',
			'label' => 'Mailchimp',
			'tutorial' => 'D5fkVcIMxxI',
			'list_property' => array(
				'key' => array('label' => 'API ключ'),
				'list_id' => array(
					'label' => 'Id списка',
				)
			)
		),
		'getresponse' => array(
			'class' => 'HlpIntegrationGetresponse',
			'label' => 'Getresponse',
			'tutorial' => '1ipQ3TcZYjE',
			'list_property' => array(
				'key' => array('label' => 'API ключ'),
				'list_id' => array(
					'label' => 'Имя компании', 
					'optional' => 'yes',
					)
			)
		),
		'unisender' => array(
			'class' => 'HlpIntegrationUnisender',
			'label' => 'Unisender',
			'tutorial' => 'qZyIbS36ft4',
			'list_property' => array(
				'key' => array('label' => 'API ключ'),
				'list_id' => array(
					'label' => 'Id списка', 
					'optional' => 'yes',
					)
			)
		),

		'sendpulse' => array(
			'class' => 'HlpIntegrationSendpulse',
			'label' => 'Sendpulse',
			'tutorial' => '',
			'list_property' => array(
				'user_id' => array('label' => 'User id'),
				'secret_key' => array('label' => 'Секретный ключ'),
				'list_id' => array(
					'label' => 'Id книги',
					'optional' => 'yes',
				)
			)
		),

		'justclick' => array(
			'class' => 'HlpIntegrationJustclick',
			'label' => 'JustClick',
			'tutorial' => '',
			'list_property' => array(
				'user_id' => array('label' => 'Логин'),
				'api_key' => array('label' => 'Ключ API'),
				'list_id' => array('label' => 'Id группы'),
				'doneurl2' => array(
					'label' =>'Адрес куда будет перенаправлен контакт после подтверждения подписки',
					'optional' => 'yes'
				)
			)
		),

		'estismail' => array(
			'class' => 'HlpIntegrationEstismail',
			'label' => 'Estismail',
			'tutorial' => 'y2a2OS0dPUM',
			'list_property' => array(
				'key' => array('label' => 'API ключ'),
				'list_id' => array(
					'label' => 'Id группы', 
				),
				'approve' => array('label' => 'approve', 'optional' => 'yes')
			)
		),

		/*********************/
		'amosrm' => array(
			'class' => 'HlpIntegrationAmocrm',
			'label' => 'amoCRM',
			'tutorial' => 'KNdkTLRRIa4',
			'list_property' => array(
				'login' => array('label' => 'Логин'),
				'key' => array('label' => 'API ключ'),
				'subdomain' => array('label' => 'Поддомен')
			)
		),
		'bitrix24' => array(
			'class' => 'HlpIntegrationBitrix24',
			'label' => 'Bitrix24',
			'tutorial' => '',
			'list_property' => array(
				'login' => array('label' => 'Логин (email)'),
				'password' => array('label' => 'Пароль'),
				'subdomain' => array('label' => 'Поддомен')
			)
		),

		/*********************/
		
		'smsaero' => array(
			'class' => 'HlpIntegrationSMSAero',
			'label' => 'SMS Aero',
			'tutorial' => '',
			'list_property' => array(
				'login' => array('label' => 'Логин(email)'),
				'password' => array('label' => 'Пароль'),
				'phone' => array(
					'label' => 'Телефон для оповещения',
					'optional' => 'yes',
				)
			)
		),

		/**************/
		'e_autopay' => array(
			'class' => 'HlpIntegrationEautopay',
			'label' => 'E-AutoPay',
			'tutorial' => '',
			'list_property' => array(
				'url' => array('label' => 'Url продукта')
			)
		),


		'recaptcha3' => array(
			'class' => 'HlpIntegrationRecaptcha3',
			'label' => 'reCAPTCHA v3',
			'tutorial' => '',
			'list_property' => array(
				'secret_key' => array('label' => 'Секретный ключ')
			)
		),

		'phpmailer' => array(
			'class' => 'HlpIntegrationPHPMailer',
			'label' => 'Yandex Почта',
			'tutorial' => '',
			'list_property' => array(
				'login' => array('label' => 'Email Yandex почты'),
				'password' => array('label' => 'Пароль от Yandex почты'),
				'to_email' => array('label' => 'Email куда отправлять оповещение'),
				
				'host' => array('label' => 'Host', 'optional' => 'yes'),
				'port' => array('label' => 'Port', 'optional' => 'yes'),
				'encryption' => array('label' => 'Encryption', 'optional' => 'yes'),
			)
		),

	);

	public function execute($lead, $pageId)
	{
		if (!$pageId) return false;
		
		$listItegration = self::$listIntegrationApi;
		$allIntegrationValue = self::getListIntegrationApiValue();
		$listItegrationValue = $allIntegrationValue[$pageId];
		$listValueAllPages =  $allIntegrationValue["all_pages"];
		
		if (!$listItegrationValue) $listItegrationValue = $listValueAllPages;
		if (!$listItegrationValue) return false;
		
		$lead = $this->setDefault($lead);

		foreach ($listItegration as $integrationName => $integrationProperty) {
			if (!array_key_exists($integrationName, $listItegrationValue)) {
				if (array_key_exists($integrationName, $listValueAllPages)) {
					$listItegrationValue = $listValueAllPages;
				} else {
					continue;
				}
			}

			$integrationValue = $listItegrationValue[$integrationName];
			if ($integrationValue['running'] != 'yes') {
				if (array_key_exists($integrationName, $listValueAllPages)) {
					$integrationValue = $listValueAllPages[$integrationName];
					if ($integrationValue['running'] != 'yes') continue;
				} else {
					continue;
				}
			}

			$propertyValue = $integrationValue['list_property'];

			$className = $integrationProperty['class'];
			$methodName = 'execute';

			foreach ($propertyValue as $propItemKey => $propItemVal) {
				$propertyValue[$propItemKey] = html_entity_decode($propItemVal);
			}
			
			$integrationObj = new $className();
			$integrationObj->$methodName($propertyValue, $lead);
		}
	}

	private function setDefault($lead)
	{
		if (!array_key_exists('name', $lead)) $lead['name'] = '';
		if (!array_key_exists('email', $lead)) $lead['email'] = '';
		if (!array_key_exists('phone', $lead)) $lead['phone'] = '';
		if (!array_key_exists('addr', $lead)) $lead['addr'] = '';
		if (!array_key_exists('notes', $lead)) $lead['notes'] = '';
		$lead['ip'] = $_SERVER['REMOTE_ADDR'];
		
		return $lead;
	}

/*********************************************************************************/

	/**
	* Интеграция по api
	*
	* @see 	this::execute()
	* @see 	HlpIntegrationController::getListIntegration()
	*/
	public static function getListIntegrationApiValue()
	{
		$xmlPath = self::getApiFilePath();
		if (!file_exists($xmlPath)) return array();
		$listApiResJson = file_get_contents($xmlPath);
		
		$listApiResJson = preg_replace('/\[\]/', '{}', $listApiResJson);
		$listApiResJson = preg_replace('/\\\"/', '"', $listApiResJson);

		$listApiRes = json_decode($listApiResJson, true);

		return $listApiRes;
	}

	/**
	* Интеграция для страницы
	*
	* @see 	HlpPaymentController::getServiceProperty()
	*/
	public static function getIntegration($pageId, $serviceName)
	{
		$list = self::getListIntegrationApiValue();

		if (array_key_exists($pageId, $list) && array_key_exists($serviceName, $list[$pageId])) {
			return $list[$pageId][$serviceName]['list_property'];

		} else if (array_key_exists('all_pages', $list) && array_key_exists($serviceName, $list['all_pages'])) {
			return $list['all_pages'][$serviceName]['list_property'];
		
		} else {
			return false;
		}
	}

	/**
	* Сохраниние
	*
	* @see 	HlpIntegrationController
	*/
	public static function saveValue($json)
	{
		$filePath = self::getApiFilePath();
		file_put_contents($filePath, $json);
	}


	/**
	* ОТдает путь к файлу api
	*
	* @see 	this::getListIntegrationApiValue()
	* @see 	HlpDataXml::saveIntegrationPropertyApi()
	* @see 	HlpDataXml::saveIntegrationRunningApi()
	*/
	public static function getApiFilePath()
	{
		return HLP_ADMIN_FOLDER_PATH . '/data/integration/integration_api.json';
	}



/*************************************************************************************/

	public static function query($url, $data, $isJson = false, $auth = false)
	{
		$ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $url);
                if ($isJson || $auth) {
                	$headerJson = $isJson ? 'Content-Type: application/json' : '';
                	$headerAuth = $auth ? 'Authorization: Basic '.$auth : '';
                	$listHeader = array($headerJson, $headerAuth);
                	curl_setopt($ch, CURLOPT_HTTPHEADER, $listHeader);
                }
                curl_setopt($ch, CURLOPT_USERAGENT, 'PHP-MCAPI/2.0');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 10);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);                      

                $result = curl_exec($ch);
                return json_decode($result);
	}

/*************************************************************************************/

} // end class

?>
