$(document).ready(function(){
    /*MODALBOX*/
    $('body').on('click', '.open-modal', function(){
        var modalBtn= $(this).data('target');
        $('#'+modalBtn).fadeIn(350);
        $('#'+modalBtn).find('.modalbox').fadeIn(300);
        $('body').addClass('notflow');
    });

    $('body').on('click', '.modalbox .dismiss', function(){
        $('.modal-wrap').fadeOut(200);
        $('.modal-wrap .modalbox').fadeOut(200);
        $('body').removeClass('notflow');
    });

    /*inputfile*/
    $('body').on('click', '.upload_file', function(){
        $(this).children('input[type="file"]').change(function(){
            var filename = this.value.match(/[^\\\/]+$/, '')[0];
            $(this).next('.file-name').html(filename);
        });       
    });  
});