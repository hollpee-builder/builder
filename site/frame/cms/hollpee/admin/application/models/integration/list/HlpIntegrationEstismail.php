<?php  
class HlpIntegrationEstismail extends HlpIntegrationBasic {

	private $subscriber_data = array();
	private $api_key = '';
	private $subscribe_url = 'https://v1.estismail.com/mailer/emails';

	public function execute($service, $lead) {
		$this->api_key = $service['key'];

		if (!$this->_process_input($service, $lead)) {
			return false;
		}

		return $this->_subscribe_email();

	}

	private function _process_input($service, $lead) {

		if (!empty($lead['email'])) {
			$this->subscriber_data['email'] = $lead['email'];
		} else {
			return false;
		}

		if (!empty($lead['est_list_id'])) {
			$this->subscriber_data['list_id'] = $lead['est_list_id'] * 1;
		} else if (!empty($service['list_id'])) {
			$this->subscriber_data['list_id'] = $service['list_id'] * 1;
		} else {
			return false;
		}

		if (!empty($lead['name'])) {
			$this->subscriber_data['name'] = $lead['name'];
		}

		if (!empty($lead['phone'])) {
			$this->subscriber_data['phone'] = $lead['phone'];
		}

		if (!empty($lead['ip'])) {
			$this->subscriber_data['ip'] = $lead['ip'];
		}

		if (isset($lead['est_approve'])) {

			$this->subscriber_data['activation_letter'] = ((bool)$lead['est_approve']) * 1;
		} else if (isset($service['approve']) && $service['approve'] !== '') {
			$this->subscriber_data['activation_letter'] = ((bool)$service['approve']) * 1;
		} else {
			$this->subscriber_data['activation_letter'] = 1;
		}

		return true;

	}

	private function _subscribe_email() {

		$params = array(
			'http' => array(
				'method' => 'POST',
				'ignore_errors' => true,
				'header' => 'X-Estis-Auth: '.$this->api_key."\r\n",
				'content' => http_build_query($this->subscriber_data)
			)
		);
		$ctx = stream_context_create($params);

		$fp = @fopen($this->subscribe_url, 'rb', false, $ctx);

		if (!$fp) {
			return false;
		}

		$response = @stream_get_contents($fp);
		$status_header = $http_response_header[0];
		$result = array();
		preg_match('%^.*\s(\d{3})\s%', $status_header, $result);
		if ($result[1] * 1 !== 201) {
			return false;
		}

		return true;

	}
	
}