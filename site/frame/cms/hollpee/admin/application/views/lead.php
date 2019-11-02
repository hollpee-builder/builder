<?php  

$searchValue = array_key_exists('search-value', $_GET) ? $_GET['search-value'] : '';
$searchType = array_key_exists('search-type', $_GET) ? $_GET['search-type'] : '';

?>

<div class="lead-top-block">
	<div class="lead-filter-block-page">
		<select class="hlp-select-filter filter-page">
			<option value="">Все</option>
			<?php
				foreach ($listPages as $pageId => $page) {
					$selectedPage = $pageId == $currentPageId ? 'selected="selected"' : '';
					echo '<option '.$selectedPage.' value="'.$pageId.'">'.$page['file'].'</option>';
				}
			?>
		</select>
	</div>

	<div class="lead-filter-block">
		<input type="text" value="<?php echo $searchValue; ?>" placeholder="Значение" class="search-value">
		
		<select value="<?php echo $searchType; ?>" class="hlp-select-filter search-type">
			<?php  
				$listSearchType = array('email'=>'Email', 'phone'=>'Телефон', 'id'=>'Номер заявки');
				foreach ($listSearchType as $searchItemType => $searchItemName) {
					$attrSelected = $searchType == $searchItemType ? 'selected="selected"' : '';
					echo '<option '.$attrSelected.' value="'.$searchItemType.'">'.$searchItemName.'</option>';
				}
			?>
		</select>
		<a href="" class="filter-but-search">Найти</a>	
		<div class="clear"></div>
	</div>
	
	<div class="clear"></div>
</div>

<table class="list-lead">
	<tr class="list-lead-head">
		<th class="lead-num">#</th>
		<th class="lead-date">Дата</th>
		<th class="lead-email">Email</th>
		<th class="lead-name">Имя</th>
		<th class="lead-phone">Телефон</th>
		<th class="lead-page">Страница</th>
		<th class="lead-utm">Источник</th>
		<th class="lead-status">Статус</th>
		<th class="lead-status">-</th>
	</tr>
	<?php  
		if ($list_lead) {
			foreach($list_lead as $i_lead => $lead) {
				$status = $lead['status'] == "new" ? "Новый" : "Прочитан";

				echo '
					<tr class="lead-item" data-id="'.$lead['id'].'" data-status="'.$lead['status'].'">
						<td class="lead-num">'.$lead['id'].'</td>
						<td class="lead-date">'.$lead['date_add'].'</td>
						<td class="lead-email">'.$lead['email'].'</td>
						<td class="lead-name">'.$lead['name'].'</td>
						<td class="lead-phone">'.$lead['phone'].'</td>
						<td class="lead-page">'.$lead['file'].'</td>
						<td class="lead-utm">'.$lead['utm_source'].'</td>
						<td class="lead-status" data-status="'.$lead['status'].'">
							'.$lead['status_name'].'
						</td>
						<td class="lead-man but-lead-delete-wrap">
							<img src="img/lead/delete.png" alt="" class="but-lead-delete">
						</td>
					</tr>';
			}
		}
	?>
</table>
<div class="block-lead-bottom">
	<div class="lead-bottom-left">
		<div class="but-lead but-lead-export">
			Экспорт лидов
		</div>
		<div class="but-lead but-reset-new">
			Сбросить статуc "Новый"
		</div>
		<div class="clear"></div>
	</div>
	<div class="block-page">
		<div class="list-page-item">
			<?php  
				if (($current_page - 5) < 0) {
					$start_page = 1; 
					$end_page = 10;
					if ($end_page > $count_page) $end_page = $count_page;
				} else if (($current_page + 5) > $count_page) {
					$start_page = $count_page - 9; 
					$end_page = $count_page;
				} else {
					$start_page = $current_page - 4; 
					$end_page = $current_page + 5;
				}

				for ($i_page = $start_page; $i_page <= $end_page; $i_page++) {
					$attr_chosen = $current_page == $i_page ? 'data-chosen="true"' : '';
					$attr_href = HlpUrl::attach('/lead?page='.$i_page);
					if ($currentPageId) {
						$attr_href .= '&page_id=' . $currentPageId;
					}

					// для фильра
					if ($searchType && $searchValue) {
						$attr_href .='&search-type='.$searchType.'&search-value='.$searchValue; 	
					}

	 				echo '<a href="'.$attr_href.'" class="page-item" '.$attr_chosen.'>'.$i_page.'</a>';		
				}	
			?>
			<div class="clear"></div>	
		</div>
		
	</div>

	<div class="clear"></div>
</div>

	

