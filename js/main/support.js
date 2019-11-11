$(document).ready(function() {
	Support.setEvent();
});

var Support = new Support();
function Support() {
	/**
	* Ставит события поддержки
	* 
	*
	*/
	this.setEvent = function() 
	{
		$(".butSupport").off("mouseover");
		$(".butSupport").on("mouseover", function() {
			// console.log(999)
		});
	}

}//end class

