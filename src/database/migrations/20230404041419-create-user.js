'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      surname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      rolId: {
        type: Sequelize.INTEGER,
        references : {
          model :{
            tableName : "Rols"
          },
          key : 'id'
        }
      },
      locationId: {
        type: Sequelize.INTEGER,
        references : {
          model :{
            tableName : "Locations"
          },
          key : 'id'
        }
      },
      avatarId: {
        type: Sequelize.INTEGER,
        references : {
          model :{
            tableName : "Avatars"
          },
          key : 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};