<?php  

class HlpIntegrationSendpulse extends HlpIntegrationBasic {
	protected $libsFolder = 'sendpulse';
	protected $listIncludeFile = array(
		'sendpulseInterface.php', 
		'sendpulse.php'
	);

	/*
		$listId получать через скрипт
	*/
	public function execute($service, $user) 
	{
	    // https://login.sendpulse.com/settings/#api
	    define( 'API_USER_ID', $service['user_id'] );
	    define( 'API_SECRET', $service['secret_key'] );
	    define( 'TOKEN_STORAGE', 'file' );

	    $SPApiProxy = new SendpulseApi( API_USER_ID, API_SECRET, TOKEN_STORAGE );

	    $bookId = array_key_exists('list_id', $service) ? $service['list_id'] : false;
	    if (!$bookId) {
	    	$listBooks = $SPApiProxy->listAddressBooks();
	    	foreach ($listBooks as $book) {
	    		$bookId = $book->id;
	    		break;
	    	}
	    }

	    $email = array_key_exists('email', $user) ? $user['email'] : '';
	    $phone = array_key_exists('phone', $user) ? $user['phone'] : '';
	    $name = array_key_exists('name', $user) ? $user['name'] : '';
	    $prop = array(
	                'email'=>$email,
	                'variables' => array(
	                    'phone'=>$phone,
	                    'Имя'=>$name
	                )
	            );
	    $emails = array($prop);

	    return $SPApiProxy->addEmails($bookId, $emails);
	}

} // end class

?>
