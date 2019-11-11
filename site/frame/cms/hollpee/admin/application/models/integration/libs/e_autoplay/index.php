<?php
$url = preg_replace('|^(https?:)?//|', '', $url);

// subdomain
$subdomain = array();
preg_match_all('/^[^\.]+/', $url, $subdomain);
$subdomain = $subdomain[0][0];

// productId
$productId = array();
preg_match_all('/[\w]+$/', $url, $productId);
$productId = $productId[0][0];

// user data
$name = $userProperty['name'];
$email = $userProperty['email'];
$notes = $userProperty['notes'];
$phone = $userProperty['phone'];
$phone = preg_replace('/[^0-9\+]+/', '', $phone);

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<form style="display:none;" class="ea_form" action="//<?php echo $subdomain; ?>.e-autopay.com/buy/save_order_data.php" method=post name="order_form" target="_parent" onSubmit="return EAcheckForm(this);">
		<input type="text" value="<?php echo $name; ?>" name="name" value="" />
		<input type="text" value="<?php echo $email; ?>" name="email" value="" />
		<input type="text" value="<?php echo $phone; ?>" name="phone" value="" />
		<textarea name="notes"><?php echo $notes; ?></textarea>

		<input type="hidden" name="form_charset" value="">
		<input type="hidden" name="tovar_id" value="<?php echo $productId; ?>">
		<input type="hidden" name="order_page_referer" value="" />
		<input type="hidden" name="order_page" value="https://www.google.ru/" />
		
		<input type="submit" id="ea_submit" name="submit" value="Отправить" />
	</form>
</body>
</html>

<script>
	document.getElementById("ea_submit").click();
</script>

