const Workspace = document.querySelector('.Workspace');
const roomInfo = document.querySelector('.room-info');
const input = document.getElementById('imageUrlInput');
const preview = document.getElementById('previewImage');
const addWorker = document.getElementById('add');
const form = document.getElementById('Add-Form');
const AddExpArea = document.querySelector('.add-Exp');
const SaveWorker = document.getElementById('Save-Worker');
const Cancel = document.getElementById('Cancel');
const AddExp = document.getElementById('Add-Exp');
const AddClose = document.getElementById('AddClose');
const backdrop = document.querySelector('.backdrop');
const profileDrop = document.querySelector('.Profile-Drop');
const assignModal = document.querySelector('.Asign-Passagers');
const closeAssign = document.querySelector('.close-Btn');

let SelectedItem = null;  
let currentRoom = null;  
let assignedWorkers = {};

// workerscounter
function countWorkersInRoom(roomId) {
    let count = 0;
    for (let workerIndex in assignedWorkers) {
        if (assignedWorkers[workerIndex] === roomId) {
            count++;
        }
    }
    return count;
}

//..full-Checker
function checkIfRoomIsFull(roomId) {
    const currentWorkers = countWorkersInRoom(roomId);
    const maxWorkers = roomCapacity[roomId];
    return currentWorkers >= maxWorkers;
}

//..capacity.NUmber
function updateCapacityDisplay() {
    for (let roomId in roomCapacity) {
        const room = document.getElementById(roomId);
        const currentWorkers = countWorkersInRoom(roomId);
        const maxWorkers = roomCapacity[roomId];
        
        const oldDisplay = room.querySelector('.room-capacity');
        if (oldDisplay) {
            oldDisplay.remove();
        }
        
        const capacityDisplay = document.createElement('div');
        capacityDisplay.className = 'room-capacity';
        capacityDisplay.textContent = `${currentWorkers}/${maxWorkers}`;
        room.appendChild(capacityDisplay);
        
        if (checkIfRoomIsFull(roomId)) {
            room.classList.add('room-full');
        } else {
            room.classList.remove('room-full');
        }
    }
}

//..update numbers
function updateHeaderStatistics() {
    const totalWorkersElement = document.getElementById('totalWorkers');
    const assignedWorkersElement = document.getElementById('assignedWorkers');
    
    if (totalWorkersElement) {
        totalWorkersElement.textContent = workers.length;
    }
    
    if (assignedWorkersElement) {
        const assignedCount = Object.keys(assignedWorkers).length;
        assignedWorkersElement.textContent = assignedCount;
    }
}

//..rooms Checker
function checkRequiredRooms() {
    requiredRooms.forEach(roomId => {
        const room = document.getElementById(roomId);
        const workersInRoom = countWorkersInRoom(roomId);
        
        if (workersInRoom === 0) {
            room.classList.add('required-empty');
        } else {
            room.classList.remove('required-empty');
        }
    });
}


//..Unassigned..Workers
function showUnassignedWorkers() {
    profileDrop.innerHTML = '';
    
    const unassignedWorkers = [];
    for (let i = 0; i < workers.length; i++) {
        if (!assignedWorkers[i]) {
            unassignedWorkers.push({worker: workers[i], index: i});
        }
    }
    
    if (unassignedWorkers.length === 0) {
        profileDrop.innerHTML = '<div class="N-Staff">No Unassigned Staff</div>';
        return;
    }
    
    unassignedWorkers.forEach(item => {
        const worker = item.worker;
        const index = item.index;
        
        const card = createWorkerCard(worker, index);
        profileDrop.appendChild(card);
    });
    
    updateHeaderStatistics();
}

//..workercard InnerHTML
function createWorkerCard(worker, index) {
    const card = document.createElement('div');
    card.className = 'passenger-profile';
    card.dataset.index = index;
    
    const roleColor = roleColors[worker.role] || roleColors['other'];
    card.style.backgroundColor = roleColor;
    
    card.innerHTML = `
        <img id="Profile-Img" src="${worker.imageUrl}" alt="Profile img">
        <div class="Profile">
            <div class="Profile-Text">
                <div style="display: flex;align-items:center;gap:.2rem;">
                    <span class="left-text">USERNAME:</span>
                    <h4>${worker.firstName} ${worker.lastName}</h4>
                </div>
            </div>
            <div class="Profile-Role">
                <span class="left-text">ROLE:</span>
                <h4 class="role">${getRoleName(worker.role)}</h4>
            </div>
        </div>
        <div id="removeBtn" data-index="${index}">remove</div>
    `;
    
    card.addEventListener('click', (e) => {
        if (e.target.id !== 'removeBtn') {
            showWorkerDetails(index);
        }
    });
    
    const removeBtn = card.querySelector('#removeBtn');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteWorker(index);
    });
    
    return card;
}

