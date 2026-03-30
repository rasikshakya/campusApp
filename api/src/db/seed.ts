import { getDatabase, closeDatabase } from './database';

function seed(): void {
  const db = getDatabase();

  // Create a test admin user (password: "admin123" — NOT for production)
  const adminHash = '$2b$10$placeholder_hash_for_dev_only';
  db.prepare(`
    INSERT OR IGNORE INTO users (email, password_hash, role, status)
    VALUES (?, ?, 'admin', 'active')
  `).run('admin@oneonta.edu', adminHash);

  // Create a test student user
  const studentHash = '$2b$10$placeholder_hash_for_dev_only';
  db.prepare(`
    INSERT OR IGNORE INTO users (email, password_hash, role, status)
    VALUES (?, ?, 'student', 'active')
  `).run('student@oneonta.edu', studentHash);

  // Create sample issues around campus
  const sampleIssues = [
    { category: 'Road', severity: 'Medium', description: 'Icy walkway near Milne Library', lat: 42.4540, lng: -75.0635 },
    { category: 'Water', severity: 'Mild', description: 'Drinking fountain not working in IRC', lat: 42.4528, lng: -75.0645 },
    { category: 'Building', severity: 'Large', description: 'Heating issue in Fitzelle Hall', lat: 42.4537, lng: -75.0655 },
  ];

  const insertIssue = db.prepare(`
    INSERT INTO issues (category, severity, description, latitude, longitude, reporter_id)
    VALUES (?, ?, ?, ?, ?, 2)
  `);

  for (const issue of sampleIssues) {
    insertIssue.run(issue.category, issue.severity, issue.description, issue.lat, issue.lng);
  }

  // Create a sample lost item
  db.prepare(`
    INSERT INTO lost_found_items (type, title, description, category, latitude, longitude, reporter_id)
    VALUES ('lost', 'Black AirPods Case', 'Lost near Milne Library entrance', 'Electronics', 42.4541, -75.0633, 2)
  `).run();

  console.log('Seed data inserted.');
  closeDatabase();
}

seed();
