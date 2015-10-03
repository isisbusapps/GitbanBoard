'use strict';
/* global firebaseRef, moment, userId */
(function() {

    var init = function init() {
        var imOnline = firebaseRef.child('users').child(userId).child('online');
        imOnline.set(true);
        imOnline.onDisconnect().set(false);

        firebaseRef.child('users').on('value', function(snapshot) {
            var users = snapshot.val();
            Object.keys(users).forEach(function(user) {
                if(users.hasOwnProperty(user)) {
                    if(users[user].online){
                        $('[data-standup-user-id=' + user + '] .online-status').removeClass('hide');
                    } else {
                        $('[data-standup-user-id=' + user + '] .online-status').addClass('hide');
                    }
                }
            });
        });

        moveToSwimlanes();

        $('.issue-col').each(function() {
            this.addEventListener('drop', onDrop);
            this.addEventListener('dragover', function(){return false;});
        });
        $('.issue').each(function() {
            this.addEventListener('dragstart', startDrag);
        });

        firebaseRef.child('issues').on('child_changed', updateIssues);
        firebaseRef.child('issues').on('child_added', updateIssues);
        firebaseRef.child('adHocIssues').on('child_changed', updateAdHocIssues);
        firebaseRef.child('adHocIssues').on('child_added', updateAdHocIssues);
        firebaseRef.child('standup').on('value', updateStandup);

        configFilterOptions();
        configureAdHocIssues();
    };

    var moveToSwimlanes = function moveToSwimlanes() {
        var assignees = [];
        $('.issue').each(function() {
            var assignee = $(this).data('username');
            if(assignee !== 'Unassigned' && assignees.indexOf(assignee) < 0) {
                assignees.push(assignee);
            }
        });
        assignees = assignees.sort();
        assignees.forEach(function(assignee) {
            var html = Handlebars.templates.swimlane({assignee:assignee, avatar:$('[data-username=' + assignee + '] .avatar').attr('src')});
            $('.swimlanes').append(html);
        });
        $('.issue').each(function() {
            var column = $('.swimlane[data-assignee=' + $(this).data('username') + ']').find('[data-column=' + $(this).closest('.issue-col').data('column') + ']');
            $(this).remove().appendTo(column);
        });
    };

    var resizeColumns = function resizeColumns() {
        $('.swimlane').each(function() {
            var colHeight =  -1;
            $(this).find('.issue-col').each(function() {
                $(this).height('initial');
                var h = $(this).height();
                colHeight = h > colHeight ? h : colHeight;
            });
            $(this).find('.issue-col').height(colHeight);
        });
    };

    var startDrag = function startDrag(e) {
        e.dataTransfer.setData('text/plain', this.id);
    };

    var onDrop = function onDrop(e) {
        var $issue = $('#' + e.dataTransfer.getData('text/plain'));
        var $newCol = $(e.target).closest('.issue-col');
        var $column = $('.swimlane[data-assignee=' + $issue.data('username') + ']').find('[data-column=' + $newCol.data('column') + ']')

        var $neighbour = $(e.target).closest('.issue');
        if (($(e.target).is('.issue') || $(e.target).parents('.issue').length) && $column.has($(e.target)).length && !$neighbour.is($issue)) {
            var midPoint = $neighbour.offset().top + ($neighbour.outerHeight() / 2);
            if (e.y > midPoint) {
                $issue.remove().insertAfter($neighbour);
            } else {
                $issue.remove().insertBefore($neighbour);
            }
        } else {
            $issue.remove().appendTo($column);
        }

        $column.find('.issue').each(function(index, el){
            var $el = $(el);
            if($el.is('.adhoc')){
                firebaseRef.child('adHocIssues').child($el.attr('id').replace(/issue/,'')).update({
                    id: $el.attr('id'),
                    column: $newCol.data('column'),
                    assignee: $el.data('username'),
                    position: index
                });
            } else {
                firebaseRef.child('issues').child($el.attr('id')).update({
                    id: $el.attr('id'),
                    column: $newCol.data('column'),
                    assignee: $el.data('username'),
                    position: index
                });
            }
        });

        e.preventDefault();
    };

    var updateIssues = function updateIssues(snapshot) {
        var $issue = $('#' + snapshot.val().id);
        var column = $('.swimlane[data-assignee=' + snapshot.val().assignee + ']').find('[data-column=' + snapshot.val().column + ']');
        $issue.attr('data-position', snapshot.val().position);
        $issue.remove().appendTo(column);
        $('.progress').remove();

        resizeColumns();
        sortColumn(column);
    };

    var updateAdHocIssues = function updateAdHocIssues(snapshot) {
        var $issue = $('#' + snapshot.val().id);
        if(!$issue.length){
            $issue = $(Handlebars.templates.issuetile({
                title: snapshot.val().title,
                body: snapshot.val().description,
                assignee: {
                    login: snapshot.val().assignee
                },
                id: snapshot.key(),
                updated_at: new Date(snapshot.val().updated_at)
            }));
            $issue.removeClass('hide');
        }
        var column = $('.swimlane[data-assignee=' + snapshot.val().assignee + ']').find('[data-column=' + snapshot.val().column + ']');
        $issue.addClass('adhoc');
        $issue.get(0).removeEventListener('dragstart', startDrag);
        $issue.get(0).addEventListener('dragstart', startDrag);
        column.append($issue);
        $('.progress').remove();

        resizeColumns();
        sortColumn(column);
    }

    var sortColumn = function sortColumn($column){
        var $issues = $column.find('.issue');
        $issues = $issues.sort(function(a, b){
            var aPosition = $(a).data('position');
            var bPosition = $(b).data('position');
            if (aPosition < bPosition) {
                return -1;
            } else if (aPosition > bPosition) {
                return 1;
            } else {
                return 0;
            }
        });
        $issues.remove().appendTo($column);
    };

    var filterIssues = function filterIssues() {
        function getParentText(self) {
            return $(self).parent().text().trim();
        }
        $('.issue').removeClass('hide');
        $('.swimlane').removeClass('hide');
        $('.js-githubuser').not(':checked').each(function() {
            $('.issue[data-username="' + getParentText(this) + '"]').addClass('hide');
            $('.swimlane[data-assignee="' + getParentText(this) + '"]').addClass('hide');
        });
        $('.js-label').not(':checked').each(function() {
            $('.issue[data-label*="' + getParentText(this) + '"]').addClass('hide');
        });
        $('.js-repo').not(':checked').each(function() {
            $('.issue[data-repo="' + getParentText(this) + '"]').addClass('hide');
        });
        $('.js-state').not(':checked').each(function() {
            $('.issue[data-state="' + getParentText(this) + '"]').addClass('hide');
        });
        $('.issue').each(function() {
            var lastUpdated = $(this).data('updated');
            var weeks = $('#dateRange').val();
            if (moment(lastUpdated).isBefore(moment().subtract(weeks, 'weeks'))) {
                $(this).addClass('hide');
            }
        });

        $('#filterModal').modal('hide');
        resizeColumns();
        $('[data-column]').each(function(){
            sortColumn($(this));
        });
    };

    var configFilterOptions = function configFilterOptions() {
        var saveFilter = function saveFilter() {
            var formInputs = document.getElementById('filterForm').elements;
            var i = 0;
            var len = formInputs.length;
            var formValues = {};
            var inputId;
            for (; i < len; i++) {
                inputId = formInputs[i].id.replace(/\./g, '&46;');
                if (formInputs[i].type === 'checkbox') {
                    formValues[inputId] = formInputs[i].checked;
                } else {
                    formValues[inputId] = formInputs[i].value;
                }
            }
            firebaseRef.child('users').child(userId).child('filter').update(formValues);

            filterIssues();
        };
        var loadFilter = function loadFilter() {
            var filters = firebaseRef.child('users').child(userId);
            filters.child('filter').once('value', function(snapshot) {
                var formValues = snapshot.val();
                var inputElement;
                if (formValues) {
                    Object.keys(formValues).forEach(function(key) {
                        if (formValues.hasOwnProperty(key)) {
                            inputElement = document.getElementById(key.replace(/&46;/g, '.'));
                            if (inputElement) {
                                if (inputElement.type === 'checkbox') {
                                    inputElement.checked = formValues[key];
                                } else {
                                    inputElement.value = formValues[key];
                                }
                            }
                        }
                    });
                }
                filterIssues();
            });
        };
        var toggleAll = function toggleAll(e) {
            var formInputs = $(this).parent().next().find('input');
            if (formInputs.not(':checked').length) {
                formInputs.each(function() {
                    this.checked = true;
                });
            } else {
                formInputs.each(function() {
                    this.checked = false;
                });
            }

            e.preventDefault();
        };

        $('#saveFilterButton').on('click', saveFilter);
        $('[data-action="toggleAll"]').unbind('click').on('click', toggleAll);
        loadFilter();
    };

    var configureAdHocIssues = function configureAdHocIssues() {
        var validateInput = function validateInput(){
            var emptyCount = $('#adHocModal input,#adHocModal textarea').filter(function(){
                return $(this).val().trim().length === 0;
            }).length;

            return !emptyCount;
        };

        $('#addNewAdHocIssue').on('click', function(){
            if(validateInput()){
                firebaseRef.child('adHocIssues').push({
                    assignee: username,
                    title: $('#adhoc-title').val(),
                    description: $('#adhoc-description').val(),
                    column: 'backlog-col',
                    updated_at: new Date().getTime()
                });
                $('#adHocModal input,#adHocModal textarea').val('');
                $('#adHocModal').modal('hide');
            }
        });
    };

    var standupMode = function standupMode() {
        var endStandup = function endStandup() {
            firebaseRef.child('standup').remove();
        };
        var selectUser = function selectUser() {
            var username = $(this).data('standup-user');
            firebaseRef.child('standup').update({
                username: username
            });
        };
        $('[data-standup-user]').unbind('click').on('click', selectUser);
        $('.js-endStandup').unbind('click').on('click', endStandup);
    };

    var updateStandup = function updateStandup(snapshot) {
        if (snapshot.val()) {
            var username = snapshot.val().username;
            $('.swimlane').addClass('hide');
            $('.swimlane[data-assignee=' + username + ']').removeClass('hide');
        } else {
            $('.swimlane').removeClass('hide');
            $('#standupBtn').text('Start Stand-up');
            configFilterOptions();
        }

        $('#standupModal').modal('hide');
    };

    if (document.location.pathname.indexOf('kanban') >= 0) {
        $('#standupBtn').on('click', standupMode);
        $(document).on('firebase-ready', init);
        resizeColumns();
    }
}());
