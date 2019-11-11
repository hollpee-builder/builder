<html>
<head>
	<title>Лид с сайта <?php echo $_SERVER['HTTP_HOST'] ?></title>
</head>
<body>
	<table border="0" cellpadding="0" cellspacing="0" style="margin:0; padding:0; max-width:600px; width:100%;font-family: Verdana;font-size:17px;">
		<tr>
			<td>
				<b>Имя формы</b>:  <?php echo $form_name; ?>
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
		?>
		<tr>
			<td>
				<br/>
				url:  <?php echo urldecode($_SERVER['HTTP_REFERER']); ?>
			</td>
		</tr>
	</table>
</body>
</html>
