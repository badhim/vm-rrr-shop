function showToast(message) {
    const toastBody = document.getElementById('toastBody');
    toastBody.innerHTML = message;

    const toastEl = document.getElementById('toastEl');
    const toast = new bootstrap.Toast(toastEl);

    toast.show();

    return false;
}

function notImplemented() {
    return showToast('Not implemented yet');
}

function getCurrentUser() {
    let currentUser = '';

    let el = document.getElementById('current-user');
    if (el) currentUser = el.innerText.trim();

    if (currentUser.indexOf('@') < 0) return '';
    return currentUser;
}

function loadLocalCart() {
    let itemText = localStorage.getItem(getCurrentUser());
    if (itemText) return JSON.parse(itemText);
    else return [];
}

function saveLocalCart(items) {
    if (items.constructor !== Array) {
        console.log('Items is not an array');
        return;
    }

    localStorage.setItem(getCurrentUser(), JSON.stringify(items));
}

function updateCartBadges(count = -1) {
    if (count < 0) count = loadLocalCart().length;

    el = document.getElementById('cart-count-0');
    if (el) el.innerText = count;
    el = document.getElementById('cart-count-1');
    if (el) el.innerText = count;
}

(function ($) {
    "use strict";

    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);

        updateCartBadges();
        setInterval(() => {
            updateCartBadges();
        }, 5000);
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
})(jQuery);