// ==UserScript==
// @name         JRA - Sort Race Card
// @namespace    http://iwamot.com/
// @version      0.0.2
// @author       IWAMOTO Takashi <hello@iwamot.com> http://iwamot.com/
// @description  JRAの出馬表を並べ替えできるようにします。
// @include      http://www.jra.go.jp/JRADB/accessD.html
// @homepage     https://github.com/iwamot/jra-sort-race-card
// @updateURL    https://github.com/iwamot/jra-sort-race-card/raw/master/jra-sort-race-card.user.js
// @require      http://code.jquery.com/jquery-3.1.1.slim.min.js
// ==/UserScript==

(function(){
    $(document).on('click', '.jra-src-up', function(event){
        var selectedRow = $(event.target).closest('tr');
        selectedRow.insertBefore(selectedRow.prev('.jra-src-row'));
    });

    $(document).on('click', '.jra-src-down', function(event){
        var selectedRow = $(event.target).closest('tr');
        selectedRow.insertAfter(selectedRow.next('.jra-src-row'));
    });

    $(document).on('click', '#jra-src-sort-by-number', function(){
        var sortedRows = $('.jra-src-row').clone(true).sort(function(a, b){
            return ($(a).data('jra-src-number') < $(b).data('jra-src-number')) ? -1 : 1;
        });
        $('.jra-src-row').each(function(i){
            $(this).replaceWith(sortedRows[i]);
        });
    });

    $('.raceDetailList .hNumber').each(function(i){
        $(this).prepend('<p><input class="jra-src-up" type="button" value="↑"></p>')
               .append('<p><input class="jra-src-down" type="button" value="↓"></p>')
               .closest('tr').addClass('jra-src-row').data('jra-src-number', i + 1);
    });

    var div = $('<div>').css({'position': 'fixed', 'right': '5px', 'bottom': '5px'});
    div.append('<input id="jra-src-sort-by-number" type="button" value="馬番で並べる">');
    $('body').append(div);
})();
