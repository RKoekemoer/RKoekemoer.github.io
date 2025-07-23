$(document).ready(function () {

    const skillsMatrix = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                var item = $(entry.target).find('.skillMastery');

                item.html( item.data('fill') );

                $(entry.target).find('.filler').css('width', item.data('fill'));

            }
        });
    }, {
        threshold: 0
    });

    $('#skills').find('.skillItem').each(function () {
        skillsMatrix.observe(this);
    });

});


