<?php  
class Clear {
	//оставляем буквы, цифры и подчеркивание
	public static function leaveLettersAndNumber($text)
	{
		$text = trim(rawurldecode($text));
		$text =  preg_replace('|[^0-9a-zа-я\s\.\,\_\-\?\!\@\#\%\№\(\)\:\/\=\&]|ui', '', $text);
		
		$text =  preg_replace('/--/', '', $text);
		
		return $text;
	}

	public static function text($text)
	{
		return self::leaveLettersAndNumber($text);
	}

	//ставляет буквы
	public static function leaveLetters($text)
	{
		$text = trim(rawurldecode($text));
		return preg_replace('|[^a-zа-я\s\.\,\_\-\?\!\@\#\%\№\(\)\:\/\=\&\ ]|ui', '', $text);
	}
	//оставляем цифры
	public static function leaveNumber($text)
	{
		$text = trim(rawurldecode($text));
		return preg_replace('|[^0-9\s]|ui', '', $text);
	}

	//убирает у URI параметр
	public static function clearGet($text)
	{
		$text = trim(rawurldecode($text));
		return preg_replace('|\?.*|ui', '', $text);
	}

	//оставляетт у URI параметры
	public static function leaveGet($text)
	{
		$text = trim(rawurldecode($text));
		return preg_replace('|.*\?|ui', '', $text);
	}

	//очищяет для email
	public static function email($text)
	{
		$text = trim(rawurldecode($text));
		return preg_replace('|[^a-zа-я0-9\@\.\-_]+|ui', '', $text);
	}

	//очищяет для password
	public static function password($text)
	{
		$text = trim(rawurldecode($text));
		return preg_replace('|[^a-z0-9\!\?\@\#\$\%^&*\-\_]|ui', '', $text);
	}

	//очищяет для number phone 
	public static function phone($text)
	{
		$text = trim(rawurldecode($text));
		$res =  preg_replace('|[^0-9]|ui', '', $text);
		return preg_replace('@^7|8@ui', '', $res);
	}


	/**
	* Очищает json
	*
	* @see 	DownloadController::createHtmlAction()
	* @see 	ShowController::publishedSiteAction()
	*/ 
	public static function json($textJson, $isDownload = false) {
		$textJson = urldecode( trim($textJson) );
		$textJson = preg_replace("/&lt;/", '<', $textJson);
		$textJson = preg_replace("/&gt;/", '>', $textJson);
		$textJson = preg_replace("/&nbsp;/", ' ', $textJson);
			
		// заменяем 
		$textJson = preg_replace("/@@@@@lt@@@@@/", '<', $textJson);
		$textJson = preg_replace("/@@@@@gt@@@@@/", '>', $textJson);

		$textJson = preg_replace("/@@@@@plus@@@@@/", '+', $textJson);
		$textJson = preg_replace("/@@@@@question@@@@@/", '?', $textJson);
		$textJson = preg_replace("/@@@@@hlp_amp@@@@@/", '&', $textJson);

		//
		$textJson = preg_replace('/@@@@@brace_start@@@@@/', '%7B', $textJson);
		$textJson = preg_replace('/@@@@@brace_end@@@@@/', '%7D', $textJson);
		$textJson = preg_replace('/@@@@@double_quotes@@@@@/', '%22', $textJson);

		// очищаем
		if ($isDownload) {
			
		}

		return $textJson;
	}

	public static function jsonHttp($text)
	{
		$text = preg_replace('/@@@@@hp@@@@@/', 'http', $text);

		return $text;
	}

	// public static function http($text) {
		// return $textJson;
	// }

}









































?>












