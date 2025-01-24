import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformationInterceptor } from './responseInterceptor';
import { ValidationPipe } from '@nestjs/common';
import * as os from 'os';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import axios from 'axios';


function getLocalIPAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address; // Retourne la première adresse IPv4 non interne
      }
    }
  }
  return '127.0.0.1'; // Adresse de repli si aucune adresse n'est trouvée
}

const hostName = getLocalIPAddress()

async function bootstrap() {
  const host = getLocalIPAddress()
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: host,
      port: 3050, // Port for NestJS service
    },
  });
    
  const serviceName = 'authentificationService';
  // Choose a different port

  // Register with Gateway (assuming Gateway listens on port 3003)
  try {
    await axios.post('http://127.0.0.1:3003/discovery/register', {
      name: serviceName,
      host: host,
      port: 3050,
      protocol: 'tcp',
    });

    
    console.log(`${serviceName} registered with Gateway`);
  } catch (error) {
    console.error('Error registering with Gateway:', error.message);
  }
  microservice.listen()

  const app = await NestFactory.create(AppModule);
  const servicePort = 3001;

  const corsOption = {
    origin: true,
    credentials: true,
    methods: 'GET,POST',
    allowedHeaders:'Content-Type, Authorization'
  };


  app.enableCors(corsOption);
  app.useGlobalInterceptors(new TransformationInterceptor())

  app.useGlobalPipes( new ValidationPipe({
    whitelist:true
  }));
  

  app.setGlobalPrefix('api')

  const port  = process.env.SERVER_PORT
  console.log(`User Service is running on http://localhost:${servicePort}`);

  await app.listen(3000,'0.0.0.0');
}
bootstrap();
