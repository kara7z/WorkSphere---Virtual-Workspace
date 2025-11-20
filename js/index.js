const Workspace = document.querySelector('.Workspace');
const roomInfo = document.querySelector('.room-info');
const input = document.getElementById('imageUrlInput');
const preview = document.getElementById('previewImage');
const addWorker = document.getElementById('add');
const form = document.getElementById('Add-Form');
const AddExpArea =document.querySelector('.add-Exp')
const SaveWorker = document.getElementById('Save-Worker');
const Cancel = document.getElementById('Cancel');
const AddExp = document.getElementById('Add-Exp');
const AddClose = document.getElementById('AddClose');
const backdrop = document.querySelector('.backdrop');
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
        preview.src = "images/Default_pfp.jpg"; 
    }
}
updatePreview();

function EventHide(e,area){
    e.addEventListener('click',()=>{
        area.style.display ='none'
    })
}
function EventShow(e,area){
    e.addEventListener('click',()=>{
        area.style.display ='flex';
    })
}
EventHide(AddClose,AddExpArea);
EventShow(AddExp,AddExpArea);


Cancel.addEventListener('click',()=>{
    form.style.display = "none";
    backdrop.style.display = "none";       
    document.body.classList.remove('modal-open');
    AddExpArea.style.display = "none";

})
addWorker.addEventListener('click',(e)=>{
    e.preventDefault();
    form.style.display ="flex";
    backdrop.style.display = "block"
    document.body.classList.add('modal-open');
})
backdrop.addEventListener('click', () => {
    form.style.display = "none";
    backdrop.style.display = "none";
    document.body.classList.remove('modal-open');
    AddExpArea.style.display = "none";
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

    roomInfo.textContent =roomDescriptions[clicked.id];
});
const array = [1,3,5,7,8]
const newArray= array.map((e)=>e*2).filter(e=>e>5)
console.log(newArray);