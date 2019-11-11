<?php

function sendEmail($lead, $formName)
{
	$email = getEmail();
	if (!$email) return false;

	$lead = json_encode($lead, true);
	$params = array('form_name' => $formName, 'lead' => $lead);
	$message = render('email.php', $params);
	$subject = 'Новый лид с сайта ' . $_SERVER['HTTP_HOST'];

	$headers = 'From: '.$_SERVER['HTTP_HOST'].' <'.$email.'>' . "\r\n" .
				    'Reply-To: '.$email."\r\n" .
				   	'Content-Type: text/html; charset=utf-8'. "\r\n" .
				    'X-Mailer: PHP/' . phpversion();

	mail($email, $subject, $message, $headers);
}

function getEmail()
{
	$filePath = '../hlp_email.txt';
	if (!file_exists($filePath)) return false;
	$email = file_get_contents($filePath);
	return trim($email);
}

function isLink($text)
{
	if (preg_match('|^https?://|', $text)) return true;
	else if (preg_match('|^//|', $text)) return true;
	else return false;
}

function render($file, $params = array())
{
	if (is_array($params)) {
		foreach ($params as $key => $value) {
			$$key = $value;
		}	
	}
	ob_start();
	if (file_exists($file)) require_once $file;
	else return null;
	return ob_get_clean();
}

function redirect($typeQuery, $redirectUrl)
{
	// перенаправляем на страницу
	if ($typeQuery == 'ajax') {
		echo 1;
		return false;
	} else if (!$redirectUrl) {
		$redirectUrl = $_SERVER['HTTP_REFERER'];
	} else {
		$isLink = isLink($redirectUrl);
		if (!$isLink) {
			$redirectUrl = preg_replace('/^\//', '', $redirectUrl);
			$redirectUrl = '../' . $redirectUrl;
		}
	}

	header('Location: ' . urldecode($redirectUrl) );
}

/**************************************************************************************/

//данные лида
$params = $_SERVER['REQUEST_METHOD'] == 'POST' ? $_POST : $_GET;

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

if (array_key_exists('hlp-type-query', $params)) {
	$typeQuery = $params['hlp-type-query'];
	unset($params['hlp-type-query']);
} else {
	$typeQuery = false;
}

sendEmail($params, $formName);

// перенаправляем
redirect($typeQuery, $redirectUrl);

?>
