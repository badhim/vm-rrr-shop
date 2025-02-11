const useLocalCart = () => {
    const loadCart = () => {
        if (typeof window.loadLocalCart === 'function') {
            return window.loadLocalCart();
        } else {
            console.error('loadLocalCart is not defined');
            return [];
        }
    }

    const saveCart = (items) => {
        if (typeof window.saveLocalCart === 'function') {
            window.saveLocalCart(items);
        } else {
            console.error('saveLocalCart is not defined');
        }
    }

    const updateCartBadges = (count) => {
        if (typeof window.updateCartBadges === 'function') {
            window.updateCartBadges(count);
        } else {
            console.error('updateCartBadges is not defined');
        }
    }

    const getCurrentUser = () => {
        if (typeof window.getCurrentUser === 'function') {
            return window.getCurrentUser();
        } else {
            console.error('getCurrentUser is not defined');
            return '';
        }
    }

    return { loadCart, saveCart, updateCartBadges, getCurrentUser }
}

export default useLocalCart;