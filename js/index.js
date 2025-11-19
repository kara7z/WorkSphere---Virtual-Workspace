const Workspace = document.querySelector('.Workspace');
const roomInfo = document.querySelector('.room-info');
const input = document.getElementById('imageUrlInput');
const preview = document.getElementById('previewImage');
const addWorker = document.getElementById('add');
const form = document.getElementById('Add-Form');
const SaveWorker = document.getElementById('Save-Worker');
const Cancel = document.getElementById('Cancel');
let SelectedItem = null;


const roomDescriptions = {
    Conference: "Meeting room for discussions and presentations.",
    Reception: "Entrance area where visitors are welcomed.",
    Server: "Secured room that holds servers and network equipment.",
    Security: "Room where security monitors cameras and controls access.",
    Staff: "Break room for employees to rest and eat.",
    Archives: "Storage room for important files and documents."
};
// img preview
function updatePreview() {
    if (input.value.trim() !== "") {
        preview.src = input.value;
    } else {
        preview.src = ""; 
    }
}
updatePreview();
Cancel.addEventListener('click',(e)=>{
    e.preventDefault()
    form.style.display ="none";
})
addWorker.addEventListener('click',(e)=>{
    e.preventDefault()
    form.style.display ="flex";
})
input.addEventListener('input', updatePreview);

Workspace.addEventListener('click', (e) => {
    const clicked = e.target;

    if (clicked === Workspace) return;

    if (SelectedItem) {
        SelectedItem.classList.remove('Selected');
    }

    SelectedItem = clicked;
    SelectedItem.classList.add('Selected');

    roomInfo.textContent =roomDescriptions[clicked.id];
});