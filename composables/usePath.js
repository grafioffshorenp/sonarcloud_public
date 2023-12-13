export const usePath = () => {
    const getSlug = (url) => {
        try {
            return new URL(url).pathname;
        } catch(err) {
            return url;
        }
    }

    return { getSlug };
};
