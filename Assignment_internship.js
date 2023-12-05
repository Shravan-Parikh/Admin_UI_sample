
// making a global variable for API
const apiUrl = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

let sampleData = [];

let currentPage = 1;
const rowsPerPage = 10;


// fetching API

function fetchData() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      sampleData = data;
      renderTableRows(sampleData.slice(0, rowsPerPage));
      renderPagination(Math.ceil(sampleData.length / rowsPerPage));
    })
    .catch(error => console.error('Error fetching data:', error));
}

//rendering table rows

function renderTableRows(data) {
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  data.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" class="select-checkbox" onchange="toggleRowSelection(this)"></td>
      <td>${user.id}</td>
      <td class="edit-mode" contenteditable="false">${user.email}</td>
      <td class="edit-mode" contenteditable="false">${user.name}</td>
      <td class="edit-mode" contenteditable="false">${user.role}</td>
      <td>
        <button class="edit-button" onclick="editRow(this)">Edit</button>
        <button class="delete-button" onclick="deleteRow(this)">🗑️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

//Pagination

function renderPagination(totalPages) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const firstPagebutton = document.createElement('button');
  firstPagebutton.innerText = "<<";
  firstPagebutton.onclick = () => goToPage(1);
  pagination.appendChild(firstPagebutton);

  const PrevPagebutton = document.createElement('button');
  PrevPagebutton.innerText = "<";
  PrevPagebutton.onclick = () => goToPage(currentPage - 1);
  // PrevPagebutton.disabled = currentPage === 1 ;
  pagination.appendChild(PrevPagebutton);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.onclick = () => goToPage(i);
    pagination.appendChild(button);
  }

  const NextPagebutton = document.createElement('button');
  NextPagebutton.innerText = ">";
  NextPagebutton.onclick = () => goToPage(currentPage + 1);
  NextPagebutton.disabled = currentPage === totalPages;
  pagination.appendChild(NextPagebutton);

  const lastPagebutton = document.createElement('button');
  lastPagebutton.innerText = ">>";
  lastPagebutton.onclick = () => goToPage(totalPages);
  pagination.appendChild(lastPagebutton);
}


//Searching functions

function searchOnEnter(event) {
 if (event.key === 'Enter') {
  search();
}
}
function search() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filteredData = sampleData.filter(user =>
    Object.values(user).some(value => value.toString().toLowerCase().includes(searchTerm))
  );
  renderTableRows(filteredData);
  renderPagination(Math.ceil(filteredData.length / rowsPerPage));
}


function goToPage(page) {
  currentPage = page;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = sampleData.slice(startIndex, endIndex);
  renderTableRows(paginatedData);
}

//check box and functionality

function toggleRowSelection(checkbox) {
  const row = checkbox.closest('tr');
  row.classList.toggle('selected', checkbox.checked);
}


function selectAll() {
  const checkboxes = document.querySelectorAll('.select-checkbox');
  checkboxes.forEach(checkbox => checkbox.checked = event.target.checked);
}

// all the delete functions

function deleteSelected() {
  const selectedRows = document.querySelectorAll('.select-checkbox:checked');
  selectedRows.forEach(row => row.closest('tr').remove());
}


function deleteAll() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
}


function deleteRow(button) {
    const row = button.closest('tr');
    row.remove();

}

function editRow(button) {
const row = button.closest('tr');
const editableCells = row.querySelectorAll('.edit-mode');

editableCells.forEach(cell => {
    cell.contentEditable = !cell.isContentEditable;
    if (cell.isContentEditable) {
    cell.focus();
        }
    });
}


fetchData();