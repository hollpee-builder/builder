<?php
class HlpIntegrationAmocrm extends HlpIntegrationBasic {
	private $subdomain;

	public function execute($service, $lead)
	{
		$user=array(
			'USER_LOGIN'=>$service['login'],
			'USER_HASH'=>$service['key']
		);
		$this->subdomain=$service['subdomain'];

		$data=array(
			'name'=>isset($lead['name']) ? $lead['name'] : 'ss',
			'phone'=>isset($lead['phone']) ? $lead['phone'] : '',
			'email'=>isset($lead['email']) ? $lead['email'] : 'sd',
		);

		//авторизация
		$link='https://'.$this->subdomain.'.amocrm.ru/private/api/auth.php?type=json';
		$Response = $this->query($link, $user);
		$Response=$Response['response'];
		if(!isset($Response['auth'])) return false;
		
		
		// // проверка на существование контакта
		// $link='https://'.$this->subdomain.'.amocrm.ru/private/api/v2/json/contacts/list?query='.$data['email'];
		// $Response = $this->query($link);
		// // print_r($Response);
		// // return false;
		// 	// die('Такой контакт уже существует в amoCRM');

		/*****************************************/
		// добавление лиды
		$leadParams = $this->getLeadParams($lead);
		$setLead['request']['leads']['add'][]=$leadParams;
		$linkLead = 'https://'.$this->subdomain.'.amocrm.ru/private/api/v2/json/leads/set';
		$Response = $this->query($linkLead, false, $setLead);
		$linkedLeadsId = $Response['response']['leads']['add'][0]['id'];
		/*****************************************/

		// контакты
		$data['linked_leads_id'] = $linkedLeadsId;
		$contact = $this->getContact($data);
		$set['request']['contacts']['add'][]=$contact;
		
		// //Формируем ссылку для запроса
		$link='https://'.$this->subdomain.'.amocrm.ru/private/api/v2/json/contacts/set';
		$Response = $this->query($link, false, $set);

		// $output='ID добавленных контактов:'.PHP_EOL;
		// foreach($Response as $v)
		// 	if(is_array($v))
		// 		$output.=$v['id'].PHP_EOL;

		return $output;

	} // end method


	private function getCustomerFields()
	{
		$link='https://'.$this->subdomain.'.amocrm.ru/private/api/v2/json/accounts/current';
		$Response = $this->query($link);
		$account=$Response['response']['account'];

		
		$need=array_flip(array('POSITION','PHONE','EMAIL'));
		if(isset($account['custom_fields'],$account['custom_fields']['contacts']))
			do
			{
				foreach($account['custom_fields']['contacts'] as $field)
					if(is_array($field) && isset($field['id']))
					{
						if(isset($field['code']) && isset($need[$field['code']]))
							$fields[$field['code']]=(int)$field['id'];
						#SCOPE - нестандартное поле, поэтому обрабатываем его отдельно
						elseif(isset($field['name']) && $field['name']=='Сфера деятельности')
							$fields['SCOPE']=$field;
						
						$diff=array_diff_key($need,$fields);
						if(empty($diff))
							break 2;
					}
					if(isset($diff))
						die('В amoCRM отсутствуют следующие поля'.': '.join(', ',$diff));
					else
						die('Невозможно получить дополнительные поля');
				}
			while(false);
		else
			die('Невозможно получить дополнительные поля');
		$custom_fields=isset($fields) ? $fields : false;

		return $custom_fields;
	}

	private function getContact($data)
	{
		$custom_fields = $this->getCustomerFields();

		$contact=array(
					'name'=>$data['name'],
					'linked_leads_id' => $data['linked_leads_id'],
					'custom_fields'=>array(
						array(
							'id'=>$custom_fields['EMAIL'],
							'values'=>array(
								array(
									'value'=>$data['email'],
									'enum'=>'WORK'
								)
							)
						)
					)
				);
				
		if(!empty($data['company']))
			$contact+=array('company_name'=>$data['company']);
		if(!empty($data['position']))
			$contact['custom_fields'][]=array(
				'id'=>$custom_fields['POSITION'],
				'values'=>array(
					array(
						'value'=>$data['position']
					)
				)
		);


		if(!empty($data['phone']))
			$contact['custom_fields'][]=array(
				'id'=>$custom_fields['PHONE'],
				'values'=>array(
					array(
						'value'=>$data['phone'],
						'enum'=>'OTHER'
					)
				)
		);

		return $contact;
	}

	private function getLeadParams($lead)
	{
		$leadName = $lead['name'].' ('.$lead['hlp-form-name'].')';

		$res = array(
			'name' => $leadName,
			'created_at' => time(),	
			// 'updated_at' => time(),
			'status_id' => $lead['lead_id'],
			'sale' => '456',
			// 'company_id' => ''
		);

		return $res;
	}

	private function CheckCurlResponse($code)
	{
		$code=(int)$code;
		$errors=array(
			301=>'Moved permanently',
			400=>'Bad request',
			401=>'Unauthorized',
			403=>'Forbidden',
			404=>'Not found',
			500=>'Internal server error',
			502=>'Bad gateway',
			503=>'Service unavailable'
		);
		try
		{
			#Если код ответа не равен 200 или 204 - возвращаем сообщение об ошибке
			if($code!=200 && $code!=204)
				throw new Exception(isset($errors[$code]) ? $errors[$code] : 'Undescribed error',$code);
		}
		catch(Exception $E)
		{
			die('Ошибка: '.$E->getMessage().PHP_EOL.'Код ошибки: '.$E->getCode());
		}
	}

	private function query($link, $user = false, $set = false)
	{
		$curl=curl_init(); #Сохраняем дескриптор сеанса cURL
		#Устанавливаем необходимые опции для сеанса cURL
		curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
		curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client/1.0');
		curl_setopt($curl,CURLOPT_URL,$link);
		
		if ($user) {
			curl_setopt($curl,CURLOPT_POST,true);
			curl_setopt($curl,CURLOPT_POSTFIELDS,http_build_query($user));
		}

		if ($set) {
			curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'POST');
			curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($set));
			curl_setopt($curl,CURLOPT_HTTPHEADER,array('Content-Type: application/json'));
		}

		curl_setopt($curl,CURLOPT_HEADER,false);
		curl_setopt($curl,CURLOPT_COOKIEFILE,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
		curl_setopt($curl,CURLOPT_COOKIEJAR,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
		curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
		curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);

		$out=curl_exec($curl); #Инициируем запрос к API и сохраняем ответ в переменную
		$code=curl_getinfo($curl,CURLINFO_HTTP_CODE); #Получим HTTP-код ответа сервера
		curl_close($curl); #Заверашем сеанс cURL
		$this->CheckCurlResponse($code);

		$Response=json_decode($out,true);

		return $Response;
	} 

} // end class

?>
