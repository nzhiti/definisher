module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert(
            'themes',
            [
                { nom: 'dark' },
                { nom: 'light' },
            ],
        );
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('themes');
    },
};
