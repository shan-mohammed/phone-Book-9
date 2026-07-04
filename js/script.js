const contactForm = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");
const searchInput = document.getElementById("searchInput");
const cancelBtn =  document.getElementById("cancelBtn")

let contacts = [];

const saveContacts = () => {
  localStorage.setItem("contacts", JSON.stringify(contacts));
};

async function fetchContacts() {
  const storedContacts = localStorage.getItem("contacts");
  if (storedContacts) {
    contacts = JSON.parse(storedContacts);
    displayContacts(contacts);
    return;
  }
  // or
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }

    const data = await response.json();

    contacts = data.map((user) => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
    }));
    saveContacts(); //save API data to local storage
    displayContacts(contacts);
  } catch (error) {
    alert(error.message);
  }
}

// display contacts
const displayContacts = (contactArray) => {
  contactList.innerHTML = "";
  contactArray.forEach((contact) => {
    const li = document.createElement("li");
   li.innerHTML = `
  <div class="contact-card">
    <div>
      <strong>${contact.name}</strong><br>
      ${contact.phone}
    </div>

    <div class="actions">
      <button class="btn btn-warning btn-sm"
              onclick="editContact(${contact.id})">
        Edit
      </button>

      <button class="btn btn-danger btn-sm"
              onclick="deleteContact(${contact.id})">
        Delete
      </button>
    </div>
  </div>
`;
    contactList.appendChild(li);
  });
};

fetchContacts();

// Add new contacts
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("contactId").value;
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (name === "" || phone === "") {
    alert("Please fill all fields");
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
    alert("Enter a valid 10-digit number");
    return;
  }
  const exist = contacts.some((contact) => contact.phone === phone);
  if (id && exist) {
    alert("Phone number already exists");
    return;
  }
  if (id) {
    updateContact(Number(id), name, phone);
  } else {
    addContact(name, phone);
  }
});

const addContact = (name, phone) => {
  const newContact = {
    id: Date.now(),
    name,
    phone,
  };
  contacts.push(newContact);
  saveContacts();
  displayContacts(contacts);
  contactForm.reset();
};
// Edit contacts
function editContact(id) {
  const contact = contacts.find((c) => c.id === id);
  document.getElementById("contactId").value = contact.id;
  document.getElementById("name").value = contact.name;
  document.getElementById("phone").value = contact.phone;

  document.querySelector('button[type="submit"]').textContent =
    "Update Contact";

  // Scroll to the form
  document.getElementById("contactForm").scrollIntoView({
    behavior: "smooth",
     block: "start"
    });
    }
// Update Contact
const updateContact = (id, name, phone) => {
  contacts = contacts.map((contact) => {
    if (contact.id === id) {
      return {
        ...contact,
        name,
        phone,
      };
    }
    return contact;
  });
  saveContacts();
  displayContacts(contacts);
  contactForm.reset();
  document.getElementById("contactId").value = "";
};
// use cancel button
cancelBtn.addEventListener("click", () => {
  contactForm.reset();
  // remove hidden contact id
  document.getElementById("contactId").value = "";
  // change btn text to Add Contact
  document.querySelector('button[type="submit"]').textContent = "Add Contact";
});
// Delete Contacts
function deleteContact(id) {
  contacts = contacts.filter((contact) => contact.id !== id);

  saveContacts();
  displayContacts(contacts);
}
// Search Contacts
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase().trim();
  if (keyword === "") {
    displayContacts(contacts);
    return;
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(keyword) ||
      contact.phone.includes(keyword),
  );

  displayContacts(filteredContacts);
});
