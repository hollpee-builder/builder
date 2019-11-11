<?php  

//имя папки, где будут файлы
$userFolder = 'user_files';
//сохранение файла
$uploaddir = $_SERVER['DOCUMENT_ROOT'].'/'.$userFolder;
if (!file_exists($uploaddir)) mkdir($uploaddir);
$uploaddir .= '/lead_id_'.$property_lead['lead_id'].'/';
if (!file_exists($uploaddir)) mkdir($uploaddir);
$uploadfile = $uploaddir . basename($_FILES['file']['name']);
move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
	

?>