function getRoleName(role) {
    const roleNames = {
        'receptionist': 'Receptionist',
        'it_technician': 'IT Technician',
        'security_agent': 'Security Agent',
        'manager': 'Manager',
        'cleaning': 'Cleaner',
        'other': 'Other'
    };
    return roleNames[role] || role;
}


//..Show qualified
function showQualifiedWorkersForRoom(roomId) {
    const list = document.querySelector('.Qualified-Workers');
    list.innerHTML = '';

    if (checkIfRoomIsFull(roomId)) {
        list.innerHTML = `<div class="N-Staff" style="color: white;">Room is at maximum capacity (${roomCapacity[roomId]})</div>`;
        return;
    }
    
    
    const qualifiedWorkers = [];
    for (let i = 0; i < workers.length; i++) {
        const worker = workers[i];
        const canAccessRoom = roomAccess[roomId].includes(worker.role);
        const isNotAssigned = !assignedWorkers[i];
        
        if (canAccessRoom && isNotAssigned) {
            qualifiedWorkers.push({worker: worker, index: i});
        }
    }
    if (qualifiedWorkers.length === 0) {
        list.innerHTML = '<div class="N-Staff" style="color: white;">No workers available</div>';
        return;
    }
    

    const currentWorkers = countWorkersInRoom(roomId);
    const availableSpots = roomCapacity[roomId] - currentWorkers;
    const headerDiv = document.createElement('div');
    headerDiv.style.color = 'white';
    headerDiv.style.marginBottom = '10px';
    headerDiv.style.fontWeight = 'bold';
    headerDiv.textContent = `Available spots: ${availableSpots}`;
    list.appendChild(headerDiv);
    
    qualifiedWorkers.forEach(item => {
        const worker = item.worker;
        const index = item.index;
        const card = createQualifiedWorkerCard(worker, index);
        list.appendChild(card);
    });
}

//..QualifiedCArd
function createQualifiedWorkerCard(worker, index) {
    const card = document.createElement('div');
    card.className = 'user-Qualified';
    card.style.backgroundColor = roleColors[worker.role];
    
    card.innerHTML = `
        <img id="Profile-Img" src="${worker.imageUrl}" alt="">
        <div style="display: flex;flex-direction: column;">
            <div class="Profile-Text">
                <div style="display: flex;align-items:center;gap:.2rem;">
                    <span class="left-text">USERNAME:</span>
                    <h4>${worker.firstName} ${worker.lastName}</h4>
                </div>
            </div>
            <div class="Profile-Role">
                <span class="left-text">ROLE:</span>
                <h4 class="role">${worker.role}</h4>
            </div>
        </div>
        <div id="asign" data-index="${index}">assign</div>
    `;
    
    const assignBtn = card.querySelector('#asign');
    assignBtn.addEventListener('click', () => {
        assignWorkerToRoom(index, currentRoom);
    });
    
    return card;
}

function assignWorkerToRoom(workerIndex, roomId) {
    if (checkIfRoomIsFull(roomId)) {
        alert(`Cannot assign worker. ${roomId} is at maximum capacity.`);
        return;
    }
    
    const worker = workers[workerIndex];
    const room = document.getElementById(roomId);
    
    const workerImage = document.createElement('img');
    workerImage.src = worker.imageUrl;
    workerImage.className = 'assigned-worker-img';
    workerImage.dataset.workerIndex = workerIndex;
    workerImage.title = worker.firstName + ' ' + worker.lastName;
    
    workerImage.addEventListener('click', (e) => {
        e.stopPropagation();
        removeWorkerFromRoom(workerIndex);
    });
    
    room.appendChild(workerImage);
    
    assignedWorkers[workerIndex] = roomId;
    
    showQualifiedWorkersForRoom(roomId);
    showUnassignedWorkers();
    checkRequiredRooms();
    updateCapacityDisplay();
    updateHeaderStatistics();
}
//..removeWork..formroom

function removeWorkerFromRoom(workerIndex) {
    const worker = workers[workerIndex];
    const roomId = assignedWorkers[workerIndex];
    
    const confirmRemove = confirm(`Remove ${worker.firstName} ${worker.lastName} from ${roomId}?`);
    
    if (confirmRemove) {
        const room = document.getElementById(roomId);
        const workerImage = room.querySelector(`[data-worker-index="${workerIndex}"]`);
        if (workerImage) {
            workerImage.remove();
        }
        delete assignedWorkers[workerIndex];
        showUnassignedWorkers();
        if (currentRoom) {
            showQualifiedWorkersForRoom(currentRoom);
        }
        checkRequiredRooms();
        updateCapacityDisplay();
        updateHeaderStatistics();
    }
}

