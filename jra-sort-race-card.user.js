// ==UserScript==
// @name         JRA - Sort Race Card
// @namespace    http://iwamot.com/
// @version      0.0.3
// @author       IWAMOTO Takashi <hello@iwamot.com> http://iwamot.com/
// @description  JRAの出馬表を並べ替えできるようにします。
// @include      http://www.jra.go.jp/JRADB/accessD.html
// @homepage     https://github.com/iwamot/jra-sort-race-card
// @updateURL    https://github.com/iwamot/jra-sort-race-card/raw/master/jra-sort-race-card.user.js
// @require      http://code.jquery.com/jquery-3.1.1.slim.min.js
// ==/UserScript==

(function(){
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

    $(document).on('click', '#jra-src-sort-by-number', function(){
        var sortedRows = $('.jra-src-row').clone(true).sort(compareByNumber);
        $('.jra-src-row').each(function(i){
            $(this).replaceWith(sortedRows[i]);
        });
    });

    $(document).on('click', '#jra-src-sort-by-favorite', function(){
        var sortedRows = $('.jra-src-row').clone(true).sort(function(a, b){
            var comp = $(a).data('jra-src-favorite') - $(b).data('jra-src-favorite');
            return (comp !== 0) ? comp : compareByNumber(a, b);
        });
        $('.jra-src-row').each(function(i){
            $(this).replaceWith(sortedRows[i]);
        });
    });

    $('.raceDetailList .hNumber').each(function(i){
        $(this).prepend('<p><input class="jra-src-up" type="button" value="↑"></p>')
               .append('<p><input class="jra-src-down" type="button" value="↓"></p>');
        var row = $(this).closest('tr');
        var favorite = parseInt(row.find('.ninki').text().replace(/[^0-9]/, '')) || 99;
        row.addClass('jra-src-row').data('jra-src-number', i + 1).data('jra-src-favorite', favorite);
    });

    var div = $('<div>').css({'position': 'fixed', 'right': '5px', 'bottom': '5px'});
    div.append('<input id="jra-src-sort-by-number" type="button" value="馬番で並べる">\n');
    div.append('<input id="jra-src-sort-by-favorite" type="button" value="人気で並べる">');
    $('body').append(div);
})();
