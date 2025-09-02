import { vi } from 'vitest';

// Mock de nodemailer pour tous les tests
export const mockTransporter = {
  sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' }),
  verify: vi.fn().mockResolvedValue(true)
};

export const mockNodemailer = {
  createTransport: vi.fn().mockReturnValue(mockTransporter)
};

// Mock des variables d'environnement pour les tests d'email
export const mockEnv = {
  EMAIL_USER: 'test@example.com',
  EMAIL_APP_PASSWORD: 'test-password',
  ADMIN_EMAIL: 'admin@example.com',
  SMTP_HOST: 'smtp.test.com',
  SMTP_USER: 'test@test.com',
  SMTP_PASS: 'test-pass',
  SMTP_PORT: '587'
};

// Configuration des mocks globaux
export const setupEmailMocks = () => {
  vi.mock('nodemailer', () => ({
    createTransport: mockNodemailer.createTransport
  }));

  vi.mock('$env/dynamic/private', () => ({
    env: mockEnv
  }));
};

// Reset des mocks
export const resetEmailMocks = () => {
  vi.clearAllMocks();
  mockTransporter.sendMail.mockResolvedValue({ messageId: 'test-id' });
  mockTransporter.verify.mockResolvedValue(true);
};

// Vérifications communes pour les tests d'email
export const expectEmailsSent = (expectedCount: number = 2) => {
  expect(mockTransporter.sendMail).toHaveBeenCalledTimes(expectedCount);
};

export const expectEmailToClient = (clientEmail: string) => {
  const calls = mockTransporter.sendMail.mock.calls;
  const clientCall = calls.find(call => call[0].to === clientEmail);
  expect(clientCall).toBeDefined();
};

export const expectEmailToAdmin = (adminEmail: string = 'admin@example.com') => {
  const calls = mockTransporter.sendMail.mock.calls;
  const adminCall = calls.find(call => call[0].to === adminEmail);
  expect(adminCall).toBeDefined();
};
