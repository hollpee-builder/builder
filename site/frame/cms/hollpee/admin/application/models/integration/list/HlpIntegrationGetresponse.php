<?php  

class HlpIntegrationGetresponse extends HlpIntegrationBasic {

	/*
		$listId получать через скрипт
	*/
	public function execute($service, $user) 
	{
		$apiKey = $service['key'];

		$apiUrl = 'http://api2.getresponse.com';

		$client = new jsonRPCClient($apiUrl);
		$campaigns = $client->get_campaigns($apiKey);
		$campaignsRes = $campaigns['result'];

		$campaignName = array_key_exists('list_id', $service) ? $service['list_id'] : false;
		if ($campaignName) {
			$listId = false;
			foreach ($campaignsRes as $compId => $copItem) {
				if ($copItem['name'] == $campaignName) {
					$listId = $compId;
					break;
				}
			}
			if (!$listId) $listId = array_pop(array_keys($campaignsRes));
		} else {
			$listId = array_pop(array_keys($campaignsRes));
		}

		$result = $client->add_contact(
		    $apiKey,
		    array(
		        'campaign' => $listId,
		        'name' => $user['name'],
		        'email' => $user['email'],
		        'cycle_day' => '0',
		        'ip' => $user['ip']
		    )
		);
		
		return $result;
	}

} // end class

?>
