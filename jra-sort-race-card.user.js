// ==UserScript==
// @name         JRA - Sort Race Card
// @namespace    http://iwamot.com/
// @version      0.0.1
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
        selectedRow.insertBefore(selectedRow.prev('tr.jra-src-row'));
    });

    $(document).on('click', '.jra-src-down', function(event){
        var selectedRow = $(event.target).closest('tr');
        selectedRow.insertAfter(selectedRow.next('tr.jra-src-row'));
    });

    $('.raceDetailList .hNumber').each(function(){
        $(this).prepend('<p><input class="jra-src-up" type="button" value="↑"></p>')
               .append('<p><input class="jra-src-down" type="button" value="↓"></p>')
               .closest('tr').addClass('jra-src-row');
    });
})();
