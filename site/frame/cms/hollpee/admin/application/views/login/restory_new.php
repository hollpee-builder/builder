	<form action="<?php echo HlpUrl::attach('/login/restoryAddNew') ?>" method="post" class="">
		<input type="hidden" name="key" value="<?php echo $key ?>">
		<div class="form-item">
			<input type="password" name="password" class="input" value="" placeholder="Введите пароль">
		</div>
		<div class="form-item">
			<input type="password" name="password2" class="input" value="" placeholder="Повторите пароль">
		</div>	
		<input type="submit" class="send"  value="Изменить пароль">
	</form>