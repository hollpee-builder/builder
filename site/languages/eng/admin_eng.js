// general
Resource.but_edit = "Edit";
// page site
Resource.page_site_but_upload = "Upload internal format";
Resource.page_site_notification_edit  = "Successfully edit!";
Resource.page_site_project_title_add = "Create new folder";
Resource.page_site_project_title_edit = "Edit folder";
Resource.page_site_project_input_name = "Name folder";
Resource.page_site_project_but_add = "Create folder";
Resource.page_site_project_but_edit = "Edit folder";
Resource.page_site_project_notification_edit = "Name folder edit!";
Resource.page_site_project_notification_no_delete = "Delete only folder without site";
Resource.page_site_delete_loading_site = "Deleting site";
Resource.page_site_copy_loading = "Coping site";
Resource.page_site_move_title = "Move site";
Resource.page_site_move_label = "Chosen folder for move site";
Resource.page_site_move_but_ok = "Move";
Resource.page_site_move_notifacation_ok = "Site move!";
Resource.page_site_limitation_title = "Limitation rate";
Resource.page_site_limitation_but = "List rate";
Resource.page_site_limitation_down_hlp = "No export internal format";
Resource.page_site_limitation_update_hlp = "No import internal format";
Resource.page_site_download_title = "Download site";
Resource.page_site_download_but = "Download";
Resource.page_site_download_html_label = "Clean HTML";
Resource.page_site_download_html_desc = "This clean html";
Resource.page_site_download_html_type_label = "Donwload in format";
Resource.page_site_download_holcms_label = "Hollpee CMS";
Resource.page_site_download_holcms_desc = "Donwload site - theme Hollpee CMS";
Resource.page_site_download_wp_label = "Wordpress";
Resource.page_site_download_wp_desc = "Donwload site - theme WP";
Resource.page_site_download_hollpee_desc = "On hosting need support PHP";
Resource.page_site_download_hol_label = "Internal format";
Resource.page_site_download_hol_desc = "Internal format - move other account";
Resource.page_site_download_notification_create_arch = "Create archive for download";
Resource.page_site_confirmation_delete_site = "Confirmation delete site";

// page account
Resource.page_account_psw_title = "Edit password";
Resource.page_account_psw_but_ok = "Edit password";
Resource.page_account_psw_key_old = "Old password";
Resource.page_account_psw_key_new = "New password";
Resource.page_account_psw_key_new_cfr = "Confirmation password";

// page chosen style
Resource.page_chosenstyle_site_hover_add = "Add";
Resource.page_chosenstyle_site_hover_show = "Show";
Resource.page_chosenstyle_modal_title = "Add site";
Resource.page_chosenstyle_modal_input_name = "Enter name site";
Resource.page_chosenstyle_group_basic = "Basic";
Resource.page_chosenstyle_group_magazine = "Magazine";
Resource.page_chosenstyle_group_infobiznes = "Infobusiness";
Resource.page_chosenstyle_group_service = "Services";

// show
Resource.page_show_chosen_model = "Chosen model";

Resource.getLimitationCountSite = function(maxCountSite)
	{
		var siteStr = maxCountSite == 1 ? "сайта" : "сайтов";
		var text = 'Ваш тариф не позволяет добавлять больше '+maxCountSite+' '+siteStr+'.\
				Для добавления, удалите один из ваших сайтов или перейдите на другой тариф.';
		return text;
	}
