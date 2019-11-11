<?php  


class LoginSite() {
		/**
		* Записывает данные пользователя при регистрации с сайта
		*
		*/
		public function registerSiteAction()
		{
			//имя
			$name = Clear::leaveLetters($_POST['name']);
			//email
			$email = Clear::clearEmail($_POST['email']); 
			//пароль
			$password =  Clear::clearPassword($_POST['password']); 
			$password = md5(md5($password));
			//соль
			$salt = md5($email.date('H:i:s Y-m-d'));

			//проверяем есть ли такой email уже в базе
			$isThereEmail = $this->objDb->isThereEmail($email);

			//если нет такого email, то записываем в базу
			if (!$isThereEmail[0]) {
				//запрос на
				$idUser = $this->objDb->saveDataUserSite($name, $email, $password, $salt);
				$idUser = $idUser[0]['id'];

				//все нормально записалось 
				if ($idUser) {
				 	//создаем img директорию для пользователя
				 	$pathUser = $_SERVER['DOCUMENT_ROOT'].'/user/img_user/'.$idUser;
				 	mkdir($pathUser);
				 	//устанавливаем кукки
				 	setcookie('user', $salt, time()+3600*24*7, '/');

				 	//возращяем id пользователя
				 	echo json_encode(array('user_id'=>$idUser));
				} else {
				 	//ошибка
				 	echo json_encode(array('error_record'=>'1'));
				}
			//если есть такой email или телефон то возращяем ошибку
			} else {
				//ошибка email
				echo json_encode(array('error_email'=>'1'));
			}
		}

		/**
		* Отдает страницу
		*
		*
		*/
		public function getPages($array=array())
		{
			//сформировываем странцу
			$result = $this->objView->render('register.php', $array);
			// вывод результата
			$this->objFront->setBody($result);
		}
	/***************************************************************************/
	/********************************************************************************/
		/**
		* Авторизация пользователя
		*
		*/
		public function authAction()
		{
			$this->getArr($_POST);

			//полученные данные
			$email = Clear::clearEmail($_POST['email']); 
			$password = Clear::clearPassword($_POST['password']);
			$password = md5(md5($password));
			//обращяемся к базе данных
			$result = $this->objDb->authUser($email, $password);

			$salt = $result['0']['salt'];
			
			if ($salt) {
				//устанавливаем куки
				setcookie('user', $salt, time()+3600*24*7, '/');
			}

			// вывод результата
			$this->objFront->setBody($salt);
			
		}


	/***********************************************************************************/
	/**************************************************************************************/
		//рандом string
		protected function randStr($count)
		{
			//набор символов
			$character = array(
								'1'=>'a', '2'=>'b', '3'=>'c', '4'=>'d', 
								'5'=>'e', '6'=>'f', '7'=>'g', '8'=>'h',
								'9'=>'i', '10'=>'j', '11'=>'k', '12'=>'l',
								'13'=>'m', '14'=>'n', '15'=>'o', '16'=>'p',
								'17'=>'g', '18'=>'r', '19'=>'s', '20'=>'t', 
								'21'=>'v', '22'=>'w', '23'=>'x', '24'=>'y',
								'25'=>'z', '26'=>'0', '27'=>'1', '28'=>'2',
								'29'=>'3', '30'=>'4', '31'=>'5', '32'=>'6',
								'33'=>'7', '34'=>'8', '35'=>'9'
							);
			$pass = '';
			for ($i=0; $i<$count; $i++) {
				$n = rand(1, 35);
				$pass .= $character[$n];
			}

			return $pass;
		}

		/**
		* Востановление пароля
		*
		*/
		public function rememberAction()
		{
			//сформировываем странцу
			$result = $this->objView->render('remember.php');
		
			// вывод результата
			$this->objFront->setBody($result);
		}

		/**
		* Замена пароля
		*
		*/
		public function replaceAction()
		{
			$email = $_POST['email'];
			
			$result = $this->randStr(6);
			// вывод результата
			$this->objFront->setBody($result);
		}
}








