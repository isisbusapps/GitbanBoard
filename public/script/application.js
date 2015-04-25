(function(){
	var init = function init(){
		$('.issue-col').height($('.issue-col').height());
		$('.issue-col').each(function(){
			this.addEventListener('drop', onDrop);
		});
		$('.issue').each(function(){
			this.addEventListener('dragstart', startDrag);
		});		
	};

	var startDrag = function startDrag(e){
		e.dataTransfer.setData('text/plain', this.id);
	};
	var onDrop = function onDrop(e){
		var issue = $('#'+event.dataTransfer.getData('text/plain'));
		issue.remove().appendTo($(e.target).closest('.issue-col'));
	};

	init();
}());