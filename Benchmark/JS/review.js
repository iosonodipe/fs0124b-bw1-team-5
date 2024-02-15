const stars = document.querySelectorAll('.logo-button');
let rating = 0;

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        if (index === rating - 1) {
            rating = 0; 
        } else {
            rating = index + 1;
        }
        updateStars();
        console.log('Valutazione:', rating);

    });

    star.addEventListener('mouseenter', () => {

        for (let i = 0; i <= index; i++) {
            stars[i].classList.add('selected');
        }
    });

    star.addEventListener('mouseleave', () => {

        if (rating === 0) {
            stars.forEach(star => star.classList.remove('selected'));
        }
    });
});

function updateStars() {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}