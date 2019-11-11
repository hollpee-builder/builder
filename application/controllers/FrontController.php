<?php
/**
* Основной контороллер
* Контроллер который запускает приложение
*
* @package FrontController
*/
class FrontController {
	/**
	* Содержит имя  запускаемого контроллера
	* @var string
	*/
	public $_controller;
	
	/**
	* Содержит имя запускаемого метода
	* @var string
	*/
	protected $_action;

	/**
	* Содержит имя параметров
	* @var array
	*/
	protected $params = array();

	/**
	* То, что выводиться на экран пользователя
	* @var string
	*/
	protected $_body;

	/**
	* содержит единственный экзекмпляр класса
	* @var object
	*/
	protected static $_instance;

	/**
	* Создает только один объект класса.
	* Если нету объекта то она его создает и помещает в свойтсво и
	* возращяет его. Если есть свойство с созданным объектом, то
	* она просто возращяет это свойство с объекстом класса.
	*
	* @staticvar object $_instance Содержит единственный объект класса 
	* @return object возращяет объект класса
	*/
	public static function getInstance()
	{
		// проверяем есть ли объект класса
		if (!(self::$_instance instanceOf self)) {
			// создает объект класса и помещяем его в свойство
			self::$_instance = new self();
		}

		// возращяем объект класса
		return self::$_instance;
	}

	/**
	* Закрытый конструктор
	* Конструктор сделан закрытым для того что бы можно было создать
	* только один объект класса. Он также разбивает url на части и 
	* получанные части распределяет по свойствам объекта. Первая часть
	* это класса, вторая это метод, а следующие это параметры, где не 
	* четная часть это название, а четная это значение
	*
	* @return void
	*/

	private function __construct()
	{
		// получаем url
		$request = $_SERVER['REQUEST_URI'];

		//очищяем от переметров GET
		$request = preg_replace('@\?.*$@iu', '', $request);

		// разбиваем ul на части
		$splits = explode('/', trim($request, '/'));
		$count = count($splits);

		// очищяем от всякого мусора
		for ($i=0; $i<$count; $i++) {
			$splits[$i] = Clear::leaveLettersAndNumber($splits[$i]);
		}

		/*********/
		if ($splits[0] == 'user') {
			$splits[0] = 'show';
			$splits[1] = 'show';
			$this->params["site_id"] = $splits[2];
		}
		/*******************/

		// выбираем класс
		$this->_controller = !empty($splits[0])?ucfirst($splits[0]).'Controller':'IndexController';
		// выбираем метод
		$this->_action = !empty($splits[1])?$splits[1].'Action':'indexAction';
		
		// выбор параметров
		if (!empty($splits[2])) {
			for ($i=2, $cnt=count($splits); $i<$cnt; $i+=2) {
				//очищяем от мусора, оставляем буквы, цифры и подчеркивание
				$key   = $splits[$i];
				$value = $splits[$i+1];
				// соединяем ключ и значение
				if (!empty($key) AND !empty($value)) {
					$this->params[$key] = $value;
				} 
			}
		}
	}

	/**
	* Запуск приложения
	* Берем те переменные в которые были помещены части url(класс и
	* метод). С начало создаем объект класса, а потом вызываем метод
	*
	* @return void
	*/
	public function route()
	{
		$controller = $this->_controller;
		$action 	= $this->_action;
		
		
		// проверяем есть этот класс
		if (class_exists($controller)) {
			// создаем объект класса
			$class = new $controller();
			/* проверяем есть ли у этого класса интерфейс IController
			это сделанно для того, что бы не возможно было запустить
			класс который не сделан контроллером*/
			if ($class instanceof IController) {
				if (method_exists($class, $action)) {
					// вызваем метод класса
					$class->$action();
				} else {
					// echo $_SERVER['REQUEST_URI'];
					header('Location: /error404');
					exit;
				}
			} else {
				// echo $_SERVER['REQUEST_URI'];
				header('Location: /error404');
				exit;
			}
		} else {
			// echo $_SERVER['REQUEST_URI'];
			header('Location: /error404');
			exit;
		}
	}

	/**
	* Функция возращяет массив с параметрами, ввиде key->value
	*
	* @return array массив с параметрами
	*/
	public function getParams()
	{
		return $this->params;
	}

	/**
	* Возращяет свойство $_body
	* В этом свойстве содержиться результат работы приложения,
	* содержиться то что выводиться на экран ползователя 
	*
	* @return string Возращяется переменная $_body
	*/
	public function getBody()
	{
		return $this->_body;
	}

	/**
	* Устанавливает свойство $_body
	* В этом свойстве содержиться результат работы приложения,
	* содержиться то что выводиться на экран пользователя 
	* 
	* @param string $body Содержиться результат работы приложения
	* @return void
	*/
	public function setBody($body)
	{
		$this->_body = $body;
	}


}//end class







	




?>


























