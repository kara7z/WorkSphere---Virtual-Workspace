const Workspace = document.querySelector('.Workspace');
const roomInfo = document.querySelector('.room-info');
const input = document.getElementById('imageUrlInput');
const preview = document.getElementById('previewImage');
const addWorker = document.getElementById('add');
const form = document.getElementById('Add-Form');
const AddExpArea = document.querySelector('.add-Exp')
const SaveWorker = document.getElementById('Save-Worker');
const Cancel = document.getElementById('Cancel');
const AddExp = document.getElementById('Add-Exp');
const AddClose = document.getElementById('AddClose');
const backdrop = document.querySelector('.backdrop');
const profileDrop = document.querySelector('.Profile-Drop');
let SelectedItem = null;


const roleColors = {
    'receptionist': '#2ecc71',    
    'it_technician': '#e74c3c',   
    'security_agent': '#f1c40f', 
    'manager': '#9b59b6',         
    'cleaning': '#3498db',        
    'other': '#95a5a6'           
};

const roomDescriptions = {
    Conference: "Meeting room for discussions and presentations.",
    Reception: "Entrance area where visitors are welcomed.",
    Server: "Secured room that holds servers and network equipment.",
    Security: "Room where security monitors cameras and controls access.",
    Staff: "Break room for employees to rest and eat.",
    Archives: "Storage room for important files and documents."
};

function displayWorkers() {
    profileDrop.innerHTML = '';
    if (workers.length === 0) {
        profileDrop.innerHTML += '<div class="N-Staff">Unassigned Staff</div>';
        return;
    }
    
    workers.forEach((worker, index) => {
        const profileCard = document.createElement('div');
        profileCard.className = 'passenger-profile';
        profileCard.dataset.index = index;
        
        const roleColor = roleColors[worker.role] || roleColors['other'];
        profileCard.style.backgroundColor = roleColor;
        
        const roleNames = {
            'receptionist': 'Receptionist',
            'it_technician': 'IT Technician',
            'security_agent': 'Security Agent',
            'manager': 'Manager',
            'cleaning': 'Cleaner',
            'other': 'Other'
        };
        
        profileCard.innerHTML = `
            <img id="Profile-Img" src="${worker.imageUrl}" alt="Profile img">
            <div class="Profile">
                <div class="Profile-Text">
                    <div style="display: flex;gap:.2rem;">
                        <span class="left-text">USERNAME:</span>
                        <h4>${worker.firstName}</h4>
                        <h4>${worker.lastName}</h4>
                    </div>
                </div>
                <div class="Profile-Role">
                    <span class="left-text">ROLE:</span>
                    <h4 class="role">${roleNames[worker.role] || worker.role}</h4>
                </div>
            </div>
            <div id="removeBtn" data-index="${index}">remove</div>
        `;
        
        profileDrop.appendChild(profileCard);
    });
    
    const removeButtons = profileDrop.querySelectorAll('#removeBtn');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeWorker(index);
        });
    });
}

// remove a worker
function removeWorker(index) {
    if (confirm('Are you sure you want to remove this worker?')) {
        workers.splice(index, 1);
        displayWorkers();
        console.log('Worker removed. Remaining workers:', workers);
    }
}

// img preview
function updatePreview() {
    if (input.value.trim() !== "") {
        preview.src = input.value;
    } else {
        preview.src = "images/Default_pfp.jpg";
    }
}
updatePreview();

function EventHide(e, area) {
    e.addEventListener('click', () => {
        area.style.display = 'none'
    })
}

function EventShow(e, area) {
    e.addEventListener('click', () => {
        area.style.display = 'flex';
    })
}
EventHide(AddClose, AddExpArea);
EventShow(AddExp, AddExpArea);

Cancel.addEventListener('click', () => {
    form.style.display = "none";
    backdrop.style.display = "none";
    AddExpArea.style.display = "none";
    preview.src = "images/Default_pfp.jpg";
})

addWorker.addEventListener('click', (e) => {
    e.preventDefault();
    form.style.display = "flex";
    backdrop.style.display = "block"
    document.body.classList.add('modal-open');
})

backdrop.addEventListener('click', () => {
    form.style.display = "none";
    backdrop.style.display = "none";
    AddExpArea.style.display = "none";
    preview.src = "images/Default_pfp.jpg";
});

input.addEventListener('input', updatePreview);

Workspace.addEventListener('click', (e) => {
    const clicked = e.target;

    if (clicked === Workspace) return;

    if (SelectedItem) {
        SelectedItem.classList.remove('Selected');
    }

    SelectedItem = clicked;
    SelectedItem.classList.add('Selected');

    roomInfo.textContent = roomDescriptions[clicked.id];
});

// Set error
const setError = (input, msg) => {
    const control = input.parentElement;
    const error = control.querySelector('.Error');
    if (error) {
        error.textContent = msg;
        error.style.display = 'block';
    }
    control.classList.add('error');
    control.classList.remove('success');
};

// Set success
const setSuccess = (input) => {
    const control = input.parentElement;
    const error = control.querySelector('.Error');
    if (error) {
        error.textContent = '';
        error.style.display = 'none';
    }
    control.classList.remove('error');
};

const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
const isPhone = (val) => /^\+212[5-7]\d{8}$/.test(val);
const isAlpha = (val) => /^([A-Za-z\s]{3,})$/.test(val.trim());

