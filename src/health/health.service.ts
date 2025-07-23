import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectConnection } from '@nestjs/mongoose';
import { Repository, DataSource } from 'typeorm';
import { Connection } from 'mongoose';
import { User } from '../users/user.entity';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    @InjectConnection()
    private readonly mongoConnection: Connection,
  ) {}

  async getHealthStatus() {
    const postgres = await this.checkPostgresHealth();
    const mongodb = await this.checkMongodbHealth();

    const status = postgres.status === 'healthy' && mongodb.status === 'healthy' 
      ? 'healthy' 
      : 'unhealthy';

    return {
      status,
      timestamp: new Date().toISOString(),
      services: {
        postgres,
        mongodb,
      },
    };
  }

  async getPostgresHealth() {
    return await this.checkPostgresHealth();
  }

  async getMongodbHealth() {
    return await this.checkMongodbHealth();
  }

  async getDetailedHealthStatus() {
    const postgres = await this.checkPostgresHealthDetailed();
    const mongodb = await this.checkMongodbHealthDetailed();

    const status = postgres.status === 'healthy' && mongodb.status === 'healthy' 
      ? 'healthy' 
      : 'unhealthy';

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      services: {
        postgres,
        mongodb,
      },
    };
  }

  private async checkPostgresHealth() {
    try {
      // Simple connection check
      await this.dataSource.query('SELECT 1');
      return {
        status: 'healthy',
        message: 'PostgreSQL connection successful',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'PostgreSQL connection failed',
        error: error.message,
      };
    }
  }

  private async checkMongodbHealth() {
    try {
      // Check MongoDB connection
      if (this.mongoConnection.readyState === 1) {
        return {
          status: 'healthy',
          message: 'MongoDB connection successful',
        };
      } else {
        return {
          status: 'unhealthy',
          message: 'MongoDB connection not ready',
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'MongoDB connection failed',
        error: error.message,
      };
    }
  }

  private async checkPostgresHealthDetailed() {
    try {
      const startTime = Date.now();
      
      // Test basic query
      await this.dataSource.query('SELECT 1');
      
      // Test table access
      const userCount = await this.userRepository.count();
      
      const responseTime = Date.now() - startTime;

      return {
        status: 'healthy',
        message: 'PostgreSQL connection successful',
        details: {
          responseTime: `${responseTime}ms`,
          userCount,
          connectionStatus: 'connected',
          database: this.dataSource.options.database,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'PostgreSQL connection failed',
        error: error.message,
        details: {
          connectionStatus: 'disconnected',
        },
      };
    }
  }

  private async checkMongodbHealthDetailed() {
    try {
      const startTime = Date.now();
      
      // Check connection state
      const readyState = this.mongoConnection.readyState;
      const stateNames = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
      };

      if (readyState === 1) {
        // Test database access
        if (this.mongoConnection.db) {
          const admin = this.mongoConnection.db.admin();
          const serverStatus = await admin.serverStatus();
          
          const responseTime = Date.now() - startTime;

          return {
            status: 'healthy',
            message: 'MongoDB connection successful',
            details: {
              responseTime: `${responseTime}ms`,
              connectionStatus: stateNames[readyState],
              host: serverStatus.host,
              version: serverStatus.version,
              uptime: serverStatus.uptime,
            },
          };
        } else {
          const responseTime = Date.now() - startTime;
          return {
            status: 'healthy',
            message: 'MongoDB connection successful',
            details: {
              responseTime: `${responseTime}ms`,
              connectionStatus: stateNames[readyState],
            },
          };
        }
      } else {
        return {
          status: 'unhealthy',
          message: 'MongoDB connection not ready',
          details: {
            connectionStatus: stateNames[readyState],
          },
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'MongoDB connection failed',
        error: error.message,
        details: {
          connectionStatus: 'error',
        },
      };
    }
  }
}