//..worker..info
function showWorkerDetails(workerIndex) {
    const worker = workers[workerIndex];
    const modal = document.getElementById('workerDetailModal');
    
    const location = assignedWorkers[workerIndex] || 'Unassigned';
    
    let experiencesHTML = '';
    if (worker.experiences && worker.experiences.length > 0) {
        worker.experiences.forEach(exp => {
            experiencesHTML += `
                <div class="experience-item">
                    <strong>${exp.company}</strong> - ${getRoleName(exp.role)}<br>
                    <small>${exp.from} to ${exp.to}</small>
                </div>
            `;
        });
    } else {
        experiencesHTML = '<div class="experience-item">No experience recorded</div>';
    }
    
    modal.innerHTML = `
        <div class="worker-detail-header">
            <img src="${worker.imageUrl}" alt="${worker.firstName}" class="worker-detail-img">
            <div class="worker-detail-info">
                <h2>${worker.firstName} ${worker.lastName}</h2>
                <p><strong>Role:</strong> ${getRoleName(worker.role)}</p>
                <p><strong>Location:</strong> ${location}</p>
            </div>
        </div>
        <div class="worker-detail-body">
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span>${worker.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span>${worker.phone}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Experience:</span>
            </div>
            ${experiencesHTML}
            <button class="close-detail-btn" onclick="closeWorkerDetail()">Close</button>
        </div>
    `;
    
    modal.classList.add('show');
    backdrop.style.display = 'block';
}

function closeWorkerDetail() {
    const modal = document.getElementById('workerDetailModal');
    modal.classList.remove('show');
    backdrop.style.display = 'none';
}


function deleteWorker(workerIndex) {
    const confirmDelete = confirm('Are you sure you want to remove this worker?');
    
    if (confirmDelete) {
        if (assignedWorkers[workerIndex]) {
            const roomId = assignedWorkers[workerIndex];
            const room = document.getElementById(roomId);
            const workerImage = room.querySelector(`[data-worker-index="${workerIndex}"]`);
            if (workerImage) {
                workerImage.remove();
            }
        }
        
        workers.splice(workerIndex, 1);
        
        const newAssignedWorkers = {};
        for (let key in assignedWorkers) {
            const index = parseInt(key);
            if (index < workerIndex) {
                newAssignedWorkers[index] = assignedWorkers[index];
            } else if (index > workerIndex) {
                newAssignedWorkers[index - 1] = assignedWorkers[index];
            }
        }
        assignedWorkers = newAssignedWorkers;

        showUnassignedWorkers();
        if (currentRoom) {
            showQualifiedWorkersForRoom(currentRoom);
        }
        checkRequiredRooms();
        updateCapacityDisplay();
        updateHeaderStatistics();
    }
}

//..img preview

function updateImagePreview() {
    if (input.value.trim() !== "") {
        preview.src = input.value;
    } else {
        preview.src = "images/Default_pfp.jpg";
    }
}
updateImagePreview();
input.addEventListener('input', updateImagePreview);


AddExp.addEventListener('click', () => {
    AddExpArea.style.display = 'flex';
});

AddClose.addEventListener('click', () => {
    AddExpArea.style.display = 'none';
});

Cancel.addEventListener('click', () => {
    form.style.display = "none";
    backdrop.style.display = "none";
    AddExpArea.style.display = "none";
    preview.src = "images/Default_pfp.jpg";
});

addWorker.addEventListener('click', (e) => {
    e.preventDefault();
    form.style.display = "flex";
    backdrop.style.display = "block";
});

//..backdrop event
backdrop.addEventListener('click', () => {
    form.style.display = "none";
    backdrop.style.display = "none";
    AddExpArea.style.display = "none";
    assignModal.style.display = "none";
    preview.src = "images/Default_pfp.jpg";
    currentRoom = null;
    closeWorkerDetail();
});

//..selection
Workspace.addEventListener('click', (e) => {
    const clicked = e.target;
    if (clicked === Workspace) return;
    
    let room = clicked;
    if (!room.id || !roomDescriptions[room.id]) {
        room = clicked.closest('.Workspace > div');
        if (!room) return;
    }
    
    if (SelectedItem) {
        SelectedItem.classList.remove('Selected');
    }
    
    SelectedItem = room;
    SelectedItem.classList.add('Selected');
    
    const currentWorkers = countWorkersInRoom(room.id);
    const maxWorkers = roomCapacity[room.id];
    roomInfo.textContent = `${roomDescriptions[room.id]} (${currentWorkers}/${maxWorkers})`;
});

