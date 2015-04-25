(function(){
	
	var init = function init(){
		$('.issue-col').each(function(){
			this.addEventListener('drop', onDrop);
		});
		$('.issue').each(function(){
			this.addEventListener('dragstart', startDrag);
		});

		firebaseRef.child("issues").on("child_changed", updateIssues);
		firebaseRef.child("issues").on("child_added", updateIssues);

		configFilterOptions();
	};

	var resizeColumns = function resizeColumns(){
		var colHeight =  -1;
	    $('.issue-col').each(function() {
	    	$(this).height('initial');
	        var h = $(this).height();
	        colHeight = h > colHeight ? h : colHeight;
	    });
		$('.issue-col').height(colHeight);
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
		resizeColumns();
	};

	var configFilterOptions = function configFilterOptions(){
		var filterIssues = function filterIssues(){
			$('.issue').show();
			$('.js-githubuser').not(':checked').each(function(){
				$('.issue[data-username="'+$(this).parent().text().trim()+'"]').hide();
			});
			$('.js-label').not(':checked').each(function(){
				$('.issue[data-label*="'+$(this).parent().text().trim()+'"]').hide();
			});
			$('.js-repo').not(':checked').each(function(){
				$('.issue[data-repo="'+$(this).parent().text().trim()+'"]').hide();
			});

			$('#filterModal').modal('hide');
			resizeColumns();
		};

		$('#saveFilterButton').on('click', filterIssues);
	};

	$(document).on('firebase-ready', init);
	resizeColumns();
}());