export default {
    namespaced: true,

    state: {
        challenges: JSON.parse(localStorage.getItem('panier')) || [],
    },

    mutations: {
        add(state, challenge) {
            // for now, we can not buy more than one challenge at a time
            state.challenges = [
                challenge.id,
            ];
            localStorage.setItem('panier', JSON.stringify(state.challenges));
        },
    },
};