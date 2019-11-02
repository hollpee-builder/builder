<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><?php echo $title ?></title>
	<link rel="icon" type="image/png" href="/img/icon.png" sizes="32x32" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	
	<link rel="stylesheet" href="<?php echo HlpUrl::attach('/css/login.css'); ?>">
	<link rel="stylesheet" href="<?php echo HlpUrl::attach('/css/main/widget.css'); ?>">

	<script type="text/javascript" src="<?php echo HlpUrl::attach('/js/main/jquery.js'); ?>"></script>
	<script type="text/javascript" src="<?php echo HlpUrl::attach('/js/main/widget.js') ?>" ></script>
	<script type="text/javascript" src="<?php echo HlpUrl::attach('/js/login.js');?>"></script>
</head>
<body>
	<div id="wrapper" class="<?php echo $addClass ?>">
		<a href="<?php echo HlpUrl::attach('/'); ?>" class="logo-form">
			<img src="<?php echo HlpUrl::attach('/img/logo/logo_w.png'); ?>" alt="">
		</a>
		<div class="block-form" id="blockForm">
			<div class="form-title">
				<?php echo $label ?>
			</div>
			<?php echo $content ?>
		</div>
	</div>
</body>
</html>