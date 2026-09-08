// requests-data.js
// Shared data layer for the admin dashboard + requests page.
// This is a localStorage stand-in for the "requests" table that will
// live in MySQL once the Java Servlet backend is wired up. Every
// function here maps to a future servlet call:
//   getRequests()          -> GET  /getAllRequests
//   updateRequestStatus()  -> POST /updateRequestStatus
//   addRequest()           -> POST /submitRequest

const REQUESTS_KEY = 'barangayRequests';

function seedRequestsIfEmpty() {
  if (localStorage.getItem(REQUESTS_KEY)) return;
  const seed = [
    {
      id: 'REQ-0001',
      firstName: 'Juan', lastName: 'Dela Cruz',
      email: 'juan.delacruz@email.com',
      address: '12 Mabini St., Barangay Corregidor',
      contact: '0917 123 4567',
      docType: 'Barangay Certification / Clearance',
      purpose: 'Employment requirement',
      proof: 'valid_id_juan.jpg',
      dateFiled: 'Aug 17, 2026',
      status: 'pending'
    },
    {
      id: 'REQ-0002',
      firstName: 'Maria', lastName: 'Santos',
      email: 'maria.santos@email.com',
      address: '45 Rizal Ave., Barangay Corregidor',
      contact: '0918 234 5678',
      docType: 'Certificate of Indigency',
      purpose: 'Medical assistance application',
      proof: 'valid_id_maria.jpg',
      dateFiled: 'Aug 17, 2026',
      status: 'pending'
    },
    {
      id: 'REQ-0003',
      firstName: 'Ramon', lastName: 'Bautista',
      email: 'ramon.bautista@email.com',
      address: '8 Bonifacio St., Barangay Corregidor',
      contact: '0919 345 6789',
      docType: 'Senior Citizen Certification',
      purpose: 'Senior citizen discount renewal',
      proof: 'senior_id_ramon.jpg',
      dateFiled: 'Aug 16, 2026',
      status: 'processing'
    },
    {
      id: 'REQ-0004',
      firstName: 'Liza', lastName: 'Fernandez',
      email: 'liza.fernandez@email.com',
      address: '21 Aguinaldo St., Barangay Corregidor',
      contact: '0920 456 7890',
      docType: 'Facilities & Properties Request',
      purpose: 'Barangay court reservation for community event',
      proof: '—',
      dateFiled: 'Aug 16, 2026',
      status: 'ready'
    },
    {
      id: 'REQ-0005',
      firstName: 'Pedro', lastName: 'Villanueva',
      email: 'pedro.villanueva@email.com',
      address: '3 Luna St., Barangay Corregidor',
      contact: '0921 567 8901',
      docType: 'Certificate to File Action (CFA)',
      purpose: 'Filing a case after failed conciliation',
      proof: 'conciliation_notice.jpg',
      dateFiled: 'Aug 15, 2026',
      status: 'processing'
    },
    {
      id: 'REQ-0006',
      firstName: 'Corazon', lastName: 'Reyes',
      email: 'corazon.reyes@email.com',
      address: '17 Sampaguita St., Barangay Corregidor',
      contact: '0922 678 9012',
      docType: 'Barangay Certification / Clearance',
      purpose: 'School requirement',
      proof: 'valid_id_corazon.jpg',
      dateFiled: 'Aug 15, 2026',
      status: 'pending'
    }
  ];
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(seed));
}

function getRequests() {
  seedRequestsIfEmpty();
  return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
}

function saveRequests(list) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(list));
}

function addRequest(request) {
  const list = getRequests();
  list.unshift(request);
  saveRequests(list);
}

function updateRequestStatus(id, newStatus) {
  const list = getRequests();
  const idx = list.findIndex(r => r.id === id);
  if (idx > -1) {
    list[idx].status = newStatus;
    saveRequests(list);
  }
}

// Cross-checks a request's email against accounts created through the
// resident sign-up form, so staff can see whether it's really coming
// from a registered Corregidor resident before accepting it.
function isVerifiedResident(email) {
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  return users.some(u => u.email === (email || '').toLowerCase());
}

function statusLabel(status) {
  return {
    pending: 'Pending',
    processing: 'Processing',
    ready: 'Ready for Pickup',
    rejected: 'Rejected'
  }[status] || status;
}
