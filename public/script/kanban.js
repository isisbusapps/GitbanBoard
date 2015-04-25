(function(){
	$('.issue-col').height($('.issue-col').height());
	
	var init = function init(){
		$('.issue-col').each(function(){
			this.addEventListener('drop', onDrop);
		});
		$('.issue').each(function(){
			this.addEventListener('dragstart', startDrag);
		});

		firebaseRef.child("issues").on("child_changed", updateIssues);
		firebaseRef.child("issues").on("child_added", updateIssues);
	};

	var startDrag = function startDrag(e){
		e.dataTransfer.setData('text/plain', this.id);
	};
	var onDrop = function onDrop(e){
		var $issue = $('#'+event.dataTransfer.getData('text/plain'));
		var $newCol = $(e.target).closest('.issue-col');
		$issue.remove().appendTo($newCol);
		firebaseRef.child("issues").child($issue.attr('id')).update({
			"id":$issue.attr('id'),
			"column":$newCol.attr('id')
		})
	};

	var updateIssues = function updateIssues(snapshot){
		var $issue = $('#'+snapshot.val().id);
		var column = '#'+snapshot.val().column;
		if($issue.parents(column).length == 0){
			$issue.remove().appendTo(column);
		}
	};

	$(document).on('firebase-ready', init);
}());