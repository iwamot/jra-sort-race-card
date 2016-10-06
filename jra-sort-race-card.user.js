// ==UserScript==
// @name         JRA - Sort Race Card
// @namespace    http://iwamot.com/
// @version      0.0.6
// @author       IWAMOTO Takashi <hello@iwamot.com> http://iwamot.com/
// @description  JRAの出馬表を並べ替えできるようにします。
// @include      http://www.jra.go.jp/JRADB/accessD.html
// @homepage     https://github.com/iwamot/jra-sort-race-card
// @updateURL    https://github.com/iwamot/jra-sort-race-card/raw/master/jra-sort-race-card.user.js
// @require      http://code.jquery.com/jquery-3.1.1.slim.min.js
// ==/UserScript==

(function(){
    function switchModeButtons(id) {
        $('#jra-src-number-mode,#jra-src-popularity-mode,#jra-src-edit-mode').css({'background-color': '', 'color': ''});
        $('#' + id).css({'background-color': '#99B761', 'color': 'white'});
        $('.jra-src-edit').css('display', (id === 'jra-src-edit-mode') ? 'block' : 'none');
    }

    function intoNumberMode() {
        switchModeButtons('jra-src-number-mode');

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
        switchModeButtons('jra-src-edit-mode');
    }

    function compareByNumber(a, b) {
        return $(a).data('jra-src-number') - $(b).data('jra-src-number');
    }

    if ($('.raceDetailList').length === 0 || $('table.print:first').length > 0) {
        return;
    }

    var matches = /'[^']{7}([^']+)\/[^']{2}'\)/.exec($('.kaisaiBtnStay a').attr('onclick'));
    if (!matches) return;
    var pageId = matches[1];

    $(document).on('click', '.jra-src-up', function(event){
        var selectedRow = $(event.target).closest('tr');
        selectedRow.insertBefore(selectedRow.prev('.jra-src-row'));
    });

    $(document).on('click', '.jra-src-down', function(event){
        var selectedRow = $(event.target).closest('tr');
        selectedRow.insertAfter(selectedRow.next('.jra-src-row'));
    });

    $(document).on('click', '#jra-src-number-mode', intoNumberMode);
    $(document).on('click', '#jra-src-popularity-mode', intoPopularityMode);
    $(document).on('click', '#jra-src-edit-mode', intoEditMode);

    var numbered = false;
    var voted = false;

    $('.raceDetailList .hNumber').each(function(i){
        var p = $('<p class="jra-src-edit" style="display: none;">');
        $(this).prepend(p.clone().append('<input class="jra-src-up" type="button" value="↑">'))
               .append(p.clone().append('<input class="jra-src-down" type="button" value="↓">'));

        var row = $(this).closest('tr');
        var favorite = parseInt(row.find('.ninki').text().replace(/[^0-9]/, '')) || 99;
        row.addClass('jra-src-row').data({'jra-src-number': i + 1, 'jra-src-favorite': favorite});

        if (!numbered && $.trim($(this).text()) !== '') numbered = true;
        if (!voted && favorite !== 99) voted = true;
    });

    var btn = $('<input type="button" style="display: block; margin-top: 4px; width: 7.5em">');
    $('<div style="position: fixed; right: 5px; bottom: 5px">')
      .append(btn.clone().attr('id', 'jra-src-number-mode').val('馬番順モード').prop('disabled', !numbered))
      .append(btn.clone().attr('id', 'jra-src-popularity-mode').val('人気順モード').prop('disabled', !voted))
      .append(btn.clone().attr('id', 'jra-src-edit-mode').val('検討モード'))
      .appendTo('body');

    if (numbered) {
        intoNumberMode();
    } else {
        intoEditMode();
    }
})();
