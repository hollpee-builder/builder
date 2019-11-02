<?php  

class HlpIntegrationBitrix24 extends HlpIntegrationBasic {

	public function execute($service, $user)
	{
		define('CRM_HOST', $service['subdomain'].'.bitrix24.ru');
		define('CRM_PORT', '443');
		define('CRM_PATH', '/crm/configs/import/lead.php');

		// представляем массив
		$postData = array(
			'LOGIN' => $service['login'],
			'PASSWORD' => $service['password'],
		);

		$name = $user['name'];
		$email = $user['email'];
		$phone = $user['phone'];

		$name = $name . ' ('.$user['hlp-form-name'].')';

		$title = $email;
		if (!$title) $title = $name;
		if (!$title) $title = 'Заявка';
		$postData['TITLE'] = $title;

		if ($name) $postData['NAME'] = $name;
		if ($email) $postData['EMAIL_WORK'] = $email;
		if ($phone) $postData['PHONE_WORK'] = $phone;

		// открываем сокет соединения к облачной CRM
		$fp = fsockopen("ssl://".CRM_HOST, CRM_PORT, $errno, $errstr, 30);
		if ($fp) {
			// производим URL-кодирование строки
			$strPostData = '';
			foreach ($postData as $key => $value)
				$strPostData .= ($strPostData == '' ? '' : '&').$key.'='.urlencode($value);

			// подготавливаем заголовки
			$str = "POST ".CRM_PATH." HTTP/1.0\r\n";
			$str .= "Host: ".CRM_HOST."\r\n";
			$str .= "Content-Type: application/x-www-form-urlencoded\r\n";
			$str .= "Content-Length: ".strlen($strPostData)."\r\n";
			$str .= "Connection: close\r\n\r\n";

			$str .= $strPostData;

			fwrite($fp, $str);

			$result = '';
			while (!feof($fp)) {
				$result .= fgets($fp, 128);
			}
			fclose($fp);

			$response = explode("\r\n\r\n", $result);
		} else {
			// echo 'Не удалось подключиться к CRM '.$errstr.' ('.$errno.')';
		}
	}

} // end class

