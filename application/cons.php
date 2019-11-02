<?php  


$LIST_IP = array();
define('SERVER_TEST_NAME', 'cs20');
/**************************************************************************************/
define('DOMAIN_ANALYTICS', 'analytics.hlptest.su');

//домен
define('DOMAIN', $_SERVER['HTTP_HOST']);
define('DOMAIN_ROOT', DOMAIN);//корневой домен
define('DOMAIN_ACCOUNT', DOMAIN);//домен кабинета пользователя 
define('DOMAIN_EDITOR', DOMAIN);//редактор

/**********************************************/
define('DOMAIN_MAIN', 'hlptest.su');//редактор
define('DOMAIN_HOSTING', 'h1-'.DOMAIN_MAIN);//редактор
/****************************************************************************************/

//корень сайта
define('DIR_ROOT', $_SERVER['DOCUMENT_ROOT']);
define('DIR_EDITOR', $_SERVER['DOCUMENT_ROOT']);
define('DIR_ACCOUNT', $_SERVER['DOCUMENT_ROOT']);


// define("UPDATE_INDEX", 20);
define("UPDATE_INDEX", time());
