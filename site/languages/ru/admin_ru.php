<?php  
class Resource {
	// main
	public static $admin_title = 'Личный кабинет';
	public static $main_nav_site = 'Сайты';
	public static $main_nav_tutorial = 'Инструкция';
	public static $main_nav_rate = 'Тарифы';
	public static $main_nav_account = 'Кабинет';
	public static $main_label_but_exit = 'Выход';

	// page site
	public static $page_site_title = 'Список сайтов';
	public static $page_site_but_add = 'Добавить новый сайт';
	public static $page_site_project_title = 'Список проектов';
	public static $page_site_project_all_site = 'Все сайты';
	public static $page_site_project_but_create = 'Создать папку';
	public static $page_site_project_but_edit = 'изменить';
	public static $page_site_list_type = 'Тип сайта';
	public static $page_site_list_label_delete = 'Удалить';
	public static $page_site_list_label_copy = 'Копировать';
	public static $page_site_list_label_move = 'Переместить';
	public static $page_site_list_label_download = 'Скачать';
	public static $page_site_list_label_show = 'Просмотр';
	public static $page_site_list_label_edit = 'Редактировать';
	public static $page_site_list_label_edit_name = 'Кликните и вводите текст';
	public static $page_site_list_published_but_no = 'Закрыто';
	public static $page_site_list_published_but_yes = 'Открыто';
	public static $page_site_list_published_label_no = 'Запретить <br/>просмотр сайта';
	public static $page_site_list_published_label_yes = 'Разрешить <br/>просмотр сайта';
	public static $page_site_list_comment_placeholder = 'Коментарий';
	public static $page_site_title_no_site = 'У вас пока нет сайтов';
	public static $page_site_tutorial_title = 'Основы работы';
	public static $page_site_tutorial_work1 = 'Workshop #1 создание сайта';

	// cms
	public static $page_cms_title = 'CMS Hollpee';
	public static $page_cms_branding_title = 'Брендирование CMS';
	public static $page_cms_branding_label_logow = 'Светлый логотип';
	public static $page_cms_branding_label_logob = 'Темный логотип';
	public static $page_cms_branding_label_name = 'Название компании';
	public static $page_cms_branding_name_placeholder = 'Введите название';
	public static $page_cms_branding_logo_but_edit = 'Изменить';
	public static $page_cms_branding_logo_but_delete = 'Удалить';

	// tutorial
	public static $page_tutorial_theme_1_videobg = 'Видео фон';
	public static $page_tutorial_theme_1_paralax = 'Параллакс';
	public static $page_tutorial_theme_1_cleate_link = 'Создание ссылки';
	public static $page_tutorial_theme_1_template_section = 'Шаблоны секций';
	public static $page_tutorial_theme_1_manager_page = 'Менеджер страниц';
	public static $page_tutorial_theme_1_export_site = 'Экспорт сайта';
	public static $page_tutorial_theme_1_internal_format = 'Внутренний формат';
	public static $page_tutorial_theme_1_mode_showing = 'Режимы просмотра';
	public static $page_tutorial_theme_1_mode_editor = 'Режимы редактора Lite/Pro';
	public static $page_tutorial_theme_1_setting_seo = 'Настройка SEO';
	public static $page_tutorial_theme_1_hotkeys = 'Горячие клавиши';
	public static $page_tutorial_theme_1_font_weight = 'Ширина шрифта';
	public static $page_tutorial_theme_1_vertical_align = 'Выравнивание по вертикали';

	public static $page_tutorial_theme_2_add_video = 'Добавление видео';
	public static $page_tutorial_theme_2_add_font = 'Добавление стороннего шрифта';
	public static $page_tutorial_theme_2_add_form = 'Добавление формы';
	public static $page_tutorial_theme_2_add_google_maps = 'Добавление Google Maps';
	public static $page_tutorial_theme_2_add_yandex_maps = 'Добавление Яндекс.Карты';
	public static $page_tutorial_theme_2_add_menu = 'Добавление меню';
	public static $page_tutorial_theme_2_add_modal = 'Добавление модального';
	public static $page_tutorial_theme_2_add_code = 'Вставка стороннего кода';
	
	public static $page_tutorial_theme_3_setup = 'Установка';
	public static $page_tutorial_theme_3_review = 'Обзор функционала';
	public static $page_tutorial_theme_3_add_code = 'Вставка стороннего кода';
	public static $page_tutorial_theme_3_integration = 'Интеграция с';

	// chosenstyle
	public static $page_chosenstyle_title = 'Список шаблонов';
	public static $page_chosenstyle_but_site = 'Сайт';

