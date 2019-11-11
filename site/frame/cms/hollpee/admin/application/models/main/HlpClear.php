<?php  
class HlpClear {
	//оставляем буквы, цифры и подчеркивание
	public static function text($text)
	{
		$text = trim(rawurldecode($text));
		return  preg_replace("|[^0-9a-zа-я\s\r\n\t\.\,\_\-\?\!\@\#\%\№\(\)\:\/\=\&]|ui", '', $text);
	}

	//оставляем цифры
	public static function number($text)
	{
		$text = trim(rawurldecode($text));
		$res = preg_replace('|[^0-9\s]|ui', '', $text);
		
		return (int)$res;
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
}









































?>