// Validation
const validateForm = () => {
    let valid = true;

    const fName = document.getElementById(`fName`);
    const lName = document.getElementById(`lName`);
    const email = document.getElementById(`email`);
    const phone = document.getElementById(`phone`);

    const companies = document.querySelectorAll('.company');

    const dateInputs1 = document.querySelectorAll('.date-p input[type="date"]');
    const fromDate1 = dateInputs1[0];
    const toDate1 = dateInputs1[1];

    // First Name
    const fNameVal = fName.value.trim();
    if (!fNameVal) {
        setError(fName, 'First name required');
        valid = false;
    } else if (!isAlpha(fNameVal)) {
        setError(fName, 'At least 3 letters');
        valid = false;
    } else {
        setSuccess(fName);
    }

    // Last Name
    const lNameVal = lName.value.trim();
    if (!lNameVal) {
        setError(lName, 'Last name required');
        valid = false;
    } else if (!isAlpha(lNameVal)) {
        setError(lName, 'At least 3 letters');
        valid = false;
    } else {
        setSuccess(lName);
    }

    // Email
    if (!email.value.trim()) {
        setError(email, 'Email required');
        valid = false;
    } else if (!isEmail(email.value)) {
        setError(email, 'Invalid email');
        valid = false;
    } else setSuccess(email);

    // Phone
    if (!phone.value.trim()) {
        setError(phone, 'Phone required');
        valid = false;
    } else if (!isPhone(phone.value)) {
        setError(phone, 'it must be +212 followed by 9 digits ');
        valid = false;
    } else setSuccess(phone);

    const firstCompany = companies[0];
    const firstCompanyVal = firstCompany.value.trim();

    if (!firstCompanyVal) {
        setError(firstCompany, 'First experience company is required');
        valid = false;
    } else if (!isAlpha(firstCompanyVal)) {
        setError(firstCompany, 'Company must be letters only');
        valid = false;
    } else {
        setSuccess(firstCompany);
    }

    if (!fromDate1.value) {
        setError(fromDate1, 'From date required');
        valid = false;
    } else {
        setSuccess(fromDate1);
    }

    if (!toDate1.value) {
        setError(toDate1, 'To date required');
        valid = false;
    } else {
        setSuccess(toDate1);
    }

   
    if (fromDate1.value && toDate1.value) {
        const from = new Date(fromDate1.value);
        const to = new Date(toDate1.value);

        if (from >= to) {
            setError(toDate1, 'To date must be after From date');
            valid = false;
        } else {
            setSuccess(toDate1);
        }
    }

    
    if (companies[1]) {
        const secondCompanyVal = companies[1].value.trim();
        if (secondCompanyVal && !isAlpha(secondCompanyVal)) {
            setError(companies[1], 'Company must be letters only');
            valid = false;
        } else if (secondCompanyVal) {
            setSuccess(companies[1]);

            
            const addExpSection = document.querySelector('.add-Exp');
            if (addExpSection && addExpSection.style.display === 'flex') {
                const dateInputs2 = addExpSection.querySelectorAll('input[type="date"]');
                const fromDate2 = dateInputs2[0];
                const toDate2 = dateInputs2[1];

                if (fromDate2.value && toDate2.value) {
                    const from2 = new Date(fromDate2.value);
                    const to2 = new Date(toDate2.value);

                    if (from2 >= to2) {
                        setError(toDate2, 'To date must be after From date');
                        valid = false;
                    }
                }
            }
        }
    }

    return valid;
};

SaveWorker.addEventListener('click', (e) => {
    e.preventDefault();
    if (validateForm()) {
        const fName = document.getElementById('fName').value.trim();
        const lName = document.getElementById('lName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const role = document.getElementById('role').value;
        const imageUrl = document.getElementById('imageUrlInput').value.trim() || 'images/Default_pfp.jpg';

        
        const experiences = [];

        // Get first experience
        const company1 = document.querySelectorAll('.company')[0];
        const role1 = document.querySelectorAll('select[name="role"]')[1];
        const dateInputs1 = document.querySelectorAll('.date-p input[type="date"]');

        if (company1 && company1.value.trim()) {
            experiences.push({
                company: company1.value.trim(),
                role: role1 ? role1.value : '',
                from: dateInputs1[0] ? dateInputs1[0].value : '',
                to: dateInputs1[1] ? dateInputs1[1].value : ''
            });
        }

        // Get second experience if exists
        const addExpSection = document.querySelector('.add-Exp');
        if (addExpSection && addExpSection.style.display === 'flex') {
            const company2 = addExpSection.querySelector('.company');
            const role2 = addExpSection.querySelector('select[name="role"]');
            const dateInputs2 = addExpSection.querySelectorAll('input[type="date"]');

            if (company2 && company2.value.trim()) {
                experiences.push({
                    company: company2.value.trim(),
                    role: role2 ? role2.value : '',
                    from: dateInputs2[0] ? dateInputs2[0].value : '',
                    to: dateInputs2[1] ? dateInputs2[1].value : ''
                });
            }
        }

        const worker = {
            firstName: fName,
            lastName: lName,
            email: email,
            phone: phone,
            role: role,
            imageUrl: imageUrl,
            experiences: experiences
        };

        
        workers.push(worker);

        alert('Worker saved successfully!');
        console.log('All workers:', workers);

    
        displayWorkers();

        
        form.reset();
        form.style.display = "none";
        backdrop.style.display = "none";
        document.body.classList.remove('modal-open');
        AddExpArea.style.display = "none";
        updatePreview();
    }
    else {
        console.log('Form has errors. Please fix them.');
    }
});

displayWorkers();