<?php  

class Resource {
	// general
	public static $but_add = 'Add';
	public static $but_delete = 'Delete';
	public static $but_edit = 'Edit';
	public static $value_no = 'No';
	public static $value_yes = 'Yes';
	// main
	public static $page_title = 'Builder Hollpee';
	public static $show_but_back = 'Back';
	public static $start_loading = 'Loading builder';
	// panel top
	public static $panel_top_template_but = 'TEMPLATES';
	public static $panel_top_element_but = 'ELEMENTS';
	public static $panel_top_but_page_lable = 'List pages';
	public static $panel_top_but_modal_lable = 'List modals';
	public static $panel_top_but_manager_file = 'Manager file';
	public static $panel_top_but_setting_page = 'Setting page';
	public static $panel_top_but_template_pro = 'TEMPLATES';
	public static $panel_top_but_template_lite = 'Add section';
	public static $panel_top_but_elements_pro = 'ELEMENTS';
	public static $panel_top_but_elements_lite = 'Add element';
	public static $panel_top_fastshow_label = 'Fast show <br/>Space';
	public static $panel_top_fullshow_label = 'Full show';
	public static $panel_top_save_label = 'Save<br/>Ctr+S';
	public static $panel_top_published_label = 'Published<br/>Ctr+A';
	public static $panel_top_history_back = 'Ctr+Z';
	public static $panel_top_history_next = 'Ctr+Shift+Z';
	public static $panel_top_screen_mp = 'Mobile portrait';
	public static $panel_top_screen_ml = 'Mobile landscape';
	public static $panel_top_screen_tp = 'Tap portrait';
	public static $panel_top_screen_tl = 'Tap landscape';
	public static $panel_top_screen_desktop = 'Dektop';
	public static $panel_top_tab_page = 'Page';
	public static $panel_top_tab_longreads = 'Style LG';
	public static $panel_top_tab_buffer = 'Buffer';
	public static $panel_top_tab_modal = 'Modal';
	public static $panel_top_name_key = 'site';
	// panel bottom
	public static $panel_bottom_ruller_label = 'Ruler';
	public static $panel_bottom_grid_label = 'Grid';
	public static $panel_bottom_autoclass_label = 'Add class <br/>manually';
	public static $panel_simple_but_copy = 'Copy';
	public static $panel_simple_but_delete = 'Delete';
	public static $panel_simple_but_edit = 'Change';
	public static $panel_simple_but_setting = 'Setting';
	public static $panel_bottom_mode_lite_label = 'Lite mode';
	public static $panel_bottom_mode_pro_label = 'Pro mode';
	public static $panel_bottom_mode_label = 'Mode work in builder';
	// canvas
	public static $canvas_guides_delete_label = 'Delete <br/>guides';
	// list elements
	public static $panel_elements_title = 'Add elements';
	public static $panel_elements_label_layout = 'Layout';
	public static $panel_elements_sectoin = 'Section';
	public static $panel_elements_column = 'Column';
	public static $panel_elements_block = 'Block';
	public static $panel_elements_lg_p = 'Paragraph';
	public static $panel_elements_lg_quote = 'Quote';
	public static $panel_elements_lg_image = 'Image';
	public static $panel_elements_label_menu = 'Menu';
	public static $panel_elements_menu = 'Menu';
	public static $panel_elements_menu_item = 'Menu Item';
	public static $panel_elements_sub_menu = 'Submenu';
	public static $panel_elements_menu_mobile = 'Mobile menu';
	public static $panel_elements_label_basic = 'Basic';
	public static $panel_elements_label_extansion = 'Extansion';
	public static $panel_elements_heading = 'Heading';
	public static $panel_elements_text = 'Text';
	public static $panel_elements_button = 'Button';
	public static $panel_elements_image = 'Image';
	public static $panel_elements_video = 'Video';
	public static $panel_elements_label_form = 'Form';
	public static $panel_elements_form = 'Form';
	public static $panel_elements_input = 'Input';
	public static $panel_elements_label_widget = 'Widget';
	public static $panel_elements_gallery = 'Gallery';
	public static $panel_elements_tab = 'Tab';
	public static $panel_elements_slider = 'Slider';
	public static $panel_elements_comparison = 'Comparison';
	public static $panel_elements_hoverblock = 'Hover block';
	public static $panel_elements_map = 'Map';
	public static $panel_elements_label_wpblog = 'Wordpress Blog';
	public static $panel_elements_wplist = 'List';
	public static $panel_elements_wparticle = 'Article';
	public static $panel_elements_wpauthor = 'Author';
/**********************************************************************************/
	public static $panel_right_but_show = 'Setting<br/>style';
	public static $panel_right_but_hide = 'Hide<br/>style';
	// menu right
	public static $panel_right_tab_style = 'Style';
	public static $panel_right_tab_setting = 'Setting';
	public static $panel_right_tab_struct = 'Structure';
	public static $panel_right_tab_site_pro = 'Site';
	public static $panel_right_tab_site_lite = 'General style';
	public static $panel_right_key_class = 'Class';
	public static $panel_right_class_edit_label = 'For change<br/> dblclick';
	public static $panel_right_class_add_label = 'Add class';
	public static $panel_right_class_delete_label = 'Delete class';
	public static $panel_right_display_label = 'Dipslay';
	public static $panel_right_struct_title = 'Structure';
	public static $panel_right_style_state = 'State element';
	// menu style geometry
	public static $panel_style_but_clear = 'reset style';
	public static $panel_style_title_geometry = 'Geometry';
	public static $panel_style_geometry_label_state = 'Position';
	public static $panel_style_geometry_state_static = 'Static';
	public static $panel_style_geometry_state_absolute = 'Absolute';
	public static $panel_style_geometry_label_position = 'Value';
	public static $panel_style_geometry_label_pos_top = 'Top';
	public static $panel_style_geometry_label_pos_bottom = 'Bottom';
	public static $panel_style_geometry_label_pos_left = 'Left';
	public static $panel_style_geometry_label_pos_right = 'Right';
	public static $panel_style_geometry_label_mobpanel_side = 'Side';
	public static $panel_style_geometry_mobpanel_side_left = 'Left';
	public static $panel_style_geometry_mobpanel_side_right = 'Right';
	public static $panel_style_geometry_label_width = 'Width';
	public static $panel_style_geometry_label_height = 'Height';
	public static $panel_style_geometry_label_minheight = 'Min<br>height';
	public static $panel_style_geometry_label_fullwidth = 'Full width';
	public static $panel_style_geometry_label_margin = 'Margin';
	public static $panel_style_geometry_label_float = 'Float';
	public static $panel_style_geometry_label_side = 'Side';
	public static $panel_style_geometry_label_align = 'Align';
	public static $panel_style_geometry_label_fillvacuum = 'Fill <br>vaccum';
	public static $panel_style_geometry_value_no = 'No';
	public static $panel_style_geometry_value_yes = 'Yes';
	public static $panel_style_geometry_label_padding = 'Padding';
	public static $panel_style_geometry_show_ext_setting = 'Extension setting';
	public static $panel_style_geometry_hide_ext_setting = 'Hide setting';
	public static $panel_style_geometry_label_full_height = 'Full height';
	public static $panel_style_geometry_label_vertical_align = 'Vertical align<br/> child';
	// menu style list
	public static $panel_style_title_list = 'List';
	public static $panel_style_list_label_style = 'Style';
	// menu style text
	public static $panel_style_title_text = 'Text';
	public static $panel_style_text_label_text = 'Text';
	public static $panel_style_text_label_style = 'Style';
	public static $panel_style_text_label_color = 'Color text';
	public static $panel_style_text_label_height = 'Height word';
	public static $panel_style_text_label_size = 'Size text';
	public static $panel_style_text_label_width = 'Width word';
	public static $panel_style_text_label_bg = 'Bg text';
	public static $panel_style_text_label_font = 'Font';
	public static $panel_style_text_but_manager_font = 'List Font';
	public static $panel_style_text_label_align = 'Align';
	public static $panel_style_text_label_property = 'Property';
	public static $panel_style_text_label_interval = 'Interval';
	public static $panel_style_text_label_register = 'Register';
	public static $panel_style_text_label_wordwrap = 'Word wrap';
	public static $panel_style_text_wordwrap_normal = 'Normal';
	public static $panel_style_text_wordwrap_break = 'Break';
	public static $panel_style_text_register_none = 'Default';
	public static $panel_style_text_register_uppercase = 'Uppercase';
	public static $panel_style_text_register_lowercase = 'Lowercase';
	public static $panel_style_text_register_capitalize = 'Capitalize';
	public static $panel_style_text_label_placeholder = 'Placeholder';
	public static $panel_style_text_label_weight = 'Weight';
	public static $panel_style_text_style_italic = 'Italic';
	public static $panel_style_text_style_underline = 'Underline';
	public static $panel_style_text_style_strike = 'Strike';
	// menu style bg 
	public static $panel_style_bg_title = 'Background';
	public static $panel_style_bg_label_type = 'Type';
	public static $panel_style_bg_type_standart = 'Standart';
	public static $panel_style_bg_type_gradient = 'Gradient';
	public static $panel_style_bg_type_video = 'Video';
	public static $panel_style_bg_label_direction = 'Direction';
	public static $panel_style_bg_label_gradient_basic = 'Basic';
	public static $panel_style_bg_label_gradient_start = 'Start';
	public static $panel_style_bg_label_gradient_end = 'End';
	public static $panel_style_bg_video_but_edit = 'Change';
	public static $panel_style_bg_label_video_blackout = 'Blackout';
	public static $panel_style_label_paralax = 'Parallax';
	public static $panel_style_bg_label_std_color = 'Color';
	public static $panel_style_bg_label_std_image = 'Image';
	public static $panel_style_bg_std_but_add = 'add image';
	public static $panel_style_bg_std_but_add2 = 'Add image';
	public static $panel_style_bg_std_but_edit = 'Change';
	public static $panel_style_bg_std_but_delete = 'delete';
	public static $panel_style_bg_std_label_position = 'Position';
	public static $panel_style_bg_std_position_top = 'Top';
	public static $panel_style_bg_std_position_left = 'Left';
	public static $panel_style_bg_std_label_repeat = 'Repeat';
	public static $panel_style_bg_std_label_size = 'Size';
	public static $panel_style_bg_label_element = 'Element';
	public static $panel_style_bg_label_section = 'Section';
	public static $panel_style_bg_label_content = 'Content';
	public static $panel_style_bg_label_mask = 'Mask';
	// menu style border
	public static $panel_style_border_title = 'Border';
	public static $panel_style_border_label_style = 'Style';
	public static $panel_style_border_label_width = 'Width border';
	public static $panel_style_border_label_style_l = 'Style border';
	public static $panel_style_border_label_color = 'Color';
	public static $panel_style_border_label_radius = 'Radius';
	// menu style border
	public static $panel_style_boxshadow_title = 'Box shadow';
	public static $panel_style_boxshadow_but_add = 'Add shadow';
	public static $panel_style_boxshadow_list = 'List';
	public static $panel_style_textshadow_title = 'Text shadow';
	public static $panel_style_boxshadow_label_type = 'Direction';
	public static $panel_style_boxshadow_type_but_inset = 'Inset';
	public static $panel_style_boxshadow_type_but_outer = 'Outer';
	public static $panel_style_boxshadow_label_color = 'Color';
	public static $panel_style_boxshadow_label_offset = 'Offset';
	public static $panel_style_boxshadow_label_offset_horizontal = 'Horizontal';
	public static $panel_style_boxshadow_label_offset_vertical = 'Vertical';
	public static $panel_style_boxshadow_label_radius = 'Radius';
	public static $panel_style_boxshadow_label_width = 'Width';
	// menu style other
	public static $panel_style_transform_title = 'Transformation';
	public static $panel_style_transform_label_rotate = 'Rotate';
	public static $panel_style_transform_label_opacity = 'Opacity';
	public static $panel_style_other_title = 'Other';
	public static $panel_style_transform_label_blur = 'Blur';
	public static $panel_style_other_overflow_visible = 'Visible';
	public static $panel_style_other_overflow_hidden = 'Hidden';
	public static $panel_style_other_overflow_auto = 'Auto';
	public static $panel_style_other_label_cursor = 'Cursor';
	// menu style animate
	public static $panel_style_animate_title = 'Animate';
	public static $panel_style_animate_label_event = 'Event';
	public static $panel_style_animate_event_scroll = 'Scroll';
	public static $panel_style_animate_event_load = 'Load';
	public static $panel_style_animate_event_delay = 'Delay';
	public static $panel_style_animate_event_duration = 'Duration';
	public static $panel_style_animate_label_hover = 'Hover';
	// menu transform
	public static $panel_style_transform_label_transition = 'Transition';
	public static $panel_style_transform_label = 'Transformation';
	public static $panel_style_transform_add = 'Add';
	public static $panel_style_transform_add_value = 'Add value';
	public static $panel_style_transform_label_property = 'Property';
	public static $panel_style_transform_label_hor = 'Horizontal';	
	public static $panel_style_transform_label_ver = 'Vertical';
	// menu filter
	public static $panel_style_filter_title = 'Filter';
	public static $panel_style_filter_label_type = 'Type';
	public static $panel_style_filter_label_value = 'Value';
	public static $panel_style_filter_add_but = 'Add filter';
	
/**********************************************************************************/
	// setting grid
	public static $setting_grid_title = 'Grid';
	public static $setting_grid_but_value_yes = 'Yes';
	public static $setting_grid_but_value_no = 'No';
	public static $setting_grid_delete_column = 'Delete current column';
	public static $setting_grid_label_indent = 'Indent';	
	public static $setting_grid_label_row = 'Count<br>row';
	public static $setting_grid_label_size = 'Size<br>column';
	public static $setting_grid_label_desktop = 'Desktop';
	public static $setting_grid_label_tl = 'Tab landscape';
	public static $setting_grid_label_tp = 'Tab portrait';
	public static $setting_grid_label_ml = 'Mobile landscape';
	public static $setting_grid_label_mp = 'Mobile portrait';
	// setting click
	public static $setting_click_title = 'Click for element';
	public static $setting_click_label_action = 'Action';
	public static $setting_click_action_none = 'None';
	public static $setting_click_action_page = 'Page';
	public static $setting_click_action_section = 'Section';
	public static $setting_click_action_modal = 'Modal';
	public static $setting_click_action_link = 'Link';
	public static $setting_click_action_contact = 'Contact';
	public static $setting_click_action_downfile = 'Download file';
	public static $setting_click_action_closemodal = 'Close modal';
	public static $setting_click_action_closemenu = 'Close menu';
	public static $setting_click_label_link_open = 'Open';
	public static $setting_click_link_open_self = 'self';
	public static $setting_click_link_open_blank = 'blank';
	public static $setting_click_contact_label_type = 'Type';
	public static $setting_click_contact_label_value = 'Value';
	public static $setting_click_contact_option_phone = 'Phone';
	public static $setting_click_label_modal = 'Modal';
	public static $setting_click_label_page = 'Page';
	public static $setting_click_label_section = 'Section';
	public static $setting_click_label_downfile = 'File';
	public static $setting_click_downfile_value_desc = 'Setting file for download in editor Hollpee CMS';
	public static $setting_click_action_download = 'Download';
	public static $setting_click_action_slider = 'Slider';
	public static $setting_click_action_slider_next = 'Next';
	public static $setting_click_action_slider_prev = 'Prev';
	public static $setting_click_action_tab = 'Tab';
	public static $setting_click_action_group_general = 'General';
	public static $setting_click_action_group_widget = 'Widget';
	public static $setting_click_action_group_other = 'Other';
	public static $setting_click_tab_label_event = 'Event';
	public static $setting_click_tab_event_click = 'Click';
	public static $setting_click_tab_event_mouseover = 'Mouseover';
	public static $setting_click_modal_nameform = 'Name form';
	// setting
	public static $setting_seo_label_heading = 'Heading';
	public static $setting_heading_level_title = 'Level heading';
	public static $setting_section_title = 'Section';
	public static $setting_section_label_fixed = 'Fixed';
	// setting form input
	public static $setting_form_input_title = 'Input';
	public static $setting_form_input_label_name = 'Name';
	public static $setting_form_input_label_placehoder = 'Placeholder';
	public static $setting_form_input_label_mask = 'Mask';
	public static $setting_form_input_mask_none = 'None';
	public static $setting_form_input_mask_name = 'Name';
	public static $setting_form_input_mask_email = 'Email';
	public static $setting_form_input_mask_phone = 'Phone';
	public static $setting_form_input_mask_addr = 'Addres';
	public static $setting_form_input_label_mandatory = 'Mandatory';
	public static $setting_form_input_list_option = 'list option';
	public static $setting_form_input_option_add = 'Add';
	public static $setting_form_input_option_add_full = 'Add option';
	public static $setting_form_input_option_value = 'Value';
	public static $setting_form_input_option_name = 'Name';
	// setting form
	public static $setting_form_title = 'Form';
	public static $setting_form_value_none = 'None';
	public static $setting_form_label_button = 'Button';
	public static $setting_form_label_name = 'Name form';
	public static $setting_form_label_method = 'Method';
	public static $setting_form_label_redirect = 'Redirect';
	public static $setting_form_label_type = 'Type';
	public static $setting_form_redirect_page = 'Page';
	public static $setting_form_redirect_modal = 'Modal';
	public static $setting_form_redirect_link = 'Link';
	public static $setting_form_redirect_params = 'Redirect <br/>params';
	// setting widget effect
	public static $setting_widget_effect_label = 'Animate';
	public static $setting_widget_effect_pop = 'Fade';
	public static $setting_widget_effect_width = 'Move';
	public static $setting_widget_effect_height = 'Move with top';
	public static $setting_widget_visible_hide = 'Hide';
	public static $setting_widget_visible_show = 'Show';
	public static $setting_widget_visible_list = 'List';
	public static $setting_widget_visible_nav = 'Nav';
	// setting slider
	public static $setting_slider_title = 'Slider';
	public static $setting_slider_label_list = 'List';
	public static $setting_slider_label_delay = 'Delay';
	public static $setting_slider_label_speed = 'Speed <br/>animate';
	public static $setting_slider_label_interval = 'Interval';
	public static $setting_slider_label_navigation = 'Navigation';
	public static $setting_slider_label_stop = 'Stop<br>for<br>mouseover';
	// setting gallery
	public static $setting_gallery_title = 'Gallery';
	public static $setting_gallery_label_type = 'Type';
	public static $setting_gallery_type_product = 'Product';
	public static $setting_gallery_type_grid = 'Grid';
	public static $setting_gallery_label_indent = 'Indect';
	// tab
	public static $setting_tab_title = 'Tab';
	public static $setting_tab_label_list = 'List';
	// setting hover block
	public static $setting_hover_block_title = 'Hover block';
	// setting blog list
	public static $setting_blog_list_title = 'Blog - List articles';
	public static $setting_blog_list_label_category = 'Id category';
	public static $setting_blog_list_label_columns = 'columns';
	// export
	public static $setting_export_title = 'Export';
	public static $setting_export_label_delete = 'Delete element';
	public static $setting_export_label_code = 'Replace code';
	public static $setting_export_code_label_status = 'Replace';
	public static $setting_export_class_title = 'Класс';
	public static $setting_export_label_clear_class = 'Clear class';
	public static $setting_export_label_code_position = 'Position';
	public static $setting_export_label_code_self = 'Code';
	public static $setting_export_code_position_insert = 'Insert';
	public static $setting_export_code_position_replace = 'Replace';
	public static $setting_export_label_parent_class = 'Parent class';
	public static $setting_export_label_notice = 'Comment';
	public static $setting_export_label_write_status = 'Write in file';
	public static $setting_export_write_label_status = 'Write';
	public static $setting_export_label_write_file = 'Name file';
	public static $setting_export_other_title = 'Other';
	public static $setting_export_page_title = 'Page';
	public static $setting_export_page_label_incmain = 'Header <br/>and Footer';
	public static $setting_export_page_label_namefile = 'Name';
	public static $setting_export_site_title = 'Site';
	public static $setting_export_site_imgsrc = 'Src <br/>image';
		public static $setting_export_site_incheader = 'Include<br/>Header';
	public static $setting_export_site_incfooter = 'Include<br/>Footer';
	// setting attr
	public static $setting_attr_title = 'Attributes';
	public static $setting_attr_label_class = 'Class';
	public static $setting_attr_class_add = 'Add class';
	public static $setting_attr_class_modal_title = 'Added class';
	public static $setting_attr_label_attr = 'Attributes';
	public static $setting_attr_attr_add = 'Add attributes';
	public static $setting_attr_attr_modal_title = 'Added attributes';
	public static $setting_attr_attr_modal_name = 'Name';
	public static $setting_attr_attr_modal_key = 'Value';
	// yandex goal
	public static $setting_yagoal_title = 'Yandex goal';
	public static $setting_yagoal_label_counterid = 'Id counter';
	public static $setting_yagoal_title_eventid = 'Id event';
	// setting zoom image
	public static $setting_zoom_title = 'Zoom image on click';
	public static $setting_zoom_label_parent = 'Zoom already set parent';
	public static $setting_zoom_label_status = 'Zoom';
	public static $setting_zoom_label_type = 'Type';
	public static $setting_zoom_type_modal = 'Modal';
	public static $setting_zoom_type_panel = 'Panel';
	// site style
	public static $panel_right_site_type_block_title = 'Type element';
	public static $panel_right_site_type_all = 'All';
	public static $panel_right_site_type_h2 = 'Heading h2';
	public static $panel_right_site_type_h2_sub = 'Sub heading h2';
	public static $panel_right_site_type_h3 = 'Heading h3';
	public static $panel_right_site_type_h4 = 'Heading h4';
	public static $panel_right_site_type_button = 'Button';
	// triger
	public static $setting_title_triger = 'Triger';
	public static $setting_triger_event = 'Event';
	public static $setting_triger_event_default = 'None';
	public static $setting_triger_event_videotimer = 'Video timer';
	public static $setting_triger_event_videotimer_label_time = "Timer";
	public static $setting_triger_event_videotimer_label_display = 'Hide';

} // end class

?>
