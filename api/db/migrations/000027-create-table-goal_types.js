module.exports = {

    up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction(
        transaction => queryInterface.createTable(
            'goal_types',
            {
                goal_type_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true,
                },
                slug: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                nom: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                strava_types: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated_at: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    defaultValue: null,
                    onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                },
            },
            {
                transaction,
            },
        )
            .then(() => queryInterface.addConstraint(
                'goal_types',
                ['slug'],
                {
                    type: 'unique',
                    name: 'uk_goal_types_slug',
                    transaction,
                },
            ))
            .then(() => queryInterface.bulkInsert(
                'goal_types',
                [
                    { slug: 'run', nom: 'Course à pied', strava_types: 'Hike;Run;Walk;VirtualRun' },
                    { slug: 'swim', nom: 'Natation', strava_types: 'Swim', },
                    { slug: 'bike', nom: 'Cyclisme', strava_types: 'EBikeRide;Ride;VirtualRide' },
                ],
                {
                    transaction,
                },
            )),
    ),

    down: queryInterface => queryInterface.sequelize.transaction(
        transaction => queryInterface.dropTable('goal_types', { transaction }),
    ),

};
