import { User } from "src/users/entities/user.entity";
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    queue: process.env.RABBITMQ_QUEUE || 'user_queue',
    queueOptions: {
      durable: false
    }
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/user-service',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  database: {
    mysql: {
      type:"mysql",
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
      username: process.env.MYSQL_USERNAME || 'root',
      password: process.env.MYSQL_PASSWORD || 'password',
      database: process.env.MYSQL_DATABASE || 'users',
      entities:[User]
    },
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/users',
    },
  },
}); 