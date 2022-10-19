export const handleInfiniteScroll = (callback) => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 0.5;

    if (endOfPage) {
        setTimeout(callback, 500)
    }
};