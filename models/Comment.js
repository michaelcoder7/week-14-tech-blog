const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Comment extends Model {}

Comment.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  blog_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "blog",
      key: "id",
    },
  },
});
