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
		var saveFilter = function saveFilter(){
			var formInputs = document.getElementById('filterForm').elements;
			var i=0, len = formInputs.length;
			var formValues = {};
			for(;i<len;i++){
				// Currently only dealing with checkboxes
				formValues[formInputs[i].id.replace(/\./g,'&46;')] = formInputs[i].checked;
			}
			firebaseRef.child("filter").child(userId).update(formValues);

			filterIssues();
		};
		var loadFilter = function saveFilter(){
			firebaseRef.child("filter").child(userId).once("value", function(snapshot){
				var formValues = snapshot.val();
				if(formValues){
					Object.keys(formValues).forEach(function(key){
						if(formValues.hasOwnProperty(key)){
							// Currently only dealing with checkboxes
							document.getElementById(key.replace(/&46;/g,'.')).checked = formValues[key];
						}
					})
				}
				filterIssues();
			});			
		};
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

		$('#saveFilterButton').on('click', saveFilter);
		loadFilter();
	};

	$(document).on('firebase-ready', init);
	resizeColumns();
}());