 function showPage(pageId) {
      const isResidentLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
        && localStorage.getItem('userRole') === 'Resident';

      if (pageId === 'request' && !isResidentLoggedIn) {
        pageId = 'login';
      }

      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      const page = document.getElementById(pageId);
      if (page) page.classList.add('active');
      window.scrollTo(0, 0);

      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
      });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        const scroll = link.dataset.scroll;
        showPage(page);
        if (scroll) {
          setTimeout(() => {
            const el = document.getElementById(scroll);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
      });
    });

    function updateFileName(input) {
      const name = input.files[0] ? input.files[0].name : 'No file chosen';
      document.getElementById('file-name').textContent = name;
    }

    function handleSubmit(e) {
      e.preventDefault();

      const isResidentLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
        && localStorage.getItem('userRole') === 'Resident';

      if (!isResidentLoggedIn) {
        showPage('login');
        return;
      }

      const fileInput = document.getElementById('file-upload');
      const file = fileInput.files[0];

      const request = {
        id: 'REQ-' + Date.now(),
        firstName: document.getElementById('req-firstname').value.trim(),
        lastName: document.getElementById('req-lastname').value.trim(),
        address: document.getElementById('req-address').value.trim(),
        contact: document.getElementById('req-contact').value.trim(),
        email: document.getElementById('req-email').value.trim().toLowerCase(),
        docType: document.getElementById('req-doctype').value,
        purpose: document.getElementById('req-purpose').value.trim(),
        proof: file ? file.name : '—',
        dateFiled: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'pending'
      };

      function finishSubmit() {
        addRequest(request);
        alert('Request submitted! Barangay staff will review it shortly.');
        e.target.reset();
        document.getElementById('file-name').textContent = 'No file chosen';
      }

      if (file) {
        const reader = new FileReader();
        reader.onload = function () {
          request.proofImage = reader.result;
          finishSubmit();
        };
        reader.readAsDataURL(file);
      } else {
        finishSubmit();
      }
    }

  
    function getRegisteredUsers() {
      return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    }

    function saveRegisteredUsers(users) {
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    }

    function handleLogin(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim().toLowerCase();
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');
      errorEl.textContent = '';

      // Resident login — must already be registered
      const users = getRegisteredUsers();
      const account = users.find(u => u.email === email);

      if (!account) {
        errorEl.textContent = "We couldn't find an account with that email. Please sign up first.";
        return;
      }
      if (account.password !== password) {
        errorEl.textContent = 'Incorrect password. Please try again.';
        return;
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', 'Resident');
      localStorage.setItem('userName', account.name);

      updateNavbar(true, account.name);
      showPage('profile');
      updateProfileUI(account.name);
      e.target.reset();
    }

    function handleSignup(e) {
      e.preventDefault();
      const errorEl = document.getElementById('signup-error');
      errorEl.textContent = '';

      const firstName = document.getElementById('signup-firstname').value.trim();
      const lastName = document.getElementById('signup-lastname').value.trim();
      const email = document.getElementById('signup-email').value.trim().toLowerCase();
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm').value;

      if (password !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match.';
        return;
      }

      const users = getRegisteredUsers();
      if (users.some(u => u.email === email)) {
        errorEl.textContent = 'An account with this email already exists. Try logging in instead.';
        return;
      }

      users.push({
        firstName,
        lastName,
        email,
        password,
        name: `${firstName} ${lastName}`.trim()
      });
      saveRegisteredUsers(users);

      alert('Account created! You can now log in.');
      e.target.reset();
      document.getElementById('login-email').value = email;
      switchAuth('login');
    }

    function switchAuth(mode) {
      const loginForm = document.getElementById('login-form');
      const signupForm = document.getElementById('signup-form');
      const tabLogin = document.getElementById('tab-login');
      const tabSignup = document.getElementById('tab-signup');
      document.getElementById('login-error').textContent = '';
      document.getElementById('signup-error').textContent = '';

      if (mode === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
      } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        tabLogin.classList.remove('active');
        tabSignup.classList.add('active');
      }
    }

    function updateNavbar(isLoggedIn, userName) {
      const loginBtn = document.getElementById('nav-login-btn');
      const navUser = document.getElementById('nav-user');
      const navUserName = document.getElementById('nav-user-name');
      const navLoginLink = document.getElementById('nav-login-link');
      const navProfileLink = document.getElementById('nav-profile-link');

      if (isLoggedIn) {
        loginBtn.style.display = 'none';
        navUser.classList.add('visible');
        navUserName.textContent = userName || 'Resident';
        if (navLoginLink) navLoginLink.style.display = 'none';
        if (navProfileLink) navProfileLink.style.display = 'inline';
      } else {
        loginBtn.style.display = 'inline-block';
        navUser.classList.remove('visible');
        if (navLoginLink) navLoginLink.style.display = 'inline';
        if (navProfileLink) navProfileLink.style.display = 'none';
      }
    }

    function updateProfileUI(name) {
      const nameEl = document.getElementById('profile-fullname');
      const avatarEl = document.getElementById('profile-avatar');
      if (nameEl) nameEl.textContent = name;
      if (avatarEl) {
        const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        avatarEl.textContent = initials || 'R';
      }
    }

    function handleLogout() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      updateNavbar(false);
      showPage('home');
    }

    
    (function() {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('userName') || 'Resident';

      if (isLoggedIn) {
        if (role === 'Staff Account') {
          // Admin was logged in → send to dashboard
          window.location.href = 'dashboard.html';
          return;
        }
  
        updateNavbar(true, name);
        updateProfileUI(name);
        showPage('profile');
      } else {
        updateNavbar(false);
        if (window.location.hash === '#login') {
          showPage('login');
        }
      }
    })();