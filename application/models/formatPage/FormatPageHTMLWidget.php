<?php  
class FormatPageHTMLWidget {
	
	/**
	* Отдает подклюяаемые файлы 
	*
	* @see ShowController::joinOnePage() 	
 	*/
	public static function getIncludeFile($fullSite, $page, $pathProject = false)
	{
		if (!$page['widget']['slider']) return '';
		

		// при просмотре
		$rootFolder = $pathProject ? '' : '/site/frame/';

		// подключение
		$includeFile = "\r\n\t".'<link rel="stylesheet" href="'.$rootFolder.'widget/slider/s1/s1_style.css">';
		$includeFile .= "\r\n\t".'<script type="text/javascript" src="'.$rootFolder.'widget/slider/s1/s1_script.js"></script>';
		$includeFile .= "\r\n\t";

		// при просмотре
		if (!$pathProject) return $includeFile;

		/*копируем*/
		$pathTo = $pathProject.'/widget';
		if (!file_exists($pathTo)) mkdir($pathTo);
		$pathTo = $pathTo.'/slider';
		if (!file_exists($pathTo)) mkdir($pathTo);
		$pathTo = $pathTo.'/s1';
		if (!file_exists($pathTo)) mkdir($pathTo);
		// копируем саму папку
		if (!file_exists($pathTo.'/s1_style.css')) {
			$folderFrom = $_SERVER['DOCUMENT_ROOT'].'/site/frame/widget/slider/s1';
			Dir::copy($folderFrom, $pathTo);
		}

		return $includeFile;
	}

	/**
	* Замена путей
	*
	* @see 	FormatPageHTML::writeTextFile() 
	*/
	public static function replacePath($html, $fileType)
	{
		$newPath = 'widget/';
		if ($fileType == 'css') $newPath =  '../' . $newPath;

		$html = preg_replace('|/site/frame/widget/|', $newPath, $html);

		return $html;
	}

} // end class

?>

