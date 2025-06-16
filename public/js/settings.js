
const form = document.querySelector(".user-form");
const modalOverlay = document.querySelector(".modal-overlay");
const addUserBtn  = document.querySelector(".add-user-btn");
const closeModal = document.querySelector(".close-modal");
const statusMessage = document.querySelector(".status-message");
const loader = document.querySelector('.loader');
const loaderWrapper = document.querySelector('#loaderWrapper');
const usersContainer = document.querySelector(".users-containter");

function showLoader() {
  loaderWrapper.classList.remove('hidden');
}

function hideLoader() {
  loaderWrapper.classList.add('hidden');
}

document.addEventListener("DOMContentLoaded",async() => {
    try {
        const response = await fetch("/user/get-allUsers");
        const data = await response.json()
        if(data.success) {
          renderUsers(data.data)
        }else {
          usersContainer.innerHTML = '<p style="color:red;">Failed to load orders.</p>' 
        }
    } catch (error) {
        usersContainer.innerHTML = '<p style="color:red;">Failed to load orders.</p>'
    }
})

form.addEventListener("submit",async(e) => {
    e.preventDefault();

 statusMessage.classList.add('hidden');
  showLoader()

const userName = form.username.value.trim();
const password = form.password.value.trim();

if(!userName || !password) {
    showMessage('Please fill all fields correctly.', 'error');
    hideLoader()
    return;
}

try {
    const response = await fetch("/user/create-user",{
     method: "POST",
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({username: userName,password: password})
    })

     const data = await response.json();
    hideLoader()

    if(data.success) {
    modalOverlay.classList.remove("show")
     modalOverlay.classList.add("hidden")
       showMessage(data.message, 'success');
      form.reset();
      window.location.reload()
    }else {
         modalOverlay.classList.remove("show")
     modalOverlay.classList.add("hidden")
 showMessage(data.message || 'Something went wrong.', 'error');
    }
} catch (error) {
    modalOverlay.classList.remove("show")
    modalOverlay.classList.add("hidden")
     hideLoader()
    showMessage('Server error. Please try again.', 'error');
}
})

function renderUsers(users) {
  usersContainer.innerHTML = users.map((user,i) => {
    return `
    <div class="user" data-id="${user.id}">
  <div>
    <p>#${i + 1}</p>
  </div>
  <div>
    <p>${user.username}</p>
  </div>
  <div>
    <p>${user.userType}</p>
  </div>
  <div class="del-btn">
    <img src="/assets/delete.svg" alt="delete">
  </div>
</div>  
    `
  }).join('');
}

function showMessage(msg, type) {
  statusMessage.textContent = msg;
  statusMessage.className = `status-message ${type}`;
  statusMessage.classList.remove('hidden');
}

addUserBtn.addEventListener("click",() => {
    modalOverlay.classList.add("show");
    modalOverlay.classList.remove("hidden");
})

closeModal.addEventListener("click",() => {
    modalOverlay.classList.remove("show");
    modalOverlay.classList.add("hidden")
})

usersContainer.addEventListener("click",async(e) => {
   const target = e.target.closest("img");
  if (!target) return;

  const userDiv = target.closest(".user");
  const userId = userDiv?.dataset?.id; 

  if(target.alt == "delete") {
     if (confirm("Are you sure you want to delete this user?")) {
    try {
      showLoader();
      const response = await fetch(`/user/delete-user/${userId}`,{method: "DELETE"});
      if (!response.ok) throw new Error("Delete failed");
      window.location.reload()
    } catch (err) {
      hideLoader();
      showMessage(err.message || "something went wrong!","error");
    }
  }
  }

})