//..asing
const plusButtons = document.querySelectorAll('.add-list-img');
plusButtons.forEach(img => {
    img.addEventListener('click', (e) => {
        e.stopPropagation();
        const room = e.target.closest('.Workspace > div');
        
        if (room && room.id) {
            currentRoom = room.id;
            
            if (checkIfRoomIsFull(currentRoom)) {
                alert(`${currentRoom} is at maximum capacity.`);
                return;
            }
            
            showQualifiedWorkersForRoom(currentRoom);
            assignModal.style.display = 'flex';
            backdrop.style.display = 'block';
            
            const title = document.querySelector('.Asign-title');
            const currentWorkers = countWorkersInRoom(currentRoom);
            title.textContent = `Assign to ${currentRoom} (${currentWorkers}/${roomCapacity[currentRoom]}):`;
        }
    });
});
closeAssign.addEventListener('click', () => {
    assignModal.style.display = 'none';
    backdrop.style.display = 'none';
    currentRoom = null;
});

//..show
function showError(input, message) {
    const parent = input.parentElement;
    const error = parent.querySelector('.Error');
    if (error) {
        error.textContent = message;
        error.style.display = 'block';
    }
}

//..hide
function hideError(input) {
    const parent = input.parentElement;
    const error = parent.querySelector('.Error');
    if (error) {
        error.textContent = '';
        error.style.display = 'none';
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\+212[5-7]\d{8}$/.test(phone);
}

function isValidName(name) {
    return /^([A-Za-z\s]{3,})$/.test(name.trim());
}

// Validation
function validateForm() {
    let isValid = true;
    
    const firstName = document.getElementById('fName');
    const lastName = document.getElementById('lName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const company = document.querySelectorAll('.company')[0];
    const dateInputs = document.querySelectorAll('.date-p input[type="date"]');
    const fromDate = dateInputs[0];
    const toDate = dateInputs[1];
    
    // first name
    if (!firstName.value.trim()) {
        showError(firstName, 'First name required');
        isValid = false;
    } else if (!isValidName(firstName.value)) {
        showError(firstName, 'At least 3 letters');
        isValid = false;
    } else {
        hideError(firstName);
    }
    
    // last name
    if (!lastName.value.trim()) {
        showError(lastName, 'Last name required');
        isValid = false;
    } else if (!isValidName(lastName.value)) {
        showError(lastName, 'At least 3 letters');
        isValid = false;
    } else {
        hideError(lastName);
    }
    
    // email
    if (!email.value.trim()) {
        showError(email, 'Email required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, 'Invalid email');
        isValid = false;
    } else {
        hideError(email);
    }
    
    // phone
    if (!phone.value.trim()) {
        showError(phone, 'Phone required');
        isValid = false;
    } else if (!isValidPhone(phone.value)) {
        showError(phone, 'Must be +212 followed by 9 digits');
        isValid = false;
    } else {
        hideError(phone);
    }
    
    // company
    if (!company.value.trim()) {
        showError(company, 'Company required');
        isValid = false;
    } else if (!isValidName(company.value)) {
        showError(company, 'Letters only');
        isValid = false;
    } else {
        hideError(company);
    }
    
    // date
    if (!fromDate.value) {
        showError(fromDate, 'From date required');
        isValid = false;
    } else {
        hideError(fromDate);
    }
    
    if (!toDate.value) {
        showError(toDate, 'To date required');
        isValid = false;
    } else if (fromDate.value && new Date(fromDate.value) >= new Date(toDate.value)) {
        showError(toDate, 'To date must be after From date');
        isValid = false;
    } else {
        hideError(toDate);
    }
    
    return isValid;
}

//..Save Worker
SaveWorker.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        const firstName = document.getElementById('fName').value.trim();
        const lastName = document.getElementById('lName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const role = document.getElementById('role').value;
        const imageUrl = document.getElementById('imageUrlInput').value.trim() || 'images/Default_pfp.jpg';
        const experiences = [];
        const company1 = document.querySelectorAll('.company')[0];
        const role1 = document.querySelectorAll('select[name="role"]')[1];
        const dateInputs1 = document.querySelectorAll('.date-p input[type="date"]');
        
        if (company1.value.trim()) {
            experiences.push({
                company: company1.value.trim(),
                role: role1.value,
                from: dateInputs1[0].value,
                to: dateInputs1[1].value
            });
        }
        
        if (AddExpArea.style.display === 'flex') {
            const company2 = AddExpArea.querySelector('.company');
            const role2 = AddExpArea.querySelector('select[name="role"]');
            const dateInputs2 = AddExpArea.querySelectorAll('input[type="date"]');
            
            if (company2.value.trim()) {
                experiences.push({
                    company: company2.value.trim(),
                    role: role2.value,
                    from: dateInputs2[0].value,
                    to: dateInputs2[1].value
                });
            }
        }
        
        const newWorker = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            role: role,
            imageUrl: imageUrl,
            experiences: experiences
        };
        
        workers.push(newWorker);
        alert('Worker saved successfully!');
        form.reset();
        form.style.display = "none";
        backdrop.style.display = "none";
        AddExpArea.style.display = "none";
        updateImagePreview();
        
        showUnassignedWorkers();
    }
});


showUnassignedWorkers();
updateCapacityDisplay();