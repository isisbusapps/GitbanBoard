'use strict';
/* global firebaseRef, moment, userId */
(function() {

    var init = function init() {
        $('.issue-col').each(function() {
            this.addEventListener('drop', onDrop);
        });
        $('.issue').each(function() {
            this.addEventListener('dragstart', startDrag);
        });

        configFilterOptions();

        firebaseRef.child('issues').on('child_changed', updateIssues);
        firebaseRef.child('issues').on('child_added', updateIssues);
        firebaseRef.child('standup').on('value', updateStandup);
    };

    var resizeColumns = function resizeColumns() {
        var colHeight =  -1;
        $('.issue-col').each(function() {
            $(this).height('initial');
            var h = $(this).height();
            colHeight = h > colHeight ? h : colHeight;
        });
        $('.issue-col').height(colHeight);
    };

    var startDrag = function startDrag(e) {
        e.dataTransfer.setData('text/plain', this.id);
    };
    var onDrop = function onDrop(e) {
        var $issue = $('#' + event.dataTransfer.getData('text/plain'));
        var $newCol = $(e.target).closest('.issue-col');
        $issue.remove().appendTo($newCol);
        firebaseRef.child('issues').child($issue.attr('id')).update({
            id: $issue.attr('id'),
            column: $newCol.attr('id')
        });
    };

    var updateIssues = function updateIssues(snapshot) {
        var $issue = $('#' + snapshot.val().id);
        var column = '#' + snapshot.val().column;
        if ($issue.parents(column).length === 0) {
            $issue.remove().appendTo(column);
        }
        $('.progress').remove();
        resizeColumns();
    };

    var filterIssues = function filterIssues() {
        function getParentText(self) {
            return $(self).parent().text().trim();
        }
        $('.issue').removeClass('hide');
        $('.js-githubuser').not(':checked').each(function() {
            $('.issue[data-username="' + getParentText(this) + '"]').addClass('hide');
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
            firebaseRef.child('filter').child(userId).update(formValues);

            filterIssues();
        };
        var loadFilter = function saveFilter() {
            var filters = firebaseRef.child('filter');
            filters.child(userId).once('value', function(snapshot) {
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
        $('[data-action="toggleAll"]').on('click', toggleAll);
        loadFilter();
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
        $('[data-standup-user]').on('click', selectUser);
        $('.js-endStandup').on('click', endStandup);
    };

    var updateStandup = function updateStandup(snapshot) {
        if (snapshot.val()) {
            var username = snapshot.val().username;
            $('#standupBtn').text('Select Next Person');
            $('.js-githubuser').each(function() {
                this.checked = false;
            });
            if ($('#githubuser-' + username).length) {
                $('#githubuser-' + username)[0].checked = true;
            }

            filterIssues();
        } else {
            $('#standupBtn').text('Start Stand-up');
            configFilterOptions();
        }

        $('#standupModal').modal('hide');
    };

    $('#standupBtn').on('click', standupMode);
    $(document).on('firebase-ready', init);
    resizeColumns();
}());
