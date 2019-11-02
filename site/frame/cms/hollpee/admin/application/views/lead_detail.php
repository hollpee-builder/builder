<?php  
$dataJson = $lead['data'];
$leadData = $dataJson ? json_decode($dataJson, true) : array();

foreach ($leadData as $paramKey => $paramsValue) {
	$leadData[$paramKey] = urldecode($paramsValue);
}

?>


<div id="listJsonProperty" style="display:none;">
	<div id="leadJson" style="display:none;">
		<?php echo json_encode($lead, true); ?>
	</div>
	<div id="listStatusNameJson" style="display:none;">
		<?php echo json_encode($listStatusName, true); ?>
	</div>
</div>

<div class="sectionLeadDetail">
	<div class="listLectionLeadLeft">
		<div class="block sectionNewStatus">
			<div class="block-title">
				Обновить статус
			</div>
			<div class="block-content">
				<select class="valueNewStatus">
					<?php 
						foreach ($listStatusName as $statusKey => $statusName) {
							$selectedAttr = $lead['status'] == $statusKey ? 'selected' : '';
							echo '<option value="'.$statusKey.'" '.$selectedAttr.'>'.$statusName.'</option>';
						}
					?>
				</select>
				<textarea class="valueNewStatusComment"></textarea>
				<div class="butAddNewStatus">
					Обновить
				</div>
				<div class="clear"></div>
			</div>
		</div>

		<div class="block sectionLeadInfo">
			<div class="block-title">
				Информация
			</div>
			<div class="block-content">
				<div class="leadInfoItem">
					<div class="leadInfoKey">Id:</div>
					<div class="leadInfoValue"><?php echo $lead['id'] ?></div>
					<div class="clear"></div>
				</div>
				<div class="leadInfoItem">
					<div class="leadInfoKey">Дата:</div>
					<div class="leadInfoValue"><?php echo $lead['date_add'] ?></div>
					<div class="clear"></div>
				</div>
				<div class="leadInfoItem">
					<div class="leadInfoKey">Url:</div>
					<a href="<?php echo $lead['url'] ?>" target="_blank" class="leadInfoValue"><?php echo $lead['url'] ?></a>
					<div class="clear"></div>
				</div>
				<div class="leadInfoItem">
					<div class="leadInfoKey">Имя формы:</div>
					<div class="leadInfoValue"><?php echo $lead['form_name'] ?></div>
					<div class="clear"></div>
				</div>
				<?php  if (array_key_exists('utm_source', $leadData)) : ?>
					<div class="leadInfoItem">
						<div class="leadInfoKey">Источник:</div>
						<div class="leadInfoValue"><?php echo $leadData['utm_source']; ?></div>
						<div class="clear"></div>
					</div>
				<?php elseif (array_key_exists('ch', $leadData)): ?>
					<div class="leadInfoItem">
						<div class="leadInfoKey">Источник:</div>
						<div class="leadInfoValue"><?php echo $leadData['ch']; ?></div>
						<div class="clear"></div>
					</div>
				<?php endif; ?>
				<?php  if (array_key_exists('utm_medium', $leadData)) : ?>
					<div class="leadInfoItem">
						<div class="leadInfoKey">Канал:</div>
						<div class="leadInfoValue"><?php echo $leadData['utm_medium']; ?></div>
						<div class="clear"></div>
					</div>
				<?php endif; ?>
				<?php  if (array_key_exists('utm_campaign', $leadData)) : ?>
					<div class="leadInfoItem">
						<div class="leadInfoKey">Компания:</div>
						<div class="leadInfoValue"><?php echo $leadData['utm_campaign']; ?></div>
						<div class="clear"></div>
					</div>
				<?php endif; ?>
				<?php  if (array_key_exists('utm_term', $leadData)) : ?>
					<div class="leadInfoItem">
						<div class="leadInfoKey">Ключевые слова:</div>
						<div class="leadInfoValue"><?php echo $leadData['utm_term']; ?></div>
						<div class="clear"></div>
					</div>
				<?php endif; ?>
				<?php  if (array_key_exists('utm_content', $leadData)) : ?>
					<div class="leadInfoItem">
						<div class="leadInfoKey">Контент:</div>
						<div class="leadInfoValue"><?php echo $leadData['utm_content']; ?></div>
						<div class="clear"></div>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
	
	<div class="listLectionLeadRight">
		<div class="block sectionListStatus">
			<div class="block-title">
				История статусов
			</div>
			<div class="block-content ">
				<table class="tableListStatus">
					<tr class="tr">
						<th class="th tdDate">Дата</th>
						<th class="th tdStatus">Статус</th>
						<th class="th tdComment">Коментарий</th>
					</tr>
					<?php  
						// $countStatus = count($listStatus);
						foreach ($listStatus as $statusItem) {
							// $statusItem = $listStatus[$iStatus];
							$statusItemName = $listStatusName[$statusItem['status']];

							echo '
								<tr class="tr">
									<td class="td tdDate">'.$statusItem['date_add'].'</td>
									<td class="td tdStatus">'.$statusItemName.'</td>
									<td class="td tdComment">'.$statusItem['note'].'</td>
								</tr>
							';
						}
					?>
					<div class="clear"></div>
				</table>
			</div>
		</div>
		
		
		<div class="block sectionLeadData">
			<div class="block-title">
				Данные
			</div>
			<div class="block-content">
				<div class="leadDataItem">
					<div class="leadDataKey">
						Email
					</div>
					<div class="leadDataValue">
						<input type="text" data-type="email" class="valueLeadData valueLeadEmail" value="<?php echo $lead['email']; ?>" >
					</div>
					<div class="clear"></div>
				</div>
				<div class="leadDataItem">
					<div class="leadDataKey">
						Имя
					</div>
					<div class="leadDataValue">
						<input type="text" data-type="name" class="valueLeadData valueLeadName" value="<?php echo $lead['name']; ?>" >
					</div>
					<div class="clear"></div>
				</div>
				<div class="leadDataItem">
					<div class="leadDataKey">
						Телефон
					</div>
					<div class="leadDataValue">
						<input type="text" data-type="phone" class="valueLeadData valueLeadPhone" value="<?php echo $lead['phone']; ?>" >
					</div>
					<div class="clear"></div>
				</div>
				<div class="leadDataItem">
					<div class="leadDataKey">
						Адрес
					</div>
					<div class="leadDataValue">
						<textarea data-type="addr" class="valueLeadData valueLeadAddr" value="" ><?php if (array_key_exists('addr', $lead)) { echo $lead['addr']; }?></textarea>
					</div>
					<div class="clear"></div>
				</div>
				<div class="leadDataItem">
					<div class="leadDataKey">
						Цена сделки
					</div>
					<div class="leadDataValue">
						<input type="text" data-type="price" class="valueLeadData valueLeadPrice" value="<?php if (array_key_exists('price', $lead)) { echo $lead['price']; }?>" />
					</div>
					<div class="clear"></div>
				</div>

				<div class="leadDataItemAdded">
					<?php  
						if ($leadData) {
							$fileId = 1;
							$urlSite = 'http://'.$_SERVER['HTTP_HOST'].'/'.HLP_ADMIN_FOLDER;

							foreach ($leadData as $leadDataKey => $leadDataValue) {
								if ($leadDataKey == 'hlp-file' || $leadDataKey == 'hlp-file-1') {
									if ($leadDataValue) {
										$leadFileHref = $urlSite.'/file/downloadLead/?lead_id='.$lead['id'];
										$leadDataValue = '<a href="'.$leadFileHref.'">Скачать</a>';
									} else {
										$leadDataValue = 'не загружен';
									}
									$leadDataKey = 'Файл';
								} else if (preg_match('/hlp-file-[0-9]+/', $leadDataKey)) {
									continue;
								}
								echo '
									<div class="leadDataItem">
										<div class="leadDataKey">'.$leadDataKey.'</div>
										<div class="leadDataValue">'.$leadDataValue.'</div>
										<div class="clear"></div>
									</div>';
								$fileId++;
							}
						}
					?>
				</div>
			</div>
		</div>
	</div>
	<div class="clear"></div>
</div>

	
