<?php  
/**
* Работа с почтой
*
*
*/
class HlpEmail {
	/**
	* Отправка лида
	*
	* @see 	HlpLead::sendEmail()
	*/
	public static function send($email, $subject, $message)
	{
		$headers = 'From: lead@'.$_SERVER['HTTP_HOST']. "\r\n" .
				    'Reply-To: no-reply@'.$_SERVER['HTTP_HOST']."\r\n" .
				   	'Content-Type: text/html; charset=utf-8'. "\r\n" .
				    'X-Mailer: PHP/' . phpversion();

		$message = urldecode($message);

		$list = HlpIntegration::getListIntegrationApiValue();
		if (array_key_exists('all_pages', $list) 
				&& array_key_exists('phpmailer', $list['all_pages'])
			    && $list['all_pages']['phpmailer']['running'] == 'yes') {
			HlpIntegrationPHPMailer::send($list['all_pages']['phpmailer']['list_property'], $subject, $message);
		} else {
			mail($email, $subject, $message, $headers);
		}
	}
} // end class

?>
