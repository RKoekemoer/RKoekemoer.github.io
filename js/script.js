/* Slide in animations */
$(document).ready(function () {

    const education = new IntersectionObserver(function (entries, observer) {
        entries.forEach(( entry,index )=> {
            if (entry.isIntersecting) {

                const delay = index * 750;

                setTimeout(() => {
                    $(entry.target)
                        .addClass('animate__slideInRight')
                        .css('visibility', 'visible');
                }, delay);

            }
        });
    }, {
        threshold: 0
    });

    $('#education').find('.educationItem').each(function () {
        education.observe(this);
    });

});

/* Skills matrix - numbering */
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


