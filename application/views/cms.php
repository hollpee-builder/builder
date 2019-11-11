<div class="contentCms">
	<div class="cmsLeft">
		<div class="section sectionBranding">
			<div class="sectionTitle">
				<?php echo Resource::$page_cms_branding_title; ?>
			</div>
			<div class="sectionContent">
				<div class="brandingItem">
					<div class="brandingItemKey">
						Логотип (только png)
					</div>
					<div class="brandingItemValue">
						<div class="brandingLogoBlock">
							<div class="brandingLogoImgWrap" data-type="white">
								<img src="<?php echo $logoSrc['white'] ?>" alt="" data-type="white" class="brandingLogoImg">
							</div>
							<div class="brandingListBut">
								<div class="brandingLogoButWrap" data-type="white">
									<div class="brandingLogoBut brandingButEdit"><?php echo Resource::$page_cms_branding_logo_but_edit; ?></div>
								</div>
								<div class="brandingLogoBut brandingButDelete" data-type="white"><?php echo Resource::$page_cms_branding_logo_but_delete; ?></div>
							</div>
							<div class="clear"></div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="brandingItem" style="display:none;">
					<div class="brandingItemKey">
						<?php echo Resource::$page_cms_branding_label_logob; ?>
					</div>
					<div class="brandingItemValue">
						<div class="brandingLogoBlock">
							<div class="brandingLogoImgWrap" data-type="black">
								<img src="<?php echo $logoSrc['black'] ?>" alt="" data-type="black" class="brandingLogoImg">
							</div>
							<div class="brandingListBut">
								<div class="brandingLogoButWrap" data-type="black">
									<div class="brandingLogoBut brandingButEdit"><?php echo Resource::$page_cms_branding_logo_but_edit; ?></div>
								</div>
								<div class="brandingLogoBut brandingButDelete" data-type="black"><?php echo Resource::$page_cms_branding_logo_but_delete; ?></div>	
							</div>
							<div class="clear"></div>
						</div>
					</div>
					<div class="clear"></div>
				</div>
				<!-- <div class="brandingItem">
					<div class="brandingItemKey">
						<?php echo Resource::$page_cms_branding_label_name; ?>
					</div>
					<div class="brandingItemValue">
						<input type="text" class="valueBrandingName" placeholder="<?php echo Resource::$page_cms_branding_name_placeholder; ?>">
					</div>
					<div class="clear"></div>
				</div> -->
			</div>
		</div>
	</div>
	<div class="cmsRight">

	</div>
	<div class="clear"></div>
</div>




