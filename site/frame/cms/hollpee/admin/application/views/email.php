<html>
<head>
	<title>Лид с сайта <?php echo $_SERVER['HTTP_HOST'] ?></title>
</head>
<body>
	<table border="0" cellpadding="0" cellspacing="0" style="margin:0; padding:0; max-width:600px; width:100%;font-family: Verdana;font-size:17px;">
		<tr>
			<td>
				<b>Id</b>:  <?php echo $leadId; ?>
			</td>
		</tr>
		<tr>
			<td>
				<b>Имя формы</b>:  <?php echo $formName; ?>
			</td>
		</tr>
		<?php  
			$lead = json_decode($lead, true);
			foreach ($lead as $key => $value) {

				if (preg_match('/^((name)|(email)|(phone))$/', $key)) {
					$tagBoldStart = '<b>';
					$tagBoldEnd = '</b>';
					if (preg_match('/^name$/', $key)) $key = "Имя";
					if (preg_match('/^email$/', $key)) $key = "Email";
					if (preg_match('/^phone$/', $key)) $key = "Телефон";
				} else {
					$tagBoldStart = '';
					$tagBoldEnd = '';
				}

				echo '<tr><td>' .$tagBoldStart. $key .$tagBoldEnd. ': ' . $value . '</td></tr>';
			}

			// для файла
			if (array_key_exists('hlp-file-1', $_FILES)) {
				$urlSite = 'http://'.$_SERVER['HTTP_HOST'].'/'.HLP_ADMIN_FOLDER;
				
				if (HlpLead::isExistsLeadFiles()) {
					$leadFileHref = $urlSite.'/file/downloadLead/?lead_id='.$leadId;
					$fileLink = '<a href="'.$leadFileHref.'">Скачать</a>';
				} else {
					$fileLink = 'не загружен';
				}
				echo '<tr><td>Файл '.$iFile.': '.$fileLink.'</td></tr>';
			}

		?>
		
		<tr>
			<td>
				<br/>
				url лида:  <?php echo urldecode($_SERVER['HTTP_REFERER']).'/admin/lead/detail?id='.$leadId.'&read=no'; ?>
			</td>
		</tr>

		<tr>
			<td>
				<br/>
				url сайта:  <?php echo urldecode($_SERVER['HTTP_REFERER']); ?>
			</td>
		</tr>
		
	</table>
</body>
</html>
