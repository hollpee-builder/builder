// general
Resource.but_edit = "Изменить";
// page site
Resource.page_site_but_upload = "Загрузить внутренний формат";
Resource.page_site_notification_edit  = "Успешно изменино!";
Resource.page_site_project_title_add = "Создать новую папку";
Resource.page_site_project_title_edit = "Изменить папку";
Resource.page_site_project_input_name = "Название папки";
Resource.page_site_project_but_add = "Создать папку";
Resource.page_site_project_but_edit = "Изменить папку";
Resource.page_site_project_notification_edit = "Имя проекта изменено!";
Resource.page_site_project_notification_no_delete = "Можно удалить только пустой проект";
Resource.page_site_delete_loading_site = "Удаляю сайт";
Resource.page_site_copy_loading = "Копирую сайт";
Resource.page_site_move_title = "Переместить сайт";
Resource.page_site_move_label = "Выберите проект в который переместить сайт";
Resource.page_site_move_but_ok = "Переместить";
Resource.page_site_move_notifacation_ok = "Сайт перемещен!";
Resource.page_site_limitation_title = "Ограничение тарифа";
Resource.page_site_limitation_but = "Список тарифов";
Resource.page_site_limitation_down_hlp = "Ваш тариф не позволяет скачивать сайт в внутренем формате";
Resource.page_site_limitation_update_hlp = "Ваш тариф не позволяет загружать сайт в внутренем формате";
Resource.page_site_download_title = "Скачивание сайта";
Resource.page_site_download_but = "Скачать";
Resource.page_site_download_html_label = "Код сайта";
Resource.page_site_download_html_desc = "Код без каких-либо вставок";
Resource.page_site_download_html_type_label = "Скачать в формате";
Resource.page_site_download_holcms_label = "Hollpee CMS";
Resource.page_site_download_holcms_desc = "Скачивается сайт в формате темы Hollpee CMS";
Resource.page_site_download_wp_label = "Wordpress";
Resource.page_site_download_wp_desc = "Скачивается сайт в формате темы WP";
Resource.page_site_download_hollpee_desc = "На хостинге должна быть поддержка PHP";
Resource.page_site_download_hol_label = "Внутренний формат";
Resource.page_site_download_hol_desc = "Внутренний формат вы можете загрузить в свой аккаунт или передать другому специалисту";
Resource.page_site_download_notification_create_arch = "Создаю архив для скачивания";
Resource.page_site_confirmation_delete_site = "Подтвердите удаление сайта";

// page account
Resource.page_account_psw_title = "Изменить пароль";
Resource.page_account_psw_but_ok = "Изменить пароль";
Resource.page_account_psw_key_old = "Старый пароль";
Resource.page_account_psw_key_new = "Новый пароль";
Resource.page_account_psw_key_new_cfr = "Подтвердить пароль";

// page chosen style
Resource.page_chosenstyle_site_hover_add = "Добавить";
Resource.page_chosenstyle_site_hover_show = "Смотреть";
Resource.page_chosenstyle_modal_title = "Добавление сайта";
Resource.page_chosenstyle_modal_input_name = "Введите имя сайта";
Resource.page_chosenstyle_group_basic = "Базовые";
Resource.page_chosenstyle_group_magazine = "Витрина";
Resource.page_chosenstyle_group_infobiznes = "Инфобизнес";
Resource.page_chosenstyle_group_service = "Услуги";

// show
Resource.page_show_chosen_model = "Выбор модели";

Resource.getLimitationCountSite = function(maxCountSite)
{
	var siteStr = maxCountSite == 1 ? "сайта" : "сайтов";
	var text = 'Ваш тариф не позволяет добавлять больше '+maxCountSite+' '+siteStr+'.\
			Для добавления, удалите один из ваших сайтов или перейдите на другой тариф.';
	return text;
}
