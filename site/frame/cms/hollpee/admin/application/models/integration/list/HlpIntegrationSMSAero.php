<?php  
class HlpIntegrationSMSAero extends HlpIntegrationBasic {
	protected $libsFolder = 'smsaero';
	protected $listIncludeFile = array('api.php');

	public function execute($service, $lead)
	{
		// создаем объект
		$login = $service['login'];
		$psw = $service['password'];
		$smsObj = new SmsaeroApi($login, $psw);

		// данные
		$userName = array_key_exists('name', $lead) ? $lead['name'] : '';
		$userPhone = array_key_exists('phone', $lead) ? $lead['phone'] : '';

		// добавляем контакт
		$userPhoneContact = preg_replace('/[^0-9]+/', '', $userPhone);
		$smsObj->addphone($userPhoneContact, false, '', $userName);

		// отправляем оповещение
		if (array_key_exists('phone', $service)) {
			$phone = $service['phone'];
			$domain = $_SERVER['HTTP_HOST'];
			
			$msg = 'Заявка с ' . $domain.': ';
			$msg .= $userName.' ';
			$msg .= $userPhone;
			$response = $smsObj->send($phone, $msg, false, 1);
		}
	}

} // end class

?>
