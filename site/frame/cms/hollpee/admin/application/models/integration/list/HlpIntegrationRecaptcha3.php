<?php  

class HlpIntegrationRecaptcha3 extends HlpIntegrationBasic {

	public function execute($service, $user)
	{
		
	}

	public function check($response)
	{
		$allIntegrationValue = HlpIntegration::getListIntegrationApiValue();

		if (array_key_exists('recaptcha3', $allIntegrationValue[$pageId])) {
			$params = $allIntegrationValue[$pageId]['recaptcha3']['list_property'];
		} else {
			$params =  $allIntegrationValue["all_pages"]['recaptcha3']['list_property'];
		}


		$recaptcha_secret = $params['secret_key'];
		// Build POST request
		$recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
		$recaptcha_response = $response;
		
		// Make and decode POST request
		$recaptcha = file_get_contents($recaptcha_url . '?secret=' . $recaptcha_secret . '&response=' . $recaptcha_response);
		$recaptcha = json_decode($recaptcha);
		
		// Take action based on the score returned
		if ($recaptcha->score >= 0.5) {
		   	return true;
		} else {
		    return false;
		}
	}

} // end class

?>