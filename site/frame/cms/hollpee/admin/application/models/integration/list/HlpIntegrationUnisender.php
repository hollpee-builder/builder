<?php  

class HlpIntegrationUnisender extends HlpIntegrationBasic {

	public function execute($service, $user) {
		$apiKey = $service['key'];
	    $listId = $service['list_id'];
	    $url = 'http://api.unisender.com/ru/api';
	    $data = 'format=json&api_key=' . $apiKey;

	    // получение id списка
	    if (!$listId) $listId = $this->getUnisenderListId($url, $data, $listId);
	    if (!$listId) return false;
	    
        // сохранение
        $userPhone = preg_replace('/[\+\s\-\(\)]+/', '', $user['phone']);
        $userPhone = preg_replace('/^[78]+/', '', $userPhone);
        $userName = urlencode(iconv('cp1251', 'utf-8', $user['name']));

        $data_add = $data . '&list_ids='.$listId;
        $data_add .= '&fields[Name]=' . $userName;
        $data_add .= '&fields[email]=' . $user['email'];
        $data_add .= '&fields[phone]=' . $userPhone;
        $data_add .= '&double_optin=1';
        $data_add .= '&confirm_ip=' . $user['ip'];

       	$result = HlpIntegration::query($url.'/subscribe', $data_add);
       	
       	return $result;
	}

	private function getUnisenderListId($url, $data, $listName)
	{
        $result = HlpIntegration::query($url.'/getLists', $data);
        $allList = $result->result;
        if (!$allList) return false;

        return $listId = $allList[0]->id;;
	}

} // end class

?>
