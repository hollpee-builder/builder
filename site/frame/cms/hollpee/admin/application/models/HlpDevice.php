<?php  
/**
*
*
*
*/
class HlpDevice {
	/**
	* Отдает информацию об устройстве
	*
	* @see 	HlpAnalytics->fixedVisit()
	*/
	public static function getData()
	{
		$userAgent = $_SERVER['HTTP_USER_AGENT'];

		if (preg_match('/iphone/i', $userAgent)) {
			$device = 'mobile';
			$os = 'apple';
			$browser = 'safari';
		} else if (preg_match('/ipad/i', $userAgent)) {
			$device = 'tab';
			$os = 'apple';
			$browser = 'safari';
		} else if (preg_match('/android/i', $userAgent)) {
			if (preg_match('/mobile/i', $userAgent)) $device = 'mobile';
			else $device = 'tab';
			$os = 'android';
			$browser = 'chrome';
		} else {
			$device = 'desktop';
			
			if (preg_match('/macintosh/i', $userAgent)) $os = 'apple';
			else if (preg_match('/linux/i', $userAgent)) $os = 'linux';
			else if (preg_match('/windows/i', $userAgent)) $os = 'windows';
			else $os = 'other';

			if (preg_match('/firefox/i', $userAgent)) $browser = "firefox";
			else if (preg_match('|\sopr/[0-9]+\.[0-9]+|i', $userAgent)) $browser = "opera";
			else if (preg_match('|\sedge/[0-9]+\.[0-9]+|i', $userAgent)) $browser = "edge";
			else if ($os == 'windows' && preg_match('|\srv:11\.[0-9]+|i', $userAgent)) $browser = "ie11";
			else if ($os == 'windows 10' && preg_match('|\srv:11\.[0-9]+|i', $userAgent)) $browser = "ie11";
			else if (preg_match('|\schrome/|i', $userAgent)) $browser = "chrome";
			else if (preg_match('|\ssafari/|i', $userAgent)) $browser = "safari";
			else if (preg_match('|\smsie|i', $userAgent)) $browser = "ie";
			else $browser = "other";
		}

		$data = array('device'=>$device, 'os'=>$os, 'browser'=>$browser);
		return $data;
	}


}// end class

?>
