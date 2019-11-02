<?php  

class HlpIntegrationJustclick extends HlpIntegrationBasic {

    public function execute($service, $user) 
    {
        $userId = $service['user_id'];
        $apiKey = $service['api_key'];
        $listId = $service['list_id'];

        $user_rs['user_id'] = $userId;
        // Ключ для формирования подписи. См. раздел API (ссылка в правом нижнем углу в личном кабинете)
        $user_rs['user_rps_key'] = $apiKey;

        // Формируем массив данных для передачи в API
        $send_data = array(
            'rid[0]' => $listId, // группа, в которую попадёт подписчик
            'lead_name' => $user['name'],
            'lead_email' => $user['email'],
            'lead_phone' => $user['phone'],
            'lead_city' => $user['addr'],
            'activation' => false, // требуем подтверждение подписки
            // 'utm[utm_medium]' => 'cpc',
            // 'utm[utm_source]' => 'direct',
            // 'utm[utm_campaign]' => 'Моя_Кампания',
            // 'utm[utm_content]' => 'контент_123',
            // 'utm[utm_term]' => 'my_label',
        );

        if (array_key_exists('doneurl2', $service)) {
            $send_data['doneurl2'] = $service['doneurl2'];
        }

        // Формируем подпись к передаваемым данным
        $send_data['hash'] = $this->GetHash($send_data, $user_rs);
        // Вызываем функцию AddLeadToGroup в API и декодируем полученные данные
        $res = $this->Send('http://'.$userId.'.justclick.ru/api/AddLeadToGroup', $send_data);
    }

    // Отправляем запрос в API сервиса 
    private function Send($url, $data)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // выводим ответ в переменную
        $res = curl_exec($ch);
        curl_close($ch);
        return $res;
    }

    // Формируем подпись к передаваемым в API данным
    private function GetHash($params, $user_rs) 
    {
        $params = http_build_query($params);
        $user_id = $user_rs['user_id'];
        $secret = $user_rs['user_rps_key'];
        $params = "$params::$user_id::$secret";
        return md5($params);
    }

    // Проверяем полученную подпись к ответу
    private function CheckHash($resp, $user_rs) 
    {
        $secret = $user_rs['user_rps_key'];
        $code = $resp->error_code;
        $text = $resp->error_text;
        $hash = md5("$code::$text::$secret");
        if ($hash == $resp->hash) return true;
        else return false;
    }

} // end class

?>
