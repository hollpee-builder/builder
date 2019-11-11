<?php  

$file_name = preg_replace('/\.\./', '', $_GET['file']);
$file = 'files/' . $file_name;


// если этого не сделать файл будет читаться в память полностью!
if (ob_get_level()) ob_end_clean();

// заставляем браузер показать окно сохранения файла
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename=' . basename($file));
header('Content-Transfer-Encoding: binary');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($file));

// читаем файл и отправляем его пользователю
readfile($file);

?>
