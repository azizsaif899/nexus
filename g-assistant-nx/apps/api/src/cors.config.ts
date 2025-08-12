export const corsConfig = {
  origin: [
    'http://localhost:3000',
    'http://localhost:4200',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4200',
    'http://127.0.0.1:8000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-Python-Service-Secret'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

export const pythonServiceCors = {
  origin: ['http://localhost:3000', 'http://localhost:4200'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};