	// account
	public static $page_account_title = 'Кабинет';
	public static $page_account_user_title = 'Данные пользователя';
	public static $page_account_user_key_password = 'Пароль';
	public static $page_account_user_key_rate = 'Тариф';
	public static $page_account_user_but_password = 'Изменить пароль';
	public static $page_account_title_rate_info = 'Информация о тарифе';
	public static $page_account_rate_key_last = 'Осталось';
	public static $page_account_rate_value_day = 'дней';
	public static $page_account_rate_key_todate = 'До даты';
	public static $page_account_title_payment = 'История платежей';
	public static $page_account_title_payment_key_date = 'Дата';
	public static $page_account_title_payment_key_rate = 'Тариф';
	public static $page_account_title_payment_key_month = 'Месяцев';
	public static $page_account_title_payment_key_mount = 'Сумма';

	// rate
	public static $page_rate_title = 'Оплата';
	public static $page_rate_list_key_price = 'Цена';
	public static $page_rate_list_key_site = 'Сайты';
	public static $page_rate_list_key_template = 'Свои шаблоны секций';
	public static $page_rate_list_key_export_html = 'Экспорт HTML';
	public static $page_rate_list_key_export_cmshlp = 'Экспорт CMS Hollpee';
	public static $page_rate_list_key_export_cmswp = 'Экспорт темы Wordpress';
	public static $page_rate_list_key_export_hlp = 'Экспорт внутреннего формата';
	public static $page_rate_list_key_import_hlp = 'Импорт  внутреннего формата';
	public static $page_rate_list_value_free = 'Бесплатно';

	// turorial
	public static $page_tutorial_title = 'Инструкция';
	public static $page_tutorial_theme_1 = 'Основа работы';
	public static $page_tutorial_theme_1_q_1 = 'Передвижение элемента';
	public static $page_tutorial_theme_1_q_1_id = 'MrvYLvJN7dQ';
	public static $page_tutorial_theme_2 = 'Добавление элементов';
	public static $page_tutorial_theme_2_q_1 = 'Добавить видео';
	public static $page_tutorial_theme_2_q_1_id = 'MrvYLvJN7dQ';
	public static $page_tutorial_theme_3 = 'Модульная сетка';
	public static $page_tutorial_theme_3_q_1 = 'Основы';
	public static $page_tutorial_theme_3_q_1_id = '0MYSIKkiXPs';
	
	// show
	public static $page_show_chosen_model = 'Выбор модели';
	public static $page_show_info_screen = 'Разрещение';
	public static $page_show_info_diagonal = 'Диагональ';
	public static $page_show_value_standart = 'Стандартный';
	public static $page_show_close_panel = 'Убрать панель';
	public static $page_show_device_desktop = 'Компьютер';
	public static $page_show_device_tab_l = 'Планшет<br/> горизонтально';
	public static $page_show_device_tab_p = 'Планшет<br/> вертикально';
	public static $page_show_device_mobile_l = 'Мобильный<br/> горизонтально';
	public static $page_show_device_mobile_p = 'Мобильный<br/> вертикально';

	// login
	public static $page_login_input_email = 'hollpee@gmail.com';
	public static $page_login_input_name = 'Ваше имя';
	public static $page_login_input_password = 'Введите пароль';
	public static $page_login_input_password_confirmation = 'Повторите пароль';
	public static $page_login_login_title = 'Вход в Hollpee';
	public static $page_login_login_submit = 'Войти';
	public static $page_login_login_but_restory = 'Восстановить пароль';

	public static $page_login_restory_title = 'Востановить пароль';
	public static $page_login_restory_label = 'Введите ваш email для восстановления пароля';
	public static $page_login_restory_submit = 'Восстановить пароль';
	public static $page_login_restory_msg_title = 'Востановить пароль';
	public static $page_login_restory_msg_label = 'На email отправленно письмо с инструкцией по востановлению пароля. <br/>Срок действия письма 30 минут.';
	public static $page_login_restory_new_title = 'Новый пароль';
	public static $page_login_restory_new_label = 'Введите новый пароль';
	public static $page_login_restory_new_submit = 'Изменить пароль';

	public static $page_login_register_title = 'Регистрация нового пользователя';
	public static $page_login_register_submit = 'Начать пользоваться Hollpee';
	public static $page_login_register_user_data = 'Я согласен на обработку моих персональных данных';
	public static $page_login_register_private_title = 'Регистрация закрыта';
	// public static $page_login_register_private_label = 'В данный момент проходит закрытое бета тестирование. <br/>Если вы хотите в нем поучаствовать напишите нам на support@hollpee.ru';
	public static $page_login_register_private_label = 'Сервис временно находится в закрытом режиме. <br/>Если вам необходима регистрация, то напишите на support@hollpee.ru';
	public static $page_login_register_order_start = 'Создавая аккаунт, вы соглашаетесь с';
	public static $page_login_register_order_end = 'условиями предоставления услуг';

}// end class

?>
