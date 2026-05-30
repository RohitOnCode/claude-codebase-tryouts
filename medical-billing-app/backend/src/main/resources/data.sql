-- Sample Patients
INSERT INTO patients (id, first_name, last_name, date_of_birth, gender, email, phone, address, insurance_member_id, created_at) VALUES
(1, 'John', 'Doe', '1980-05-15', 'MALE', 'john.doe@email.com', '555-0101', '123 Main St, Springfield, IL 62701', 'INS-001-JD', CURRENT_TIMESTAMP),
(2, 'Jane', 'Smith', '1975-08-22', 'FEMALE', 'jane.smith@email.com', '555-0102', '456 Oak Ave, Chicago, IL 60601', 'INS-002-JS', CURRENT_TIMESTAMP),
(3, 'Robert', 'Johnson', '1990-03-10', 'MALE', 'robert.j@email.com', '555-0103', '789 Pine Rd, Naperville, IL 60540', 'INS-003-RJ', CURRENT_TIMESTAMP),
(4, 'Emily', 'Davis', '1985-11-30', 'FEMALE', 'emily.d@email.com', '555-0104', '321 Elm St, Peoria, IL 61602', 'INS-004-ED', CURRENT_TIMESTAMP),
(5, 'Michael', 'Wilson', '1965-07-18', 'MALE', 'michael.w@email.com', '555-0105', '654 Maple Dr, Rockford, IL 61101', 'INS-005-MW', CURRENT_TIMESTAMP);

-- Sample Insurance Providers
INSERT INTO insurance_providers (id, name, payer_id, phone, address, email, created_at) VALUES
(1, 'BlueCross BlueShield', 'BCBS-001', '800-555-0001', '225 N Michigan Ave, Chicago, IL 60601', 'claims@bcbs.com', CURRENT_TIMESTAMP),
(2, 'Aetna Health Insurance', 'AETNA-001', '800-555-0002', '151 Farmington Ave, Hartford, CT 06156', 'claims@aetna.com', CURRENT_TIMESTAMP),
(3, 'United Healthcare', 'UHC-001', '800-555-0003', '9900 Bren Road East, Minnetonka, MN 55343', 'claims@uhc.com', CURRENT_TIMESTAMP),
(4, 'Cigna Health', 'CIGNA-001', '800-555-0004', '900 Cottage Grove Rd, Bloomfield, CT 06002', 'claims@cigna.com', CURRENT_TIMESTAMP);

-- Sample Providers (Doctors)
INSERT INTO providers (id, first_name, last_name, specialty, npi, phone, email, address, created_at) VALUES
(1, 'Dr. Sarah', 'Anderson', 'Internal Medicine', '1234567890', '555-0201', 'dr.anderson@hospital.com', '100 Medical Center Dr, Chicago, IL 60611', CURRENT_TIMESTAMP),
(2, 'Dr. James', 'Martinez', 'Cardiology', '0987654321', '555-0202', 'dr.martinez@hospital.com', '200 Heart Care Ave, Chicago, IL 60611', CURRENT_TIMESTAMP),
(3, 'Dr. Lisa', 'Thompson', 'Orthopedics', '1122334455', '555-0203', 'dr.thompson@hospital.com', '300 Ortho Blvd, Chicago, IL 60611', CURRENT_TIMESTAMP);

-- Sample Claims
INSERT INTO claims (id, patient_id, provider_id, insurance_provider_id, date_of_service, diagnosis_code, diagnosis_description, status, total_amount, notes, created_at) VALUES
(1, 1, 1, 1, '2024-01-15', 'J06.9', 'Acute upper respiratory infection', 'APPROVED', 350.00, 'Routine check-up and treatment', CURRENT_TIMESTAMP),
(2, 2, 2, 2, '2024-01-20', 'I10', 'Essential hypertension', 'PENDING', 1200.00, 'Cardiac consultation', CURRENT_TIMESTAMP),
(3, 3, 3, 3, '2024-02-05', 'M54.5', 'Low back pain', 'SUBMITTED', 850.00, 'Orthopedic evaluation', CURRENT_TIMESTAMP),
(4, 4, 1, 1, '2024-02-10', 'E11.9', 'Type 2 diabetes mellitus', 'APPROVED', 450.00, 'Diabetes management', CURRENT_TIMESTAMP),
(5, 5, 2, 4, '2024-02-15', 'I25.10', 'Coronary artery disease', 'DENIED', 2500.00, 'Pre-authorization required', CURRENT_TIMESTAMP);

-- Sample Claim Items
INSERT INTO claim_items (id, claim_id, procedure_code, description, quantity, unit_price, total_price) VALUES
(1, 1, '99213', 'Office visit - established patient', 1, 150.00, 150.00),
(2, 1, '85025', 'Complete blood count', 1, 75.00, 75.00),
(3, 1, '80053', 'Comprehensive metabolic panel', 1, 125.00, 125.00),
(4, 2, '93000', 'Electrocardiogram', 1, 200.00, 200.00),
(5, 2, '99244', 'Office consultation', 1, 1000.00, 1000.00),
(6, 3, '99243', 'Office consultation - moderate complexity', 1, 350.00, 350.00),
(7, 3, '72110', 'X-ray spine lumbar', 2, 250.00, 500.00),
(8, 4, '99213', 'Office visit - established patient', 1, 150.00, 150.00),
(9, 4, '82947', 'Glucose blood test', 2, 150.00, 300.00),
(10, 5, '93454', 'Coronary angiography', 1, 2500.00, 2500.00);

-- Sample Invoices
INSERT INTO invoices (id, claim_id, invoice_number, invoice_date, due_date, total_amount, paid_amount, status, created_at) VALUES
(1, 1, 'INV-2024-001', '2024-01-20', '2024-02-20', 350.00, 350.00, 'PAID', CURRENT_TIMESTAMP),
(2, 2, 'INV-2024-002', '2024-01-25', '2024-02-25', 1200.00, 0.00, 'PENDING', CURRENT_TIMESTAMP),
(3, 3, 'INV-2024-003', '2024-02-10', '2024-03-10', 850.00, 425.00, 'PARTIAL', CURRENT_TIMESTAMP),
(4, 4, 'INV-2024-004', '2024-02-15', '2024-03-15', 450.00, 450.00, 'PAID', CURRENT_TIMESTAMP),
(5, 5, 'INV-2024-005', '2024-02-20', '2024-03-20', 2500.00, 0.00, 'OVERDUE', CURRENT_TIMESTAMP);

-- Sample Payments
INSERT INTO payments (id, invoice_id, amount, payment_date, payment_method, transaction_id, notes, created_at) VALUES
(1, 1, 350.00, '2024-02-01', 'INSURANCE', 'TXN-001', 'Insurance payment received', CURRENT_TIMESTAMP),
(2, 3, 425.00, '2024-02-28', 'CREDIT_CARD', 'TXN-002', 'Partial patient payment', CURRENT_TIMESTAMP),
(3, 4, 450.00, '2024-03-01', 'INSURANCE', 'TXN-003', 'Insurance payment received', CURRENT_TIMESTAMP);
