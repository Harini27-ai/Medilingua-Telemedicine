const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../server');

describe('MediLingua Telemedicine Enterprise API Test Suite', () => {
  let server;
  let baseUrl;

  before((_, done) => {
    server = http.createServer(app).listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  after((_, done) => {
    server.close(done);
  });

  it('GET /api/health returns status 200 and system diagnostics', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.ok, true);
    assert.strictEqual(data.service, 'MediLingua Telemedicine Enterprise API');
    assert.ok(typeof data.uptimeSeconds === 'number');
    assert.ok(data.diagnostics);
    assert.ok(data.diagnostics.activeDoctors > 0);
  });

  it('POST /api/auth/demo-login authenticates demo patient account', async () => {
    const res = await fetch(`${baseUrl}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'patient' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.token);
    assert.strictEqual(data.user.role, 'patient');
    assert.strictEqual(data.user.name, 'Priya Sharma');
  });

  it('POST /api/auth/demo-login authenticates demo doctor account', async () => {
    const res = await fetch(`${baseUrl}/api/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'doctor' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.token);
    assert.strictEqual(data.user.role, 'doctor');
  });

  it('GET /api/doctors returns medical specialists list with ratings', async () => {
    const res = await fetch(`${baseUrl}/api/doctors`);
    assert.strictEqual(res.status, 200);
    const doctors = await res.json();
    assert.ok(Array.isArray(doctors));
    assert.ok(doctors.length >= 1);
    assert.ok(doctors[0].specialty);
  });

  it('POST /api/auth/send-otp validates phone requirement', async () => {
    const failRes = await fetch(`${baseUrl}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.strictEqual(failRes.status, 400);

    const okRes = await fetch(`${baseUrl}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+919876543210' })
    });
    assert.strictEqual(okRes.status, 200);
    const okData = await okRes.json();
    assert.ok(okData.message.includes('OTP sent successfully'));
  });

  it('POST /api/demo/appointments books a new consultation', async () => {
    const res = await fetch(`${baseUrl}/api/demo/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctor: 'Dr. Rajesh Sundaram',
        date: '2026-10-10',
        time: '10:00 AM',
        symptoms: 'Mild chest discomfort after meals'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.message, 'Appointment booked successfully');
    assert.ok(data.appointment.roomCode);
  });
});
