<?php 
/**
* Лиды
*
*/
class HlpFileController extends HlpMainController implements HlpIController {
	
	public function downloadLeadAction()
	{
		$leadId = $_GET['lead_id'];
		$leadId = preg_replace('/[^0-9]+/', '', $leadId);
		$pathFolder = HlpLead::getFolderAllFiles();

		/*для поддержки старой версии*******************/
		if (file_exists($pathFolder.$leadId)) {
			$this->folderToZip($leadId);
		}
		/********************/

		$path = HlpLead::getFolderFiles($leadId);
		HlpFile::download($path, true);
	}

	private function folderToZip($leadId)
	{
		$pathFolder = HlpLead::getFolderAllFiles();
		$pathFolderLead = $pathFolder.$leadId;

		$zip = new ZipArchive;
		$res = $zip->open(HlpLead::getFolderFiles($leadId), ZipArchive::CREATE);

		$dir = opendir($pathFolderLead);
		while ($file = readdir($dir)) {
			if ($file == '.' || $file == '..') continue;
			$zip->addFile($pathFolderLead.'/'.$file, $file);
		}

		$zip->close();
		HlpDir::remove($pathFolderLead);
	}

} // end class

?>
