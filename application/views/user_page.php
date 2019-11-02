<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<title><?php echo $title ?></title>
	<meta name="description" content="<?php echo $description ?>">
	<meta name="keywords" content="<?php echo $keywords ?>">
	<link rel="icon" type="image/png" href="/images/<?php echo $icon ?>" sizes="32x32" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	
	<link rel="stylesheet" href="<?php echo Url::get('/site/frame/css/hlp_main.css'); ?>">
	<?php echo $headCss ?>
	
	<script type="text/javascript" src="<?php echo Url::get('/site/frame/js/jquery.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo Url::get('/site/frame/js/hlp_script.js'); ?>"></script>
	<?php echo $headScript ?>
</head> 
<body>
<?php echo $content ?>
</body>
</html>

