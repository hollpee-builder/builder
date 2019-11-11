<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	
	<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
	<script type="text/javascript" src="colors.js"></script>
	<script type="text/javascript" src="jqColorPicker.js"></script>
	
	

</head>
<body>
	<input class="color no-alpha" value="#B6BD79" />
</body>
</html>
<script type="text/javascript">
	var options = {
		customBG: '#222',
		margin: '4px -2px 0',
		doRender: 'div div',
		opacity: true,

		// change
		renderCallback: function(elm, toggled) {
			// elm.change()
			// elm.click()
		},

		// open
		positionCallback: function(elm) {
			
		}, 

		buildCallback: function($elm) {
			console.log("build")
			var colorInstance = this.color,
				colorPicker = this,
				random = function(n) {
					return Math.round(Math.random() * (n || 255));
				};

			$elm.append('<div class="cp-memory">' +
				'<div></div><div></div><div></div><div></div>' +
				'<div></div><div></div><div></div><div class="cp-store">S</div>').
			on('click', '.cp-memory div', function(e) {
				var $this = $(this);

				if (this.className) {
					$this.parent().prepend($this.prev()).children().eq(0).
						css('background-color', '#' + colorInstance.colors.HEX);
				} else {
					colorInstance.setColor($this.css('background-color'));
					colorPicker.render();
				}
			}).find('.cp-memory div').each(function() {
				!this.className && $(this).css({background:
					'rgb(' + random() + ', ' + random() + ', ' + random() + ')'
				});
			});
		},

		cssAddon: // could also be in a css file instead
			'.cp-memory {margin-bottom:6px; clear:both;}' +
			'.cp-xy-slider:active {cursor:none;}' +
			'.cp-memory div {float:left; width:17px; height:17px; margin-right:2px;' +
				'background:rgba(0,0,0,1); text-align:center; line-height:17px;}' +
			'.cp-memory .cp-store {width:21px; margin:0; background:none; font-weight:bold;' +
				'box-sizing:border-box; border: 1px solid; border-color: #666 #222 #222 #666;}'
	};

    $('.color').colorPicker(options); // that's it

    $('.color').change(function() {
    	console.log("change")
    });
</script>

<style>
.color {
	display: block;
	margin: 100px auto;
	width: 90px;
	height: 90px;
	background-color: rgb(90,90,90);
	border: none;
	border-radius: 5px;
}

</style>
