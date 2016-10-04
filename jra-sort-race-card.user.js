// ==UserScript==
// @name         JRA - Sort Race Card
// @namespace    http://iwamot.com/
// @version      0.0.5
// @author       IWAMOTO Takashi <hello@iwamot.com> http://iwamot.com/
// @description  JRAの出馬表を並べ替えできるようにします。
// @include      http://www.jra.go.jp/JRADB/accessD.html
// @homepage     https://github.com/iwamot/jra-sort-race-card
// @updateURL    https://github.com/iwamot/jra-sort-race-card/raw/master/jra-sort-race-card.user.js
// @require      http://code.jquery.com/jquery-3.1.1.slim.min.js
// ==/UserScript==

(function(){
    if ($('.raceDetailList').length === 0 || $('table.print:first').length > 0) {
        return;
    }

    function switchModeButtons(id) {
        $('#jra-src-default-mode,#jra-src-popularity-mode,#jra-src-edit-mode').prop('disabled', false).css({'background-color': '', 'color': ''});
        $('#' + id).prop('disabled', true).css({'background-color': '#99B761', 'color': 'white'});
        $('.jra-src-edit').css('display', (id === 'jra-src-edit-mode') ? 'block' : 'none');
    }

    function intoDefaultMode() {
        switchModeButtons('jra-src-default-mode');

        var sortedRows = $('.jra-src-row').clone(true).sort(compareByNumber);
        $('.jra-src-row').each(function(i){
            $(this).replaceWith(sortedRows[i]);
        });
    }

    function intoPopularityMode() {
        switchModeButtons('jra-src-popularity-mode');

        var sortedRows = $('.jra-src-row').clone(true).sort(function(a, b){
            var comp = $(a).data('jra-src-favorite') - $(b).data('jra-src-favorite');
            return (comp !== 0) ? comp : compareByNumber(a, b);
        });
        $('.jra-src-row').each(function(i){
            $(this).replaceWith(sortedRows[i]);
        });
    }

    function intoEditMode() {
        console.log('intoEditMode');
        switchModeButtons('jra-src-edit-mode');
    }

    function compareByNumber(a, b) {
        return $(a).data('jra-src-number') - $(b).data('jra-src-number');
    }

    $(document).on('click', '.jra-src-up', function(event){
        var selectedRow = $(event.target).closest('tr');
        selectedRow.insertBefore(selectedRow.prev('.jra-src-row'));
    });

    $(document).on('click', '.jra-src-down', function(event){
        var selectedRow = $(event.target).closest('tr');
        selectedRow.insertAfter(selectedRow.next('.jra-src-row'));
    });

    $(function(){
        intoDefaultMode();
    });
    $(document).on('click', '#jra-src-default-mode', intoDefaultMode);
    $(document).on('click', '#jra-src-popularity-mode', intoPopularityMode);
    $(document).on('click', '#jra-src-edit-mode', intoEditMode);

    $('.raceDetailList .hNumber').each(function(i){
        $(this).prepend('<p class="jra-src-edit" style="display: none;"><input class="jra-src-up" type="button" value="↑"></p>')
               .append('<p class="jra-src-edit" style="display: none;"><input class="jra-src-down" type="button" value="↓"></p>');
        var row = $(this).closest('tr');
        var favorite = parseInt(row.find('.ninki').text().replace(/[^0-9]/, '')) || 99;
        row.addClass('jra-src-row').data('jra-src-number', i + 1).data('jra-src-favorite', favorite);
    });

    var div = $('<div>').css({'position': 'fixed', 'right': '5px', 'bottom': '5px'});
    var btn = $('<input type="button">').css('display', 'block').css({'margin-top': '4px', 'width': '7.5em'});
    div.append(btn.clone().attr('id', 'jra-src-default-mode').val('馬番順モード'));
    div.append(btn.clone().attr('id', 'jra-src-popularity-mode').val('人気順モード'));
    div.append(btn.clone().attr('id', 'jra-src-edit-mode').val('検討モード'));
    $('body').append(div);
})();
