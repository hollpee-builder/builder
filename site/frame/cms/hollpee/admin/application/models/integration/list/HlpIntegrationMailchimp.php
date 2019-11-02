<?php  

class HlpIntegrationMailchimp extends HlpIntegrationBasic {

	public function execute($service, $user) {
		$apiKey = $service['key'];
		$listId = $service['list_id'];
	
		$dataCenter = array();
		preg_match_all('/[^\-]+$/', $apiKey, $dataCenter);
		$dataCenter = $dataCenter[0][0];

	   	$data = array(
	   		'apikey'        => $apiKey,
	   		'email_address' => $user['email'],
	   		'status'        => 'subscribed',
	   		'merge_fields'  => array(
	   		    'FNAME' => $user['name']
	   	 	)
	   	);
		$jsonData = json_encode($data);
   	
		$url = 'https://'.$dataCenter.'.api.mailchimp.com/3.0/lists/'.$listId.'/members/';
		$auth = base64_encode('user:'.$apiKey);
		$result = $this->query($url, $jsonData, true, $auth);

		return $result;
	}

	protected function query($url, $data, $isJson = false, $auth = false)
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


} // end class

?>
